# src/components/HeroInfoPanel/hooks

Stateful logic for the HeroInfoPanel, kept out of the view layer.

## Files

- `usePaymentState.ts` — Payment state machine (`idle`→`form`→`processing`→`success`), sanitized card/CVV input, operation number; resets on a new query result. Exports: `usePaymentState()`, `PayState`.
