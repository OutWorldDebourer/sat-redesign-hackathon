# src/styles

Global CSS split into cascade layers. Imported from `src/main.tsx` in the order below; that order IS the cascade order. Palette is 100% OKLCH via `light-dark()` tokens; dark mode is driven by `color-scheme` (system + `data-theme` override).

## Files

- `tokens.css` — `@font-face` and `:root` design tokens: OKLCH colors (`light-dark()`), 4pt spacing scale, radii, fonts, shadows, easing.
- `base.css` — Reset and root HTML/element typography (`*`, `html`, `body`, headings, `p`, focus ring).
- `layout.css` — Structural shell: `.app-shell`, `.site-region`, `.site-header`, nav, `.main-content`.
- `components.css` — All component styling (cards, action-box, route cards, assistant, HeroInfoPanel `hip-*`, payment `pay-sim-*`, receipt, mockups). Single component layer per the Docs/07 architecture.
- `responsive.css` — `@media`/`@container` queries; imported after components so breakpoints override base styles.
- `theme.css` — `:root[data-theme]` `color-scheme` overrides for the manual toggle (wins over system).
- `utilities.css` — Atomic helpers (`.sr-only`).
- `animation.css` — `@keyframes` (transform/opacity only) and `prefers-reduced-motion` blocks.

## Related

- `../main.tsx` — imports the layers in cascade order.
- `../hooks/useTheme.ts`, `../components/ThemeToggle.tsx` — drive `data-theme`.
