// Triage de derivacion a asistente humano (rule-based, sin LLM). Analiza la
// conversacion del chat y decide si requiere handoff, con que prioridad y por
// que. No usa la clave DeepSeek; es determinista y testeable. La PII se evalua
// con utils/pii pero NUNCA se incluye en claro en el resumen.

import type { ChatMessage } from "../types";
import { containsPII } from "../utils/pii";

export type HandoffPriority = "low" | "medium" | "high" | "critical";

export type HandoffAssessment = {
  handoffRequired: boolean;
  reasonCode: string;
  handoffReason: string;
  priority: HandoffPriority;
  summary: string;
  userContactNeeded: boolean;
  suggestedNextAction: string;
};

const RULES: {
  code: string;
  re: RegExp;
  priority: HandoffPriority;
  reason: string;
  contact: boolean;
  next: string;
}[] = [
  {
    code: "legal_coactiva",
    re: /coactiv|embargo|remate|captur|internad|comiso|prescripc|medida cautelar|notificaci[oó]n de cobranza|resoluci[oó]n de ejecuci[oó]n/i,
    priority: "critical",
    reason: "Caso con efectos juridicos (coactiva/embargo/medida cautelar).",
    contact: true,
    next: "Asignar a un asesor legal-tributario y suspender pagos hasta revisar.",
  },
  {
    code: "pago_fallido",
    re: /no pude pagar|fall[oó] el pago|error de pago|rechaz[oó]|no se proces[oó]|cargo duplicado|pagu[eé] (?:dos veces|doble)/i,
    priority: "high",
    reason: "Incidencia de pago (rechazo, fallo o cargo duplicado).",
    contact: true,
    next: "Verificar la operacion y orientar reembolso o reintento por canal oficial.",
  },
  {
    code: "reclamo_formal",
    re: /queja|reclamo formal|denuncia|corrupci[oó]n|maltrato|abuso|tramitador|me cobraron de mas|cobro indebido/i,
    priority: "high",
    reason: "Queja, reclamo formal o posible cobro indebido.",
    contact: true,
    next: "Derivar a Mesa de Partes / integridad@sat.gob.pe y registrar el caso.",
  },
  {
    code: "frustracion",
    re: /no entiendo nada|p[eé]simo|in[uú]til|no sirve|ya te dije|est[oó]y harto|esto es un|no me ayuda|terrible|rid[ií]culo/i,
    priority: "medium",
    reason: "Usuario frustrado o insatisfecho con la orientacion automatica.",
    contact: false,
    next: "Ofrecer un asesor humano y disculparse por la friccion.",
  },
];

const TEMAS: { re: RegExp; tema: string }[] = [
  { re: /papeleta|infracci[oó]n|placa/i, tema: "papeletas" },
  { re: /predial|arbitrio/i, tema: "predial/arbitrios" },
  { re: /vehicular|veh[ií]culo/i, tema: "impuesto vehicular" },
  { re: /alcabala|inmueble|compr[eé]/i, tema: "alcabala" },
  { re: /fraccion/i, tema: "fraccionamiento" },
  { re: /sede|agencia|horario/i, tema: "sedes/atencion" },
];

function detectTema(text: string): string {
  return TEMAS.find((t) => t.re.test(text))?.tema ?? "consulta general";
}

/** Evalua la conversacion y decide la derivacion humana. */
export function triageHandoff(messages: ChatMessage[]): HandoffAssessment {
  const userMessages = messages.filter((m) => m.role === "user");
  const allUserText = userMessages.map((m) => m.content).join(" \n ");
  const tema = detectTema(allUserText);
  const userTurns = userMessages.length;
  const hasPII = userMessages.some((m) => m.containsPII) || containsPII(allUserText);

  // 1) Reglas por palabra clave (la primera que dispara fija prioridad base).
  const matched = RULES.find((r) => r.re.test(allUserText));

  // 2) Senales acumulativas.
  const manyTurns = userTurns >= 4; // varios intentos sin cerrar

  let priority: HandoffPriority = matched?.priority ?? "low";
  let required = Boolean(matched);
  let reasonCode = matched?.code ?? "ninguno";
  let handoffReason = matched?.reason ?? "Sin senales de derivacion.";
  let userContactNeeded = matched?.contact ?? false;
  let suggestedNextAction = matched?.next ?? "Continuar la orientacion automatica.";

  if (!matched && manyTurns) {
    required = true;
    reasonCode = "intentos_multiples";
    priority = "medium";
    handoffReason = `El usuario lleva ${userTurns} consultas sin resolver el caso.`;
    userContactNeeded = false;
    suggestedNextAction = "Ofrecer un asesor humano para destrabar el caso.";
  }

  // PII eleva mínimamente la prioridad (reserva tributaria) sin forzar handoff.
  if (hasPII && priority === "low") priority = "medium";

  const summary = `Tema: ${tema}. Turnos del usuario: ${userTurns}. ${
    hasPII ? "Incluye datos personales (anonimizados). " : ""
  }Motivo: ${handoffReason}`;

  return {
    handoffRequired: required,
    reasonCode,
    handoffReason,
    priority,
    summary: summary.trim(),
    userContactNeeded,
    suggestedNextAction,
  };
}
