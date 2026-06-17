# Plan de validacion del rediseno del SAT de Lima

Plan para validar que el rediseno y el chat fijo cumplen su promesa: que el ciudadano resuelve su tramite por si mismo, en lenguaje claro, sin caer en tramitadores ni saturar canales humanos. Define hipotesis, pruebas de usabilidad, KPIs, instrumentacion de eventos y criterios de exito.

Documentos relacionados: vision y North Star en [redisenio-vision-producto.md](redisenio-vision-producto.md), backlog en [backlog-priorizado.md](backlog-priorizado.md), criterios de aceptacion en [criterios-de-aceptacion.md](criterios-de-aceptacion.md).

## Hipotesis a validar

| ID | Hipotesis | Como se valida |
|----|-----------|----------------|
| H1 | Un chat fijo que enruta por intencion reduce el tiempo a encontrar el tramite vs la navegacion por menus | Test de usabilidad con tiempo a primer tramite; comparar contra baseline del portal actual |
| H2 | Traducir la jerga en linea aumenta la comprension y reduce el abandono en flujos legales (coactiva, reclamos) | Comprension medida en test moderado; tasa de abandono por paso |
| H3 | El contador de dias habiles aumenta el % de papeletas pagadas dentro de la ventana de descuento | % de pagos con descuento aplicado antes/despues |
| H4 | La desambiguacion explicita reduce el uso del canal equivocado (Libro vs reclamacion; alcabala al distrito; papeleta vs impuesto) | Tasa de eleccion correcta en tareas de triaje; nº de pagos indebidos de alcabala reportados |
| H5 | La consulta consolidada supera al Saldomatico y al portal fragmentado como puerta de entrada | Tasa de finalizacion consulta -> accion; CSAT |
| H6 | El pre-evaluador de 50 UIT hace que mas adultos mayores soliciten el beneficio que desconocian | Nº de solicitudes iniciadas desde el flujo; tasa de finalizacion accesible |
| H7 | El chat resuelve la mayoria de consultas sin escalar a humano, descargando Alo SAT/WhatSAT | % de sesiones resueltas sin handoff humano |
| H8 | El banner y el verificador anti-suplantacion reducen la exposicion a tramitadores y fraude | Nº de verificaciones realizadas; encuestas de percepcion |

## Tests de usabilidad

### Participantes (por persona del brief)

- Don Alberto (vecino del Cercado, predial/arbitrios).
- Carla (propietaria de vehiculo).
- Jhon (conductor con papeletas en coactiva) — perfil de mayor carga emocional.
- Lucia (compradora de inmueble, alcabala).
- Senora Rosa (adulta mayor/pensionista) — perfil de mayor brecha digital; incluir pruebas con teclado y lector de pantalla.
- Miguel (microempresario/persona juridica).

Minimo 5 participantes por perfil prioritario para deteccion de problemas mayores; ampliar para los perfiles de Fase 1.

### Metodo

- **Moderado remoto y presencial**, con tareas reales por flujo priorizado.
- **Think-aloud** para capturar puntos de confusion de jerga y de eleccion de canal.
- **Sesiones de accesibilidad** dedicadas para el perfil de adulto mayor (navegacion solo por teclado y con lector de pantalla).
- **Pruebas no moderadas** para tareas simples (consulta por placa, calculadora) a mayor escala.

### Tareas por flujo (muestra)

| Flujo | Tarea para el participante | Que observamos |
|-------|----------------------------|----------------|
| Consulta consolidada (#1) | "Averigua cuanto debes en total" | Encuentra el chat, elige identificador, entiende el semaforo |
| Papeletas (#2) | "Tienes una papeleta de hace 3 dias; decide que hacer" | Entiende el contador de descuento y elige pagar/impugnar a tiempo |
| Alcabala (#3) | "Compraste un depa en Lima; calcula y paga la alcabala" | Sabe que la paga el comprador y al SAT; usa la calculadora; evita pago indebido |
| Vehiculo (#4) | "Compraste un auto el mes pasado; que tienes que hacer" | Distingue inscribir de pagar; entiende el plazo |
| 50 UIT (#5) | "Eres pensionista; averigua si te ahorras en el predial" | Completa el pre-evaluador; comprende que no es automatico ni cubre arbitrios |
| Reclamos (#6) | "No estas de acuerdo con un cobro; reclama" | Elige el canal correcto (no el Libro de Reclamaciones); ve el plazo exacto |

### Metricas de cada test

- Tasa de exito por tarea (completada sin ayuda).
- Tiempo a completar y tiempo a primer tramite.
- Nº de errores criticos (eleccion de canal/pago equivocado).
- Comprension de terminos clave traducidos (preguntas de recuerdo).
- SUS (System Usability Scale) por sesion.
- Para accesibilidad: tasa de exito por teclado y por lector de pantalla.

## KPIs en produccion

### North Star

- **Tramites completados con exito por sesion, sin contacto humano ni pago a terceros.**

### KPIs por categoria

| Categoria | KPI | Objetivo inicial (a calibrar con baseline) |
|-----------|-----|--------------------------------------------|
| Adopcion del chat | % de sesiones que abren el chat | Crecer sostenido; meta a definir tras baseline |
| Adopcion del chat | % de flujos completados que pasaron por el chat | Mayoria de flujos guiados por el chat |
| Comprension | % de consultas resueltas por el chat sin escalar a humano | Alto; reduce carga de Alo SAT/WhatSAT |
| Comprension | Tasa de desambiguacion correcta en zonas de confusion | Alta; pocos casos de canal equivocado |
| Conversion | Tasa de finalizacion por flujo priorizado | Mejorar vs baseline del portal actual |
| Ahorro al ciudadano | % de papeletas pagadas dentro de la ventana de descuento | Aumentar de forma medible |
| Plazos | % de reclamos enrutados al canal correcto dentro de plazo | Alto; minimizar deuda firme por error |
| Proteccion | Nº de verificaciones anti-suplantacion y de derivaciones a integridad@sat.gob.pe | Crecer; senal de proteccion activa |
| Accesibilidad | % de tareas completadas por teclado/lector de pantalla en pruebas | Cumplir WCAG (recomendable 2.1 AA) |
| Confianza | CSAT post-tramite y % de cierres "resuelto" | Alto y estable |
| Tecnico | Latencia p50/p95 de respuesta del chat; tasa de error/timeout del LLM | Baja latencia (favorecido por modo no-thinking y cache) |
| Costo | Costo por sesion del LLM; % de cache hit del prompt | Maximizar cache hit (50x mas barato); controlar costo a volumen |

Los objetivos numericos definitivos se fijan despues de medir el baseline del portal actual; este plan evita cifras de relleno.

## Instrumentacion de eventos (analitica)

Eventos minimos a registrar (sin PII en claro; ver privacidad):

- `chat_abierto`, `chat_minimizado`, `chat_reabierto`.
- `intencion_detectada` (propiedad: intencion, evento_de_vida, confianza).
- `enrutamiento` (propiedad: destino — Pagar/Consultar/Declarar/Reclamar/Ayuda).
- `desambiguacion_mostrada` y `desambiguacion_resuelta` (propiedad: zona — predial_vs_arbitrios, papeleta_vs_impuesto, alcabala, reclamos; resultado — correcto/incorrecto).
- `identificador_ingresado` (propiedad: tipo detectado; nunca el valor).
- `consulta_realizada` (propiedad: tipo, con_login si/no, jurisdiccion_validada).
- `calculadora_usada` (propiedad: tipo — predial/alcabala/vehicular/fraccionamiento/dias_habiles).
- `descuento_mostrado` y `pago_iniciado` / `pago_resumen_mostrado`.
- `flujo_iniciado` y `flujo_completado` (propiedad: flujo, fase del embudo).
- `escalamiento_humano` (propiedad: motivo).
- `anti_suplantacion_verificado` (propiedad: resultado — oficial/no_oficial).
- `pitazo_activado`, `recordatorio_creado`.
- `error_mostrado` (propiedad: tipo — timeout/llm/servicio/validacion).
- `accesibilidad_teclado_usado` (heuristico de interaccion sin mouse).

Reglas de instrumentacion:

- Correlacion por id de sesion efimero, no por DNI/placa.
- Minimizar PII: registrar tipo de identificador, nunca el valor.
- Embudos por flujo para localizar el paso donde se cae la conversion.

## Plan de experimentacion

- **Baseline primero:** medir el portal actual en las tareas clave antes del lanzamiento para tener comparacion honesta.
- **Lanzamiento por fases** alineado al backlog (Fase 1 nucleo, luego eventos de vida, etc.), midiendo cada fase.
- **A/B donde aporte:** variantes de microcopy del chat en zonas de confusion (p. ej. distintas formas de advertir el pago indebido de alcabala) midiendo tasa de desambiguacion correcta.
- **Pruebas de regresion de accesibilidad** en cada release del widget de chat (es un riesgo conocido de widgets de terceros).
- **Pruebas de carga/resiliencia:** simular alto volumen para validar timeouts, backoff, circuit breaker y degradacion elegante; verificar limites de concurrencia del LLM.

## Criterios de exito

El rediseno se considera exitoso si, medido contra baseline:

- Sube la tasa de finalizacion de los flujos de Fase 1 (consulta -> accion).
- Sube el % de papeletas pagadas dentro de la ventana de descuento.
- Baja el uso del canal equivocado en reclamos y el nº de pagos indebidos de alcabala reportados.
- El chat resuelve la mayoria de consultas sin escalar a humano (descarga medible de Alo SAT/WhatSAT).
- Las tareas de los perfiles prioritarios alcanzan alta tasa de exito en usabilidad, incluido el perfil de adulto mayor por teclado/lector de pantalla.
- El CSAT post-tramite es alto y estable.
- No se hardcodea ninguna cifra: todas se leen de la fuente versionada (auditoria de release).

## Validaciones de cumplimiento (no negociables)

- **Reserva tributaria:** verificar que ninguna consulta sin login exponga deuda de terceros.
- **Privacidad (Ley 29733):** aviso de privacidad visible, minimizacion de PII, no persistencia de DNI/placa en logs, proceso de notificacion de brecha a la ANPD en 48h, y evaluacion del proveedor (DeepSeek, infraestructura en China) antes de produccion.
- **Identificacion del asistente:** el chat se declara automatizado y etiqueta sus montos como estimacion orientativa, sin emitir actos vinculantes.
- **Accesibilidad:** auditoria WCAG del portal y del widget de chat en cada release.

Detalle en [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md) y [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md).

## Pendientes que condicionan la medicion

- Definir objetivos numericos tras medir el baseline del portal actual.
- Confirmar cifras y plazos volatiles (DJ vehicular, tabla de multas por codigo, vencimientos predial/arbitrios 2026, condiciones de fraccionamiento) antes de medir flujos que dependan de ellos. Ver [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).

## Fuente

- Brief canonico (personas, prioritizedFlows, microcopyPrinciples, chatStrategy, topAlerts) y hallazgos por dominio.
- Investigacion DeepSeek (latencia, concurrencia, cache, cautelas).
- Vision y North Star: [redisenio-vision-producto.md](redisenio-vision-producto.md).
