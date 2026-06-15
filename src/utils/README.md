# src/utils

Pure, stateless helpers shared across the SAT prototype UI.

## Files

- `inputValidation.ts` — Sanitizes and validates citizen query inputs (placa, DNI/RUC, código, expediente) for the search/payment flow. Exports: `QueryKind`, `QueryConstraints`, `ValidationResult`, `sanitizeQuery()`, `validateQuery()`, `getConstraints()`, `DNI_LENGTH`, `RUC_LENGTH`.

## Related

- `../App.tsx` — `UniversalActionBox` consumes the validation helpers.
- `../data/satData.ts` — `paymentTabs` defines the tab ids matched by `QueryKind`.
