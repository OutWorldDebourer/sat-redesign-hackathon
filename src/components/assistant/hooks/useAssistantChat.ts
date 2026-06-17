// Logica de conversacion del asistente, fuera de la vista. Maneja el historial
// persistido, el envio con streaming al backend (/api/chat) y la degradacion a
// respuestas canned si el chat real no esta disponible o falla. Aplica
// minimizacion de PII antes de enviar al LLM, soporta "modo pensar" (think) con
// auto-escalado para consultas complejas, y triage de derivacion humana.
// Preserva el comportamiento canned previo cuando el chat esta off.

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import type { AssistantIntent, ChatMessage } from "../../../types";
import { assistantIntents } from "../../../data/satData";
import type { ChatApiMessage } from "../../../data/chatConfig";
import { CHAT_ENABLED, ChatStreamError, streamChat, type ChatMode } from "../../../services/chatClient";
import { anonymizePII, containsPII } from "../../../utils/pii";
import { triageHandoff, type HandoffAssessment } from "../../../services/handoffTriage";
import { createHandoffTicket, type HandoffTicket } from "../../../services/handoffClient";

const WELCOME_ID = "welcome";

const initialMessages: ChatMessage[] = [
  {
    id: WELCOME_ID,
    role: "assistant",
    content:
      "Hola, soy el asistente SAT. Cuentame si quieres consultar deuda, pagar, declarar, fraccionar o ubicar una sede. Te doy la ruta y el enlace oficial.",
    createdAt: new Date(0).toISOString(),
  },
];

const GENERIC_RESPONSE =
  "Puedo orientarte mejor si me dices si quieres consultar, pagar, declarar, fraccionar, reclamar o contactar al SAT.";

// Consulta compleja -> conviene modo pensar (auto-escalado).
const COMPLEX_RE =
  /calcul|cu[aá]nto|liquida|prescrip|impugn|descargo|fraccion|alcabala|inter[eé]s|coactiv|reclamo|comparar|deber[ií]a|conviene|tramo|3%|10 uit/i;

function isComplexQuery(text: string): boolean {
  if (text.length > 160) return true;
  if ((text.match(/\?/g)?.length ?? 0) >= 2) return true;
  return COMPLEX_RE.test(text);
}

export type UseAssistantChat = {
  messages: ChatMessage[];
  draft: string;
  setDraft: (value: string) => void;
  isThinking: boolean;
  isReasoning: boolean;
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  showEscalation: boolean;
  handoff: HandoffAssessment | null;
  handoffTicket: HandoffTicket | null;
  sendMessage: (text: string, intent?: AssistantIntent) => void;
  requestHandoff: () => void;
  clearConversation: () => void;
};

export function useAssistantChat(onAnnounce: (message: string) => void): UseAssistantChat {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>(
    "sat-assistant:messages",
    initialMessages,
  );
  const [draft, setDraft] = useLocalStorage("sat-assistant:draft", "");
  const [isThinking, setIsThinking] = useState(false);
  const [isReasoning, setIsReasoning] = useState(false);
  const [mode, setMode] = useState<ChatMode>("normal");
  const [showEscalation, setShowEscalation] = useState(false);
  const [handoff, setHandoff] = useState<HandoffAssessment | null>(null);
  const [handoffTicket, setHandoffTicket] = useState<HandoffTicket | null>(null);

  const messagesRef = useRef(messages);
  const abortRef = useRef<AbortController | null>(null);
  const timersRef = useRef<number[]>([]);
  const announceRef = useRef(onAnnounce);
  const modeRef = useRef(mode);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    announceRef.current = onAnnounce;
  }, [onAnnounce]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const cannedText = (intent?: AssistantIntent) =>
    intent ? buildIntentResponse(intent) : GENERIC_RESPONSE;

  const respondCanned = useCallback(
    (intent?: AssistantIntent) => {
      const timer = window.setTimeout(() => {
        setMessages((current) => [
          ...current,
          createMessage("assistant", cannedText(intent), intent?.id),
        ]);
        setIsThinking(false);
        announceRef.current("Respuesta del asistente recibida.");
        timersRef.current = timersRef.current.filter((t) => t !== timer);
      }, 420);
      timersRef.current.push(timer);
    },
    [setMessages],
  );

  const respondStreaming = useCallback(
    async (history: ChatMessage[], intent: AssistantIntent | undefined, streamMode: ChatMode) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const apiMessages: ChatApiMessage[] = history
        .filter((m) => m.id !== WELCOME_ID)
        .map((m) => ({
          role: m.role,
          content: m.role === "user" ? anonymizePII(m.content) : m.content,
        }));

      const placeholderId = `assistant-${Date.now()}-stream`;
      setMessages((current) => [
        ...current,
        { id: placeholderId, role: "assistant", content: "", createdAt: new Date().toISOString(), intentId: intent?.id },
      ]);

      let acc = "";
      try {
        await streamChat({
          messages: apiMessages,
          mode: streamMode,
          signal: controller.signal,
          onReasoning: () => setIsReasoning(true),
          onToken: (delta) => {
            acc += delta;
            setIsReasoning(false);
            setMessages((current) =>
              current.map((m) => (m.id === placeholderId ? { ...m, content: acc } : m)),
            );
          },
        });
        if (!acc.trim()) {
          setMessages((current) =>
            current.map((m) => (m.id === placeholderId ? { ...m, content: cannedText(intent) } : m)),
          );
        }
        announceRef.current("Respuesta del asistente recibida.");
      } catch (err) {
        if (err instanceof ChatStreamError && err.kind === "aborted") {
          if (!acc.trim()) {
            setMessages((current) => current.filter((m) => m.id !== placeholderId));
          }
          return;
        }
        setMessages((current) =>
          current.map((m) => (m.id === placeholderId ? { ...m, content: cannedText(intent) } : m)),
        );
        announceRef.current("Mostrando orientacion sin conexion al asistente.");
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
          setIsThinking(false);
          setIsReasoning(false);
        }
      }
    },
    [setMessages],
  );

  const sendMessage = useCallback(
    (text: string, intent?: AssistantIntent) => {
      const cleanText = text.trim();
      if (!cleanText) return;

      const matchedIntent = intent ?? matchIntent(cleanText);
      const userMessage = createMessage("user", cleanText, matchedIntent?.id, containsPII(cleanText));
      const history = [...messagesRef.current, userMessage];

      setMessages(history);
      setDraft("");
      setIsThinking(true);

      // Triage de derivacion humana sobre la conversacion completa.
      const assessment = triageHandoff(history);
      setHandoff(assessment);
      setShowEscalation(assessment.handoffRequired);

      if (CHAT_ENABLED) {
        const autoThink = modeRef.current !== "think" && isComplexQuery(cleanText);
        const effectiveMode: ChatMode = modeRef.current === "think" || autoThink ? "think" : "normal";
        announceRef.current(
          autoThink
            ? "Active el modo pensar para analizar tu caso."
            : "Consulta enviada. Preparando orientacion referencial.",
        );
        void respondStreaming(history, matchedIntent, effectiveMode);
      } else {
        announceRef.current("Consulta enviada. Preparando orientacion referencial.");
        respondCanned(matchedIntent);
      }
    },
    [respondCanned, respondStreaming, setDraft, setMessages],
  );

  const requestHandoff = useCallback(() => {
    const assessment = handoff ?? triageHandoff(messagesRef.current);
    const ticket = createHandoffTicket(assessment, messagesRef.current);
    setHandoffTicket(ticket);
    setShowEscalation(false);
    announceRef.current(`Caso derivado a un asesor humano (${ticket.id}).`);
  }, [handoff]);

  const clearConversation = useCallback(() => {
    abortRef.current?.abort();
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    setMessages(initialMessages);
    setDraft("");
    setIsThinking(false);
    setIsReasoning(false);
    setShowEscalation(false);
    setHandoff(null);
    setHandoffTicket(null);
    announceRef.current("Conversacion eliminada.");
  }, [setDraft, setMessages]);

  return {
    messages,
    draft,
    setDraft,
    isThinking,
    isReasoning,
    mode,
    setMode,
    showEscalation,
    handoff,
    handoffTicket,
    sendMessage,
    requestHandoff,
    clearConversation,
  };
}

function matchIntent(text: string): AssistantIntent | undefined {
  const lower = text.toLowerCase();
  return assistantIntents.find((candidate) =>
    candidate.patterns.some((pattern) => lower.includes(pattern.toLowerCase())),
  );
}

function createMessage(
  role: ChatMessage["role"],
  content: string,
  intentId?: string,
  containsPersonalData?: boolean,
): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
    intentId,
    containsPII: containsPersonalData,
  };
}

function buildIntentResponse(intent: AssistantIntent): string {
  const steps = intent.relatedProcedureIds?.length
    ? `\n\nRuta sugerida: revisa ${intent.relatedProcedureIds.length} tramite(s) relacionado(s) en la seccion correspondiente.`
    : "";
  return `${intent.response}${steps}\n\nRecuerda validar montos, plazos y requisitos en la fuente oficial SAT.`;
}
