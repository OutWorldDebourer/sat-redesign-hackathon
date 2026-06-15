# src/components/assistant

Persistent SAT chat assistant: side-docked panel on desktop, bottom sheet on mobile.

## Files

- `Assistant.tsx` — Chat assistant with intent quick-actions, official-access link chips, and an auto-growing message composer (Enter-to-send on fine pointers). Exports: `Assistant`, `AssistantCommand`.

## Related

- `../../data/satData.ts` — `assistantIntents`, `quickActions` consumed by the panel.
- `../../hooks/useLocalStorage.ts` — persists messages, draft and sheet state.
