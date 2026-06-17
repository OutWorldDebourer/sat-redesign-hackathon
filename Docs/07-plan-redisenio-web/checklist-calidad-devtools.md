# Checklist de calidad con Chrome DevTools

Checklist accionable de validacion del rediseno web del SAT usando el MCP chrome-devtools. Cubre tema claro/oscuro, viewports desktop y movil, cada funcionalidad con datos sinteticos, performance/Lighthouse, accesibilidad y consola sin errores. Aplica como criterio de cierre de cada bloque de [secuencia-implementacion.md](secuencia-implementacion.md).

## Como se ejecuta

- Levantar la app local: `npm run dev` (Vite, `--host 0.0.0.0`). URL base: `http://localhost:5173`.
- Abrir con MCP chrome-devtools (`new_page` / `navigate_page`); usar `take_snapshot` para el arbol accesible y `take_screenshot` para evidencia visual.
- Alternar tema escribiendo `data-theme` en `<html>` via `evaluate_script` (`document.documentElement.setAttribute('data-theme','dark')`) y verificando tambien `prefers-color-scheme` con `emulate`.
- Emular viewports con `resize_page` / `emulate`: desktop `1440x900` y movil `390x844` (umbral movil < 768px del repo).
- Datos sinteticos validos del mock actual (`src/data/mockApi.ts`): placa `ABC-123`, placa `ABC-982`, placa `FGT-415`, DNI `48592013`, DNI `12345678`, expediente `EXP-2024-001`. La pestania `codigo` no tiene datos hasta expandir `mockApi`.

## 1. Tema claro y oscuro

| Item | Como validar | Evidencia |
| --- | --- | --- |
| Toggle de tema cambia y persiste | Clic en `ThemeToggle`; recargar; el tema se mantiene (`localStorage`). | screenshot claro + oscuro |
| `prefers-color-scheme` respetado sin JS | `emulate` dark sin tocar el toggle; la app inicia en oscuro. | snapshot |
| Override manual gana sobre el sistema | Sistema en dark + `data-theme="light"` => UI clara. | screenshot |
| Sin hex hardcodeados ilegibles en dark | Inspeccionar gradientes/mockups DNI, placa, expediente; contraste legible. | screenshot dark |
| Anillo DNI sin neon cyan | Verificar que `#00ffcc` fue reemplazado por token reactivo. | screenshot dark |
| Pseudo-elementos `.action-box.gradient-cta` legibles | Revisar CTA en ambos temas; sin desborde de contraste. | screenshot claro + oscuro |

Anclas: `src/styles/tokens.css`, `src/styles/theme.css`, `src/hooks/useTheme.ts`, `src/components/ThemeToggle.tsx`.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## 2. Viewports desktop y movil

| Item | Como validar | Evidencia |
| --- | --- | --- |
| Colapso a una columna < 768px | `resize_page` 390x844; layout en columna unica, sin scroll horizontal. | screenshot movil |
| Chat fijo: rail desktop / bottom-sheet movil | Verificar rail abajo-derecha en 1440; barra inferior a pantalla completa en 390. | screenshot ambos |
| Full-height sin salto iOS | Confirmar `min-h-[100dvh]`/`dvh`, nunca `h-screen`. | snapshot |
| Header: 6 verbos visibles + eventos de vida | El nav ya no usa `slice(0,6)` que omitia sedes/institucion. | screenshot desktop |
| Targets tactiles >= 44px en movil | Inspeccionar botones de buscador, pestanias y chat. | snapshot |
| Breakpoints sin solapes | Probar 1180, 980, 640, 360 (breakpoints reales del repo). | screenshots |

Anclas: `src/styles/layout.css`, `src/App.tsx` (header/nav), `src/components/assistant/AssistantUI.tsx`.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## 3. Funcionalidades con datos sinteticos

### Buscador universal (UniversalActionBox)

| Item | Como validar | Evidencia |
| --- | --- | --- |
| Pestania placa | `fill` `ABC-123`; resultado del mock. | screenshot |
| Pestania DNI | `fill` `48592013`; resultado del mock. | screenshot |
| Pestania expediente | `fill` `EXP-2024-001`; resultado del mock. | screenshot |
| Pestania codigo (tras expandir mock) | `fill` codigo sintetico; estado vacio especifico si aun no hay datos. | screenshot |
| Validacion de input | Placa invalida `AB-12`; DNI con letras; mensaje claro (no generico). | screenshot |

Anclas: `src/components/UniversalActionBox.tsx`, `src/services/satApi.ts`, `src/utils/inputValidation.ts`.

### Simulador de pago (HeroInfoPanel)

| Item | Como validar | Evidencia |
| --- | --- | --- |
| Flujo idle -> form -> processing -> success | Recorrer estados de `usePaymentState`. | screenshots por estado |
| Tarjeta sintetica | Numero `4111 1111 1111 1111`, CVV `123`, fecha futura. | screenshot |
| Comprobante sin emojis | Generar comprobante; verificar iconos lucide, sin el emoji de advertencia ni el de check. | screenshot |
| Montos con formato es-PE | Confirmar `Intl.NumberFormat('es-PE', currency PEN)`. | screenshot |
| Disclaimer de demo | Banner de simulacion con icono `AlertTriangle`, no emoji. | screenshot |

Anclas: `src/components/HeroInfoPanel/`, `src/services/paymentService.ts`, `src/data/tabSteps.ts`.

### Chat fijo (Assistant)

| Item | Como validar | Evidencia |
| --- | --- | --- |
| Apertura/minimizado/persistencia | Abrir, minimizar, recargar; estado persiste (`useLocalStorage`). | screenshots |
| Streaming token a token | Enviar query abierta; texto fluye, no bloque tras 420ms. | screenshot + network |
| Function-calling | "Cuanto debo por ABC-123"; el backend ejecuta tool sobre `satApi`. | network `/api/chat` |
| Fallback canned | Forzar fallo del backend; chat degrada a respuesta canned. | screenshot |
| Escalamiento humano | Query con "coactiva"/"captura"/"embargo"; deriva a humano. | screenshot |
| PII truncada y borrable | Enviar DNI; verificar truncado en UI y "Eliminar conversacion". | screenshot |

Anclas: `src/components/assistant/AssistantUI.tsx`, `src/components/assistant/hooks/useAssistantChat.ts`, `src/services/chatClient.ts`, `api/chat.ts`, `src/data/chatConfig.ts`.

### Componentes de estrategia

| Item | Como validar | Evidencia |
| --- | --- | --- |
| Calendario de vencimientos | Render con fechas versionadas; recordatorio persistente. | screenshot |
| Mapa de sedes filtrable | Filtrar por distrito/materia; sugerencia de sede. | screenshot |
| Semaforo de papeleta | Estados verde/amarillo/rojo/negro con descuento y dias habiles. | screenshots |
| Contador de dias habiles | `businessDaysUntil`; excluye feriados 2026 versionados. | screenshot |
| Verificador anti-suplantacion + banner | Pegar URL/correo; resultado oficial/fraude/desconocido. | screenshot |
| Pre-evaluador 50 UIT | 4 preguntas accesibles; estimacion de ahorro. | screenshot |
| Desambiguacion de materia | `MateriaClarification` como paso 0 (alcabala comprador-al-SAT). | screenshot |

Anclas: `src/features/` (`CalendarVencimientos`, `SedeFinder`, `PapeletaSemaforo`, `VerificadorAntiSuplantacion`, `Beneficiarios50UIT`, `MateriaClarification`), `src/utils/businessDaysCalculator.ts`.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## 4. Performance y Lighthouse

| Item | Como validar | Meta |
| --- | --- | --- |
| Lighthouse por categoria | `lighthouse_audit` en `/` y `/consultar-pagar`. | Performance >= 90, A11y >= 95, Best Practices >= 95, SEO >= 90 |
| Code-splitting por ruta | `list_network_requests`; chunks `React.lazy` se cargan por ruta. | un chunk por pagina |
| LCP | `performance_start_trace` + `performance_analyze_insight`. | LCP < 2.5s |
| CLS | Trace de carga; sin saltos de layout. | CLS < 0.1 |
| Solo `transform`/`opacity` en animaciones | Inspeccionar; sin animar `width`/`height`/`top`/`left`. | sin layout thrash |
| `prefers-reduced-motion` | `emulate` reduced-motion; animaciones suprimidas. | snapshot |

Anclas: `src/pages/*` (`React.lazy` + `Suspense`), `src/styles/animation.css`.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## 5. Accesibilidad (WCAG 2.1 AA)

| Item | Como validar | Evidencia |
| --- | --- | --- |
| Navegacion por teclado | `press_key` Tab/Enter; foco visible y orden logico. | snapshot |
| ARIA del chat | `aria-live="polite"`, `role="status"` presentes. | snapshot |
| Contraste en ambos temas | Verificar texto sobre fondo; evitar gris `#555555` sobre color. | Lighthouse a11y |
| `aria-label` en toggle e iconos | Iconos lucide con etiqueta accesible, sin emojis. | snapshot |
| Pre-evaluador 50 UIT accesible | Fuente grande, contraste alto (perfil de mayor brecha digital). | snapshot |
| Formularios etiquetados | `label` asociado a cada input del buscador y pago. | snapshot |

Anclas: `src/components/ThemeToggle.tsx`, `src/features/Beneficiarios50UIT.tsx`, `src/components/assistant/AssistantUI.tsx`.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## 6. Consola y red sin errores

| Item | Como validar | Meta |
| --- | --- | --- |
| Consola limpia | `list_console_messages` tras recorrer cada ruta. | cero errores/warnings |
| Sin claves en el cliente | `get_network_request` de `/api/chat`; nunca aparece `DEEPSEEK_API_KEY`. | clave ausente |
| Manejo de 429/5xx del chat | Simular error; UI muestra fallback, no traza cruda. | screenshot |
| Sin PII en logs | Revisar requests; DNI/placa no se loguean en claro. | network |
| 404 de rutas controlado | Navegar a ruta inexistente; fallback SPA a `/index.html`. | screenshot |
| SEO/meta presente | Verificar favicon, Open Graph, `theme-color`, `robots`. | snapshot `index.html` |

Anclas: `api/chat.ts`, `vercel.json`, `index.html`, `src/services/chatClient.ts`.

> Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo.

## Rutas a recorrer en cada pasada

`/`, `/consultar-pagar`, `/tributos`, `/papeletas-multas`, `/tramites-digitales`, `/fraccionamiento`, `/atencion-sedes`, `/institucion`, `/tramite/:id`.

## Relacionados

- [secuencia-implementacion.md](secuencia-implementacion.md) — bloques implementables; cada uno cierra con esta validacion.
- [vision-implementacion.md](vision-implementacion.md) — vision, principios y deuda critica.
- [arquitectura-paginas-componentes.md](arquitectura-paginas-componentes.md) — arquitectura modular objetivo.
- [../05-roadmap-implementacion/plan-validacion.md](../05-roadmap-implementacion/plan-validacion.md) — plan de validacion de producto.
- [../05-roadmap-implementacion/criterios-de-aceptacion.md](../05-roadmap-implementacion/criterios-de-aceptacion.md) — criterios de aceptacion por historia.
- [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md) — guardrails PII y limites del chat.
