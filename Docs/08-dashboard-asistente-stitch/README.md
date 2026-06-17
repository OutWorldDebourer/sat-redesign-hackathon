# 08-dashboard-asistente-stitch

Diseño del dashboard del asistente humano del SAT (gestión de derivaciones del chat), pensado para Google Stitch y luego implementado en React.

## Archivos

- `DESIGN.md` — Spec de diseño Stitch (estética, tipografía, color OKLCH, layout, componentes, estados, motion). Es el `DESIGN.md` que consume Stitch y la fuente de verdad visual del dashboard.

## Estado de Stitch

Stitch MCP está disponible en el entorno. El flujo seguido: se autoró este `DESIGN.md` como spec Stitch y se implementó la UI React fiel a él en `src/pages/AssistantDashboard.tsx` (ruta `/asistente`). Si la generación de pantallas vía Stitch MCP no completa (salida muy grande / sin proyecto), el entregable sigue siendo válido: **"Stitch design spec implemented"** — el diseño está versionado aquí y reflejado 1:1 en React.

## Implementación

- Ruta: `/asistente` (`src/pages/AssistantDashboard.tsx`, lazy).
- Datos: tickets de `src/services/handoffClient.ts` (almacén demo localStorage; adapter real documentado ahí).
- Estilos: `src/styles/dashboard.css` (capas OKLCH, tema claro/oscuro).
