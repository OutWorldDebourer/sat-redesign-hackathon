# 07-plan-redisenio-web/plan-chat-deepseek.md

Integracion segura paso a paso del chat fijo del SAT con DeepSeek via funcion serverless de Vercel. El cliente nunca ve `DEEPSEEK_API_KEY`. Sin claves en el repo.

## Estado actual (anclado al repo)

- Chat existente: `src/components/assistant/Assistant.tsx` (449 LOC). Persistente, accesible, no invasivo.
- Respuesta CANNED: `sendMessage()` (`Assistant.tsx:174-204`) + `buildIntentResponse()` (`Assistant.tsx:442-447`): `setTimeout(420ms)` + match de patterns sobre `assistantIntents` (`src/data/satData.ts`). Sin LLM, sin streaming, sin backend, sin function calling.
- Sin backend: NO existe `api/`, `vite.config.ts` vacio (6 LOC), sin `vercel.json`, sin `.env.example`, sin `import.meta.env`.
- Datos para tools: `consultarSAT()` (`src/data/mockApi.ts:80-94`) y validaciones (`src/utils/inputValidation.ts`).
- Referencia de modelo/costos/resiliencia ya documentada: [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md). Prompts e intents: [../04-chat-ia/intenciones-y-prompts-del-chat.md](../04-chat-ia/intenciones-y-prompts-del-chat.md). PII y limites: [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).

## Regla de oro de seguridad

- `DEEPSEEK_API_KEY` vive SOLO en el entorno del servidor (Vercel Project Settings) y se lee en la funcion serverless. NUNCA con prefijo `VITE_` (Vite inyecta todo lo `VITE_*` en el bundle del cliente).
- El cliente solo conoce `VITE_API_BASE_URL` y `VITE_CHAT_ENABLED` (no secretos).
- La clave nunca aparece en codigo, logs, repo ni en el system prompt.

## Bloqueo de dependencias previas

1. Modularizar `Assistant.tsx` antes de cablear el backend (ver [./plan-modularizacion.md](./plan-modularizacion.md) si existe; depende de Fase 1 de modularizacion).
2. Tener fuente de datos versionada y rica (ver [./datos-sinteticos-y-demo.md](./datos-sinteticos-y-demo.md)) para que las tools devuelvan valor real.

## Paso 1 — Variables de entorno y `.env.example`

**Hallazgo actual**: no existe `.env.example`; `.gitignore` ya protege `.env*` pero no documenta variables.

**Impacto**: onboarding indefinido; riesgo de que un dev exponga la clave con prefijo `VITE_`.

**Propuesta**: crear `.env.example` (sin valores), copiable a `.env.local` (git-ignored).

```
# === Servidor (solo backend serverless, NUNCA en el cliente) ===
# Obtener en https://platform.deepseek.com . Provisionar en Vercel, no aqui.
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash

# === Cliente (se compilan en el bundle; jamas secretos) ===
VITE_API_BASE_URL=/api
VITE_CHAT_ENABLED=true
VITE_API_MODE=mock
```

**Archivo objetivo**: `.env.example` (nuevo, raiz del repo).

## Paso 2 — `vercel.json`

**Hallazgo actual**: deploy en Vercel sin `vercel.json`; SPA sin fallback explicito ni rutas API.

**Impacto**: sin rewrite `/api/*` y sin SPA fallback, el chat no tiene endpoint y las rutas de `react-router-dom` rompen en recarga directa.

**Propuesta**: crear `vercel.json`. El secreto se provisiona en la UI de Vercel (Settings > Environment Variables), no en este archivo.

```json
{
  "functions": { "api/chat.ts": { "maxDuration": 30 } },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Archivo objetivo**: `vercel.json` (nuevo, raiz del repo).

## Paso 3 — Funcion serverless `api/chat.ts`

**Hallazgo actual**: NO existe `api/`. Toda integracion LLM desde el cliente expondria la clave en `dist/`.

**Impacto**: bloqueador P0 de toda la IA segura.

**Propuesta**: crear `api/chat.ts` (runtime Node de Vercel). Responsabilidad unica: proxy de streaming a DeepSeek con guardrails. No mezcla UI ni datos de negocio.

Contrato del handler:

- Metodo: `POST /api/chat`. Body: `{ messages: ChatMessage[] }` (reutiliza tipo `ChatMessage` de `src/types.ts`).
- Lee `process.env.DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL`, `DEEPSEEK_MODEL`. Si falta la clave: responde `503` con mensaje de fallback (no 500 silencioso).
- SDK OpenAI-compatible apuntando a `base_url` DeepSeek (ver [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md)).
- Streaming SSE hacia el cliente (`text/event-stream`).
- Inyecta system prompt + tools desde `src/data/chatConfig.ts` (Paso 5).
- Guardrails (Paso 6): anonimizacion PII pre-envio, rate-limit por IP, timeout 15-30s, retry exponencial 429/5xx, logging sin secretos ni PII.
- Function calling: el backend ejecuta las tools (`consultarSAT`, calculos) via `src/services/satApi.ts`; el modelo solo orquesta. El cliente nunca ejecuta tools.

Esqueleto de referencia (sin clave; runtime Vercel):

```ts
import OpenAI from "openai";
import { SYSTEM_PROMPT_TEMPLATE, TOOLS_SCHEMA, buildSystemPrompt } from "../src/data/chatConfig";
import { runTool } from "../src/services/satApi";
import { anonymizePII } from "../src/services/piiGuard";

export const config = { runtime: "nodejs" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return fallbackResponse("chat-disabled"); // 503 + enlaces oficiales

  const { messages } = await req.json();
  const safe = messages.map(anonymizePII); // PII fuera antes de salir a China

  const client = new OpenAI({
    apiKey: key,
    baseURL: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com",
  });

  const stream = await client.chat.completions.create({
    model: process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash",
    messages: [{ role: "system", content: buildSystemPrompt() }, ...safe],
    temperature: 0.2,
    max_tokens: 800,
    stream: true,
    tools: TOOLS_SCHEMA,
  });
  // Reenviar deltas y resolver tool_calls con runTool() en el servidor.
  // Ante 429/5xx/timeout: retry exponencial; agotado -> fallbackResponse().
  return sseStream(stream);
}
```

`SYSTEM_PROMPT_TEMPLATE` no se transcribe aqui: vive en `src/data/chatConfig.ts` y referencia [../04-chat-ia/intenciones-y-prompts-del-chat.md](../04-chat-ia/intenciones-y-prompts-del-chat.md).

**Archivo objetivo**: `api/chat.ts` (nuevo). README de carpeta: `api/README.md` (nuevo, en ingles).

## Paso 4 — Adapter de datos `src/services/satApi.ts`

**Hallazgo actual**: `src/data/mockApi.ts` se importa directo en `App.tsx`; sin capa que conmute mock/real.

**Impacto**: el switch mock/real bloquea el deploy y el function-calling del backend no tiene punto unico de entrada.

**Propuesta**: `src/services/satApi.ts` expone `runTool(name, args)` y `consultarSAT(query)`. Selecciona implementacion por `import.meta.env.VITE_API_MODE` (`mock` usa `mockApi.ts`; `real` hace `fetch`). Las tools del chat se resuelven aqui, en servidor.

**Archivo objetivo**: `src/services/satApi.ts` (nuevo). Detalle del dataset y el camino a la API real: [./datos-sinteticos-y-demo.md](./datos-sinteticos-y-demo.md).

## Paso 5 — Config del chat `src/data/chatConfig.ts`

**Hallazgo actual**: intents bien estructurados en `src/data/satData.ts` (6 `assistantIntents`) pero sin system prompt inyectable ni `tools` schema.

**Impacto**: sin esto el modelo no puede orquestar tools ni recibir datos vigentes versionados.

**Propuesta**: crear `src/data/chatConfig.ts` exportando:

- `SYSTEM_PROMPT_TEMPLATE`: rol, tono de aliado, guardrails (no asesoria legal vinculante), traduccion de jerga inline.
- `DATOS_VIGENTES`: objeto inyectable versionado por anio fiscal (UIT, vencimientos, descuentos). NUNCA hardcodear cifras; inyectar fuera del prompt cacheado (ver nota de caching en [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md)).
- `TOOLS_SCHEMA`: formato OpenAI. Tools minimas: `consultar_deuda`, `calcular_alcabala`, `contar_dias_habiles`, `verificar_canal_oficial`.
- `buildSystemPrompt()`: compone template + `DATOS_VIGENTES`.

**Archivo objetivo**: `src/data/chatConfig.ts` (nuevo).

## Paso 6 — Guardrails y fallback

**Hallazgo actual**: `ChatMessage` persiste en `localStorage` (`Assistant.tsx:76`) con DNI/placa sin anonimizar; sin escalamiento ni banner anti-suplantacion.

**Impacto**: riesgo legal (Ley 29733, reserva tributaria art.85 Codigo Tributario); DeepSeek con infra en China. Bloquea produccion.

**Propuesta**:

- `src/services/piiGuard.ts` (nuevo): `anonymizePII(message)` detecta/enmascara DNI (8 digitos), placa (`/^[A-Z]{3}-\d{3}$/`, ver `inputValidation.ts`) y RUC (11). Marca `containsPII: boolean` (agregar campo a `ChatMessage` en `src/types.ts`).
- UI: truncar PII en display; boton "Eliminar conversacion" siempre visible (limpia las claves `sat-assistant:*` de `localStorage`).
- Escalamiento humano automatico ante keywords `coactiva`/`captura`/`embargo`: bypass del LLM, mostrar contacto/Mesa de Partes.
- Banner anti-suplantacion: "El SAT solo usa @sat.gob.pe; los tramites son gratis; no pagues a tramitadores."
- Fallback: si el endpoint responde `503`/error o `VITE_CHAT_ENABLED=false`, conservar `buildIntentResponse()` canned como degradacion graciosa (no romper el chat).
- Detalle normativo: [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).

**Archivo objetivo**: `src/services/piiGuard.ts` (nuevo), `src/types.ts` (campo `containsPII`).

## Paso 7 — Refactor de `Assistant.tsx`

**Hallazgo actual**: `Assistant.tsx` mezcla layout, persistencia, composer y logica de respuesta canned en 449 LOC.

**Impacto**: cablear streaming dentro del monolito multiplica el riesgo de regresion.

**Propuesta**: dividir en:

- `src/components/assistant/AssistantUI.tsx`: layout, persistencia (bottom-sheet/rail), composer, accesibilidad (mantener `aria-live`, `prefers-reduced-motion`, `field-sizing`).
- `src/components/assistant/hooks/useAssistantChat.ts`: `fetch` con stream a `${VITE_API_BASE_URL}/chat`, `AbortController` (cancelacion), retry/timeout, dedup, cache por intent, fallback a `buildIntentResponse()`.

Cambios concretos:

- Reemplazar `sendMessage()` (`Assistant.tsx:174-204`): en vez de `setTimeout(420ms)` + `buildIntentResponse`, invocar `useAssistantChat().send(text)` que hace `POST /api/chat` con stream y empuja deltas a `messages`.
- Mantener `buildIntentResponse()` (`Assistant.tsx:442-447`) exportado como fallback puro.
- Mantener el disparo por `command` (route cards del Home, `Assistant.tsx:206-219`).

**Archivo objetivo**: `src/components/assistant/Assistant.tsx` (dividir), `src/components/assistant/hooks/useAssistantChat.ts` (nuevo). Actualizar `src/components/assistant/README.md`.

## Paso 8 — Env de Vercel (provisioning)

- En Vercel: Project Settings > Environment Variables > agregar `DEEPSEEK_API_KEY` (Production + Preview). NO commitear su valor.
- Acordar governance: quien provisiona y rota la clave (SAT vs agencia) antes de produccion (riesgo abierto del brief).
- Cliente: `VITE_API_BASE_URL=/api` en prod (mismo dominio, sin CORS); `http://localhost:3000/api` en dev si se usa `vercel dev`.

## Paso 9 — Tests minimos (vitest)

- `useAssistantChat`: streaming OK, timeout/retry, cancelacion `AbortController`.
- Fallback canned cuando el endpoint falla o `VITE_CHAT_ENABLED=false`.
- `piiGuard.anonymizePII`: enmascara DNI/placa/RUC, marca `containsPII`.
- `TOOLS_SCHEMA`: valida shape OpenAI.

**Archivo objetivo**: `tests/` (nuevo), `vitest.config.ts` (nuevo).

## Secuencia resumida

| # | Accion | Archivo objetivo | Bloquea |
|---|---|---|---|
| 1 | Variables de entorno | `.env.example` | 3, 8 |
| 2 | Rewrite + fallback SPA | `vercel.json` | 3 |
| 3 | Proxy serverless streaming | `api/chat.ts` | 7 |
| 4 | Adapter mock/real | `src/services/satApi.ts` | 3 |
| 5 | System prompt + tools | `src/data/chatConfig.ts` | 3 |
| 6 | PII + fallback + escalamiento | `src/services/piiGuard.ts`, `src/types.ts` | produccion |
| 7 | Refactor chat a streaming | `Assistant.tsx`, `hooks/useAssistantChat.ts` | 3 |
| 8 | Provisioning secreto | Vercel UI | produccion |
| 9 | Tests | `tests/`, `vitest.config.ts` | merge seguro |

## Validacion del bloque

Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo. En la practica: usar el MCP chrome-devtools para abrir la app, alternar tema claro/oscuro, emular viewports (desktop y movil), ejercitar el chat con datos sinteticos (ver [./datos-sinteticos-y-demo.md](./datos-sinteticos-y-demo.md)) confirmando streaming, function-calling (consulta de deuda, alcabala, dias habiles), escalamiento por keywords, banner anti-suplantacion, anonimizacion PII y fallback canned con el endpoint deshabilitado, tomando capturas/snapshots de verificacion.
