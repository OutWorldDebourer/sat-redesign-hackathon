# src/components/HeroInfoPanel

Hero guide panel: a 4-step stepper plus a dynamic panel that shows the step mockup, the live query result, the "no debt" state, or the demo payment flow. Orchestration only; payment state lives in the hook and payment logic in `services/paymentService`.

## Files

- `HeroInfoPanel.tsx` — Orchestrates stepper + panel states (mockup/result/no-result/payment). Exports: `HeroInfoPanel`.
- `PaymentForm.tsx` — Controlled demo card form (number/CVV with live preview). Exports: `PaymentForm`.
- `Receipt.tsx` — On-screen payment receipt + print/download trigger. Exports: `Receipt`.

## Subdirectories

- `hooks/` — Payment state machine hook.

## Related

- `../../data/tabSteps.tsx` — per-tab step mockups (`TAB_STEPS`, `STEP_LABELS`).
- `../../services/paymentService.ts` — `validateCard`, `submitPayment`, `generateReceiptHTML`, `openReceiptWindow`.
- `../../services/satApi.ts` — `MockResultData` type.
