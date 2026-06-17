# Riesgos técnicos

Riesgos por dimensión técnica con severidad y mitigación. Marca la deuda crítica que bloquea la implementación de la estrategia (Docs/01-05).

> Stack verificado: React 19.1.1, react-router-dom 7.8 (SPA), Vite 7.1, TypeScript 5.8, lucide-react 0.468. Sin Tailwind, sin estado global, sin lint/test/format, deploy Vercel sin funciones serverless.

Severidad: P0 bloquea · P1 alta · P2 media · P3 menor.

---

## 1. Build y modularidad

- **Hallazgo actual:** `src/App.tsx` = 1947 LOC (22 funciones: 8 páginas + helpers + `HeroInfoPanel` ~495 LOC con simulador de pago, estado de tarjeta y `buildReceiptHTML` inline). `src/styles.css` = 4063 LOC (CSS global único). `satData.ts` = 1075 LOC. Viola el techo de 500 LOC.
- **Impacto:** imposible testear/debuggear/modularizar; refactorizar el chat dentro del monolito multiplica el riesgo de regresión. Habilitador previo a integrar IA.
- **Propuesta:** extraer 8 páginas a `src/pages/` con `React.lazy` + `Suspense`; descomponer `HeroInfoPanel/` (orquestación + `PaymentForm` + `Receipt` + `hooks/usePaymentState`); mover `TAB_STEPS` a `src/data/tabSteps.ts`; extraer `src/services/paymentService.ts` (`validateCard`, `generateReceipt`, `submitPayment`); dividir `styles.css` en `src/styles/` (tokens/layout/components/theme/animation, importados en orden desde `main.tsx`); repartir `satData.ts` por dominio. Meta: `App.tsx` ~100 LOC (solo router/layout), ningún archivo >500 LOC.
- **Archivo objetivo:** `src/App.tsx`, `src/styles.css`, `src/data/satData.ts`.
- **Severidad:** P1.

## 2. Código muerto y datos duplicados

- **Hallazgo actual:** `LimaSkyline`, `InlineResultCard`, `NoResultCard` (y probablemente `EmptyState`/`Channel`) definidos en `App.tsx` pero nunca invocados; `ResultModal.tsx` y `Stepper.tsx` nunca importados (~410 LOC de ruido). `routeLanes`/`heroAccessItems`/`urbanIndicators`/`benefitItems` inline en `App.tsx` duplican/solapan `satData.ts`.
- **Impacto:** confunde el refactor y arriesga desincronización de datos (cambiar una ruta no se refleja en el otro lugar).
- **Propuesta:** eliminar el código muerto; centralizar los datos duplicados en `src/data/`. Limpieza barata previa a modularizar.
- **Archivo objetivo:** `src/App.tsx`, `src/components/ResultModal.tsx`, `src/components/Stepper.tsx`, `src/data/satData.ts`.
- **Severidad:** P2.

---

## 3. Lint / test / format / typecheck

- **Hallazgo actual:** scripts solo `dev`, `build` (`tsc --noEmit && vite build`), `preview`. Cero ESLint, Prettier, vitest; sin pre-commit ni CI; `tsc` solo dentro del build.
- **Impacto:** refactor masivo + integración IA sin red de seguridad = regresiones ocultas (riesgo concreto: romper el flujo de pago de `HeroInfoPanel`/`buildReceiptHTML` o el chat en silencio).
- **Propuesta:** instalar ESLint (+ `react-hooks`), Prettier y vitest + Testing Library; tests de humo del flujo de pago y del fallback canned ANTES de Fase 1; husky pre-commit (`lint` + `typecheck`); CI mínima en GitHub Actions.
- **Archivo objetivo:** `package.json`, nuevos `.eslintrc`, `vitest.config.ts`, `.husky/pre-commit`, `.github/workflows/test.yml`.
- **Severidad:** P2.

---

## 4. Seguridad y secretos (DeepSeek) — DEUDA CRÍTICA

- **Hallazgo actual:** SPA pura sin backend. No existe `api/`, `vite.config.ts` está vacío (6 LOC), no hay `vercel.json` ni `.env.example`, ni uso de `import.meta.env`. Cualquier integración LLM en el cliente expondría la clave en el bundle.
- **Impacto:** **P0 — bloquea toda la IA.** Sin proxy serverless, `DEEPSEEK_API_KEY` quedaría compilada en `dist/` y sería decodificable. Nada de chat real, streaming ni function-calling es posible hasta tenerlo.
- **Propuesta:**
  1. `api/chat.ts` (función serverless Vercel, POST) que lee `DEEPSEEK_API_KEY` del entorno del servidor; streaming OpenAI-compatible a DeepSeek (`base_url https://api.deepseek.com`, modelo `deepseek-v4-flash`), timeout 15-30s, retry exponencial, manejo 429/5xx, rate-limit por IP, logging sin secretos. El cliente solo hace `POST /api/chat` y nunca ve la clave.
  2. `vercel.json` con rewrite `/api/:path*` y SPA fallback a `/index.html`.
  3. `DEEPSEEK_API_KEY` provisionada en Vercel Project Settings (nunca en `.env` del repo). `.env.example` documenta solo variables públicas (`VITE_API_BASE_URL`, `VITE_CHAT_ENABLED`, `VITE_API_MODE`).
- **Archivo objetivo:** nuevo `api/chat.ts`, nuevo `vercel.json`, nuevo `.env.example`, `vite.config.ts`.
- **Severidad:** P0.
- **Detalle:** [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md).

## 5. PII en localStorage (Ley 29733 / reserva tributaria)

- **Hallazgo actual:** `ChatMessage` persiste en localStorage con DNI/placa sin anonimizar (`Assistant.tsx:~76`); sin flag PII en `types.ts`.
- **Impacto:** riesgo legal (Ley 29733, reserva tributaria art. 85 del Código Tributario) y exposición ante XSS (persistir contenido sin CSP). Bloquea producción con DeepSeek (infra en China).
- **Propuesta:** detección/anonimización de DNI/placa pre-envío; `ChatMessage.containsPII`; truncado de PII en UI (solo últimos dígitos); "Eliminar conversación" siempre visible; nunca loguear `content` con PII; añadir CSP. Política de Privacidad publicada del SAT: pendiente de verificación.
- **Archivo objetivo:** `src/components/assistant/Assistant.tsx`, `src/types.ts`, `api/chat.ts`.
- **Severidad:** P1.
- **Detalle:** [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).

---

## 6. Accesibilidad y tema

- **Hallazgo actual:** `color-scheme: light` único; sin `prefers-color-scheme`/`light-dark()`/`data-theme`; mezcla 16 hex + 36 OKLCH; neón `#00ffcc` en bordes; contraste de `--color-text #555555` y badges sin verificar.
- **Impacto:** falla expectativa de accesibilidad de portal de gobierno (baja luz/fatiga ocular); migración de tema error-prone por la mezcla hex+OKLCH; posible fallo WCAG 2.1 AA de contraste.
- **Propuesta:** modo oscuro con `light-dark()` + `prefers-color-scheme` + `data-theme` + `ThemeToggle` persistente (`useTheme`); normalizar paleta a 100% OKLCH; quitar neón; auditar contraste a 4.5:1. Detalle en [estado-ui-ux-actual.md](estado-ui-ux-actual.md).
- **Archivo objetivo:** nuevo `src/styles/theme.css`, nuevo `src/components/ThemeToggle.tsx`, nuevo `src/hooks/useTheme.ts`, `src/App.tsx`, `src/styles.css`.
- **Severidad:** P1.

> Valida y observa cómo se verá en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sintéticos para confirmar las funcionalidades y todo. En la práctica: con chrome-devtools, alternar tema y `prefers-color-scheme`, emular viewports desktop/móvil, recorrer cada flujo con datos sintéticos y capturar contraste y layout.

---

## 7. Performance y code-splitting

- **Hallazgo actual:** SPA sin code-splitting por ruta (monolito `App.tsx`); CSS global de 4063 LOC parseado completo en cada página; sin `preload` de fuente display.
- **Impacto:** bundle inicial mayor de lo necesario; LCP afectado al parsear CSS no usado.
- **Propuesta:** `React.lazy` por ruta tras modularizar; CSS modular importado en orden; `preload` de la fuente crítica; verificar bundle con `vite build` (análisis). Animar solo `transform`/`opacity`.
- **Archivo objetivo:** `src/App.tsx`, `src/styles/`, `index.html`, `vite.config.ts`.
- **Severidad:** P2.

## 8. SSR / CSR / SEO

- **Hallazgo actual:** SPA sin SSR/prerender; `index.html` renderiza `<div id="root"></div>` vacío. Falta favicon, Open Graph/Twitter, `theme-color`, `robots.txt`/`sitemap.xml`.
- **Impacto:** un portal informativo de gobierno necesita indexación y preview social; SPA sin SSR limita SEO y Core Web Vitals.
- **Propuesta:** MVP — añadir meta SEO (favicon, OG, `theme-color`, `robots`/`sitemap`) y JSON-LD en la ficha de trámite. Pre-lanzamiento — evaluar Astro/Next (SSG/SSR) para no rehacer arquitectura tarde (decisión a tomar antes del piloto público).
- **Archivo objetivo:** `index.html`, `public/` (favicon, robots, sitemap), `src/App.tsx` (meta por ruta).
- **Severidad:** P2 (P3 el SSR para MVP).

---

## 9. Vercel / entorno

- **Hallazgo actual:** existe `.vercel`/`.vercelignore` pero no `vercel.json`; sin gestión de env; `.gitignore` protege `.env*` y permite `.env.example` (que no existe).
- **Impacto:** sin `vercel.json` el routing `/api/*` y el SPA fallback quedan indefinidos; sin `.env.example` el onboarding y el provisioning de secretos en Vercel quedan sin documentar.
- **Propuesta:** `vercel.json` (rewrite `/api/:path*` + fallback SPA); `.env.example` documentando solo variables públicas; documentar en README que `DEEPSEEK_API_KEY` va solo en Vercel Project Settings. Definir governance: quién provisiona y rota la clave (SAT vs agencia).
- **Archivo objetivo:** nuevo `vercel.json`, nuevo `.env.example`, README raíz.
- **Severidad:** P1.

---

## 10. Emojis en código (ban de proyecto)

- **Hallazgo actual:** símbolos de advertencia/check en JSX y en el HTML del comprobante (`App.tsx:1385, 1411, 1570, 1598, 1913`).
- **Impacto:** viola el hard-ban de las skills; débil en accesibilidad; inconsistente con lucide-react.
- **Propuesta:** reemplazar por `AlertTriangle`/`Check` de lucide-react con `aria-label`; en el comprobante, SVG inline o texto neutro.
- **Archivo objetivo:** `src/App.tsx`.
- **Severidad:** P3.

---

## Deuda crítica que bloquea la implementación

| # | Riesgo | Severidad | Bloquea |
|---|---|---|---|
| 4 | Backend serverless ausente (clave DeepSeek se expondría) | P0 | Toda la IA (chat real, streaming, function-calling) |
| 1 | Monolitos `App.tsx` 1947 LOC y `styles.css` 4063 LOC | P1 | Modularizar y testear antes de integrar IA |
| 5 | PII sin guardrails en localStorage | P1 | Producción con DeepSeek (Ley 29733) |
| 6 | Sin modo oscuro + paleta hex/OKLCH mezclada | P1 | Accesibilidad de portal de gobierno |
| 9 | Sin `vercel.json` / `.env.example` / env | P1 | Provisioning de secretos y deploy del backend |
| 3 | Sin lint/test/format/CI | P2 | Red de seguridad del refactor |

### Riesgos abiertos (requieren decisión o verificación externa)

- Cifras tributarias (UIT, vencimientos del año, descuentos de papeletas, plazo DJ vehicular, condiciones de fraccionamiento) no versionadas: no hardcodear hasta confirmar fuente primaria SAT ([../00-fuentes-y-metodologia/supuestos-y-riesgos.md](../00-fuentes-y-metodologia/supuestos-y-riesgos.md)).
- Migrar navegación de materia a intención es cambio de UX profundo: requiere validación con cliente.
- Costo/latencia de DeepSeek bajo carga sin rate-limit/circuit-breaker: definir SLOs de latencia/tokens/timeout.
- Governance de `DEEPSEEK_API_KEY` (provisión y rotación: SAT vs agencia) a acordar antes del backend.
- Política de Privacidad publicada del SAT: pendiente de verificación antes de recolectar DNI.
- SSR para SEO de portal público: decidir Astro/Next antes del lanzamiento.

---

## Relacionados

- [estado-ui-ux-actual.md](estado-ui-ux-actual.md) — sistema de diseño y tema actual.
- [brechas-contra-investigacion-sat.md](brechas-contra-investigacion-sat.md) — brechas funcionales contra Docs/01-05.
- [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md) — integración DeepSeek segura.
- [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md) — PII, Ley 29733, límites.
