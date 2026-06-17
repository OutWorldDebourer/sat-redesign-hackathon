// Cliente del chat: hace POST a /api/chat y consume el stream SSE
// OpenAI-compatible, emitiendo deltas de contenido. El backend mantiene la
// clave (nunca llega aqui). Ante cualquier fallo lanza un error tipado para que
// el hook degrade a respuestas canned sin romper el chat.

import type { ChatApiMessage } from "../data/chatConfig";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";
const CHAT_ENDPOINT = `${API_BASE}/api/chat`;

/**
 * Por defecto el cliente INTENTA el backend (/api/chat) y degrada a canned ante
 * cualquier fallo (incluido 503 missing_api_key). Asi, al provisionar la clave
 * el chat real se activa sin rebuild. Para forzar solo-canned (p. ej. sin
 * backend), define VITE_CHAT_ENABLED="false".
 */
export const CHAT_ENABLED = import.meta.env.VITE_CHAT_ENABLED !== "false";

export type ChatErrorKind =
  | "unavailable" // 503: backend sin clave provisionada
  | "rate_limited" // 429
  | "network" // fallo de red / fetch
  | "aborted" // cancelado por el cliente
  | "server"; // 5xx u otro / stream incompleto

export class ChatStreamError extends Error {
  kind: ChatErrorKind;
  status?: number;
  constructor(kind: ChatErrorKind, status?: number) {
    super(`chat_stream_error:${kind}`);
    this.name = "ChatStreamError";
    this.kind = kind;
    this.status = status;
  }
}

export type ChatMode = "normal" | "think";

export type StreamChatOptions = {
  messages: ChatApiMessage[];
  /** "think" usa el modelo razonador en el backend; "normal" el rapido. */
  mode?: ChatMode;
  signal?: AbortSignal;
  onToken: (delta: string) => void;
  /** Deltas de razonamiento (modo think). Se usan solo para indicar "pensando";
   *  NO se muestran al usuario (no exponer razonamiento interno). */
  onReasoning?: (delta: string) => void;
};

function isAbort(err: unknown): boolean {
  return err instanceof Error && err.name === "AbortError";
}

/** Llama al backend y entrega los deltas de contenido por `onToken`. */
export async function streamChat({
  messages,
  mode = "normal",
  signal,
  onToken,
  onReasoning,
}: StreamChatOptions): Promise<void> {
  let res: Response;
  try {
    res = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, mode }),
      signal,
    });
  } catch (err) {
    throw new ChatStreamError(isAbort(err) ? "aborted" : "network");
  }

  if (!res.ok || !res.body) {
    if (res.status === 503) throw new ChatStreamError("unavailable", 503);
    if (res.status === 429) throw new ChatStreamError("rate_limited", 429);
    throw new ChatStreamError("server", res.status);
  }

  // Degradacion suave: el backend devuelve 200 con un envelope JSON (no un
  // stream) cuando no hay clave provisionada. Se detecta por content-type y se
  // degrada a canned sin ruido de consola (no es un 5xx).
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("text/event-stream")) {
    let reason = "";
    try {
      reason = ((await res.json()) as { reason?: string })?.reason ?? "";
    } catch {
      /* sin cuerpo util */
    }
    throw new ChatStreamError(reason === "missing_api_key" ? "unavailable" : "server");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completed = false;

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? ""; // conserva la linea incompleta
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") {
          completed = true;
          continue;
        }
        try {
          const payload = JSON.parse(data);
          const delta = payload?.choices?.[0]?.delta ?? {};
          if (typeof delta.reasoning_content === "string" && delta.reasoning_content) {
            onReasoning?.(delta.reasoning_content);
          }
          if (typeof delta.content === "string" && delta.content) onToken(delta.content);
        } catch {
          // Fragmento JSON parcial o evento no-data: ignorar.
        }
      }
    }
  } catch (err) {
    throw new ChatStreamError(isAbort(err) ? "aborted" : "network");
  }

  // Stream cortado sin marca de cierre: tratarlo como error para degradar.
  if (!completed) throw new ChatStreamError("server");
}
