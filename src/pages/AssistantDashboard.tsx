// Dashboard del asistente humano (Fase 9). Gestiona las conversaciones del chat
// derivadas (handoff): cola filtrable, detalle, resumen, motivo, acciones y
// metricas. Lee/actualiza tickets via handoffClient (almacen demo localStorage;
// adapter real documentado ahi). Diseño: Docs/08-dashboard-asistente-stitch.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardCopy, Headphones, Send, UserCheck } from "lucide-react";
import {
  listHandoffTickets,
  seedDemoTicketsIfEmpty,
  updateHandoffTicket,
  type HandoffTicket,
  type TicketStatus,
} from "../services/handoffClient";
import type { HandoffPriority } from "../services/handoffTriage";

const STATUS_LABEL: Record<TicketStatus, string> = {
  abierto: "Abierto",
  en_progreso: "En progreso",
  cerrado: "Cerrado",
};

const PRIORITY_LABEL: Record<HandoffPriority, string> = {
  critical: "Crítico",
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

const STATUSES: (TicketStatus | "todos")[] = ["todos", "abierto", "en_progreso", "cerrado"];
const PRIORITIES: (HandoffPriority | "todas")[] = ["todas", "critical", "high", "medium", "low"];

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return "recién";
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  return `hace ${Math.round(hrs / 24)} d`;
}

export default function AssistantDashboard() {
  const [tickets, setTickets] = useState<HandoffTicket[]>([]);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "todos">("todos");
  const [priorityFilter, setPriorityFilter] = useState<HandoffPriority | "todas">("todas");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [responseDraft, setResponseDraft] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = () => setTickets(listHandoffTickets());

  useEffect(() => {
    seedDemoTicketsIfEmpty();
    const sync = () => setTickets(listHandoffTickets());
    sync();
    // Refresca si otra pestaña (o el chat) crea/cambia un ticket.
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // El borrador de respuesta es estado de UI por-caso: al cambiar de ticket se
  // limpia para no arrastrar el texto (responder/nota de cierre) de un caso a
  // otro. Sin esto, cerrar un caso con nota dejaba el texto y se escribia como
  // resolutionNote del siguiente ticket cerrado.
  useEffect(() => {
    setResponseDraft("");
  }, [selectedId]);

  const filtered = useMemo(
    () =>
      tickets.filter(
        (t) =>
          (statusFilter === "todos" || t.status === statusFilter) &&
          (priorityFilter === "todas" || t.priority === priorityFilter),
      ),
    [tickets, statusFilter, priorityFilter],
  );

  const selected = tickets.find((t) => t.id === selectedId) ?? null;

  const metrics = {
    abiertos: tickets.filter((t) => t.status === "abierto").length,
    criticos: tickets.filter((t) => t.priority === "critical" && t.status !== "cerrado").length,
    enProgreso: tickets.filter((t) => t.status === "en_progreso").length,
    cerrados: tickets.filter((t) => t.status === "cerrado").length,
  };

  const apply = (patch: Partial<HandoffTicket>, msg: string) => {
    if (!selected) return;
    updateHandoffTicket(selected.id, patch);
    refresh();
    setNotice(msg);
  };

  const tomar = () => apply({ status: "en_progreso", assignedTo: "Asesor SAT (demo)" }, "Caso asignado a ti.");
  const marcarProgreso = () => apply({ status: "en_progreso" }, "Caso marcado en progreso.");
  const cerrar = () =>
    apply({ status: "cerrado", resolutionNote: responseDraft.trim() || "Cerrado por el asesor." }, "Caso cerrado.");
  const responder = () => {
    if (!selected || !responseDraft.trim()) return;
    apply(
      { transcript: [...selected.transcript, { role: "asesor", content: responseDraft.trim() }] },
      "Respuesta demo registrada en la conversación.",
    );
    setResponseDraft("");
  };
  const copiarResumen = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard?.writeText(selected.summary);
      setNotice("Resumen copiado al portapapeles.");
    } catch {
      setNotice("No se pudo copiar el resumen.");
    }
  };

  return (
    <section className="dashboard" aria-label="Bandeja del asistente humano">
      <header className="dashboard-head">
        <span className="eyebrow">Asistente humano</span>
        <h1>Bandeja del asistente</h1>
        <p>Casos del chat ciudadano derivados para atención humana. Datos demo (almacén local).</p>
      </header>

      <div className="dashboard-metrics">
        <article className="metric-card">
          <strong>{metrics.abiertos}</strong>
          <span>Abiertos</span>
        </article>
        <article className="metric-card is-critical">
          <strong>{metrics.criticos}</strong>
          <span>Críticos activos</span>
        </article>
        <article className="metric-card">
          <strong>{metrics.enProgreso}</strong>
          <span>En progreso</span>
        </article>
        <article className="metric-card">
          <strong>{metrics.cerrados}</strong>
          <span>Cerrados</span>
        </article>
      </div>

      <div className="dashboard-filters">
        <div className="filter-group" role="group" aria-label="Filtrar por estado">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              className={statusFilter === s ? "is-active" : ""}
              aria-pressed={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            >
              {s === "todos" ? "Todos" : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        <label className="filter-select" htmlFor="dash-priority">
          Prioridad
          <select
            id="dash-priority"
            name="priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as HandoffPriority | "todas")}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p === "todas" ? "Todas" : PRIORITY_LABEL[p]}
              </option>
            ))}
          </select>
        </label>
        <span className="filter-channel">Canal: chat</span>
        <span className="dashboard-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "caso" : "casos"}
        </span>
        <button type="button" className="dashboard-refresh" onClick={refresh}>
          Actualizar
        </button>
      </div>

      <div className="dashboard-body">
        <ul className="ticket-queue" aria-label="Cola de casos">
          {filtered.length === 0 ? (
            <li className="queue-empty">No hay casos con este filtro.</li>
          ) : (
            filtered.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className={`ticket-item${t.id === selectedId ? " is-selected" : ""}`}
                  aria-pressed={t.id === selectedId}
                  onClick={() => setSelectedId(t.id)}
                >
                  <span className={`prio-dot prio-${t.priority}`} aria-hidden="true" />
                  <span className="ticket-main">
                    <span className="ticket-row">
                      <strong>{t.id}</strong>
                      <span className={`ticket-status status-${t.status}`}>{STATUS_LABEL[t.status]}</span>
                    </span>
                    <span className="ticket-reason">{t.reason}</span>
                    <span className="ticket-meta">
                      {PRIORITY_LABEL[t.priority]} · {relativeTime(t.createdAt)}
                    </span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="ticket-detail">
          {!selected ? (
            <div className="detail-empty">
              <Headphones size={28} aria-hidden="true" />
              <p>Selecciona un caso de la cola para ver el detalle y actuar.</p>
            </div>
          ) : (
            <article className="detail-card" aria-live="polite">
              <header className="detail-head">
                <div>
                  <h2>{selected.id}</h2>
                  <span className="detail-tags">
                    <span className={`tag prio-tag prio-${selected.priority}`}>
                      {PRIORITY_LABEL[selected.priority]}
                    </span>
                    <span className={`tag status-${selected.status}`}>{STATUS_LABEL[selected.status]}</span>
                    <span className="tag">canal: {selected.channel}</span>
                    {selected.userContactNeeded ? <span className="tag tag-warn">requiere contacto</span> : null}
                  </span>
                </div>
                {selected.assignedTo ? <span className="detail-assigned">{selected.assignedTo}</span> : null}
              </header>

              <dl className="detail-fields">
                <dt>Resumen</dt>
                <dd>{selected.summary}</dd>
                <dt>Motivo de derivación</dt>
                <dd>{selected.reason}</dd>
                <dt>Acción sugerida</dt>
                <dd>{selected.suggestedNextAction}</dd>
              </dl>

              <div className="detail-transcript">
                <span className="assistant-section-label">Conversación (PII anonimizada)</span>
                {selected.transcript.map((turn, i) => (
                  <p key={i} className={`turn turn-${turn.role}`}>
                    <strong>{turn.role === "user" ? "Ciudadano" : turn.role === "asesor" ? "Asesor" : "Asistente"}:</strong>{" "}
                    {turn.content}
                  </p>
                ))}
              </div>

              <div className="detail-respond">
                <label className="field-label" htmlFor="dash-response">
                  Responder (demo)
                </label>
                <textarea
                  id="dash-response"
                  className="text-input"
                  rows={2}
                  value={responseDraft}
                  onChange={(e) => setResponseDraft(e.target.value)}
                  placeholder="Escribe una respuesta para el ciudadano…"
                />
              </div>

              <div className="detail-actions">
                <button type="button" className="primary-action" onClick={tomar}>
                  <UserCheck size={16} /> Tomar caso
                </button>
                <button type="button" className="secondary-action" onClick={marcarProgreso}>
                  En progreso
                </button>
                <button type="button" className="secondary-action" onClick={responder}>
                  <Send size={15} /> Responder
                </button>
                <button type="button" className="secondary-action" onClick={cerrar}>
                  <CheckCircle2 size={15} /> Cerrar
                </button>
                <button type="button" className="secondary-action" onClick={copiarResumen}>
                  <ClipboardCopy size={15} /> Copiar resumen
                </button>
              </div>
            </article>
          )}
        </div>
      </div>

      <p className="dashboard-notice" role="status" aria-live="polite">
        {notice}
      </p>
      <p className="dashboard-foot">
        <Link to="/">← Volver al sitio ciudadano</Link>
      </p>
    </section>
  );
}
