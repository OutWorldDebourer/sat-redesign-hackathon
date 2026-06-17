// Configuracion del asistente IA del SAT: system prompt estable (cacheable),
// datos vigentes inyectables por anio fiscal (separados del prompt para no
// romper el cache cuando cambian cifras) y esquema de tools (function calling).
// Sin secretos. Las cifras numericas son DEMO/orientativas hasta confirmar
// fuente primaria del SAT; los canales/dominios oficiales si son verificados.

import { FISCAL_2026 } from "./fiscal/2026";
import { buildSatKnowledgeBase } from "./satKnowledgeBase";

// Meses en español sin depender de Intl (el backend Edge puede no traer ICU completo).
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
function fechaCorta(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(d)} de ${MESES[Number(m) - 1]}`;
}

/** Mensaje de rol para la API compatible con OpenAI. */
export type ChatRole = "system" | "user" | "assistant" | "tool";
export type ChatApiMessage = {
  role: ChatRole;
  content: string;
  name?: string;
  tool_call_id?: string;
};

/**
 * System prompt estable del asistente. NO contiene cifras ni PII para
 * maximizar el cache hit del proveedor. Las cifras llegan en DATOS_VIGENTES.
 */
export const SYSTEM_PROMPT_TEMPLATE = `Eres el asistente virtual del SAT de Lima (Servicio de Administracion Tributaria de la Municipalidad Metropolitana de Lima). Tu rol es orientar a la ciudadania sobre tributos municipales (predial, arbitrios, vehicular, alcabala), papeletas y multas, tramites, fraccionamiento, pagos y sedes.

IDENTIDAD Y TONO
- Te presentas SIEMPRE como asistente automatizado, nunca como humano.
- Lenguaje claro y directo: frases cortas, voz activa, sin siglas sin explicar. Espanol del Peru.
- Respuestas breves y accionables: el siguiente paso concreto y el canal oficial.

LIMITES (lo que NO haces)
- No das asesoria legal vinculante ni emites actos con efectos juridicos (liquidaciones, resoluciones). Orientas y derivas.
- Toda cifra es ESTIMACION orientativa, con su anio de referencia; deriva siempre a la liquidacion oficial autenticada.
- No inventas montos, tasas ni vencimientos: usa solo los datos vigentes provistos; si falta el dato, dilo y deriva a la fuente oficial.
- No pides contrasenas NUNCA. El SAT no solicita claves por chat, correo ni redes.

PRIVACIDAD (Ley 29733, reserva tributaria art. 85 Codigo Tributario)
- Pide solo el identificador minimo necesario (placa, DNI, RUC o codigo) y explica para que lo usas.
- Consultas generales (como se calcula, plazos, definiciones): sin login. "Mi deuda" o datos economicos individuales: requieren autenticacion; explica por que.
- No reveles deuda de terceros.

SEGURIDAD Y ANTI-SUPLANTACION
- Recuerda que los tramites del SAT son gratuitos: no se paga a tramitadores.
- Canales oficiales unicos: dominios sat.gob.pe, www.sat.gob.pe y app.sat.gob.pe, y correos @sat.gob.pe. Alerta ante cualquier otro dominio o correo (p. ej. el falso info@correo.sunat.gob.pe).
- La alcabala en la Provincia de Lima se paga al SAT, no a la municipalidad distrital.

ESCALAMIENTO HUMANO
- Ofrece "Hablar con un asesor" ante impugnaciones, suspension de cobranza coactiva, prescripcion, vehiculo internado o cualquier acto con efectos juridicos.
- Si no hay atencion humana disponible, deriva a Agencia Virtual o Mesa de Partes Digital (24/7).`;

/**
 * Datos vigentes por anio fiscal. DEMO/orientativos: el asistente los trata
 * como referenciales y siempre deriva a la liquidacion oficial. Versionar por
 * anio evita romper el cache del system prompt al cambiar cifras.
 */
export type DatosVigentes = {
  anioFiscal: number;
  uit: number;
  vencimientos: { concepto: string; fecha: string }[];
  descuentos: { concepto: string; detalle: string }[];
  canalesOficiales: { nombre: string; url: string }[];
  nota: string;
};

export const DATOS_VIGENTES: DatosVigentes = {
  // UIT y vencimientos derivados de la fuente fiscal versionada (fuente unica).
  anioFiscal: FISCAL_2026.year,
  uit: FISCAL_2026.uit,
  vencimientos: FISCAL_2026.vencimientos.map((v) => ({
    concepto: `${v.tributo} (${v.etiqueta})`,
    fecha: fechaCorta(v.iso),
  })),
  descuentos: [
    { concepto: "Papeleta - pago voluntario", detalle: "descuento por pronto pago dentro del plazo de dias habiles" },
    { concepto: "Pago anticipado anual", detalle: "beneficio por cancelar el ejercicio completo antes del vencimiento" },
  ],
  canalesOficiales: [
    { nombre: "Pagos en linea", url: "https://www.sat.gob.pe/WebSiteV9/Inicio/ciudadano/p/pagosenlinea" },
    { nombre: "Agencia Virtual", url: "https://app.sat.gob.pe/avisat/CiudadanoPublico" },
    { nombre: "Mesa de Partes Digital", url: "https://app.sat.gob.pe/avisat/MesaPartesDigital" },
  ],
  nota: "Cifras y fechas DEMO/orientativas. Confirmar siempre en la liquidacion oficial del SAT.",
};

/** Construye el texto de datos vigentes para un segundo mensaje system. */
export function buildDatosVigentesMessage(datos: DatosVigentes = DATOS_VIGENTES): string {
  const venc = datos.vencimientos.map((v) => `- ${v.concepto}: ${v.fecha}`).join("\n");
  const desc = datos.descuentos.map((d) => `- ${d.concepto}: ${d.detalle}`).join("\n");
  const canales = datos.canalesOficiales.map((c) => `- ${c.nombre}: ${c.url}`).join("\n");
  return `DATOS VIGENTES ${datos.anioFiscal} (referenciales, confirmar en liquidacion oficial):
UIT ${datos.anioFiscal}: S/ ${datos.uit.toLocaleString("es-PE")}.
Vencimientos:
${venc}
Descuentos:
${desc}
Canales oficiales:
${canales}
${datos.nota}`;
}

/** Mensajes system (prompt estable + datos vigentes) que abren cada conversacion. */
export function buildSystemMessages(datos: DatosVigentes = DATOS_VIGENTES): ChatApiMessage[] {
  return [
    { role: "system", content: SYSTEM_PROMPT_TEMPLATE },
    { role: "system", content: buildDatosVigentesMessage(datos) },
    // Base de conocimiento compilada desde satData (servicios, tramites, FAQs,
    // intenciones, sedes, enlaces). Estable -> cacheable por el proveedor.
    { role: "system", content: buildSatKnowledgeBase() },
  ];
}

/**
 * Esquema de tools (formato OpenAI/DeepSeek) para function calling. El backend
 * resuelve estas funciones sobre satApi/utils (cableado en Bloque 5).
 */
export const TOOLS_SCHEMA = [
  {
    type: "function",
    function: {
      name: "consultar_deuda",
      description:
        "Consulta deuda, papeleta o expediente por un identificador unico (placa, DNI, RUC, codigo o expediente).",
      parameters: {
        type: "object",
        properties: {
          identificador: { type: "string", description: "Placa (ABC-123), DNI, RUC, codigo o N.o de expediente." },
        },
        required: ["identificador"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calcular_alcabala",
      description:
        "Estima el impuesto de alcabala referencial a partir del valor de transferencia del inmueble.",
      parameters: {
        type: "object",
        properties: {
          valor_transferencia: { type: "number", description: "Valor de transferencia del inmueble en soles." },
        },
        required: ["valor_transferencia"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "contar_dias_habiles",
      description: "Cuenta dias habiles entre dos fechas para plazos de descargo o pago con descuento.",
      parameters: {
        type: "object",
        properties: {
          fecha_inicio: { type: "string", description: "Fecha de inicio en formato YYYY-MM-DD." },
          dias: { type: "number", description: "Numero de dias habiles a contar desde la fecha de inicio." },
        },
        required: ["fecha_inicio", "dias"],
      },
    },
  },
] as const;
