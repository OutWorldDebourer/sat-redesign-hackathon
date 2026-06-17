# Secuencia de implementacion

Secuencia priorizada de bloques implementables del rediseno web del SAT: orden, foco, archivos objetivo y criterio de aceptacion. El orden es de habilitadores primero (limpieza, modularizacion, tema, backend) porque cada bloque desbloquea al siguiente. Cada bloque cierra con la validacion obligatoria en Chrome DevTools (claro/oscuro + PC/movil + datos sinteticos). Detalle de checklist en [checklist-calidad-devtools.md](checklist-calidad-devtools.md).

## Resumen del orden

| # | Bloque | Foco | Depende de |
| --- | --- | --- | --- |
| 0 | Limpieza y red de seguridad | Borrar muerto, quitar emojis, lint/test/CI, centralizar datos | — |
| 1 | Sistema de tema (dark mode) | Tokens OKLCH, `light-dark()`, `data-theme`, toggle | 0 |
| 2 | Modularizar App.tsx | Paginas, componentes, HeroInfoPanel, servicios | 0 |
| 3 | Modularizar styles.css | Capas CSS, 100% OKLCH | 0, 1 |
| 4 | Backend /api/chat seguro | Serverless, env, vercel.json | 0, 2 |
| 5 | Chat IA con streaming | `useAssistantChat`, function-calling, PII | 4 |
| 6 | Navegacion por intencion | 6 verbos, eventos de vida, desambiguacion | 2 |
| 7 | Componentes de estrategia | Calendario, sedes, semaforo, 50 UIT | 2, 6 |
| 8 | SEO/meta y datos ricos | Favicon/OG, mock expandido, versionado fiscal | 2 |

> Primer bloque recomendado para ejecutar de inmediato: Bloque 0 (Limpieza y red de seguridad). Es barato, no toca features y reduce la superficie de riesgo antes de cualquier refactor estructural.

## Bloque 0 — Limpieza y red de seguridad (EJECUTAR PRIMERO)

Foco: eliminar deuda que bloquea sin tocar features.

- Borrar codigo muerto: `LimaSkyline`, `InlineResultCard`, `NoResultCard`, `EmptyState`, `Channel` en `src/App.tsx:429,873,885,1505,1640`; y `src/components/ResultModal.tsx`, `src/components/Stepper.tsx`.
- Reemplazar emojis por iconos lucide (`AlertTriangle`, `Check`) en `src/App.tsx:1385,1411,1570,1598,1913` (incluye el HTML del comprobante).
- Instalar ESLint + Prettier + Vitest; pre-commit (husky) y CI minima; typecheck separado del build.
- Centralizar datos inline duplicados (`routeLanes`, `heroAccessItems`, `urbanIndicators`, `benefitItems`) hacia `src/data/`.

Archivos objetivo: `src/App.tsx`, `src/components/ResultModal.tsx`, `src/components/Stepper.tsx`, `package.json`, `.eslintrc.cjs` (nuevo), `vitest.config.ts` (nuevo), `.husky/pre-commit` (nuevo), `src/data/routeLanes.ts` (nuevo), `src/data/homeData.ts` (nuevo).

Criterio de aceptacion: cero codigo muerto; cero emojis (grep limpio); `npm run lint`, `npm run test`, typecheck pasan; datos sin duplicacion; misma funcionalidad observable.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## Bloque 1 — Sistema de tema (dark mode)

Foco: tema claro/oscuro completo y persistente.

- `tokens.css`: cada color sensible a luz con `light-dark(<claro> <oscuro>)`; `color-scheme: light dark` en `:root`; 100% OKLCH; escala 4pt.
- `theme.css`: override por `:root[data-theme="dark"|"light"]` para el toggle manual (gana sobre el sistema).
- `useTheme.ts`: prioridad `data-theme` en `localStorage` (via `useLocalStorage`) > `prefers-color-scheme` > claro.
- `ThemeToggle.tsx`: icono lucide `Moon`/`Sun` con `aria-label`; escribe `data-theme` en `<html>`.

Archivos objetivo: `src/styles/tokens.css` (nuevo), `src/styles/theme.css` (nuevo), `src/hooks/useTheme.ts` (nuevo), `src/components/ThemeToggle.tsx` (nuevo), `src/App.tsx` (montar toggle en header).

Criterio de aceptacion: toggle alterna y persiste tras recarga; `prefers-color-scheme` funciona sin JS; override manual gana; sin hex ilegibles en dark; anillo DNI sin neon cyan.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## Bloque 2 — Modularizar App.tsx

Foco: romper el monolito de 1947 LOC.

- Extraer 8 paginas a `src/pages/*.tsx` con `React.lazy` + `Suspense` por ruta (`src/App.tsx:257-712`).
- Descomponer `HeroInfoPanel` (`src/App.tsx:928-1503`) en `HeroInfoPanel.tsx` + `PaymentForm.tsx` + `Receipt.tsx` + `hooks/usePaymentState.ts`; mover `TAB_STEPS` a `src/data/tabSteps.ts`.
- Extraer logica de pago (`src/App.tsx:1222-1266`) a `src/services/paymentService.ts` (`validateCard`, `generateReceipt`, `submitPayment`).
- Introducir `src/services/satApi.ts` como adapter (`VITE_API_MODE`); las paginas consumen `satApi`, nunca `mockApi`.
- Mover helpers UI (`UniversalActionBox`, `PageFrame`, `SectionHeading`, `ServiceCard`, `ProcedureCard`, `iconFor`) a `src/components/`.

Archivos objetivo: `src/App.tsx`, `src/pages/` (nuevo), `src/components/HeroInfoPanel/` (nuevo), `src/components/` (nuevo), `src/services/paymentService.ts` (nuevo), `src/services/satApi.ts` (nuevo), `src/data/tabSteps.ts` (nuevo).

Criterio de aceptacion: `App.tsx` ~100 LOC (solo router/layout); ningun archivo > 500 LOC; un chunk por ruta; flujo de pago y consulta intactos.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## Bloque 3 — Modularizar styles.css

Foco: dividir el CSS global de 4063 LOC en capas.

- Dividir en `src/styles/` por capa: `tokens` -> `base` -> `layout` -> `components` -> `theme` -> `utilities` -> `animation`; importar en orden desde `main.tsx`.
- Reemplazar hex hardcodeados en gradientes y mockups (DNI, placa, expediente) por `var(--color-*)` y `color-mix(in oklch, ...)`.
- Concentrar `@keyframes` y `prefers-reduced-motion` en `animation.css`.

Archivos objetivo: `src/styles.css` -> `src/styles/*.css`, `src/main.tsx`.

Criterio de aceptacion: ningun archivo CSS supera su responsabilidad; paleta 100% OKLCH; sin regresion visual en claro ni oscuro; animaciones solo `transform`/`opacity`.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## Bloque 4 — Backend /api/chat seguro

Foco: proxy serverless para DeepSeek sin exponer la clave.

- Crear `api/chat.ts` (serverless Vercel): `POST`, streaming OpenAI-compatible a DeepSeek, lee `DEEPSEEK_API_KEY` del entorno del servidor; timeout 15-30s, retry exponencial, rate-limit por IP, manejo 429/5xx, logging sin secretos.
- Crear `vercel.json` con rewrite `/api/:path*` y fallback SPA a `/index.html`.
- Crear `.env.example` documentando solo `VITE_API_BASE_URL`, `VITE_API_MODE`, `VITE_CHAT_ENABLED` (nunca la clave). Provisionar `DEEPSEEK_API_KEY` en env de Vercel.
- Crear `src/data/chatConfig.ts`: `SYSTEM_PROMPT_TEMPLATE`, `TOOLS_SCHEMA`, `DATOS_VIGENTES` inyectables por anio fiscal.

Archivos objetivo: `api/chat.ts` (nuevo), `vercel.json` (nuevo), `.env.example` (nuevo), `vite.config.ts`, `src/data/chatConfig.ts` (nuevo).

Criterio de aceptacion: `get_network_request` de `/api/chat` nunca expone `DEEPSEEK_API_KEY`; endpoint responde en streaming; 429/5xx degradan con gracia. Plan tecnico: [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md).

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## Bloque 5 — Chat IA con streaming

Foco: conectar el chat al LLM real conservando el canned como fallback.

- Dividir `Assistant.tsx` en `AssistantUI.tsx` + `hooks/useAssistantChat.ts` (streaming, `AbortController`, retry, cache, dedup, fallback canned).
- `chatClient.ts`: `fetch` a `/api/chat`; el backend ejecuta tools (`consultar_deuda`, `calcular_alcabala`, `contar_dias_habiles`) sobre `satApi`.
- Guardrails PII: detectar/anonimizar DNI/placa pre-envio; `ChatMessage.containsPII`; truncar en UI; "Eliminar conversacion" siempre visible; nunca loguear PII.
- Escalamiento humano ante keywords coactiva/captura/embargo; banner anti-suplantacion.

Archivos objetivo: `src/components/assistant/Assistant.tsx` (-> `AssistantUI.tsx`), `src/components/assistant/hooks/useAssistantChat.ts` (nuevo), `src/services/chatClient.ts` (nuevo), `src/types.ts` (`ChatMessage.containsPII`), `api/chat.ts`.

Criterio de aceptacion: streaming token a token; function-calling devuelve datos del mock; fallback canned al forzar fallo; PII truncada y borrable; escalamiento humano dispara. Limites: [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## Bloque 6 — Navegacion por intencion

Foco: migrar de materia tecnica a intencion ciudadana.

- Reescribir `navItems` a 6 verbos (Consultar / Pagar / Declarar / Reclamar / Beneficios / Ayuda y seguridad); mover sedes/institucion a Ayuda y al pie.
- Separar `routeLanes` en Nivel 1 (verbos) + Nivel 2 (materia); el home muestra 6 cards por intencion.
- Agregar fila de eventos de vida ("Compre", "Vendi", "Me multaron", "Soy adulto mayor").
- `MateriaClarification` como paso 0 (alcabala comprador-al-SAT, predial Cercado, vehicular vs papeleta).

Archivos objetivo: `src/data/satData/navigation.ts`, `src/data/routeLanes.ts`, `src/data/homeData.ts`, `src/pages/Home.tsx`, `src/features/MateriaClarification.tsx` (nuevo), `src/App.tsx` (header/nav). Detalle de IA y copy: [../03-contenido-y-ux/arquitectura-informacion-propuesta.md](../03-contenido-y-ux/arquitectura-informacion-propuesta.md).

Criterio de aceptacion: nav de 6 verbos sin `slice(0,6)` que ocultaba items; eventos de vida abren el flujo correcto; desambiguacion aparece antes de cada materia. Nota: requiere validacion del cliente (verbos y pilares no todos aprobados).

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## Bloque 7 — Componentes de estrategia

Foco: construir las piezas que faltan del brief Fase 1.

- `CalendarVencimientos` (fechas versionadas, recordatorio persistente), `SedeFinder` (mapa filtrable por distrito/materia), `PapeletaSemaforo` (verde/amarillo/rojo/negro + dias habiles + descuento), `VerificadorAntiSuplantacion` + banner, `Beneficiarios50UIT` (4 preguntas accesibles).
- `businessDaysCalculator.ts` con feriados 2026 versionados.
- Estados vacio/error especificos (no genericos) por flujo.

Archivos objetivo: `src/features/CalendarVencimientos.tsx`, `src/features/SedeFinder.tsx`, `src/features/PapeletaSemaforo.tsx`, `src/features/VerificadorAntiSuplantacion.tsx`, `src/features/Beneficiarios50UIT.tsx` (todos nuevos), `src/utils/businessDaysCalculator.ts` (nuevo). Detalle: [../03-contenido-y-ux/componentes-ui-requeridos.md](../03-contenido-y-ux/componentes-ui-requeridos.md).

Criterio de aceptacion: cada componente render con datos sinteticos; semaforo y contador calculan correctamente; pre-evaluador accesible (WCAG 2.1 AA). Cifras no hardcodeadas: leidas de fuente versionada.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## Bloque 8 — SEO/meta y datos ricos

Foco: indexacion, preview social y demo con valor de negocio.

- `index.html`: favicon, Open Graph/Twitter, `theme-color`, `robots`/`sitemap`.
- Expandir `mockApi.ts`: pestania `codigo`, estado "En coactivo", descuentos por dias habiles, deuda consolidada, alcabala, beneficio 50 UIT; nombres peruanos unicos (no "Pedro Alva" repetido).
- Versionar cifras por anio fiscal (UIT, vencimientos, descuentos) en `src/data/`.

Archivos objetivo: `index.html`, `public/robots.txt` (nuevo), `public/sitemap.xml` (nuevo), `src/data/mockApi.ts`, `src/data/satData/` (versionado fiscal).

Criterio de aceptacion: meta completo verificable; los 4 tabs del buscador funcionan; la demo muestra consolidacion, ahorro por dias habiles y beneficio 50 UIT.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## Riesgos que condicionan la secuencia

- Sin tests de humo previos, modularizar puede romper pago y chat en silencio: hacer humo en Bloque 0.
- DeepSeek con infra en China: no enviar PII sin anonimizar (Ley 29733, reserva tributaria art. 85). Bloquea Bloque 5 hasta guardrails y politica publicada.
- Cifras 2026 abiertas: no hardcodear hasta confirmar fuente primaria SAT.
- Navegacion por intencion: cambio de UX profundo, requiere aprobacion del cliente antes del Bloque 6.
- Governance de `DEEPSEEK_API_KEY`: acordar quien provisiona/rota antes del Bloque 4.

Detalle: [vision-implementacion.md](vision-implementacion.md) y [../00-fuentes-y-metodologia/supuestos-y-riesgos.md](../00-fuentes-y-metodologia/supuestos-y-riesgos.md).

## Relacionados

- [checklist-calidad-devtools.md](checklist-calidad-devtools.md) — checklist DevTools de cierre por bloque.
- [vision-implementacion.md](vision-implementacion.md) — vision, principios y deuda critica.
- [arquitectura-paginas-componentes.md](arquitectura-paginas-componentes.md) — arquitectura modular objetivo.
- [../05-roadmap-implementacion/backlog-priorizado.md](../05-roadmap-implementacion/backlog-priorizado.md) — epicas e historias.
- [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md) — backend serverless y modelo.
- [../06-auditoria-proyecto/inventario-tecnico.md](../06-auditoria-proyecto/inventario-tecnico.md) — stack, deuda y modularidad.
