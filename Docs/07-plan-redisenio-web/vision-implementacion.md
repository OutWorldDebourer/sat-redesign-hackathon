# Vision de implementacion del rediseno web

Vision de producto e ingenieria para una web del SAT de primer nivel: principios rectores, que se preserva del prototipo actual, North Star, el chat fijo como eje arquitectonico y la deuda critica a saldar antes de construir nada nuevo. Traduce la estrategia Fase 1 (Docs/01-05) y la auditoria (Docs/06) en una guia de ejecucion anclada al codigo real.

## North Star

Que cualquier ciudadano resuelva su intencion ("cuanto debo", "quiero pagar", "me multaron", "compre un inmueble") en la menor cantidad de pasos, sin saber el nombre tecnico del tramite ni en que modulo vive, con el chat fijo como ruta primaria y el lenguaje como aliado, no como cobrador.

Metrica conductora unica: tasa de intenciones resueltas sin abandonar la web ni caer en un canal externo no oficial. Todo lo demas (modularizacion, dark mode, backend, componentes) es habilitador de esa metrica.

## Principios rectores

| Principio | Significado operativo | Ancla en el repo |
| --- | --- | --- |
| Intencion sobre institucion | Navegar por verbo ciudadano, no por dominio tecnico. | `src/data/satData.ts` (`navItems`), `src/App.tsx` (`routeLanes`) |
| Chat fijo como eje | El asistente es plataforma transversal, no widget secundario. | `src/components/assistant/Assistant.tsx` |
| Una sola fuente de verdad | Cifras y datos versionados por anio fiscal; cero hardcode. | `src/data/` (centralizar inline de `App.tsx`) |
| Modularidad estricta | Ningun archivo supera 500 LOC; una responsabilidad por archivo. | `src/App.tsx` (1947), `src/styles.css` (4063) |
| Seguridad de la clave | DeepSeek detras de backend serverless; el cliente nunca ve `DEEPSEEK_API_KEY`. | `api/chat.ts` (nuevo), env de Vercel |
| Accesibilidad por defecto | Dark mode, teclado, foco, ARIA, contraste como base, no extra. | `src/styles.css`, `src/hooks/useTheme.ts` (nuevo) |
| Confianza y proteccion | Anti-suplantacion, anti-tramitadores, PII minimizada. | banners + guardrails del chat |

## Que se preserva del prototipo

La base UX es solida; el rediseno la conserva y la potencia, no la reescribe desde cero.

- Chat fijo persistente, no invasivo, accesible (bottom-sheet movil / rail desktop, `aria-live`, `prefers-reduced-motion`). Vive en `src/components/assistant/Assistant.tsx`.
- Buscador universal de 4 pestanias (`UniversalActionBox`) con autodeteccion de identificador. Vive en `src/App.tsx`.
- Simulador de pago funcional con comprobante (`HeroInfoPanel`). Vive en `src/App.tsx`.
- Datos tipados y grounded con URLs oficiales (`src/data/satData.ts`).
- Hooks y utilidades solidas: `src/hooks/useLocalStorage.ts` (SSR-safe, sync cross-tab) y `src/utils/inputValidation.ts` (puras, documentadas).
- Stack correcto: React 19, Vite 7, TypeScript 5.8, lucide-react ya en uso en todo el repo.

## Que cambia

- La navegacion por materia (Tributos/Papeletas/Tramites) se reorganiza por intencion + eventos de vida. Detalle en [../03-contenido-y-ux/arquitectura-informacion-propuesta.md](../03-contenido-y-ux/arquitectura-informacion-propuesta.md).
- El chat canned (`setTimeout` + pattern-match) se conecta a un LLM real con streaming y function-calling, conservando el canned como fallback.
- Los monolitos `App.tsx` y `styles.css` se descomponen en `pages/`, `components/`, `features/` y `src/styles/`. Detalle en [arquitectura-paginas-componentes.md](arquitectura-paginas-componentes.md).
- El tema fijo claro pasa a dark mode completo con `light-dark()` + `data-theme` + toggle persistente.

## El chat fijo como eje

El chat deja de ser un widget de respuestas predefinidas y se convierte en la capa que enruta toda intencion. Es el punto de entrada transversal que abstrae los 5 dominios tecnicos heredados.

| Capacidad objetivo | Estado actual | Habilitador requerido |
| --- | --- | --- |
| Responder queries abiertas | Canned (6 intents, `buildIntentResponse`) | Backend `api/chat.ts` + LLM |
| Triaje por intencion y desambiguacion de materia | Solo 6 intents estaticos | `chatConfig.ts` (system prompt + tools) |
| Calcular dias habiles, alcabala, deuda consolidada | No calcula | function-calling sobre `satApi.ts` |
| Escalar a humano en coactiva/captura/embargo | No detecta keywords | guardrails en `api/chat.ts` |
| Streaming token a token | Bloque unico tras 420ms | SSE desde el backend, `useAssistantChat` |
| Resiliencia ante caida del LLM | No aplica | fallback canned (degradacion graciosa) |

Comportamiento, onboarding y limites: [../04-chat-ia/propuesta-chat-fijo.md](../04-chat-ia/propuesta-chat-fijo.md). Plan tecnico de DeepSeek: [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md).

## Deuda critica a saldar primero

El orden no es negociable: cada bloque desbloquea al siguiente. Detalle por archivo en [../06-auditoria-proyecto/inventario-tecnico.md](../06-auditoria-proyecto/inventario-tecnico.md) y [../06-auditoria-proyecto/mapa-rutas-componentes.md](../06-auditoria-proyecto/mapa-rutas-componentes.md).

### 1. Limpieza y red de seguridad (habilita todo lo demas)

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| ~410 LOC de codigo muerto (`LimaSkyline`, `InlineResultCard`, `NoResultCard`, `EmptyState`, `Channel`, `ResultModal.tsx`, `Stepper.tsx`). | Confunde el refactor; arriesga reactivar componentes obsoletos. | Borrar antes de modularizar para reducir superficie. | `src/App.tsx:429,873,885,1505,1640`, `src/components/ResultModal.tsx`, `src/components/Stepper.tsx` |
| Emojis prohibidos en JSX y en el HTML del comprobante. | Viola hard-ban del proyecto; debil en accesibilidad; inconsistente con lucide-react ya cargado. | Reemplazar por iconos lucide (`AlertTriangle`, `Check`). | `src/App.tsx:1385`, `:1411`, `:1570`, `:1598`, `:1913` |
| Sin lint/test/format/CI; unico typecheck acoplado al `build`. | Refactor grande a ciegas: regresiones ocultas en pago y chat. | Instalar ESLint + Prettier + Vitest, pre-commit y CI minima. | `package.json`, `.eslintrc.cjs` (nuevo), `vitest.config.ts` (nuevo) |
| Datos de navegacion duplicados inline (`routeLanes`, `heroAccessItems`, `urbanIndicators`, `benefitItems`) vs `satData.ts`. | Cambiar una ruta en un lugar no se refleja en el otro; deriva de datos. | Centralizar en `src/data/` (`routeLanes.ts`, `homeData.ts`) versionado por anio fiscal. | `src/App.tsx:50-173`, `src/data/satData.ts` |

### 2. Modularizacion (habilita testear e integrar IA sin riesgo)

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| `App.tsx` monolito de 1947 LOC con 22 funciones (8 paginas + helpers + `HeroInfoPanel` ~495 LOC). | Imposible testear/debuggear; integrar el chat dentro del monolito multiplica el riesgo de regresion. | Extraer paginas a `src/pages/` (`React.lazy`), componentes a `src/components/`, `HeroInfoPanel` a carpeta propia con `PaymentForm`/`Receipt`/`usePaymentState`. | `src/App.tsx` |
| `styles.css` global de 4063 LOC, `color-scheme: light` solo, 36 OKLCH mezclados con 16 hex. | Dark mode inviable sistemicamente; buscar un cambio exige grep en 4063 lineas. | Dividir en `src/styles/` (`tokens.css`, `layout.css`, `components.css`, `theme.css`, `animation.css`), 100% OKLCH + escala 4pt. | `src/styles.css` |

### 3. Backend seguro (habilita el chat IA)

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| No existe `api/`, `vite.config.ts` vacio, sin `vercel.json` ni `.env.example`. | Sin proxy serverless, cualquier integracion LLM expone `DEEPSEEK_API_KEY` en el bundle. Bloqueador P0. | Crear funcion serverless que lea la clave del entorno del servidor; cliente solo llama `POST /api/chat`. | `api/chat.ts` (nuevo), `vercel.json` (nuevo), `.env.example` (nuevo) |
| Chat 100% canned, sin streaming. | No resuelve queries abiertas ni calcula; limita a 6 intents. | Refactorizar `Assistant.tsx` en `AssistantUI` + `useAssistantChat` con streaming, antes de cablear el backend. | `src/components/assistant/Assistant.tsx` |
| `ChatMessage` con DNI/placa persistido en `localStorage` sin anonimizar. | Riesgo legal (Ley 29733, reserva tributaria art. 85). Bloquea produccion con DeepSeek. | Deteccion/marcado PII, truncado en UI, "Eliminar conversacion" siempre visible, nunca loguear PII. | `src/components/assistant/Assistant.tsx`, `src/types.ts` |

### 4. Tema y arquitectura de informacion

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| Sin dark mode (`color-scheme: light`, sin `light-dark()`/`prefers-color-scheme`/`data-theme`). | Portal de gobierno sin tema oscuro falla expectativa de accesibilidad (fatiga ocular, baja luz). | Toggle persistente con `useTheme` (prioridad `prefers-color-scheme` > `localStorage` > claro) + `data-theme` en `<html>`. | `src/styles/theme.css` (nuevo), `src/hooks/useTheme.ts` (nuevo), `src/components/ThemeToggle.tsx` (nuevo) |
| Navegacion por materia, sin eventos de vida ni desambiguacion. | El ciudadano cae en error costoso (paga alcabala en municipalidad). | Migrar a 6 verbos de intencion + Nivel 2 por materia + `MateriaClarification` (paso 0). | `src/data/satData.ts`, `src/App.tsx` |

## Decision abierta: libreria de iconos (a resolver con el cliente)

Conflicto explicito, no resuelto en silencio. `lucide-react` (0.468) esta en uso en todo el repo (`App.tsx`, `Assistant.tsx`). Las skills del proyecto prefieren `@phosphor-icons/react` o `@radix-ui/react-icons`.

- Opcion A (recomendada para esta fase): mantener `lucide-react`, estandarizar `strokeWidth` (1.5 o 2.0) en todo el set y documentar la excepcion al default de las skills. Cero migracion, cero riesgo de regresion visual.
- Opcion B: migrar a `@phosphor-icons/react`. Alinea con las skills pero implica reemplazar cada import de icono y revalidar tamanos/pesos en todas las pantallas.

Recomendacion: Opcion A para no introducir riesgo durante el refactor estructural; reevaluar en el pulido final (Fase 4). Decision del cliente requerida antes de tocar iconos en masa.

## Riesgos clave que condicionan la vision

- Refactorizar sin tests de humo previos puede romper el flujo de pago (`HeroInfoPanel`/`buildReceiptHTML`) y el chat en silencio. Mitigar con humo antes de modularizar.
- DeepSeek con infraestructura en China: enviar DNI/placa/deuda sin anonimizar viola Ley 29733 y reserva tributaria. Bloquea produccion hasta tener guardrails PII y politica de privacidad publicada (pendiente de verificacion).
- Cifras tributarias 2026 (UIT, vencimientos, descuentos, plazo DJ vehicular, condiciones de fraccionamiento) abiertas: no hardcodear hasta confirmar fuente primaria SAT.
- Migrar de materia a intencion es cambio de UX profundo: requiere validacion del cliente (los 4 pilares y 6 verbos no estan todos aprobados).
- SPA sin SSR limita el SEO de un portal de gobierno: decidir Astro/Next antes del lanzamiento publico.
- Governance de secretos indefinida: acordar quien provisiona y rota `DEEPSEEK_API_KEY` (SAT vs agencia) antes del backend.

Detalle de fuentes pendientes en [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo. En la practica: tras cada bloque de deuda saldado, abrir la app con el MCP chrome-devtools, alternar tema claro/oscuro, emular viewports desktop y movil, ejercitar el buscador universal, el simulador de pago y el chat con datos sinteticos (placa `ABC-123`, DNI `48592013`, codigo y expediente) y tomar capturas/snapshots de verificacion de que nada quedo roto.

## Relacionados

- [arquitectura-paginas-componentes.md](arquitectura-paginas-componentes.md) — arquitectura objetivo modular y arbol de carpetas.
- [../03-contenido-y-ux/arquitectura-informacion-propuesta.md](../03-contenido-y-ux/arquitectura-informacion-propuesta.md) — navegacion por intencion.
- [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md) — backend serverless seguro y modelo.
- [../05-roadmap-implementacion/backlog-priorizado.md](../05-roadmap-implementacion/backlog-priorizado.md) — epicas e historias priorizadas.
- [../06-auditoria-proyecto/inventario-tecnico.md](../06-auditoria-proyecto/inventario-tecnico.md) — stack, deuda y modularidad.
- [../06-auditoria-proyecto/mapa-rutas-componentes.md](../06-auditoria-proyecto/mapa-rutas-componentes.md) — rutas, componentes y codigo muerto.
