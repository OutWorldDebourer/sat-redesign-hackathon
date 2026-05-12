import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, ChevronDown, ChevronUp, ExternalLink, MessageCircle, Minimize2, Send, Sparkles } from "lucide-react";
import { assistantIntents, quickActions } from "../../data/satData";
import type { AssistantIntent, ChatMessage, QuickAction } from "../../types";
import { useLocalStorage } from "../../hooks/useLocalStorage";

type AssistantProps = {
  pagePath: string;
  command?: AssistantCommand | null;
};

export type AssistantCommand = {
  id: string;
  intentId: string;
};

type SheetState = "collapsed" | "peek" | "expanded";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hola, soy el asistente SAT. Cuentame si quieres consultar deuda, pagar, declarar, fraccionar o ubicar una sede. Te doy la ruta y el enlace oficial.",
    createdAt: new Date(0).toISOString(),
  },
];

const primaryIntents = [
  "intent-consultar-deuda",
  "intent-pagar",
  "intent-declarar",
  "intent-fraccionar",
  "intent-contactar",
  "intent-reclamar",
];

const railLetters = "ASISTENTE SAT".split("");

const shortcutMeta: Record<string, { title: string; subtitle: string }> = {
  "intent-consultar-deuda": { title: "Pagar mis deudas", subtitle: "Tributos, arbitrios, multas" },
  "intent-pagar": { title: "Tengo una papeleta", subtitle: "Consulta y opciones de pago" },
  "intent-declarar": { title: "Compre un vehiculo", subtitle: "Transferencia y requisitos" },
  "intent-fraccionar": { title: "Fraccionar deuda", subtitle: "Opciones y requisitos" },
  "intent-contactar": { title: "Sedes y atencion", subtitle: "Horarios y ubicacion" },
  "intent-reclamar": { title: "Reclamo o escrito", subtitle: "Mesa de Partes y seguimiento" },
};

export function Assistant({ pagePath, command }: AssistantProps) {
  const [isMinimized, setIsMinimized] = useLocalStorage("sat-assistant:minimized", false);
  const [sheetState, setSheetState] = useLocalStorage<SheetState>("sat-assistant:sheet", "collapsed");
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>("sat-assistant:messages", initialMessages);
  const [draft, setDraft] = useLocalStorage("sat-assistant:draft", "");
  const [isThinking, setIsThinking] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [liveMessage, setLiveMessage] = useState("Asistente SAT listo");
  const inputRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const lastCommandId = useRef<string | null>(null);
  const attentionTimer = useRef<number | null>(null);
  const attentionFrame = useRef<number | null>(null);
  const responseTimers = useRef<number[]>([]);
  const pendingResponses = useRef(0);

  const visibleIntents = useMemo(
    () =>
      primaryIntents
        .map((id) => assistantIntents.find((intent) => intent.id === id))
        .filter((intent): intent is AssistantIntent => Boolean(intent)),
    [],
  );

  const contextualHint = useMemo(() => {
    if (pagePath.includes("papeletas")) return "Estas en papeletas y multas. Puedo ayudarte a revisar descuentos, pago o descargo.";
    if (pagePath.includes("fraccionamiento")) return "Estas en fraccionamiento. Puedo ayudarte a revisar elegibilidad y pasos.";
    if (pagePath.includes("atencion")) return "Estas en atencion y sedes. Puedo ubicar canal, horario o sede.";
    if (pagePath.includes("tramites")) return "Estas en tramites digitales. Puedo ordenar requisitos y canal correcto.";
    if (pagePath.includes("tributos")) return "Estas en tributos. Puedo diferenciar predial, vehicular y alcabala.";
    return "Puedo ayudarte a elegir la ruta correcta sin saber el nombre del tramite.";
  }, [pagePath]);

  useEffect(() => {
    return () => {
      if (attentionTimer.current) {
        window.clearTimeout(attentionTimer.current);
      }

      if (attentionFrame.current) {
        window.cancelAnimationFrame(attentionFrame.current);
      }

      responseTimers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    thread.scrollTo({
      top: thread.scrollHeight,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [messages, isThinking]);

  const triggerAssistantAttention = () => {
    if (attentionTimer.current) {
      window.clearTimeout(attentionTimer.current);
    }

    if (attentionFrame.current) {
      window.cancelAnimationFrame(attentionFrame.current);
    }

    setIsAttending(false);
    attentionFrame.current = window.requestAnimationFrame(() => {
      setIsAttending(true);
      setLiveMessage("Ruta enviada al asistente SAT.");
      attentionTimer.current = window.setTimeout(() => {
        setIsAttending(false);
        attentionTimer.current = null;
      }, 820);
    });
  };

  const sendMessage = (text: string, intent?: AssistantIntent) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const matchedIntent =
      intent ??
      assistantIntents.find((candidate) =>
        candidate.patterns.some((pattern) => cleanText.toLowerCase().includes(pattern.toLowerCase())),
      );

    const userMessage = createMessage("user", cleanText, matchedIntent?.id);
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setSheetState("expanded");
    setIsMinimized(false);
    pendingResponses.current += 1;
    setIsThinking(true);
    setLiveMessage("Consulta enviada. Preparando orientacion referencial.");

    const responseTimer = window.setTimeout(() => {
      const response = matchedIntent
        ? buildIntentResponse(matchedIntent)
        : "Puedo orientarte mejor si me dices si quieres consultar, pagar, declarar, fraccionar, reclamar o contactar al SAT.";
      setMessages((current) => [...current, createMessage("assistant", response, matchedIntent?.id)]);
      pendingResponses.current = Math.max(0, pendingResponses.current - 1);
      setIsThinking(pendingResponses.current > 0);
      setLiveMessage("Respuesta del asistente recibida.");
      responseTimers.current = responseTimers.current.filter((timer) => timer !== responseTimer);
    }, 420);
    responseTimers.current.push(responseTimer);
  };

  useEffect(() => {
    if (!command || lastCommandId.current === command.id) return;

    lastCommandId.current = command.id;
    const intent = assistantIntents.find((candidate) => candidate.id === command.intentId);
    if (!intent) return;

    setIsMinimized(false);
    setSheetState("expanded");
    triggerAssistantAttention();
    window.setTimeout(() => {
      sendMessage(intent.label, intent);
    }, 120);
  }, [command]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  const triggerIntent = (intent: AssistantIntent) => {
    triggerAssistantAttention();
    sendMessage(intent.label, intent);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const advanceSheet = () => {
    setIsMinimized(false);
    setSheetState((current) => {
      if (current === "collapsed") return "peek";
      if (current === "peek") return "expanded";
      return "collapsed";
    });
  };

  const sheetActionLabel =
    sheetState === "expanded"
      ? "Contraer asistente"
      : sheetState === "peek"
        ? "Expandir asistente"
        : "Mostrar vista rapida del asistente";

  if (isMinimized) {
    return (
      <aside className="assistant-region is-minimized" aria-label="Asistente SAT minimizado">
        <div className="assistant-minirail">
          <button
            className="assistant-rail-button"
            type="button"
            aria-label="Abrir asistente SAT"
            onClick={() => {
              setIsMinimized(false);
              setSheetState("peek");
            }}
          >
            <span className="assistant-rail-icon">
              <MessageCircle size={22} />
            </span>
            <span className="assistant-rail-status" aria-hidden="true" />
            <span className="assistant-rail-stack" aria-hidden="true">
              {railLetters.map((letter, index) => (
                <span key={`${letter}-${index}`}>{letter === " " ? "\u00A0" : letter}</span>
              ))}
            </span>
            <span className="assistant-rail-reopen">Abrir</span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`assistant-region${isAttending ? " is-attending" : ""}`}
      data-sheet={sheetState}
      aria-label="Asistente SAT"
    >
      <button
        className="bottom-sheet-trigger"
        type="button"
        aria-label={sheetActionLabel}
        aria-expanded={sheetState !== "collapsed"}
        aria-controls="assistant-panel"
        onClick={advanceSheet}
      >
        <span aria-hidden="true" />
      </button>
      <div className="assistant-panel" id="assistant-panel">
        <header className="assistant-top">
          <div className="assistant-identity">
            <span className="assistant-avatar">
              <Bot size={22} />
            </span>
            <span>
              <strong>Asistente SAT</strong>
              <small>
                <span className="assistant-online-dot" aria-hidden="true" />
                En linea
              </small>
            </span>
          </div>
          <div className="assistant-controls">
            <button
              className="icon-button"
              type="button"
              aria-label={sheetActionLabel}
              aria-expanded={sheetState !== "collapsed"}
              aria-controls="assistant-panel"
              onClick={advanceSheet}
            >
              {sheetState === "expanded" ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
            <button
              className="icon-button desktop-minimize"
              type="button"
              aria-label="Minimizar asistente"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 size={18} />
            </button>
          </div>
        </header>

        <div className="chat-thread" ref={threadRef} aria-live="polite">
          <div className="assistant-greeting">
            <strong>Hola! Soy tu copiloto SAT</strong>
            <p>{contextualHint}</p>
          </div>

          <span className="assistant-section-label">Acciones rapidas</span>
          <div className="quick-actions" aria-label="Acciones rapidas del asistente">
            {visibleIntents.map((intent) => (
              <button key={intent.id} type="button" onClick={() => triggerIntent(intent)}>
                <span className="assistant-action-icon">
                  <Sparkles size={15} />
                </span>
                <span>
                  <strong>{shortcutMeta[intent.id]?.title ?? intent.label}</strong>
                  <small>{shortcutMeta[intent.id]?.subtitle ?? intent.userGoal}</small>
                </span>
              </button>
            ))}
          </div>

          {messages.map((message) => (
            <article key={message.id} className={`message ${message.role}${message.intentId ? " has-intent" : ""}`}>
              <strong>{message.role === "assistant" ? "SAT guía" : "Tú"}</strong>
              <p>{message.content}</p>
            </article>
          ))}

          {isThinking ? (
            <article className="message assistant is-thinking">
              <strong>SAT guía</strong>
              <p>Preparando orientacion referencial...</p>
            </article>
          ) : null}
        </div>

        <form className="chat-composer" onSubmit={handleSubmit}>
          <div className="chat-composer-row">
            <input
              id="assistant-query"
              name="assistant-query"
              ref={inputRef}
              className="text-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ej. Tengo una papeleta que no aparece"
              aria-label="Escribe tu consulta al asistente SAT"
            />
            <button className="primary-action" type="submit" disabled={!draft.trim() || isThinking}>
              <Send size={18} />
              <span className="send-label">Enviar</span>
            </button>
          </div>
          <div className="assistant-disclaimer">
            Orientacion referencial. Verifica montos, plazos y requisitos en SAT antes de continuar.
          </div>
          <div className="assistant-source-row" aria-label="Accesos oficiales relacionados">
            {quickActions.slice(3, 6).map((action: QuickAction) =>
              action.href ? (
                <a key={action.id} href={action.href} target="_blank" rel="noreferrer">
                  {action.label}
                  <ExternalLink size={13} />
                </a>
              ) : null,
            )}
          </div>
        </form>
      </div>
      <span className="assistant-live" aria-live="polite" role="status">
        {liveMessage}
      </span>
    </aside>
  );
}

function createMessage(role: ChatMessage["role"], content: string, intentId?: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
    intentId,
  };
}

function buildIntentResponse(intent: AssistantIntent) {
  const steps = intent.relatedProcedureIds?.length
    ? `\n\nRuta sugerida: revisa ${intent.relatedProcedureIds.length} tramite(s) relacionado(s) en la seccion correspondiente.`
    : "";
  return `${intent.response}${steps}\n\nRecuerda validar montos, plazos y requisitos en la fuente oficial SAT.`;
}

export default Assistant;
