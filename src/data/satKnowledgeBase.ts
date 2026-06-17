// Base de conocimiento SAT para el system prompt del chat IA. Se COMPILA desde
// la data canónica (satData) — NO duplica contenido: editar satData/Docs y la KB
// se actualiza sola. Cubre servicios, tramites (pasos/requisitos/plazos), FAQs,
// intenciones, sedes, canales oficiales y limites. Fuentes internas: ver
// Docs/01-mapa-tramites, Docs/02-flujos-usuario, Docs/03-contenido-y-ux,
// Docs/04-chat-ia y src/data/satData.ts (cada item lleva sourceIds).
//
// Actualizacion: la KB se regenera en cada arranque desde satData; para cambiar
// el contenido se edita satData.ts (services/procedures/faqs/assistantIntents/
// officeLocations) o fiscal/2026.ts. Subir KB_VERSION ayuda a invalidar caches.

import {
  assistantIntents,
  faqs,
  officeLocations,
  procedures,
  services,
  sourceLinks,
} from "./satData";

export const KB_VERSION = "2026.1";

const clean = (s: string): string => s.replace(/\s+/g, " ").trim();
const list = (arr: readonly string[]): string => arr.join("; ");

function serviciosSection(): string {
  return services
    .map((s) => `- ${s.title} [${s.category}]: ${clean(s.summary)} (canales: ${list(s.channels)})`)
    .join("\n");
}

function tramitesSection(): string {
  return procedures
    .map((p) => {
      const reqs = p.requirements.length ? ` Requisitos: ${list(p.requirements)}.` : "";
      const pasos = p.steps.length ? ` Pasos: ${list(p.steps)}.` : "";
      return `- ${p.title} (canal: ${p.channel}; plazo: ${p.timeframe}; costo: ${p.cost}; cita: ${p.requiresAppointment ? "si" : "no"}): ${clean(p.summary)}.${reqs}${pasos} Fuente: ${p.source.url}`;
    })
    .join("\n");
}

function faqsSection(): string {
  return faqs.map((f) => `- P: ${clean(f.question)} R: ${clean(f.answer)}`).join("\n");
}

function intencionesSection(): string {
  return assistantIntents
    .map((i) => `- ${i.label} (objetivo: ${clean(i.userGoal)}): ${clean(i.response)}`)
    .join("\n");
}

function sedesSection(): string {
  return officeLocations
    .map((o) => `- ${o.name} (${o.district}): ${o.address}. ${o.hours}. Servicios: ${list(o.services)}.`)
    .join("\n");
}

function canalesSection(): string {
  return sourceLinks.map((s) => `- ${s.label}: ${s.url}`).join("\n");
}

/** Compila la base de conocimiento completa en texto para el system prompt. */
export function buildSatKnowledgeBase(): string {
  return `BASE DE CONOCIMIENTO SAT LIMA (v${KB_VERSION}) — usala para responder con precision; cita el canal o enlace oficial cuando exista. Si algo no esta aqui, dilo y deriva a la fuente oficial.

ALCANCE Y RESERVAS CLAVE (no confundir):
- Predial y arbitrios: el SAT los administra SOLO del Cercado de Lima; otros distritos pagan en su municipalidad.
- Impuesto vehicular y alcabala: de TODA la provincia de Lima.
- Alcabala: se paga al SAT, NO a la municipalidad distrital. 3% sobre el exceso de 10 UIT del valor de transferencia.
- Papeleta de transito (placa) es distinta de multa administrativa y de deuda tributaria.

SERVICIOS:
${serviciosSection()}

TRAMITES (con requisitos, pasos, plazo y canal):
${tramitesSection()}

PREGUNTAS FRECUENTES:
${faqsSection()}

RESPUESTAS GUIA POR INTENCION:
${intencionesSection()}

SEDES Y CANALES DE ATENCION:
${sedesSection()}

ENLACES OFICIALES:
${canalesSection()}

LIMITES DE LA ORIENTACION:
- Toda cifra (montos, tasas, plazos) es ESTIMACION orientativa con su anio de referencia; deriva a la liquidacion oficial autenticada.
- Datos economicos individuales ("mi deuda") requieren identidad autenticada (reserva tributaria, art. 85 CT). No reveles deuda de terceros.
- No das asesoria legal vinculante ni emites actos con efectos juridicos; orientas y derivas.
- Anti-suplantacion: canales oficiales unicos = dominios sat.gob.pe / www.sat.gob.pe / app.sat.gob.pe y correos @sat.gob.pe. Los tramites del SAT son gratis; no pagar a tramitadores.`;
}
