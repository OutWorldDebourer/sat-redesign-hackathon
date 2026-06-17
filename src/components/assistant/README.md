# src/components/assistant

Persistent SAT chat assistant: side-docked panel on desktop, bottom sheet on mobile. View layer; conversation logic lives in `hooks/`.

## Files

- `Assistant.tsx` — Chat UI: intent quick-actions, official-access link chips, auto-growing composer (Enter-to-send on fine pointers), anti-spoofing banner, delete-conversation, PII note on user messages, and human-escalation chip. Owns view state (minimized, sheet, attention). Exports: `Assistant`, `AssistantCommand`.

## Subdirectories

- `hooks/` — Conversation logic (streaming + canned fallback + PII).

## Related

- `../../data/satData.ts` — `assistantIntents`, `quickActions` consumed by the panel.
- `../../hooks/useLocalStorage.ts` — persists sheet/minimized state.
