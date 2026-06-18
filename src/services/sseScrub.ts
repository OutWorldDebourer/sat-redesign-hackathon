// Filtrado server-side del stream SSE (DeepSeek, OpenAI-compatible): elimina
// `reasoning_content` —el razonamiento interno del modelo en modo pensar— antes
// de reenviar cada evento al cliente. El razonamiento NUNCA debe salir por la
// red: el cuerpo RAW de la respuesta solo lleva el contenido visible (`content`)
// y el marcador de cierre `[DONE]`. Privacidad por defecto.
//
// Funciones puras y por-linea para usarse dentro de un TransformStream (runtime
// Edge) y testearse sin red. El SSE entrega un JSON completo por linea `data:`
// (los saltos de linea internos van escapados como \n), por eso el parseo
// por-linea es seguro.

/** Procesa una sola linea SSE quitando `reasoning_content` del delta si existe. */
export function scrubLine(line: string): string {
  const trimmed = line.trimStart();
  if (!trimmed.startsWith("data:")) return line; // event:/comentario/linea en blanco
  const data = trimmed.slice(5).trim();
  if (data === "" || data === "[DONE]") return line; // preserva [DONE] y data vacio

  let payload: unknown;
  try {
    payload = JSON.parse(data);
  } catch {
    // Linea data completa no parseable: por privacidad no dejes pasar nada que
    // mencione razonamiento; sustituye por un delta vacio valido.
    return /reasoning_content/.test(line) ? 'data: {"choices":[{"delta":{}}]}' : line;
  }

  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices)) return line;

  let changed = false;
  for (const choice of choices) {
    const delta = (choice as { delta?: Record<string, unknown> })?.delta;
    if (delta && "reasoning_content" in delta) {
      delete delta.reasoning_content;
      changed = true;
    }
  }
  if (!changed) return line; // sin razonamiento: conserva el formato original
  return `data: ${JSON.stringify(payload)}`;
}

/**
 * Filtra un bloque de texto SSE que puede terminar en una linea incompleta.
 * Devuelve `output` (lineas completas ya saneadas, listas para reenviar) y
 * `remainder` (la linea parcial que debe conservarse hasta el siguiente chunk).
 */
export function scrubReasoningChunk(input: string): { output: string; remainder: string } {
  const lines = input.split("\n");
  const remainder = lines.pop() ?? ""; // ultimo segmento: linea aun sin cerrar
  if (lines.length === 0) return { output: "", remainder };
  const output = lines.map(scrubLine).join("\n") + "\n";
  return { output, remainder };
}
