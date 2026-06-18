# src/components

Reusable presentational UI for the SAT redesign. No domain or network logic; data and adapters are injected via props or imported from `data/`.

## Files

- `PageFrame.tsx` — Interior page header (eyebrow/title/copy) + content wrapper. Exports: `PageFrame`.
- `SectionHeading.tsx` — Eyebrow + title + copy heading block. Exports: `SectionHeading`.
- `ServiceCard.tsx` — Service (tributo/multa) card with actions and source link. Exports: `ServiceCard`.
- `ProcedureCard.tsx` — Procedure card linking to its detail route. Exports: `ProcedureCard`.
- `UniversalActionBox.tsx` — Single-entry query form (placa/DNI/codigo/expediente) with sanitize + validate. `demo` prop (default true) accepts any non-empty value and passes the active kind to `onSubmit`. Exports: `UniversalActionBox`.
- `ThemeToggle.tsx` — Light/dark theme toggle (Moon/Sun, `aria-label`). Exports: `ThemeToggle`.

## Subdirectories

- `icons/` — Central lucide icon map by semantic key.
- `HeroInfoPanel/` — Hero guide panel + demo payment simulation.
- `assistant/` — Fixed AI chat assistant (isolated).

## Related

- `../pages/` — composes these components per route.
