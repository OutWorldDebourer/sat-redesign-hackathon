// Deteccion y enmascarado de PII (DNI, RUC, celular, placa) antes de enviar
// texto al LLM. Funcion pura. Privacidad-por-defecto (Ley 29733, reserva
// tributaria): el asistente recibe placeholders, no los identificadores reales.
// Errar hacia la privacidad (sobre-enmascarar) es preferible a filtrar; por eso
// se aceptan separadores comunes (espacios/puntos) y formatos de moto.

// Secuencia de 8 a 11 digitos con separadores opcionales (espacio o punto):
// cubre DNI "4859 2013", RUC "20.123.456.789" y celular "948 592 013".
const DOC_RE = /\b\d(?:[.\s]?\d){7,10}\b/;
// Placa: auto (3 letras + 3 digitos) y moto/especial (2 letras + 4 digitos), con o sin guion.
const PLACA_RE = /\b[A-Z]{2,3}-?\d{3,4}\b/i;

/** Indica si el texto contiene un identificador personal (DNI/RUC/celular/placa). */
export function containsPII(text: string): boolean {
  return DOC_RE.test(text) || PLACA_RE.test(text);
}

/** Reemplaza identificadores por placeholders, tolerando separadores comunes. */
export function anonymizePII(text: string): string {
  return text
    .replace(/\b\d(?:[.\s]?\d){7,10}\b/g, (match) => {
      const digits = match.replace(/\D/g, "").length;
      if (digits === 11) return "[RUC]";
      if (digits === 9) return "[TEL]";
      return "[DNI]"; // 8 o 10 digitos
    })
    .replace(/\b[A-Z]{2,3}-?\d{3,4}\b/gi, "[PLACA]");
}
