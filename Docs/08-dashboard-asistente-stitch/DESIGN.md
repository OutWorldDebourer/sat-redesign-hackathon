# DESIGN.md — Dashboard del Asistente Humano SAT (spec Stitch)

Spec de diseño para Google Stitch del panel donde un asesor humano del SAT gestiona las conversaciones derivadas por el chat IA. Implementado fiel en React (`/asistente`).

## Producto y usuario

- Usuario: asesor/a del SAT que atiende casos derivados (handoff) del chat ciudadano.
- Objetivo: triar la cola, abrir un caso, leer el resumen y transcripción, actuar (tomar, en progreso, responder, cerrar) y vigilar métricas.
- Tono: operativo, sobrio, institucional. Cero ruido decorativo; densidad de datos alta pero legible.

## Aesthetic

- Estilo "consola cívica": panel de trabajo claro, jerarquía por color y peso, no por tamaños gigantes.
- Sin glassmorphism, sin gradientes decorativos, sin sombras neón. Tarjetas planas con borde sutil y sombra de difusión mínima.

## Color (OKLCH, reactivo a tema claro/oscuro)

- Hereda los tokens del sistema (`src/styles/tokens.css`): `--color-primary` (navy), `--color-accent` (azul), superficies y texto con `light-dark()`.
- Prioridad por color semántico: `critical` → `--color-danger`; `high` → `--color-alerta`/warning; `medium` → `--color-consultar`; `low` → `--color-muted`.
- Estado: abierto (acento), en progreso (warning), cerrado (success/muted).
- Texto sobre superficie nunca gris-sobre-color; contraste AA.

## Tipografía

- Display: `var(--font-display)` para títulos y métricas. Body: `var(--font-body)`.
- Escala contenida: métricas 1.6–2rem; títulos de sección 1rem–1.15rem; cuerpo 0.85–0.95rem; metadatos 0.72–0.78rem.

## Layout

- Encabezado: título "Bandeja del asistente" + subtítulo + fila de métricas (abiertos, críticos, en progreso, cerrados).
- Cuerpo: dos columnas en escritorio — izquierda **cola** (lista filtrable de tickets), derecha **detalle** del ticket seleccionado. En móvil (<900px) se apilan; el detalle aparece bajo la cola al seleccionar.
- Espaciado 4pt; `gap`, no márgenes sueltos. Contenedor `max-width: 1200px`.

## Componentes

1. **Métricas** (4 tarjetas planas): valor grande + etiqueta. Crítico resaltado en danger.
2. **Filtros**: segmentos por estado (todos/abierto/en progreso/cerrado), select de prioridad, indicador de canal (chat). Conteo de resultados con `aria-live`.
3. **Cola** (lista): cada item = punto de prioridad + id + motivo (1 línea) + estado + tiempo relativo. Item activo resaltado. Operable por teclado (botones), foco visible.
4. **Detalle**: cabecera (id, prioridad, estado, canal, ¿requiere contacto?), resumen, motivo, acción sugerida, transcripción (roles usuario/asistente; PII ya anonimizada), y barra de **acciones**: Tomar caso · Marcar en progreso · Responder (demo, textarea) · Cerrar · Copiar resumen.
5. **Estados**: vacío (cola sin tickets), sin selección (placeholder en detalle), confirmaciones de acción con `aria-live`.

## Motion

- Solo `transform`/`opacity`. Aparición suave del detalle (fade/slide corto). Respeta `prefers-reduced-motion`.

## Accesibilidad

- Roles/labels ARIA en cola (listbox-like con botones), filtros etiquetados, foco visible, anuncios de acción. Contraste AA en ambos temas.

## Prompt Stitch (resumen)

"Diseña un dashboard operativo para un asesor de un servicio tributario municipal que gestiona conversaciones derivadas por un chatbot. Dos columnas: cola de tickets filtrable por estado y prioridad a la izquierda, detalle del caso a la derecha con resumen, transcripción y acciones (tomar, en progreso, responder, cerrar, copiar). Fila superior de métricas. Estética cívica sobria, plana, alta densidad legible, paleta navy/azul, tema claro y oscuro, accesible WCAG AA. Nada de glassmorphism ni gradientes decorativos."
