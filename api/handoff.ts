// Contrato de creacion de tickets de handoff humano (Vercel Edge).
// DEMO: valida la forma del ticket y responde 202 SIN persistir (no hay DB en
// este entorno). Produccion: insertar en una DB (tabla de tickets), notificar a
// la cola del asistente humano y autenticar el origen. No maneja la clave del
// LLM ni ningun secreto.

export const config = { runtime: "edge" };

function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
  }

  let parsed: unknown;
  try {
    parsed = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const ticket = parsed as { id?: unknown; summary?: unknown; reasonCode?: unknown };
  if (typeof ticket.summary !== "string" || typeof ticket.reasonCode !== "string") {
    return json({ error: "invalid_ticket" }, 400);
  }

  const id = typeof ticket.id === "string" && ticket.id ? ticket.id : `HO-${Date.now().toString(36)}`;

  // DEMO: sin persistencia. Aqui iria el insert en DB + notificacion a la cola.
  return json(
    { ok: true, id, persisted: false, note: "demo: configurar adapter de DB para persistir" },
    202,
  );
}
