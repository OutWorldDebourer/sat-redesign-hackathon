// Proxy serverless (Vercel Edge) hacia DeepSeek para el chat del SAT.
// La clave vive SOLO en el entorno del servidor (DEEPSEEK_API_KEY) y nunca se
// envia al cliente ni se loguea. Hace streaming OpenAI-compatible, con timeout
// de conexion + watchdog de inactividad por chunk (no corta streams largos
// legitimos), reintentos con backoff ante 429/5xx, rate-limit best-effort por
// IP y errores degradados con gracia (el cliente cae a respuestas canned).

import { buildSystemMessages, type ChatApiMessage } from "../src/data/chatConfig";

export const config = { runtime: "edge" };

// El runtime Edge expone process.env sin traer @types/node; lo declaramos
// localmente para tipar el acceso sin dependencias extra.
declare const process: { env: Record<string, string | undefined> };

const DEFAULT_BASE_URL = "https://api.deepseek.com";

// Solo se acepta una base URL https (evita downgrade a HTTP y exfiltracion del
// header Authorization a un host arbitrario si la env se mal-configura).
function resolveBaseUrl(): string {
  const raw = process.env.DEEPSEEK_BASE_URL;
  if (raw && /^https:\/\//i.test(raw)) return raw.replace(/\/+$/, "");
  return DEFAULT_BASE_URL;
}

const BASE_URL = resolveBaseUrl();
const MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash";
const CONNECT_TIMEOUT_MS = 20_000; // conectar + primer byte
const STREAM_IDLE_TIMEOUT_MS = 20_000; // inactividad maxima entre chunks
const MAX_RETRIES = 2;
const MAX_MESSAGES = 24;
const MAX_CONTENT_CHARS = 4_000;

// Rate-limit best-effort por instancia edge (ventana fija). Produccion: KV/Upstash.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const RATE_MAP_CAP = 5_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string, now: number): boolean {
  // Purga ligera para que el Map no crezca sin cota.
  if (hits.size > RATE_MAP_CAP) {
    for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key);
  }
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function backoffMs(attempt: number): number {
  return 400 * 2 ** attempt + Math.floor(Math.random() * 250);
}

function sleepAbortable(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

type ClientMessage = { role: string; content: unknown };

function sanitizeMessages(input: unknown): ChatApiMessage[] | null {
  if (!Array.isArray(input)) return null;
  const cleaned: ChatApiMessage[] = [];
  for (const raw of input as ClientMessage[]) {
    if (!raw || (raw.role !== "user" && raw.role !== "assistant")) continue;
    if (typeof raw.content !== "string") continue;
    const content = raw.content.slice(0, MAX_CONTENT_CHARS).trim();
    if (content) cleaned.push({ role: raw.role, content });
  }
  // Recorta a los ultimos N DESPUES de filtrar (no vacia con ruido intercalado).
  const trimmed = cleaned.slice(-MAX_MESSAGES);
  return trimmed.length ? trimmed : null;
}

async function callDeepSeek(payload: unknown, apiKey: string, signal: AbortSignal): Promise<Response> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let res: Response;
    try {
      res = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal,
      });
    } catch (err) {
      // Error de red: reintenta salvo que se haya abortado (timeout) o se agoten.
      if (signal.aborted || attempt >= MAX_RETRIES) throw err;
      await sleepAbortable(backoffMs(attempt), signal);
      continue;
    }
    if (res.ok) return res;
    if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
      await res.body?.cancel().catch(() => {});
      await sleepAbortable(backoffMs(attempt), signal);
      continue;
    }
    return res; // error no reintentable o reintentos agotados
  }
  throw new Error("unreachable");
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    // Sin clave provisionada: el chat real no esta disponible; el cliente
    // degrada a respuestas canned. No es un error del cliente.
    return json({ error: "chat_unavailable", reason: "missing_api_key" }, 503);
  }

  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anon";
  if (rateLimited(ip, Date.now())) {
    return json({ error: "rate_limited" }, 429, { "Retry-After": "60" });
  }

  let parsed: unknown;
  try {
    parsed = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const body = parsed as { messages?: unknown; reasoning?: unknown };
  const messages = sanitizeMessages(body.messages);
  if (!messages) return json({ error: "invalid_messages" }, 400);

  const payload = {
    model: MODEL,
    messages: [...buildSystemMessages(), ...messages],
    temperature: 0.2,
    max_tokens: 800,
    stream: true,
    ...(body.reasoning === true ? {} : { reasoning_effort: "low" }),
  };

  const controller = new AbortController();
  // Presupuesto SOLO para conectar + primer byte; se limpia al recibir headers.
  let connectTimer: ReturnType<typeof setTimeout> | null = setTimeout(
    () => controller.abort(),
    CONNECT_TIMEOUT_MS,
  );

  try {
    const upstream = await callDeepSeek(payload, apiKey, controller.signal);
    clearTimeout(connectTimer);
    connectTimer = null;

    if (!upstream.ok || !upstream.body) {
      await upstream.body?.cancel().catch(() => {});
      const status = upstream.status === 429 ? 429 : 502;
      // Nunca se reenvia el cuerpo del proveedor (puede traer detalles internos).
      return json({ error: "upstream_error", status: upstream.status }, status);
    }

    // Watchdog de inactividad: aborta solo si NO llegan chunks por N ms, no por
    // un deadline absoluto; asi no se corta una respuesta larga legitima.
    let idleTimer: ReturnType<typeof setTimeout> = setTimeout(
      () => controller.abort(),
      STREAM_IDLE_TIMEOUT_MS,
    );
    const stream = upstream.body.pipeThrough(
      new TransformStream({
        transform(chunk, ctrl) {
          clearTimeout(idleTimer);
          idleTimer = setTimeout(() => controller.abort(), STREAM_IDLE_TIMEOUT_MS);
          ctrl.enqueue(chunk);
        },
        flush() {
          clearTimeout(idleTimer);
        },
      }),
    );

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    if (connectTimer) clearTimeout(connectTimer);
    const aborted = err instanceof Error && err.name === "AbortError";
    return json({ error: aborted ? "timeout" : "proxy_error" }, aborted ? 504 : 502);
  }
}
