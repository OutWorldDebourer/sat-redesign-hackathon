# src/pages

Route-level pages, one per file, default-exported and loaded via `React.lazy` in `App.tsx` (one chunk per route). Local view state only; data comes from `services/satApi` and `data/`.

## Files

- `Home.tsx` — Landing: hero (UniversalActionBox + HeroInfoPanel), intent route cards, urban indicators, benefits strip. Props: `onAssistantIntent`. Exports: `default`.
- `ConsultPay.tsx` — Single-entry consult/pay flow (UniversalActionBox + HeroInfoPanel). Exports: `default`.
- `Catalog.tsx` — Service catalog filtered by `kind` (`"tributos"`/`"papeletas"`). Exports: `default`.
- `Procedures.tsx` — Digital procedures list. Exports: `default`.
- `Installments.tsx` — Fraccionamiento pre-evaluator. Exports: `default`.
- `Offices.tsx` — Offices and channels. Exports: `default`.
- `Institution.tsx` — Institutional page and official sources. Exports: `default`.
- `ProcedureDetail.tsx` — Procedure detail by `:id` param. Exports: `default`.
- `AssistantDashboard.tsx` — Human-assistant dashboard (`/asistente`): handoff ticket queue, filters, detail, summary, actions, metrics. Reads `services/handoffClient`. Exports: `default`.

## Related

- `../App.tsx` — lazy-imports every page and wires routes.
- `../components/` — shared presentational UI.
- `../services/satApi.ts` — data adapter consumed by Home/ConsultPay.
