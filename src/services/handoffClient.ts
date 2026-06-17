// Cliente de tickets de handoff humano. Almacen DEMO en localStorage (compartido
// entre el chat que crea tickets y el dashboard que los gestiona). El transcript
// guarda el contenido del usuario ANONIMIZADO (sin PII en claro).
//
// Adapter real (produccion): reemplazar read/write por una API con DB
// (POST /api/handoff -> tabla tickets; GET para el dashboard) y autenticacion del
// asistente. `postRemote` ya envia el contrato a /api/handoff (best-effort).

import type { ChatMessage } from "../types";
import { anonymizePII } from "../utils/pii";
import type { HandoffAssessment, HandoffPriority } from "./handoffTriage";

const STORE_KEY = "sat-handoff:tickets";
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export type TicketStatus = "abierto" | "en_progreso" | "cerrado";

export type TicketTurn = { role: string; content: string };

export type HandoffTicket = {
  id: string;
  createdAt: string;
  status: TicketStatus;
  priority: HandoffPriority;
  channel: "chat";
  reasonCode: string;
  reason: string;
  summary: string;
  userContactNeeded: boolean;
  suggestedNextAction: string;
  transcript: TicketTurn[];
  assignedTo?: string;
  resolutionNote?: string;
};

function read(): HandoffTicket[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as HandoffTicket[]) : [];
  } catch {
    return [];
  }
}

function write(tickets: HandoffTicket[]): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(tickets));
  } catch {
    /* almacenamiento no disponible: demo degrada en silencio */
  }
}

export function listHandoffTickets(): HandoffTicket[] {
  return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function updateHandoffTicket(id: string, patch: Partial<HandoffTicket>): HandoffTicket | null {
  const all = read();
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, id: all[idx].id };
  write(all);
  return all[idx];
}

async function postRemote(ticket: HandoffTicket): Promise<void> {
  // Contrato hacia el backend; en demo no persiste (sin DB). No bloquea ni rompe.
  try {
    await fetch(`${API_BASE}/api/handoff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    });
  } catch {
    /* demo: el almacen real es localStorage */
  }
}

export function createHandoffTicket(
  assessment: HandoffAssessment,
  messages: ChatMessage[],
): HandoffTicket {
  const ticket: HandoffTicket = {
    id: `HO-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "abierto",
    priority: assessment.priority,
    channel: "chat",
    reasonCode: assessment.reasonCode,
    reason: assessment.handoffReason,
    summary: assessment.summary,
    userContactNeeded: assessment.userContactNeeded,
    suggestedNextAction: assessment.suggestedNextAction,
    transcript: messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: m.role,
        content: m.role === "user" ? anonymizePII(m.content) : m.content,
      })),
  };
  const all = read();
  all.unshift(ticket);
  write(all);
  void postRemote(ticket);
  return ticket;
}

// Datos sinteticos DEMO para que el dashboard tenga cola desde el inicio.
const DEMO_SEED: HandoffTicket[] = [
  {
    id: "HO-DEMO-001",
    createdAt: "2026-06-17T09:12:00.000Z",
    status: "abierto",
    priority: "critical",
    channel: "chat",
    reasonCode: "legal_coactiva",
    reason: "Caso con efectos juridicos (coactiva/embargo/medida cautelar).",
    summary: "Tema: papeletas. Turnos del usuario: 3. Motivo: papeleta en cobranza coactiva con riesgo de captura del vehiculo.",
    userContactNeeded: true,
    suggestedNextAction: "Asignar a un asesor legal-tributario y suspender pagos hasta revisar.",
    transcript: [
      { role: "user", content: "mi placa [PLACA] esta en coactiva y me quieren capturar el auto" },
      { role: "assistant", content: "Entiendo la urgencia. Este caso requiere un asesor; no pagues a tramitadores." },
    ],
  },
  {
    id: "HO-DEMO-002",
    createdAt: "2026-06-17T10:40:00.000Z",
    status: "en_progreso",
    priority: "high",
    channel: "chat",
    reasonCode: "pago_fallido",
    reason: "Incidencia de pago (rechazo, fallo o cargo duplicado).",
    summary: "Tema: predial/arbitrios. Turnos del usuario: 2. Motivo: pago rechazado dos veces y posible cargo duplicado.",
    userContactNeeded: true,
    suggestedNextAction: "Verificar la operacion y orientar reembolso o reintento por canal oficial.",
    transcript: [
      { role: "user", content: "pague mi predial pero salio error y me cobraron igual" },
      { role: "assistant", content: "Reviso tu caso. Conserva el comprobante de tu banco." },
    ],
    assignedTo: "Asesora Pamela Ríos",
  },
  {
    id: "HO-DEMO-003",
    createdAt: "2026-06-17T11:05:00.000Z",
    status: "abierto",
    priority: "medium",
    channel: "chat",
    reasonCode: "frustracion",
    reason: "Usuario frustrado o insatisfecho con la orientacion automatica.",
    summary: "Tema: alcabala. Turnos del usuario: 5. Motivo: no logra ubicar donde pagar la alcabala de su primera vivienda.",
    userContactNeeded: false,
    suggestedNextAction: "Ofrecer un asesor humano y disculparse por la friccion.",
    transcript: [
      { role: "user", content: "ya te pregunte tres veces y no me ayudas con la alcabala" },
      { role: "assistant", content: "Lamento la demora. Te conecto con un asesor." },
    ],
  },
];

/** Pre-puebla el almacen demo si esta vacio (para mostrar la cola del dashboard). */
export function seedDemoTicketsIfEmpty(): void {
  if (read().length === 0) write(DEMO_SEED);
}
