# Arquitectura de informacion propuesta

IA del sitio rediseniado del SAT: navegacion por intencion, jerarquia del home, donde vive el chat fijo en el layout y como se ocultan los 5 dominios tecnicos heredados. Reemplaza la arquitectura por institucion (Tramites/Servicios/Consultas/Pagos superpuestos) por una arquitectura por lo que el ciudadano quiere HACER.

## Principio rector

El portal actual organiza por nombre de modulo (Websitev9, WebsiteV8, VirtualSAT, app.sat.gob.pe, transparenciav3) y superpone menus que el ciudadano no sabe distinguir. La nueva IA titula y enruta por intencion (Pagar / Consultar / Declarar / Reclamar / Ayuda) y por evento de vida ("Compre", "Vendi", "Me multaron"). El chat fijo es el punto de entrada transversal que abstrae los dominios tecnicos. Mapeo completo de dominios a intencion: ver [../01-mapa-tramites/taxonomia-servicios.md](../01-mapa-tramites/taxonomia-servicios.md).

## Navegacion nivel 1 (barra principal)

Seis entradas, todas por intencion. El nombre del modulo tecnico nunca aparece.

| Nivel 1 | Verbo ciudadano | Login |
|---|---|---|
| Consultar | "Cuanto debo / en que estado estoy" | Consulta general no; mi deuda si (reserva tributaria) |
| Pagar | "Quiero pagar" | No para iniciar; identificador autodetectado |
| Declarar | "Compre / vendi / modifique un bien" | Para presentar si |
| Reclamar | "No estoy de acuerdo / quiero detener un cobro" | Para presentar si |
| Beneficios | "Quiero pagar menos o en cuotas" | Pre-evaluacion no; solicitud si |
| Ayuda y seguridad | "Necesito orientacion o un canal" | No |

Entrada paralela permanente: barra de eventos de vida ("Compre algo", "Vendi algo", "Me multaron", "Soy adulto mayor", "No puedo pagar todo", "Me estan por embargar") que abre el flujo correcto sin que el usuario elija una categoria.

## Navegacion nivel 2 (patron por materia)

Dentro de cada intencion, el segundo nivel se cruza con la materia (predial, arbitrios, vehicular, alcabala, papeletas, multas administrativas, juegos y espectaculos) usando un patron repetible para mantener consistencia. Cada ficha de materia abre con la desambiguacion conocida de esa materia:

- Predial: filtro "Tu predio esta en el Cercado de Lima?" antes de cualquier flujo.
- Arbitrios: "predial es impuesto; arbitrios son servicios".
- Vehicular: "el impuesto sigue al vehiculo; la papeleta es personal del conductor".
- Alcabala: "la paga el comprador, al SAT, no en la municipalidad distrital".
- Papeletas: "SAT Lima (ciudad) vs SUTRAN (carreteras)".
- Multas administrativas: "no es papeleta de transito; plazos y descuentos propios".

Detalle del patron por materia: ver [../01-mapa-tramites/taxonomia-servicios.md](../01-mapa-tramites/taxonomia-servicios.md).

## Jerarquia del home (orden de prioridad visual)

El home se ordena por la friccion #1 del ciudadano ("cuanto debo") y por la promesa central del rediseno (el chat fijo). Orden vertical:

1. Barra superior: identidad SAT + acceso a iniciar sesion + verificador de canal oficial.
2. Buscador universal de deuda/pago: una sola caja que autodetecta el identificador (DNI, RUC, placa, codigo, documento de deuda). Es el primer elemento accionable, sobre el pliegue.
3. Chat fijo en modo destacado: visible desde el primer scroll, con chips de intencion (Pagar, Consultar mi deuda, Compre algo, Me multaron, Reclamar).
4. Accesos por intencion (nivel 1) en tarjetas: Consultar / Pagar / Declarar / Reclamar / Beneficios / Ayuda.
5. Eventos de vida: fila de atajos ("Compre un inmueble", "Compre un vehiculo", "Me multaron", "Soy adulto mayor").
6. Alertas y recordatorios vigentes: vencimientos del periodo y campanias de descuento activas (leidas de la fuente versionada, con su anio de referencia).
7. Banner de seguridad persistente: tramites gratis, no pagar a tramitadores, solo @sat.gob.pe.
8. Ayuda y canales: Alo SAT, WhatSAT, Mesa de Partes 24/7, ubicar agencia/deposito.
9. Pie institucional: politica de privacidad, accesibilidad, transparencia, denuncia a integridad@sat.gob.pe.

Regla de jerarquia: el buscador universal y el chat son los dos elementos dominantes. Las tarjetas de intencion no compiten en peso visual con ellos. Evitar la plantilla de tres columnas identicas; usar agrupacion asimetrica por prioridad.

## Jerarquia de contenido en fichas de tramite

Cada ficha de tramite (predial, papeleta, alcabala, etc.) sigue el mismo orden de lectura:

1. Desambiguacion de entrada (la confusion conocida de esa materia).
2. "Esto es para ti si..." (quien aplica, jurisdiccion).
3. Accion principal (Consultar / Pagar / Declarar) como CTA dominante.
4. Que necesitas (identificador o documentos), explicando para que se usa cada dato.
5. Plazos y montos como estimacion, con su anio de referencia y enlace a la liquidacion oficial.
6. Alertas especificas (anti-pago-indebido, papeletas personales, dias habiles).
7. Salida humana y canales.

## Donde vive el chat fijo en el layout

- Posicion: anclado abajo a la derecha en escritorio (`position: fixed`), respetando area segura. En movil, barra inferior persistente con apertura a pantalla completa.
- Persistencia: visible en TODAS las paginas (home, fichas, calculadoras, flujos de pago, resultados de consulta).
- Estados de presentacion: burbuja contraida (FAB) con etiqueta breve; panel expandido (~min(420px, 100vw) en escritorio, pantalla completa en movil < 768px); modo destacado en el home con chips de intencion.
- Capa: reservada en la capa de overlays del sistema (junto a nav y modales), no z-index arbitrario.
- No invasivo: recuerda estado abierto/cerrado por sesion; un unico auto-open opcional la primera visita, descartable.
- Relacion con la navegacion: el chat no sustituye los menus para quien prefiere navegar, pero es la ruta primaria. Quien escribe su intencion evita los menus; quien navega los menus encuentra el chat siempre disponible.

Detalle de comportamiento, onboarding y limites del chat: ver [../04-chat-ia/propuesta-chat-fijo.md](../04-chat-ia/propuesta-chat-fijo.md).

## Reglas de routing y consolidacion

- Separar "consulta general" (sin login) de "mi deuda" (con login por reserva tributaria) en toda la IA.
- Vista consolidada de toda la deuda (predial + arbitrios + vehicular + papeletas + multas) tras autenticar, accesible desde Consultar y desde el chat. Replica y supera al Saldomatico fisico.
- Migrar la informacion critica que hoy vive en noticias (fraccionamiento, descuentos) a paginas permanentes versionadas; el chat y los enlaces deben apuntar a destinos verificados, no a aid/NNN fragiles.
- Toda cifra con su anio de referencia, leida de fuente unica versionada. Nunca hardcodear.

## Accesibilidad de la IA

- Navegacion completa por teclado, foco visible, "saltar al contenido".
- HTML semantico, etiquetas ARIA en el chat (anuncio de mensajes nuevos), contraste suficiente.
- Objetivo recomendado WCAG 2.1 AA (la norma del Estado cita 2.0 A como base obligatoria). Verificar version exigible: ver [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).

## Pendiente de verificacion

Vencimientos oficiales del periodo, tarifas de arbitrios por ordenanza, porcentajes de descuento por campania y version WCAG exigible se leen de la fuente versionada y se confirman antes del lanzamiento. Detalle en [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).

## Relacionados

- [lenguaje-directo-y-microcopy.md](lenguaje-directo-y-microcopy.md) — copy de cada nivel de la IA.
- [componentes-ui-requeridos.md](componentes-ui-requeridos.md) — componentes que materializan esta IA.
- [errores-vacios-alertas.md](errores-vacios-alertas.md) — estados y fallback por pantalla.
- [../01-mapa-tramites/taxonomia-servicios.md](../01-mapa-tramites/taxonomia-servicios.md) — taxonomia por intencion y eventos de vida.
- [../02-flujos-usuario/flujos-priorizados.md](../02-flujos-usuario/flujos-priorizados.md) — orden de implementacion de los flujos sobre esta IA.
- [../04-chat-ia/propuesta-chat-fijo.md](../04-chat-ia/propuesta-chat-fijo.md) — chat fijo en el layout.
