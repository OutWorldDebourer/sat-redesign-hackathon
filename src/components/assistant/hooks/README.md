# src/components/assistant/hooks

Conversation logic for the SAT assistant, decoupled from the view.

## Files

- `useAssistantChat.ts` — Manages persisted history, draft and thinking state; sends via streaming to `/api/chat` when chat is enabled, degrading gracefully to canned intent responses on failure; anonymizes PII before sending to the LLM and flags human-escalation cases. Exports: `useAssistantChat()`, `UseAssistantChat`.

## Related

- `../../../services/chatClient.ts` — SSE streaming client and `CHAT_ENABLED`.
- `../../../utils/pii.ts` — `anonymizePII`, `containsPII`.
- `../../../data/satData.ts` — `assistantIntents` for matching and canned responses.
