# Arquitectura de paginas y componentes

Arquitectura objetivo modular del rediseno: como descomponer `src/App.tsx` (1947 LOC) en `pages/` + `components/` + `features/`, como dividir `src/styles.css` (4063 LOC) en capas (`tokens`/`base`/`componentes`/`tema`/`utilidades`), el arbol de carpetas propuesto, la navegacion por intencion, donde vive el chat fijo y el dark mode con `light-dark()` + `data-theme` + toggle. Ancla cada propuesta a rutas reales del repo.

## Estado de partida (verificado)

- `src/App.tsx` (1947 LOC): monolito con datos inline + 8 paginas + helpers + `HeroInfoPanel` (UI + estado de pago + `buildReceiptHTML`).
- `src/styles.css` (4063 LOC): CSS global unico, `color-scheme: light` solo, 36 OKLCH mezclados con 16 hex, sin dark mode.
- `src/components/assistant/Assistant.tsx` (449 LOC): chat fijo canned, aislado y solido como base.
- `src/data/satData.ts` (1074 LOC): datos tipados grounded; navegacion duplicada inline en `App.tsx`.

Mapa de rutas, arbol de componentes y codigo muerto: [../06-auditoria-proyecto/mapa-rutas-componentes.md](../06-auditoria-proyecto/mapa-rutas-componentes.md).

## Arbol de carpetas propuesto

```
src/
  main.tsx                       entry: createRoot + BrowserRouter + import de estilos en orden
  App.tsx                        ~100 LOC: router + layout + montaje del chat fijo

  pages/                         una pagina por archivo, < 500 LOC, React.lazy + Suspense
    Home.tsx
    ConsultPay.tsx
    Catalog.tsx
    Procedures.tsx
    Installments.tsx
    Offices.tsx
    Institution.tsx
    ProcedureDetail.tsx
    README.md

  components/                    UI atomica reutilizable (sin logica de dominio)
    PageFrame.tsx
    SectionHeading.tsx
    ServiceCard.tsx
    ProcedureCard.tsx
    UniversalActionBox.tsx
    ThemeToggle.tsx
    EmptyState.tsx               recreado con contexto real (no el muerto actual)
    icons/iconFor.ts
    HeroInfoPanel/
      HeroInfoPanel.tsx          orquestacion ~150 LOC
      PaymentForm.tsx            ~100 LOC
      Receipt.tsx                ~50 LOC
      hooks/usePaymentState.ts   ~80 LOC
      README.md
    assistant/                   se mantiene aislado
      AssistantUI.tsx            layout + persistencia + composer
      hooks/useAssistantChat.ts  streaming, AbortController, retry, cache, fallback canned
      README.md
    README.md

  features/                      componentes de estrategia (dominio ciudadano)
    CalendarVencimientos.tsx
    SedeFinder.tsx
    PapeletaSemaforo.tsx
    VerificadorAntiSuplantacion.tsx
    Beneficiarios50UIT.tsx
    MateriaClarification.tsx
    README.md

  services/                      capa de I/O desacoplada
    satApi.ts                    adapter mock/real por import.meta.env.VITE_API_MODE
    paymentService.ts            validateCard, generateReceipt, submitPayment
    chatClient.ts                fetch a /api/chat
    README.md

  data/                          fuente unica versionada por anio fiscal
    satData/                     satData.ts dividido por dominio
      navigation.ts
      services.ts
      procedures.ts
      faqs.ts
      intents.ts
      sources.ts
      index.ts
    routeLanes.ts
    homeData.ts
    tabSteps.ts                  TAB_STEPS extraido de HeroInfoPanel
    chatConfig.ts                SYSTEM_PROMPT_TEMPLATE, TOOLS_SCHEMA, DATOS_VIGENTES
    mockApi.ts                   expandido (codigo, coactiva, descuentos, consolidada)
    README.md

  hooks/
    useTheme.ts                  prefers-color-scheme > localStorage > claro
    useLocalStorage.ts           existente
    README.md

  utils/
    inputValidation.ts           existente
    businessDaysCalculator.ts    contador de dias habiles (feriados 2026 versionados)
    README.md

  styles/                        CSS modular, importado en orden desde main.tsx
    tokens.css                   100% OKLCH + escala 4pt + tipografia
    base.css                     reset, html, elementos base
    layout.css                   app-shell, header, main, assistant-region
    components.css               route-card, action-box, hip-*, mockups
    theme.css                    light-dark() + prefers-color-scheme + data-theme
    utilities.css                helpers atomicas (sr-only, espaciado)
    animation.css                @keyframes + prefers-reduced-motion

api/                             funciones serverless Vercel (fuera de src/)
  chat.ts                        POST streaming a DeepSeek, lee DEEPSEEK_API_KEY del entorno
  README.md
```

`vercel.json` (raiz) con rewrite `/api/:path*` y fallback SPA a `/index.html`. `.env.example` documentando solo `VITE_API_BASE_URL`, `VITE_API_MODE`, `VITE_CHAT_ENABLED`. La clave nunca entra al repo: solo en env de Vercel. Detalle en [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md).

## Descomposicion de App.tsx

`App.tsx` queda reducido a router + layout + montaje del chat (~100 LOC). Todo lo demas se extrae.

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| 8 paginas definidas dentro de `App.tsx` (`HomePage`, `ConsultPayPage`, `CatalogPage`, `ProceduresPage`, `InstallmentsPage`, `OfficesPage`, `InstitutionPage`, `ProcedureDetailPage`). | Imposible testear o code-split por ruta; cualquier cambio toca el monolito. | Extraer cada una a `src/pages/*.tsx` y cargar con `React.lazy` + `Suspense` por ruta. | `src/App.tsx:257-712` -> `src/pages/` |
| `HeroInfoPanel` mega-funcion (~495 LOC) mezcla `TAB_STEPS`, estado de pago, validacion de tarjeta y `buildReceiptHTML`. | Inmanejable, no reutilizable, no testeable sin DOM. | Dividir en `HeroInfoPanel.tsx` (orquestacion) + `PaymentForm.tsx` + `Receipt.tsx` + `hooks/usePaymentState.ts`; `TAB_STEPS` a `data/tabSteps.ts`. | `src/App.tsx:928-1503` -> `src/components/HeroInfoPanel/`, `src/data/tabSteps.ts` |
| Logica de pago inline (`validateCard` implicita, `buildReceiptHTML`, `window.print`). | No reutilizable; imposible de integrar con backend real sin duplicar. | Extraer a `services/paymentService.ts` (`validateCard`, `generateReceipt`, `submitPayment`). | `src/App.tsx:1222-1266` -> `src/services/paymentService.ts` |
| Helpers UI inline (`UniversalActionBox`, `PageFrame`, `SectionHeading`, `ServiceCard`, `ProcedureCard`, `iconFor`). | Acoplados al monolito; sin reutilizacion entre paginas. | Mover a `src/components/*.tsx` y `src/components/icons/iconFor.ts`. | `src/App.tsx:714-892` -> `src/components/` |
| Consumo directo de `mockApi.ts` sin adapter. | Bloquea el switch mock/real y el deploy a produccion. | Introducir `services/satApi.ts` como adapter (`VITE_API_MODE`); paginas consumen `satApi`, nunca `mockApi`. | `src/App.tsx` (imports), `src/services/satApi.ts` (nuevo) |
| Datos inline (`routeLanes`, `heroAccessItems`, `urbanIndicators`, `benefitItems`, `externalLinks`). | Duplican/solapan `satData.ts`; deriva de datos al editar. | `routeLanes` a `data/routeLanes.ts`; el resto a `data/homeData.ts`; `externalLinks` consume `officialSources`. | `src/App.tsx:50-173` -> `src/data/` |
| Codigo muerto (`LimaSkyline`, `InlineResultCard`, `NoResultCard`, `EmptyState`, `Channel`). | ~210 LOC de ruido que confunde el refactor. | Borrar antes de extraer; recrear `EmptyState` con contexto real cuando se use. | `src/App.tsx:429,873,885,1505,1640` |

Resultado: ningun archivo de pagina o componente supera 500 LOC; `App.tsx` solo orquesta.

## Descomposicion de styles.css

Dividir el monolito en capas con responsabilidad unica, importadas en orden desde `main.tsx`: `tokens -> base -> layout -> components -> theme -> utilities -> animation`.

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| CSS global unico de 4063 LOC. | Buscar un cambio exige grep en todo el archivo; el navegador parsea todo siempre. | Dividir en `src/styles/` por capa; cada archivo con una responsabilidad. | `src/styles.css` -> `src/styles/*.css` |
| `:root` con 36 OKLCH mezclados con 16 hex (`#16236e`, `#337ab7`, `#006db3`, `#555555`, `#006db3`). | Migracion de tema error-prone: cada hex debe redefinirse a mano. | `tokens.css` 100% OKLCH (ej. `--color-primary: oklch(0.28 0.12 260)`), semantico, escala 4pt. | `src/styles.css:14-35` -> `src/styles/tokens.css` |
| Hex hardcodeados en gradientes y mockups (`linear-gradient(135deg, #16236e, #006db3)`). | No reactivos al tema; ilegibles en dark. | Reemplazar por `var(--color-primary)`/`var(--color-accent)` y `color-mix(in oklch, ...)`. | `src/styles.css` (gradientes/mockups DNI, placa, expediente) |
| Borde neon cyan `#00ffcc` en anillos DNI. | Viola ban neon-on-dark; bajo contraste; imposible en dark. | `color-mix(in oklch, var(--color-accent) 65%, white)` o `var(--color-accent)` puro. | `src/styles.css:3059`, `:3387` |
| `color-scheme: light` solo; sin `prefers-color-scheme`, `data-theme`, `light-dark()`. | Dark mode inviable; falla expectativa de accesibilidad. | `theme.css` con `color-scheme: light dark` + variables por modo + override `[data-theme]`. | `src/styles.css:14` -> `src/styles/theme.css` |
| `@keyframes` y media queries dispersos entre reglas de componente. | Dificil aislar motion y respetar `prefers-reduced-motion` de forma sistemica. | Concentrar animaciones en `animation.css` con guarda `prefers-reduced-motion`. | `src/styles.css` -> `src/styles/animation.css` |

Nota: el proyecto usa CSS plano (sin Tailwind). Se mantiene CSS plano modular; CSS Modules es opcional para componentes nuevos de `features/` pero no obligatorio para esta fase.

## Dark mode con light-dark() + data-theme + toggle

Estrategia de tema en tres piezas que coexisten:

1. `tokens.css`: declarar cada color sensible a luz con `light-dark(<claro> <oscuro>)` y `color-scheme: light dark` en `:root`. Asi `prefers-color-scheme` funciona sin JS.
2. `theme.css`: override explicito por `:root[data-theme="dark"]` y `:root[data-theme="light"]` para el toggle manual, que gana sobre la preferencia del sistema.
3. `useTheme.ts` + `ThemeToggle.tsx`: el hook resuelve prioridad `data-theme` guardado en `localStorage` > `prefers-color-scheme` > claro; el toggle (icono lucide `Moon`/`Sun` con `aria-label`) escribe `data-theme` en `<html>` y persiste via `useLocalStorage`.

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| Sin dark mode ni toggle. | Portal de gobierno sin tema oscuro falla WCAG en baja luz; fatiga ocular. | `light-dark()` en tokens + override `data-theme` + toggle persistente. | `src/styles/tokens.css`, `src/styles/theme.css`, `src/hooks/useTheme.ts` (nuevo), `src/components/ThemeToggle.tsx` (nuevo) |
| Preferencia de tema no persiste. | Cada sesion reinicia a claro; ignora la eleccion del usuario. | `useTheme` lee/escribe `localStorage` via `useLocalStorage` existente. | `src/hooks/useTheme.ts`, `src/hooks/useLocalStorage.ts` |
| Pseudo-elementos de gradiente (`.action-box.gradient-cta::before/::after`) sin validar en oscuro. | Pueden quedar ilegibles o desbordar el contraste en dark. | Definir sus colores con tokens reactivos al tema y validar en ambos modos. | `src/styles/components.css` |

## Navegacion por intencion en la arquitectura

La navegacion de 2 niveles se materializa en datos y componentes, no en strings sueltos. Detalle de IA y copy en [../03-contenido-y-ux/arquitectura-informacion-propuesta.md](../03-contenido-y-ux/arquitectura-informacion-propuesta.md).

- Nivel 1 (barra principal): 6 verbos de intencion (Consultar / Pagar / Declarar / Reclamar / Beneficios / Ayuda y seguridad) + barra de eventos de vida ("Compre", "Vendi", "Me multaron", "Soy adulto mayor").
- Nivel 2 (patron repetible por materia): predial, arbitrios, vehicular, alcabala, papeletas, multas; cada ficha abre con su desambiguacion conocida via `MateriaClarification`.

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| `navItems` (8) organizado por materia tecnica; `desktop-nav` muestra solo `slice(0,6)` (omite sedes e institucion). | El ciudadano navega por nombre tecnico, no por su objetivo; dos items invisibles en escritorio. | Reescribir `navItems` a 6 verbos de intencion; mover sedes/institucion a Ayuda y al pie. | `src/data/satData/navigation.ts`, `src/App.tsx` (header/nav) |
| `routeLanes` mezcla intencion y materia en un solo array (`tone`: consultar/pagar/predio/alcabala). | Confunde nivel 1 (verbo) con nivel 2 (materia); no mapea 1:1 con la IA propuesta. | Separar `routeLanes` en Nivel 1 (verbos) + Nivel 2 (materia); home muestra 6 cards por intencion. | `src/data/routeLanes.ts` (nuevo), `src/pages/Home.tsx` |
| Sin desambiguacion de entrada por materia. | El ciudadano cae en error costoso (paga alcabala en municipalidad). | `MateriaClarification` como paso 0 en cada ficha (predial Cercado, alcabala comprador-al-SAT, etc.). | `src/features/MateriaClarification.tsx` (nuevo) |
| Falta entrada por eventos de vida. | El ciudadano no sabe que categoria elegir; se pierde el triaje. | Fila de atajos de eventos de vida en el home que abre el flujo correcto. | `src/pages/Home.tsx`, `src/data/homeData.ts` |

## Donde vive el chat fijo

El chat es la unica pieza transversal montada fuera del `<Routes>`, presente en todas las paginas.

- Montaje: en `App.tsx`, hermano de `<Routes>`, nunca dentro de una pagina. Sobrevive a cambios de ruta sin remontar.
- Posicion: `position: fixed` abajo-derecha en escritorio (rail), barra inferior a pantalla completa en movil < 768px, modo destacado con chips en el home.
- Capa: reservada en la capa de overlays del sistema (junto a nav y modales), sin `z-index` arbitrario.
- Estructura: `AssistantUI.tsx` (layout/persistencia/composer) + `hooks/useAssistantChat.ts` (streaming, `AbortController`, retry, cache, fallback canned, mapeo de tools).
- Datos: `chatClient.ts` hace `fetch` a `/api/chat`; `chatConfig.ts` aporta system prompt, tools y datos vigentes.

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| `Assistant.tsx` (449 LOC) mezcla UI, persistencia y respuestas canned. | Cablear streaming dentro multiplica el riesgo; logica de red acoplada a UI. | Dividir en `AssistantUI.tsx` + `hooks/useAssistantChat.ts`; conservar canned como fallback. | `src/components/assistant/Assistant.tsx` |
| Respuestas via `setTimeout(420ms)` + `buildIntentResponse`. | No hay streaming ni queries abiertas. | `useAssistantChat` consume `chatClient.ts` con SSE; degrada a canned si el backend falla. | `src/components/assistant/hooks/useAssistantChat.ts` (nuevo), `src/services/chatClient.ts` (nuevo) |
| Sin function-calling ni datos vigentes inyectables. | El chat no calcula dias habiles, alcabala ni consolida deuda. | `chatConfig.ts` (`SYSTEM_PROMPT_TEMPLATE`, `TOOLS_SCHEMA`, `DATOS_VIGENTES`); el backend ejecuta tools sobre `satApi`. | `src/data/chatConfig.ts` (nuevo), `api/chat.ts` (nuevo) |

Comportamiento y limites: [../04-chat-ia/propuesta-chat-fijo.md](../04-chat-ia/propuesta-chat-fijo.md). Plan tecnico: [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md).

## Decision abierta: libreria de iconos

`lucide-react` (0.468) esta en uso en todo el repo; las skills del proyecto prefieren `@phosphor-icons/react` o `@radix-ui/react-icons`. No se resuelve en silencio. Recomendacion para esta arquitectura: mantener `lucide-react` y centralizar el mapeo en `src/components/icons/iconFor.ts` estandarizando `strokeWidth` (1.5 o 2.0); evaluar migracion solo en el pulido final. Decision del cliente requerida antes de reemplazar iconos en masa. Detalle en [vision-implementacion.md](vision-implementacion.md).

## READMEs de carpeta a crear

Indices AI-optimizados (en ingles) en cada carpeta nueva o tocada: `src/pages/`, `src/components/`, `src/components/HeroInfoPanel/`, `src/features/`, `src/services/`, `src/data/`, `src/hooks/`, `api/`. Ya existen `src/components/assistant/README.md` y `src/utils/README.md`.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo. En la practica: tras descomponer cada pagina/componente y tras dividir el CSS, abrir cada ruta (`/`, `/consultar-pagar`, `/tributos`, `/papeletas-multas`, `/tramites-digitales`, `/fraccionamiento`, `/atencion-sedes`, `/institucion`) con el MCP chrome-devtools, alternar `data-theme` claro/oscuro, emular viewports desktop y movil (< 768px), ejercitar el buscador universal, el simulador de pago y el chat fijo con datos sinteticos (placa `ABC-123`, DNI `48592013`, codigo, expediente) y tomar capturas/snapshots para confirmar paridad visual y funcional sin regresiones.

## Relacionados

- [vision-implementacion.md](vision-implementacion.md) — vision, principios, North Star y deuda critica.
- [../03-contenido-y-ux/arquitectura-informacion-propuesta.md](../03-contenido-y-ux/arquitectura-informacion-propuesta.md) — navegacion por intencion.
- [../03-contenido-y-ux/componentes-ui-requeridos.md](../03-contenido-y-ux/componentes-ui-requeridos.md) — componentes de estrategia y estados.
- [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md) — backend serverless seguro.
- [../04-chat-ia/propuesta-chat-fijo.md](../04-chat-ia/propuesta-chat-fijo.md) — el chat fijo en el layout.
- [../06-auditoria-proyecto/mapa-rutas-componentes.md](../06-auditoria-proyecto/mapa-rutas-componentes.md) — rutas, arbol de componentes y codigo muerto.
- [../06-auditoria-proyecto/inventario-tecnico.md](../06-auditoria-proyecto/inventario-tecnico.md) — stack y estado de modularidad.
