# src/features

Strategy components (citizen domain) for the SAT redesign. Self-contained: each renders with demo synthetic data and reads figures from the versioned fiscal source — never hardcoded. Mounted into pages.

## Files

- `PapeletaSemaforo.tsx` — Traffic-light status per ticket (verde/amarillo/rojo/negro) with a business-days discount countdown. Exports: `PapeletaSemaforo`.
- `Beneficiarios50UIT.tsx` — Accessible 4-question pre-evaluator for the pensioner 50-UIT benefit. Exports: `Beneficiarios50UIT`.
- `VerificadorAntiSuplantacion.tsx` — Checks if an email/URL/number is an official SAT channel; flags known fraud. Exports: `VerificadorAntiSuplantacion`.
- `SedeFinder.tsx` — Filters offices by district and service. Exports: `SedeFinder`.
- `CalendarVencimientos.tsx` — Versioned due-dates with business-days countdown and demo reminder. Exports: `CalendarVencimientos`.

## Related

- `../data/fiscal/2026.ts` — versioned UIT, holidays, due dates, discounts.
- `../utils/businessDaysCalculator.ts` — business-days math (holiday-aware).
- `../data/satData.ts` — `officeLocations` for `SedeFinder`.
- `../styles/features.css` — styles for these components.
