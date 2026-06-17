# Mapa de rutas y componentes

Mapeo verificado de rutas SPA a componentes, arbol de componentes reales, datos que consume cada uno y codigo muerto confirmado por grep. Anclado a `src/App.tsx`.

## Rutas

`BrowserRouter` en `src/App.tsx`. Todas las paginas estan definidas en el mismo archivo monolito.

| Path | Componente (App.tsx) | Linea def. | Proposito |
| --- | --- | --- | --- |
| `/` | `HomePage` | 257 | Entrada por acciones prioritarias; tarjetas de flujo (`routeLanes`) que disparan intents del chat. |
| `/consultar-pagar` | `ConsultPayPage` | 479 | Buscador universal (placa/DNI-RUC/codigo/expediente) y continuacion al pago. |
| `/tributos` | `CatalogPage kind="tributos"` | 530 | Catalogo de servicios tributarios (predial, arbitrios, vehicular, alcabala). |
| `/papeletas-multas` | `CatalogPage kind="papeletas"` | 530 | Catalogo de papeletas e infracciones; multas administrativas. |
| `/tramites-digitales` | `ProceduresPage` | 555 | Tarjetas de tramite (Agencia Virtual, Mesa de Partes, declaraciones, seguimiento). |
| `/fraccionamiento` | `InstallmentsPage` | 571 | Facilidades de pago de deuda tributaria y no tributaria. |
| `/atencion-sedes` | `OfficesPage` | 618 | Lista estatica de agencias y depositos (sin filtros ni mapa). |
| `/institucion` | `InstitutionPage` | 644 | Informacion institucional, transparencia y datos abiertos. |
| `/tramite/:id` | `ProcedureDetailPage` | 683 | Detalle de un tramite por id. |

Nota de navegacion: el `desktop-nav` muestra solo `navItems.slice(0, 6)`; omite `atencion-sedes` e `institucion` en escritorio. `navItems` (8 entradas) vive en `src/data/satData.ts:209`.

## Arbol de componentes

```
App (App.tsx:175)
├── Header / nav  (consume navItems)
├── <Routes>
│   ├── HomePage (257)
│   │   ├── UniversalActionBox (714)
│   │   ├── HeroInfoPanel (1206)        <- simulador de pago
│   │   ├── route cards (routeLanes inline) -> onAssistantIntent
│   │   └── secciones (heroAccessItems, urbanIndicators, benefitItems inline)
│   ├── ConsultPayPage (479)
│   │   ├── UniversalActionBox (714)
│   │   └── HeroInfoPanel (1206)
│   ├── CatalogPage (530)               <- ServiceCard (836)
│   ├── ProceduresPage (555)            <- ProcedureCard (857)
│   ├── InstallmentsPage (571)
│   ├── OfficesPage (618)               <- officeLocations
│   ├── InstitutionPage (644)
│   └── ProcedureDetailPage (683)
├── PageFrame (813) / SectionHeading (826)   <- layout helpers
└── Assistant (components/assistant/Assistant.tsx)   <- command={assistantCommand}
```

Helpers compartidos en `App.tsx`: `iconFor` (mapeo nombre->icono lucide), `buildReceiptHTML` (HTML del comprobante para `window.print`), `TAB_STEPS` (928, visuales por pestania), `STEP_LABELS` (1204).

## Datos que consume cada componente

| Componente | Fuente importada | Simbolos |
| --- | --- | --- |
| `App` | `./data/satData` | `navItems`, `officeLocations`, `paymentTabs`, `procedures`, `serviceItems`, `sourceLinks` |
| `App` | `./data/mockApi` | `consultarSAT`, tipo `MockResultData` |
| `App` | `./utils/inputValidation` | `getConstraints`, `sanitizeQuery`, `validateQuery` |
| `HomePage` | inline en `App.tsx` | `routeLanes`, `heroAccessItems`, `urbanIndicators`, `benefitItems` |
| `App` (links externos) | inline en `App.tsx` | `externalLinks` |
| `Assistant` | `../../data/satData` | `assistantIntents`, `quickActions` |
| `Assistant` | `../../hooks/useLocalStorage` | persistencia de mensajes, draft, estado del sheet |

Import de satData en `App.tsx` (lineas 36-43): `navItems`, `officeLocations`, `paymentTabs`, `procedures`, `serviceItems`, `sourceLinks`.

## Duplicacion de datos inline vs satData

Arrays declarados inline en `src/App.tsx` que solapan o conviven con `src/data/satData.ts`.

| Array inline (App.tsx) | Linea | Relacion con satData | Veredicto |
| --- | --- | --- | --- |
| `externalLinks` | 50 | Solapa parcialmente `officialSources` (`satData.ts:13`). | Duplicacion: unificar contra `officialSources`. |
| `routeLanes` | 57 | NO existe en satData. Tiene campos `tone` e `intentId` para flujos ciudadanos (no es navegacion pura). | Especializacion legitima: extraer a `src/data/routeLanes.ts`, no fusionar con `navItems`. |
| `heroAccessItems` | 126 | Sin equivalente directo; solapa accesos de `quickAccessItems` (`satData.ts:372`). | Mover a `src/data/homeData.ts`. |
| `urbanIndicators` | 133 | Sin equivalente; cifra "3 obligaciones vencen pronto" hardcodeada. | Mover a `src/data/homeData.ts` con fuente versionada por anio fiscal. |
| `benefitItems` | 168 | Sin equivalente; pilares "Mas claro/rapido/humano/confiable" sin fuente documentada. | Mover a `src/data/homeData.ts` y validar copy contra [../03-contenido-y-ux/](../03-contenido-y-ux/). |

### Riesgo de la duplicacion

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| `navItems` (8) en satData vs `routeLanes` (6) inline. | Cambiar una ruta en un lugar no se refleja en el otro; deriva de datos. | `routeLanes` -> `src/data/routeLanes.ts`; `heroAccessItems`/`urbanIndicators`/`benefitItems` -> `src/data/homeData.ts`; `externalLinks` consume `officialSources`. | `src/App.tsx:50-173`, `src/data/satData.ts` |
| Cifras tributarias hardcodeadas en arrays inline (UIT, vencimientos, descuentos). | Cualquier cifra mostrada puede ser incorrecta; no hay fuente unica por anio fiscal. | Centralizar datos vigentes en `src/data/` versionados por anio fiscal; no hardcodear hasta confirmar fuente primaria SAT. | `src/data/` |

## Codigo muerto verificado

Confirmado por grep de usos JSX e imports (0 coincidencias).

| Simbolo / archivo | Ubicacion | Verificacion | Accion |
| --- | --- | --- | --- |
| `LimaSkyline` | `App.tsx:429` | `<LimaSkyline` = 0 usos | Eliminar de `App.tsx`. |
| `EmptyState` | `App.tsx:873` | `<EmptyState` = 0 usos | Eliminar de `App.tsx`. |
| `Channel` (funcion) | `App.tsx:885` | `<Channel` = 0 usos. (El tipo `Channel` en `types.ts` no es este componente.) | Eliminar la funcion de `App.tsx`. |
| `InlineResultCard` | `App.tsx:1505` | `<InlineResultCard` = 0 usos | Eliminar de `App.tsx`. |
| `NoResultCard` | `App.tsx:1640` | `<NoResultCard` = 0 usos | Eliminar de `App.tsx`. |
| `ResultModal.tsx` | `src/components/ResultModal.tsx` (221 LOC) | No importado en `App.tsx` (0) | Eliminar archivo. |
| `Stepper.tsx` | `src/components/Stepper.tsx` (47 LOC) | Solo lo usa `ResultModal`; stepper reimplementado inline (`hip-stepper`) | Eliminar archivo. |

Contexto: `HeroInfoPanel` reemplazo a un flujo de modal previo (`ResultModal` + `Stepper`). El stepper vive ahora inline en `HeroInfoPanel`. Si se quiere extraer un `Stepper` reutilizable, hacerlo DESDE la logica actual de `HeroInfoPanel`, no reactivar los archivos legacy.

### Plan de limpieza

| Hallazgo actual | Impacto | Propuesta | Archivo objetivo |
| --- | --- | --- | --- |
| ~410 LOC de codigo muerto (5 simbolos en App.tsx + 2 archivos). | Confunde el refactor; arriesga reactivar componentes obsoletos. | Borrar en Fase 0, antes de modularizar, para reducir la superficie. | `src/App.tsx:429,873,885,1505,1640`, `src/components/ResultModal.tsx`, `src/components/Stepper.tsx` |

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo. En la practica: tras borrar el codigo muerto, abrir cada ruta con el MCP chrome-devtools, alternar tema claro/oscuro, emular viewports desktop y movil, recorrer el flujo de consulta y pago con datos sinteticos (placa, DNI, codigo, expediente) y tomar capturas/snapshots de que ninguna pantalla quedo rota.

## READMEs faltantes

Para orientacion AI (en ingles), crear: `src/README.md`, `src/components/README.md`, `src/data/README.md`, `src/hooks/README.md`. Existen `src/components/assistant/README.md` y `src/utils/README.md`.

## Relacionados

- [./inventario-tecnico.md](./inventario-tecnico.md) — Stack, scripts, LOC y modularidad.
- [../03-contenido-y-ux/](../03-contenido-y-ux/) — Componentes de estrategia faltantes y microcopy.
- [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md) — Backend del chat IA.
