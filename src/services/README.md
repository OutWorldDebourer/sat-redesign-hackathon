# src/services

I/O and domain-logic layer, decoupled from UI. Pages and components depend on these adapters, never on raw data modules.

## Files

- `satApi.ts` — Data adapter (mock/real by `VITE_API_MODE`); wraps the in-memory query so pages are source-agnostic. Exports: `satApi`, `MockApiResponse`, `MockResultData`.
- `paymentService.ts` — Demo payment logic: card validation, simulated submit, printable receipt HTML and print window. Exports: `validateCard()`, `submitPayment()`, `generateReceiptHTML()`, `openReceiptWindow()`, `PROCESSING_DELAY_MS`, `CardDraft`, `ReceiptData`.
- `chatClient.ts` — Calls `/api/chat` and consumes the OpenAI-compatible SSE stream (content + reasoning deltas), sends `mode` (normal/think), throws typed errors for graceful fallback. Exports: `streamChat()`, `CHAT_ENABLED`, `ChatStreamError`, `ChatErrorKind`, `ChatMode`, `StreamChatOptions`.
- `sseScrub.ts` — Pure server-side SSE filter that strips `reasoning_content` deltas while preserving `content` and `[DONE]`; line-based, buffers partial lines across chunks. Consumed by the `/api/chat` Edge proxy. Exports: `scrubLine()`, `scrubReasoningChunk()`.
- `handoffTriage.ts` — Rule-based triage deciding human handoff (legal/coactiva, failed payment, complaint, frustration, PII, multiple attempts). Exports: `triageHandoff()`, `HandoffAssessment`, `HandoffPriority`.
- `handoffClient.ts` — Handoff ticket store (localStorage demo; documents the real DB adapter) shared with the assistant dashboard; PII anonymized in transcripts. Exports: `createHandoffTicket()`, `listHandoffTickets()`, `updateHandoffTicket()`, `seedDemoTicketsIfEmpty()`, `HandoffTicket`, `TicketStatus`, `TicketTurn`.

## Related

- `../data/mockApi.ts` — in-memory source wrapped by `satApi`.
- `../components/HeroInfoPanel/` — consumes `paymentService`.
