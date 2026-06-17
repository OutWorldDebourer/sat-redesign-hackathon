# Estado actual de UI/UX del prototipo SAT

Fotografía del sistema de diseño implementado en el repo (no la investigación). Sirve de línea base para el rediseño: qué preservar, qué corregir.

> Alcance: `src/styles.css` (4063 LOC, monolito global) y la capa visual de `src/App.tsx` (1947 LOC). Cruce con [../03-contenido-y-ux/componentes-ui-requeridos.md](../03-contenido-y-ux/componentes-ui-requeridos.md) y [../03-contenido-y-ux/lenguaje-directo-y-microcopy.md](../03-contenido-y-ux/lenguaje-directo-y-microcopy.md).

---

## 1. Sistema de diseño actual

### Tokens de color (mezcla hex + OKLCH)

| Token | Valor real | Tipo | Observación |
|---|---|---|---|
| `--color-primary` | `#16236e` | hex | Azul institucional SAT. Hardcodeado también en gradientes (`styles.css:~2961, ~3018`). |
| `--color-secondary` | `#337ab7` | hex | Azul medio. |
| `--color-accent` | `#006db3` | hex | Azul vínculo/realce. |
| `--color-text` | `#555555` | hex | Gris de texto; contraste a verificar sobre superficies tintadas. |
| `--color-focus` | `#006db3` | hex | Anillo de foco. |
| Superficies y estados | `oklch(...)` (36 usos) | OKLCH | Fondos, bordes, sombras, badges con `color-mix`. |

- **Hallazgo actual:** 16 valores hex conviven con 36 declaraciones OKLCH; el azul base vive como hex y se repite literal en gradientes en vez de leer `var(--color-primary)`.
- **Impacto:** migración de tema (claro/oscuro) error-prone: cada hex debe reconvertirse a mano y los gradientes literales no responden a variables.
- **Propuesta:** normalizar el 100% de la paleta a OKLCH semántico (`--color-primary: oklch(0.28 0.12 260)` aprox., etc.), sustituir todo `#16236e/#337ab7/#006db3` literal por `var(--color-*)`, y reescribir gradientes como `linear-gradient(135deg, var(--color-primary), var(--color-accent))`.
- **Archivo objetivo:** `src/styles.css` (`:root` ~16-35, y ocurrencias literales ~2961, ~3018, ~3059, ~3387).

### Color neón fuera de paleta

- **Hallazgo actual:** `#00ffcc` (cyan neón) como borde en `.dni-highlight-ring` (`styles.css:~3059`) y `.hip-dni-ring` (`styles.css:~3387`) sobre fondo azul oscuro del mockup de DNI.
- **Impacto:** viola el ban de proyecto neón-sobre-oscuro; contraste agresivo, ilegible en un eventual tema oscuro.
- **Propuesta:** reemplazar por `color-mix(in oklch, var(--color-accent) 65%, white)` o `var(--color-accent)` puro.
- **Archivo objetivo:** `src/styles.css:~3059, ~3387`.

### Tipografía

| Familia | Rol | Origen |
|---|---|---|
| Atkinson Hyperlegible | Texto/cuerpo (alta legibilidad, accesible) | Google Fonts en `index.html` |
| Bricolage Grotesque | Títulos/display | Google Fonts en `index.html` |

- **Hallazgo actual:** par display + cuerpo intencional; Atkinson Hyperlegible es una elección fuerte para accesibilidad. No usa fuentes prohibidas por las skills.
- **Impacto:** base tipográfica sólida; preservable.
- **Propuesta:** preservar el par. Verificar escala modular (ratio >=1.25), `clamp()` en titulares marketing y `rem` fijo en UI de app; topar longitud de línea 65-75ch. Añadir `<link rel="preload" as="font">` para la display crítica (ver [riesgos-tecnicos.md](riesgos-tecnicos.md), bloque SEO/performance).
- **Archivo objetivo:** `index.html` (carga de fuentes), `src/styles.css` (escala tipográfica).

---

## 2. Responsive (breakpoints reales)

- **Hallazgo actual:** breakpoints `@media` en `styles.css`: 1180, 981-1500, 980, 640, 360 y 680px. Usa `dvh`, `clamp()` y `field-sizing`. El asistente alterna rail lateral (desktop) y bottom-sheet (móvil).
- **Impacto:** cobertura responsive amplia y moderna (`dvh` evita el salto de barra en iOS). Riesgo: breakpoints numéricos dispersos sin tokens, difíciles de mantener tras modularizar el CSS.
- **Propuesta:** preservar la estrategia `dvh`/`clamp`; al modularizar, centralizar breakpoints como custom media/tokens en `src/styles/tokens.css`. Confirmar colapso a una sola columna por debajo de 768px.
- **Archivo objetivo:** `src/styles.css` (bloques `@media`).

> Valida y observa cómo se verá en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sintéticos para confirmar las funcionalidades y todo. En la práctica: con el MCP chrome-devtools, abrir la app, emular viewports desktop (1280/1440) y móvil (360/390), y capturar el colapso a una columna en cada breakpoint.

---

## 3. Motion

- **Hallazgo actual:** animaciones por `@keyframes` CSS; respeta `prefers-reduced-motion` (`styles.css:~2451+`). No usa Framer Motion. Pseudo-elemento `conic-gradient` como borde animado en `.action-box.gradient-cta::before` (borde, no texto: permitido).
- **Impacto:** motion sobrio y accesible; sin librería extra de animación. Coherente con un portal institucional.
- **Propuesta:** preservar `prefers-reduced-motion`. Mantener animaciones solo en `transform`/`opacity` (no `width/height/margin`). Si se introduce motion adicional, evaluar coste antes de añadir dependencias; no mezclar librerías en el mismo árbol de componentes.
- **Archivo objetivo:** `src/styles.css` (bloque de `@keyframes` y media de motion).

---

## 4. Accesibilidad observada

- **Hallazgo actual:** `aria-live="polite"` y `role="status"` en el asistente; uso de `sr-only`; semántica de `nav`/`article`/`aside`; `Enter`-to-send solo en puntero fino; respeta `prefers-reduced-motion`. Atkinson Hyperlegible refuerza legibilidad.
- **Impacto:** base de accesibilidad por encima del promedio para un prototipo.
- **Propuesta:** preservar. Pendientes a auditar: contraste real de `--color-text #555555` y badges (`hip-badge-ok` verde) sobre superficies tintadas (objetivo WCAG 2.1 AA, 4.5:1); `aria-label` en iconos que hoy son emoji (ver bloque 6). Localización numérica con `Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })` en lugar de montos hardcodeados.
- **Archivo objetivo:** `src/components/assistant/Assistant.tsx`, `src/styles.css` (tokens de texto/badges), `src/App.tsx` (HeroInfoPanel, formato de montos).

> Valida y observa cómo se verá en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sintéticos para confirmar las funcionalidades y todo. En la práctica: correr una pasada de accesibilidad/contraste con chrome-devtools sobre el asistente y el simulador de pago, en ambos temas.

---

## 5. Ausencia de modo oscuro (crítico)

- **Hallazgo actual:** `color-scheme: light` único (`styles.css:14`). Cero `prefers-color-scheme`, cero `light-dark()`, cero `data-theme`, cero `.dark`, sin toggle en UI.
- **Impacto:** un portal de gobierno sin tema oscuro falla la expectativa de accesibilidad en baja luz/fatiga ocular; la mezcla hex+OKLCH hace la migración sistémica costosa.
- **Propuesta:**
  1. `:root { color-scheme: light dark; }` y paleta semántica con `light-dark(<light> <dark>)` por cada color sensible a luz (fondo, texto, bordes, sombras).
  2. Override automático bajo `@media (prefers-color-scheme: dark)`.
  3. `data-theme="dark|light"` en `<html>` para override manual persistente.
  4. `ThemeToggle` (icono `Moon`/`Sun` de lucide-react, con `aria-label`) en el header.
  5. Hook `useTheme` con prioridad: localStorage > `prefers-color-scheme` > light (reutiliza `src/hooks/useLocalStorage.ts`).
  6. Espaciado en escala 4pt con tokens semánticos (`--space-md`), `gap` en lugar de márgenes.
- **Archivo objetivo:** nuevo `src/styles/theme.css`; nuevo `src/components/ThemeToggle.tsx`; nuevo `src/hooks/useTheme.ts`; `src/App.tsx` (header) para montar el toggle y aplicar `data-theme`.

> Valida y observa cómo se verá en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sintéticos para confirmar las funcionalidades y todo. En la práctica: alternar `data-theme` y `prefers-color-scheme` (emulación de chrome-devtools), recorrer home, consulta/pago y asistente en cada tema y viewport, y tomar capturas de verificación.

---

## 6. Emojis en código (ban de proyecto)

- **Hallazgo actual:** símbolos de advertencia y check renderizados como texto en JSX y en el HTML del comprobante: `App.tsx:1385`, `1411`, `1570`, `1598` y `1913` ("Simulación demo", "Cancelado").
- **Impacto:** viola el hard-ban de las skills; débil en accesibilidad (sin `aria-label`); inconsistente con lucide-react ya cargado.
- **Propuesta:** reemplazar el símbolo de advertencia por `<AlertTriangle size={16} aria-label="Aviso" />` y el check por `<Check size={14} aria-label="Confirmado" />` de lucide-react. Para el HTML del comprobante (string para `window.print`), usar SVG inline o texto neutro. Estandarizar `strokeWidth` de lucide (1.5 o 2.0).
- **Archivo objetivo:** `src/App.tsx:1385, 1411, 1570, 1598, 1913`.

### Conflicto de iconos (decisión explícita requerida)

- **Hallazgo actual:** `lucide-react` (^0.468) está en uso en todo el repo; las skills del proyecto prefieren `@phosphor-icons/react` o `@radix-ui/react-icons`.
- **Impacto:** migrar de librería de iconos es un cambio transversal de superficie media; mantener lucide evita churn.
- **Propuesta (a decidir por el equipo, no resolver en silencio):**
  - Opción A (recomendada): **mantener lucide-react** por consistencia con el código existente y estandarizar `strokeWidth`.
  - Opción B: migrar a Phosphor/Radix para alinear con las skills, asumiendo el costo de reemplazo en todos los componentes.
- **Archivo objetivo:** decisión de proyecto; afecta `src/App.tsx`, `src/components/**`.

---

## 7. Resumen: preservar vs mejorar

| Preservar | Mejorar |
|---|---|
| Atkinson Hyperlegible + Bricolage Grotesque | Normalizar paleta a 100% OKLCH semántico |
| `dvh` + `clamp()` + `field-sizing` | Modularizar `styles.css` en `src/styles/` (tokens/layout/components/theme/animation) |
| `prefers-reduced-motion` y motion sobrio | Implementar modo oscuro completo (`light-dark()` + `data-theme` + toggle) |
| `aria-live`/`role=status`/`sr-only` en asistente | Verificar contraste WCAG 2.1 AA de texto y badges |
| Bottom-sheet móvil / rail desktop del chat | Quitar emojis y estandarizar iconos lucide |
| OKLCH + `color-mix` ya presentes | Quitar neón `#00ffcc`; `Intl.NumberFormat('es-PE')` para montos |

---

## Relacionados

- [brechas-contra-investigacion-sat.md](brechas-contra-investigacion-sat.md) — brechas funcionales contra Docs/01-05.
- [riesgos-tecnicos.md](riesgos-tecnicos.md) — deuda y riesgos por dimensión técnica.
- [../03-contenido-y-ux/componentes-ui-requeridos.md](../03-contenido-y-ux/componentes-ui-requeridos.md) — componentes y estados objetivo.
- [../03-contenido-y-ux/lenguaje-directo-y-microcopy.md](../03-contenido-y-ux/lenguaje-directo-y-microcopy.md) — tono y microcopy objetivo.
