import { FormEvent, KeyboardEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  CreditCard,
  ExternalLink,
  FileUp,
  Headphones,
  Lock,
  MessageCircle,
  Minimize2,
  Monitor,
  Send,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import { assistantIntents, quickActions } from "../../data/satData";
import { externalLinks } from "../../data/homeData";
import type { AssistantIntent, QuickAction } from "../../types";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useAssistantChat } from "./hooks/useAssistantChat";

type AssistantProps = {
  pagePath: string;
  command?: AssistantCommand | null;
};

export type AssistantCommand = {
  id: string;
  intentId: string;
};

type SheetState = "collapsed" | "peek" | "expanded";

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

// Accesos oficiales que viven dentro de las acciones rapidas del chat.
const officialLinkIds = ["pagar-online", "agencia-virtual", "mesa-partes"];

const linkIcons: Record<string, ReactNode> = {
  "credit-card": <CreditCard size={16} />,
  monitor: <Monitor size={16} />,
  "file-up": <FileUp size={16} />,
};

// Limite de crecimiento del textarea antes de hacer scroll interno.
const COMPOSER_MAX_HEIGHT = 132;

export function Assistant({ pagePath, command }: AssistantProps) {
  const [isMinimized, setIsMinimized] = useLocalStorage("sat-assistant:minimized", false);
  const [sheetState, setSheetState] = useLocalStorage<SheetState>("sat-assistant:sheet", "collapsed");
  const [isAttending, setIsAttending] = useState(false);
  const [liveMessage, setLiveMessage] = useState("Asistente SAT listo");
  const { messages, draft, setDraft, isThinking, showEscalation, sendMessage, clearConversation } =
    useAssistantChat(setLiveMessage);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const lastCommandId = useRef<string | null>(null);
  const attentionTimer = useRef<number | null>(null);
  const attentionFrame = useRef<number | null>(null);

  const visibleIntents = useMemo(
    () =>
      primaryIntents
        .map((id) => assistantIntents.find((intent) => intent.id === id))
        .filter((intent): intent is AssistantIntent => Boolean(intent)),
    [],
  );

  const officialLinks = useMemo(
    () =>
      officialLinkIds
        .map((id) => quickActions.find((action) => action.id === id))
        .filter((action): action is QuickAction => Boolean(action?.href)),
    [],
  );

  // Si el navegador soporta `field-sizing: content`, el CSS crece el textarea
  // solo; si no, lo hacemos por JS midiendo scrollHeight.
  const supportsFieldSizing = useMemo(
    () => typeof CSS !== "undefined" && Boolean(CSS.supports?.("field-sizing", "content")),
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
      if (attentionTimer.current) window.clearTimeout(attentionTimer.current);
      if (attentionFrame.current) window.cancelAnimationFrame(attentionFrame.current);
    };
  }, []);

  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    thread.scrollTo({ top: thread.scrollHeight, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (supportsFieldSizing) return;
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, COMPOSER_MAX_HEIGHT)}px`;
  }, [draft, supportsFieldSizing]);

  const triggerAssistantAttention = () => {
    if (attentionTimer.current) window.clearTimeout(attentionTimer.current);
    if (attentionFrame.current) window.cancelAnimationFrame(attentionFrame.current);
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

  useEffect(() => {
    if (!command || lastCommandId.current === command.id) return;
    lastCommandId.current = command.id;
    const intent = assistantIntents.find((candidate) => candidate.id === command.intentId);
    if (!intent) return;
    setIsMinimized(false);
    setSheetState("expanded");
    triggerAssistantAttention();
    window.setTimeout(() => sendMessage(intent.label, intent), 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // En pantallas tactiles el teclado virtual no distingue Shift+Enter, asi que
    // Enter inserta salto de linea y el envio queda en el boton.
    const coarsePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    if (event.key === "Enter" && !event.shiftKey && !coarsePointer) {
      event.preventDefault();
      sendMessage(draft);
    }
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
                <span key={`${letter}-${index}`}>{letter === " " ? " " : letter}</span>
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
              aria-label="Eliminar conversacion"
              title="Eliminar conversacion"
              onClick={clearConversation}
            >
              <Trash2 size={18} />
            </button>
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

        <p className="assistant-banner" role="note">
          <ShieldAlert size={15} aria-hidden="true" />
          <span>
            Los tramites del SAT son gratis. Canales oficiales: <strong>sat.gob.pe</strong> y{" "}
            <strong>app.sat.gob.pe</strong>.
          </span>
        </p>

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

          <span className="assistant-section-label">Accesos oficiales</span>
          <div className="assistant-quick-links" aria-label="Accesos oficiales del SAT">
            {officialLinks.map((link) => (
              <a
                key={link.id}
                className="assistant-quick-link"
                href={link.href}
                target="_blank"
                rel="noreferrer"
                title={link.description}
              >
                <span className="assistant-quick-link-icon" aria-hidden="true">
                  {linkIcons[link.icon] ?? <ExternalLink size={16} />}
                </span>
                {link.label}
                <ExternalLink className="assistant-quick-link-ext" size={13} aria-hidden="true" />
              </a>
            ))}
          </div>

          {messages.map((message) => (
            <article
              key={message.id}
              className={`message ${message.role}${message.intentId ? " has-intent" : ""}`}
            >
              <strong>{message.role === "assistant" ? "SAT guía" : "Tú"}</strong>
              <p>{message.content}</p>
              {message.containsPII ? (
                <span className="message-pii-note">
                  <Lock size={11} aria-hidden="true" /> Datos ocultos al asistente
                </span>
              ) : null}
            </article>
          ))}

          {isThinking ? (
            <article className="message assistant is-thinking">
              <strong>SAT guía</strong>
              <p>Preparando orientacion referencial...</p>
            </article>
          ) : null}

          {showEscalation ? (
            <a className="assistant-escalation" href={externalLinks.citas} target="_blank" rel="noreferrer">
              <Headphones size={16} aria-hidden="true" />
              <span>
                <strong>Hablar con un asesor</strong>
                <small>Para coactiva, impugnaciones o casos con efectos legales</small>
              </span>
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          ) : null}
        </div>

        <form className="chat-composer" onSubmit={handleSubmit}>
          <div className="composer-pill">
            <textarea
              id="assistant-query"
              name="assistant-query"
              ref={inputRef}
              className="composer-input"
              value={draft}
              rows={1}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta…"
              aria-label="Escribe tu consulta al asistente SAT"
            />
            <button
              className="composer-send"
              type="submit"
              disabled={!draft.trim() || isThinking}
              aria-disabled={!draft.trim() || isThinking}
              aria-label="Enviar mensaje"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="assistant-disclaimer">
            Orientacion referencial. Verifica montos, plazos y requisitos en SAT antes de continuar.
          </p>
        </form>
      </div>
      <span className="assistant-live" aria-live="polite" role="status">
        {liveMessage}
      </span>
    </aside>
  );
}

export default Assistant;
