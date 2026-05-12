# Auditoria Responsive SAT

Fecha: 2026-05-10  
Marco: Impeccable audit + adapt  
Filosofia: Planificacion, organizacion, direccion y control

## Capturas generadas

- `audit-screens/sat-desktop-1440x960.png`
- `audit-screens/sat-laptop-1280x800.png`
- `audit-screens/sat-tablet-768x1024.png`
- `audit-screens/sat-mobile-390x844.png`
- `audit-screens/sat-mobile-360x740.png`
- `audit-responsive-390-expanded.png`

## Resultado Ejecutivo

Score tecnico estimado: 12/20, aceptable con riesgos moviles serios.

Build: `npm run build` paso.  
Impeccable CLI: `npx impeccable --json src` retorno `[]`.

No hay scroll horizontal global en los viewports auditados, pero si hay overflow interno y solapamiento visual en mobile. El problema principal esta en la convivencia entre el hero, la ilustracion skyline y el asistente bottom sheet.

## Hallazgos

### P0: Bottom sheet tapa el formulario principal en moviles bajos

Ubicacion:
- `src/styles.css:1692`, `.assistant-region`
- `src/styles.css:1706`, `.assistant-region[data-sheet="collapsed"]`
- `src/components/assistant/Assistant.tsx:175`, estructura del aside

Evidencia:
- En `360x740`, el asistente empieza en `y=682`.
- El `action-box` va de `y=464` a `y=776`.
- Hay solapamiento directo entre asistente y formulario.

Impacto: el usuario ve y toca el asistente encima de la accion principal, justo donde deberia consultar o pagar.

Recomendacion: hacer que collapsed sea una barra real de 48-56px, ocultar contenido interno en collapsed, y sincronizar `padding-bottom` de `.main-content` con la altura visible del asistente.

### P1: Header mobile mantiene enlaces desktop y comprime el menu

Ubicacion:
- `src/styles.css:224`, `.site-header .ghost-link`
- `src/styles.css:1579`, `.ghost-link`

Evidencia:
- En `390x844`, `Citas` sigue visible.
- En `360x740`, el boton menu queda en `29x44`, menor al minimo tactil recomendado.

Impacto: el header se congestiona y reduce la precision tactil.

Recomendacion: usar `.site-header .ghost-link { display: none; }` dentro del breakpoint y fijar `.icon-button.mobile-only { width: 44px; flex: 0 0 44px; }`.

### P1: Touch targets bajo 44px

Ubicacion:
- Tabs de busqueda en `src/styles.css`
- `.route-arrow`
- `.bottom-sheet-trigger`

Evidencia:
- Tabs: 36px de alto.
- Flechas de ruta: 30x30.
- Handle del bottom sheet: 22px de alto.

Impacto: baja accesibilidad tactil, especialmente en celular y usuarios con poca precision.

Recomendacion: tabs a `min-height: 44px`, flechas con hit area `44x44`, trigger del sheet a 44px.

### P1: Estado peek del asistente queda demasiado denso

Ubicacion:
- `src/components/assistant/Assistant.tsx:222`
- `src/components/assistant/Assistant.tsx:258`
- `src/styles.css:1520`
- `src/styles.css:1711`

Evidencia: en `390x844`, el sheet peek mide cerca de 287px, pero el composer y links ocupan casi todo el espacio. La conversacion queda visualmente asfixiada.

Impacto: el estado intermedio parece abierto, pero no ofrece una experiencia de chat usable.

Recomendacion: en `peek`, mostrar solo header, saludo corto y 1 CTA. Dejar composer completo solo para expanded.

### P2: Skyline desborda internamente en mobile

Ubicacion:
- `src/styles.css:1638`
- `src/styles.css:1642`
- `src/styles.css:1831`
- `src/styles.css:1836`

Evidencia:
- En `390x844`, `.hero-visual` tiene 308px de ancho pero scroll interno de 447px.
- En `360x740`, `.hero-visual` tiene 278px de ancho pero scroll interno de 409px.

Impacto: aunque no genera scroll horizontal global, la ilustracion domina el primer viewport y empuja la accion hacia abajo.

Recomendacion: en mobile reducir skyline a banda de 72-96px o convertirla en fondo suave despues del formulario.

### P2: Desktop/tablet intermedio rompe jerarquia por ancho reservado al asistente

Ubicacion:
- `src/styles.css:85`, `.app-shell`
- `src/styles.css:1584`, breakpoint mobile/tablet

Evidencia: en anchos alrededor de 1024px, el asistente lateral reserva 320px y deja poco espacio al header/nav y a los grids.

Impacto: la navegacion se siente comprimida antes de activar el layout mobile.

Recomendacion: subir el breakpoint del modo mobile/asistente a 1120px o pasar el asistente a bottom sheet antes.

## Positivo

- No se detecto scroll horizontal global.
- El build pasa.
- Existen `aria-live`, labels en inputs y soporte `prefers-reduced-motion`.
- El asistente persistente es una decision fuerte y diferenciadora. Debe conservarse, pero con estados mobile mas disciplinados.

## Orden de accion recomendado

1. `$impeccable adapt`: corregir bottom sheet, header mobile, breakpoints y touch targets.
2. `$impeccable layout`: compactar hero mobile y bajar la skyline.
3. `$impeccable polish`: revisar microespaciado final y foco visible.
4. Re-ejecutar `$impeccable audit`.
