# api

Vercel serverless (Edge) functions. Outside `src/`, compiled by Vercel (not by `npm run typecheck`). Secrets live only in server env, never in the client bundle.

## Files

- `chat.ts` — Edge proxy to DeepSeek for the SAT assistant. POST, OpenAI-compatible streaming (SSE), reads `DEEPSEEK_API_KEY`/`DEEPSEEK_MODEL`/`DEEPSEEK_BASE_URL` from server env, prepends the system messages from `chatConfig`, applies timeout, retry-with-backoff on 429/5xx, best-effort per-IP rate limit, and degrades gracefully (503 `missing_api_key`, 429, 502/504). Exports: `default` handler, `config` (`runtime: "edge"`).

- `handoff.ts` — Edge contract for creating human-handoff tickets. POST, validates ticket shape, returns `202` WITHOUT persisting (demo; documents the real DB adapter). No secrets. Exports: `default` handler, `config`.

## Related

- `../src/data/chatConfig.ts` — system prompt, `DATOS_VIGENTES`, `TOOLS_SCHEMA` consumed by `chat.ts`.
- `../src/services/chatClient.ts` — client that calls `/api/chat` (Bloque 5).
- `../vercel.json` — SPA rewrite that excludes `/api/`.
