# src/utils

Pure, stateless helpers shared across the SAT prototype UI.

## Files

- `inputValidation.ts` — Sanitizes and validates citizen query inputs (placa, DNI/RUC, código, expediente) for the search/payment flow. `ValidationOptions { demo }` relaxes per-tab formatting to accept any non-empty value (exposition demo). Exports: `QueryKind`, `QueryConstraints`, `ValidationResult`, `ValidationOptions`, `sanitizeQuery()`, `validateQuery()`, `getConstraints()`, `DNI_LENGTH`, `RUC_LENGTH`.
- `pii.ts` — Detects and masks personal identifiers (DNI/RUC/placa) before sending chat text to the LLM. Exports: `containsPII()`, `anonymizePII()`.

## Related

- `../components/UniversalActionBox.tsx` — consumes the validation helpers (demo mode).
- `../data/satData.ts` — `paymentTabs` defines the tab ids matched by `QueryKind`.
