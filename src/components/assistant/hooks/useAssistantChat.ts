// Logica de conversacion del asistente, fuera de la vista. Maneja el historial
// persistido, el envio con streaming al backend (/api/chat) y la degradacion a
// respuestas canned si el chat real no esta disponible o falla. Aplica
// minimizacion de PII antes de enviar al LLM y detecta casos de escalamiento
// humano. Preserva el comportamiento canned previo cuando el chat esta off.

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import type { AssistantIntent, ChatMessage } from "../../../types";
import { assistantIntents } from "../../../data/satData";
import type { ChatApiMessage } from "../../../data/chatConfig";
import { CHAT_ENABLED, ChatStreamError, streamChat } from "../../../services/chatClient";
import { anonymizePII, containsPII } from "../../../utils/pii";

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

// Materias que requieren ofrecer atencion humana (efectos juridicos).
const ESCALATION_RE =
  /coactiv|embargo|remate|captur|internad|comiso|prescripc|impugna|apela|demanda|notificaci[oó]n de cobranza/i;

const GENERIC_RESPONSE =
  "Puedo orientarte mejor si me dices si quieres consultar, pagar, declarar, fraccionar, reclamar o contactar al SAT.";

export type UseAssistantChat = {
  messages: ChatMessage[];
  draft: string;
  setDraft: (value: string) => void;
  isThinking: boolean;
  showEscalation: boolean;
  sendMessage: (text: string, intent?: AssistantIntent) => void;
  clearConversation: () => void;
};

export function useAssistantChat(onAnnounce: (message: string) => void): UseAssistantChat {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>(
    "sat-assistant:messages",
    initialMessages,
  );
  const [draft, setDraft] = useLocalStorage("sat-assistant:draft", "");
  const [isThinking, setIsThinking] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);

  const messagesRef = useRef(messages);
  const abortRef = useRef<AbortController | null>(null);
  const timersRef = useRef<number[]>([]);
  const announceRef = useRef(onAnnounce);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    announceRef.current = onAnnounce;
  }, [onAnnounce]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const cannedText = (intent?: AssistantIntent) =>
    intent ? buildIntentResponse(intent) : GENERIC_RESPONSE;

  // Respuesta canned con la misma cadencia que la version previa (fallback).
  const respondCanned = useCallback((intent?: AssistantIntent) => {
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
  }, [setMessages]);

  const respondStreaming = useCallback(
    async (history: ChatMessage[], intent?: AssistantIntent) => {
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
          signal: controller.signal,
          onToken: (delta) => {
            acc += delta;
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
          // Superado por un envio mas nuevo: conserva el parcial; si no alcanzo a
          // streamear nada, elimina el placeholder huerfano. No degrades a canned.
          if (!acc.trim()) {
            setMessages((current) => current.filter((m) => m.id !== placeholderId));
          }
          return;
        }
        // Degradacion graciosa: reemplaza el placeholder por la respuesta canned.
        setMessages((current) =>
          current.map((m) => (m.id === placeholderId ? { ...m, content: cannedText(intent) } : m)),
        );
        announceRef.current("Mostrando orientacion sin conexion al asistente.");
      } finally {
        // Solo el envio vigente apaga el indicador (evita la race con reenvios).
        if (abortRef.current === controller) {
          abortRef.current = null;
          setIsThinking(false);
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
      setShowEscalation((current) => current || ESCALATION_RE.test(cleanText));
      announceRef.current("Consulta enviada. Preparando orientacion referencial.");

      if (CHAT_ENABLED) {
        void respondStreaming(history, matchedIntent);
      } else {
        respondCanned(matchedIntent);
      }
    },
    [respondCanned, respondStreaming, setDraft, setMessages],
  );

  const clearConversation = useCallback(() => {
    abortRef.current?.abort();
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    setMessages(initialMessages);
    setDraft("");
    setIsThinking(false);
    setShowEscalation(false);
    announceRef.current("Conversacion eliminada.");
  }, [setDraft, setMessages]);

  return { messages, draft, setDraft, isThinking, showEscalation, sendMessage, clearConversation };
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
