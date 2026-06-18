# api

Vercel serverless (Edge) functions. Outside `src/`, compiled by Vercel (not by `npm run typecheck`). Secrets live only in server env, never in the client bundle.

## Files

- `chat.ts` — Edge proxy to DeepSeek for the SAT assistant. POST, OpenAI-compatible streaming (SSE). Reads `DEEPSEEK_API_KEY` and the configurable models `DEEPSEEK_MODEL_FAST`/`DEEPSEEK_MODEL_THINK` (legacy fallback `DEEPSEEK_MODEL`) plus `DEEPSEEK_BASE_URL` from server env; picks model + `reasoning_effort` by request `mode` (`normal`/`think`). Prepends the system messages from `chatConfig`, strips `reasoning_content` from the SSE before forwarding (via `sseScrub`), applies timeout + per-chunk idle watchdog, retry-with-backoff on 429/5xx, best-effort per-IP rate limit. Missing key degrades softly to a `200` JSON envelope `{ error: "chat_unavailable", reason: "missing_api_key" }` (not a `5xx`, keeps the browser console clean); also handles 429, 502/504. Exports: `default` handler, `config` (`runtime: "edge"`).

- `handoff.ts` — Edge contract for creating human-handoff tickets. POST, validates ticket shape, returns `202` WITHOUT persisting (demo; documents the real DB adapter). No secrets. Exports: `default` handler, `config`.

## Related

- `../src/data/chatConfig.ts` — system messages (`buildSystemMessages`) consumed by `chat.ts`.
- `../src/services/sseScrub.ts` — pure SSE filter that strips `reasoning_content`, used by `chat.ts`.
- `../src/services/chatClient.ts` — client that calls `/api/chat` (Bloque 5).
- `../vercel.json` — SPA rewrite that excludes `/api/`.
