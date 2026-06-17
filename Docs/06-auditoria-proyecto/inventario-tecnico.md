# Inventario tecnico

Foto verificada del stack, scripts, dependencias, deploy y estado de modularidad del prototipo SAT. Leida directamente del codigo. Sin cifras inventadas.

## Stack

| Capa | Tecnologia | Version (package.json) |
| --- | --- | --- |
| UI | React + React DOM | 19.1.1 |
| Router | react-router-dom (BrowserRouter, SPA) | 7.8.0 |
| Build | Vite | 7.1.0 |
| Plugin | @vitejs/plugin-react | 5.0.0 |
| Lenguaje | TypeScript | 5.8.3 |
| Iconos | lucide-react | 0.468.0 |
| Tipos dev | @types/react, @types/react-dom | 19.2.14 / 19.2.3 |

- Sin Tailwind: CSS plano global unico (`src/styles.css`).
- Sin libreria de estado (no Redux/Zustand/Jotai). Estado local por componente y persistencia via `useLocalStorage`.
- Sin SSR ni prerender: SPA puro, `index.html` monta `<div id="root">` y React hidrata en cliente.

## Scripts

| Script | Comando | Nota |
| --- | --- | --- |
| `dev` | `vite --host 0.0.0.0` | Servidor de desarrollo expuesto en red. |
| `build` | `tsc --noEmit && vite build` | Unico typecheck del proyecto: acoplado al build. |
| `preview` | `vite preview --host 0.0.0.0` | Sirve el `dist/`. |

Ausencias verificadas: NO `lint`, NO `test`, NO `format`, NO `typecheck` separado, NO `husky`/pre-commit, NO CI (`.github/workflows`).

## Dependencias y ausencias

- devDependencies = solo `@types/*`. No hay ESLint, Prettier, Vitest, Playwright ni MSW.
- No hay SDK de LLM (`openai`, `@deepseek-ai`) ni cliente HTTP. El chat no llama a ninguna red.
- No hay manejo de entorno: no existe `.env.example`, no se usa `import.meta.env`, `vite.config.ts` no define `env`, `define`, `server.proxy` ni `rewrites`.

## Deploy

- Vercel (`.vercel/`, `.vercelignore` presentes en repo).
- NO existe `vercel.json` en raiz.
- NO existe carpeta `api/` ni funciones serverless. El deploy sirve solo el bundle estatico.
- Implicancia: integrar DeepSeek de forma segura requiere AGREGAR backend serverless (`api/chat.ts`) que lea `DEEPSEEK_API_KEY` del entorno del servidor. El cliente nunca debe ver la clave. Detalle en [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md).

## Naturaleza SPA sin backend

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| SPA pura sin rutas API ni serverless. | Cualquier integracion LLM en cliente expondria la clave en el bundle. Bloqueador P0 de toda la IA. | Crear funcion serverless Vercel y `vercel.json` con rewrite `/api/:path*` + fallback SPA a `/index.html`. | `api/chat.ts` (nuevo), `vercel.json` (nuevo) |
| Sin `.env.example` ni `import.meta.env`. | Onboarding indefinido; provisioning de secretos en Vercel sin documentar. | `.env.example` documentando solo `VITE_API_BASE_URL`, `VITE_API_MODE`, `VITE_CHAT_ENABLED`. La clave va solo en env de Vercel, nunca en repo. | `.env.example` (nuevo), `vite.config.ts` |
| Sin lint/test/format/CI. | Refactor grande sin red de seguridad: regresiones ocultas en flujo de pago y chat. | Instalar ESLint + Prettier + Vitest, pre-commit y CI minima antes de modularizar. | `package.json`, `.eslintrc.cjs` (nuevo), `vitest.config.ts` (nuevo) |

## Inventario de archivos (LOC reales)

### Codigo activo

| Archivo | LOC | Responsabilidad | Estado |
| --- | --- | --- | --- |
| `src/main.tsx` | 14 | Entry React 19: `createRoot` + `StrictMode` + `BrowserRouter`; importa `./styles.css`. | OK |
| `src/App.tsx` | 1947 | MONOLITO. Datos inline + 8 paginas + helpers + `HeroInfoPanel` con simulador de pago + `buildReceiptHTML`. | Critico: refactor |
| `src/styles.css` | 4063 | MONOLITO CSS global. `:root` OKLCH (36) mezclado con 16 hex. `color-scheme: light` solo. Sin dark mode. | Critico: refactor |
| `src/types.ts` | 144 | Tipos compartidos: `NavigationItem`, `PaymentTab`, `Procedure`, `OfficeLocation`, `AssistantIntent`, `ChatMessage`, etc. | OK |
| `src/components/assistant/Assistant.tsx` | 449 | Chat fijo persistente (bottom-sheet movil / rail desktop). Respuestas CANNED: `setTimeout(420ms)` + `buildIntentResponse`. Sin LLM. | Aislar + refactor |
| `src/data/satData.ts` | 1074 | Datos tipados grounded: `officialSources`, `navItems` (8), `paymentTabs`, `services`, `procedures`, `officeLocations`, `faqs`, `assistantIntents`. | Modularizar por dominio |
| `src/data/mockApi.ts` | 94 | Mock en memoria. `consultarSAT(query)`. 3 placas, 2 DNI, 1 expediente. Sin datos para pestania `codigo`. | Expandir + adapter |
| `src/hooks/useLocalStorage.ts` | 94 | Hook SSR-safe con sync cross-tab. | OK (faltan tests) |
| `src/utils/inputValidation.ts` | 106 | Puras: `sanitizeQuery`, `validateQuery`, `getConstraints`, `formatPlaca`. | OK (faltan tests) |
| `index.html` | 23 | `lang=es`, viewport, fonts (Atkinson Hyperlegible + Bricolage Grotesque). Sin favicon, OG, theme-color, robots/sitemap. | Completar SEO |

### Codigo muerto verificado (no invocado)

| Archivo / simbolo | LOC | Verificacion |
| --- | --- | --- |
| `src/components/ResultModal.tsx` | 221 | No importado en `src/App.tsx` (0 matches). |
| `src/components/Stepper.tsx` | 47 | Solo usado por `ResultModal`; `App.tsx` reimplementa el stepper inline (`hip-stepper`). |
| `LimaSkyline` (en `App.tsx`) | ~50 | 0 usos JSX `<LimaSkyline`. |
| `InlineResultCard` (en `App.tsx`) | ~135 | 0 usos JSX `<InlineResultCard`. |
| `NoResultCard` (en `App.tsx`) | ~8 | 0 usos JSX `<NoResultCard`. |
| `EmptyState` (en `App.tsx`) | ~10 | 0 usos JSX `<EmptyState`. |
| `Channel` (en `App.tsx`) | ~7 | 0 usos JSX `<Channel`. |

Total estimado de ruido: ~410 LOC. Mapa de uso detallado en [./mapa-rutas-componentes.md](./mapa-rutas-componentes.md).

## Estado de modularidad

| Metrica | Valor | Norma del proyecto | Veredicto |
| --- | --- | --- | --- |
| `src/App.tsx` | 1947 LOC | <= 500 LOC | Viola (x3.9) |
| `src/styles.css` | 4063 LOC | <= 500 LOC | Viola (x8.1) |
| `src/data/satData.ts` | 1074 LOC | <= 500 LOC (datos: ~300/dominio) | Viola |
| Resto de archivos | <= 449 LOC | <= 500 LOC | Cumple |
| READMEs de carpeta | 2 de 5 (`assistant/`, `utils/`) | Todas | Faltan `data/`, `hooks/`, `components/` |

### Detalle de los dos monolitos

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| `App.tsx` concentra datos inline, 8 paginas, helpers y `HeroInfoPanel` (UI + estado de pago + validacion de tarjeta + `buildReceiptHTML`). | Imposible testear/debuggear/modularizar. Refactorizar el chat dentro del monolito multiplica el riesgo de regresion. | Extraer paginas a `src/pages/` (una por archivo, `React.lazy`), componentes a `src/components/`, `HeroInfoPanel` a carpeta propia con `PaymentForm`/`Receipt`/`usePaymentState`, datos a `src/data/`. | `src/App.tsx` |
| `styles.css` global unico: `color-scheme: light` solo; 36 OKLCH mezclados con 16 hex (`#16236e`, `#337ab7`, `#006db3`, `#555555`); hex hardcodeados en gradientes. | Dark mode inviable sistemicamente: cada hex debe redefinirse a mano. Buscar un cambio exige grep en 4063 lineas. | Dividir en `src/styles/`: `tokens.css` (100% OKLCH + escala 4pt), `layout.css`, `components.css`, `theme.css` (`light-dark()` + `prefers-color-scheme` + `data-theme`), `animation.css`. Importar en orden desde `main.tsx`. | `src/styles.css` |
| Tema fijo claro, sin toggle ni `prefers-color-scheme`. | Portal de gobierno sin tema oscuro falla expectativa de accesibilidad (fatiga ocular, baja luz). | Toggle persistente con `useTheme` (prioridad `prefers-color-scheme` > `localStorage` > claro) y `data-theme` en `<html>`. | `src/hooks/useTheme.ts` (nuevo), `src/components/ThemeToggle.tsx` (nuevo) |

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo. En la practica: abrir la app con el MCP chrome-devtools, alternar tema claro/oscuro, emular viewports desktop y movil, ejercitar cada funcionalidad con datos sinteticos y tomar capturas/snapshots de verificacion.

## Higiene fuera de codigo TS

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| Emojis en JSX y en HTML del comprobante. | Viola hard-ban del proyecto; debil en accesibilidad (sin `aria-label`); inconsistente con lucide-react ya cargado. | Reemplazar por iconos lucide (`AlertTriangle`, `Check`). | `src/App.tsx:1385`, `:1411`, `:1570`, `:1598`, `:1913` |
| `index.html` sin favicon, OG, theme-color, robots/sitemap. SPA sin SSR. | Indexacion y preview social pobres para portal de gobierno; LCP afectado. | Agregar meta SEO + favicon; evaluar Astro/Next pre-lanzamiento. | `index.html`, `public/` |

## Relacionados

- [./mapa-rutas-componentes.md](./mapa-rutas-componentes.md) — Rutas, arbol de componentes, datos consumidos y codigo muerto.
- [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md) — Plan de backend serverless seguro.
- [../05-roadmap-implementacion/](../05-roadmap-implementacion/) — Secuencia de fases.
- [../01-mapa-tramites/](../01-mapa-tramites/) — Taxonomia de servicios fuente.
