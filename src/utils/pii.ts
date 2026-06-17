// Deteccion y enmascarado de PII (correo, DNI, RUC, telefono, placa) antes de
// enviar texto al LLM. Funcion pura. Privacidad-por-defecto (Ley 29733, reserva
// tributaria): el asistente recibe placeholders, no los identificadores reales.
// Errar hacia la privacidad (sobre-enmascarar) es preferible a filtrar.
//
// Limitacion conocida: nombres propios y direcciones en texto libre NO se
// enmascaran de forma fiable por regex (requeriria NER). El system prompt pide
// minimizar PII; produccion deberia anadir un scrub NER server-side.

// Correo electronico.
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
// Secuencia de 7 a 11 digitos con separadores opcionales (espacio o punto):
// cubre DNI (8), RUC (11), celular (9) y telefono fijo (7).
const DOC_RE = /\b\d(?:[.\s]?\d){6,10}\b/;
// Placa: auto (3 letras + 3 digitos) y moto/especial (2 letras + 4 digitos).
const PLACA_RE = /\b[A-Z]{2,3}-?\d{3,4}\b/i;

/** Indica si el texto contiene un identificador personal. */
export function containsPII(text: string): boolean {
  return EMAIL_RE.test(text) || DOC_RE.test(text) || PLACA_RE.test(text);
}

/** Reemplaza identificadores por placeholders, tolerando separadores comunes. */
export function anonymizePII(text: string): string {
  return text
    .replace(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, "[CORREO]")
    .replace(/\b\d(?:[.\s]?\d){6,10}\b/g, (match) => {
      const digits = match.replace(/\D/g, "").length;
      if (digits === 11) return "[RUC]";
      if (digits === 9 || digits === 7) return "[TEL]";
      return "[DNI]"; // 8 o 10 digitos
    })
    .replace(/\b[A-Z]{2,3}-?\d{3,4}\b/gi, "[PLACA]");
}
