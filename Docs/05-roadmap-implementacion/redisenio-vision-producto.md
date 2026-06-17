# Vision de producto del rediseno del SAT de Lima

Vision, principios y metricas del rediseno de la web del SAT de Lima. El eje del producto es un chat fijo siempre visible que guia tramites, traduce jerga, calcula, deriva y pre-llena formularios, reemplazando la navegacion fragmentada por una experiencia organizada por intencion y por evento de vida.

Documentos relacionados: backlog en [backlog-priorizado.md](backlog-priorizado.md), criterios de aceptacion en [criterios-de-aceptacion.md](criterios-de-aceptacion.md), plan de validacion en [plan-validacion.md](plan-validacion.md). Flujos priorizados: [../02-flujos-usuario/flujos-priorizados.md](../02-flujos-usuario/flujos-priorizados.md). Diseno del chat: [../04-chat-ia/](../04-chat-ia/).

## Problema

- El portal actual organiza por estructura institucional, no por intencion del ciudadano. Mezcla 5 dominios tecnicos (Websitev9, WebSiteV8, VirtualSAT, app.sat.gob.pe, transparenciav3) y superpone menus (Tramites / Servicios / Consultas / Pagos).
- Informacion critica vive enterrada en noticias temporales (fraccionamiento aid/873, descuentos aid/846), con riesgo de enlaces que caducan.
- El ciudadano enfrenta jerga sin traduccion (cobranza coactiva, autovaluo, inafectacion, REC) y plazos en dias habiles que no sabe contar.
- Confusiones recurrentes y costosas: predial vs arbitrios; impuesto vehicular vs papeletas; alcabala la paga el comprador y al SAT (no en la municipalidad distrital); Libro de Reclamaciones vs reclamacion vs queja Art. 155.
- La ventana de descuento del 83% en papeletas (5 dias habiles) se pierde por desconocimiento; ~80,000 vehiculos con orden de captura y +19,000 internados.

## Vision

Una web del SAT de Lima donde cualquier ciudadano resuelve su tramite hablando en su propio lenguaje, sin saber que existen modulos tecnicos. El chat fijo es el punto de entrada: pregunta "que necesitas hacer?", enruta por Pagar / Consultar / Declarar / Reclamar / Ayuda o detecta el evento de vida ("compre", "vendi", "me multaron"), y acompana hasta el final del flujo con calculo, traduccion, alerta y pre-llenado.

El rediseno no es un chatbot pegado a un portal viejo: es un portal disenado alrededor del chat, donde cada pagina invita a usarlo y el chat siempre puede llevar al ciudadano al destino verificado correcto.

## Principios de producto

- **Intencion sobre institucion.** Titular y enrutar por lo que el ciudadano quiere hacer y por evento de vida, nunca por nombre de modulo (Websitev9, VirtualSAT, app).
- **El chat es el eje, no un anexo.** Toda pagina acerca al ciudadano al chat; el chat resuelve la fragmentacion y deriva al modulo correcto sin exponer la complejidad tecnica.
- **Traducir, no exigir glosario.** Cada termino burocratico se explica en linea la primera vez que aparece, usando el par oficial->ciudadano del brief.
- **Una sola fuente de verdad versionada por anio.** Toda cifra (UIT, tramos, tasas, vencimientos) se lee de una fuente unica parametrizada por anio fiscal y se muestra con su anio de referencia. Nunca hardcodear montos en texto.
- **Consecuencia y numero concreto.** Dar siempre el efecto y la cifra ("te quedan 3 dias habiles para pagar con 83% de descuento; despues pagaras S/ X mas"), contando los dias habiles por el usuario.
- **Aliado, no cobrador.** En flujos de coactiva o multa, reducir la ansiedad explicando la etapa y la salida antes que la amenaza.
- **Identidad solo cuando toca.** Separar consulta general (sin login) de "mi deuda" (con login por reserva tributaria) y explicar por que se pide iniciar sesion.
- **Transparente y seguro por diseno.** El chat se identifica como asistente automatizado, no emite montos vinculantes, minimiza PII, es operable por teclado y compatible con lectores de pantalla, y respeta la Ley 29733 y la reserva tributaria.
- **Proteger por defecto.** Banner persistente "tramites gratis, no pagues a tramitadores, solo @sat.gob.pe" y verificador anti-suplantacion en todo flujo de pago.

## North Star Metric

**Tramites ciudadanos completados con exito por sesion, sin contacto humano ni pago a terceros.**

Esta metrica unica captura el valor del rediseno: un ciudadano que entra, entiende, calcula, decide y resuelve (paga, declara, reclama o agenda) por si mismo, en lenguaje claro, sin caer en tramitadores y sin saturar canales presenciales o telefonicos.

Se mide como sesiones con al menos un tramite-objetivo completado (pago iniciado, DJ presentada, solicitud enviada a Mesa de Partes, cita agendada, Pitazo activado) sobre el total de sesiones con intencion clara.

## Metricas de soporte (driver metrics)

| Categoria | Metrica | Por que importa |
|-----------|---------|-----------------|
| Comprension | % de consultas resueltas por el chat sin escalar a humano | Mide si el chat traduce y guia bien |
| Comprension | Tasa de desambiguacion correcta en zonas de confusion (predial/arbitrios, papeleta/impuesto, alcabala, reclamos) | Evita que el ciudadano use el canal o pago equivocado |
| Conversion | Tasa de finalizacion por flujo priorizado (consulta -> pago, evento de vida -> tramite) | Mide friccion real del embudo |
| Ahorro al ciudadano | % de papeletas pagadas dentro de la ventana de descuento (83% / 67%) | Valor monetario directo; objetivo central del flujo de papeletas |
| Plazos | % de reclamos enrutados al canal correcto dentro del plazo (20 dias habiles) | Evita que la deuda quede firme por usar el Libro de Reclamaciones |
| Proteccion | Nº de verificaciones anti-suplantacion realizadas y nº de derivaciones a integridad@sat.gob.pe | Mide proteccion activa contra fraude |
| Adopcion del chat | % de sesiones que abren el chat; % de flujos completados que pasaron por el chat | Mide si el chat es realmente el eje |
| Accesibilidad | % de tareas completadas por teclado / lector de pantalla en pruebas | Requisito legal y critico para el perfil de adulto mayor |
| Confianza | CSAT post-tramite y % de cierres "resuelto" | Salud cualitativa de la experiencia |

Detalle de instrumentacion y objetivos cuantitativos en [plan-validacion.md](plan-validacion.md).

## El chat fijo como eje transversal

El chat no es una epica mas: es la capa que atraviesa todas las epicas. Su rol por capacidad:

- **Guia** por intencion y evento de vida; reemplaza la navegacion fragmentada.
- **Explica** traduciendo jerga en tiempo real y descomponiendo "por que pago esto".
- **Calcula y simula** con datos parametrizados por anio (predial por tramos, alcabala 3% sobre exceso de 10 UIT, vehicular 1% con minimo, fraccionamiento, contador de dias habiles), siempre etiquetado como estimacion orientativa.
- **Consolida** toda la deuda en una vista tras autenticar, con semaforo de estado y monto a pagar HOY con descuento aplicado.
- **Deriva** con inteligencia segun hora y materia (Agencia Virtual / Mesa de Partes 24/7; WhatSAT al numero/turno correcto; "hablar con asesor" para actos juridicos).
- **Pre-llena** escritos de descargo/reclamo/prescripcion, solicitudes ARCO y de devolucion, y pre-evalua elegibilidad (deduccion 50 UIT, fraccionamiento) antes de pedir documentos.
- **Alerta y protege** con banner anti-tramitadores, avisos anti-pago-indebido, recordatorios y verificador anti-suplantacion.
- **Triaja** para no perder plazos, forzando una decision informada pagar-vs-impugnar.

Especificacion completa en [../04-chat-ia/propuesta-chat-fijo.md](../04-chat-ia/propuesta-chat-fijo.md) e [../04-chat-ia/intenciones-y-prompts-del-chat.md](../04-chat-ia/intenciones-y-prompts-del-chat.md).

## Alcance por fases (resumen)

- **Fase 1 - Nucleo del valor:** consulta consolidada + pago con descuento, papeletas con semaforo y contador, calculadora de dias habiles, chat fijo base, banner anti-suplantacion.
- **Fase 2 - Eventos de vida:** alcabala (compre un inmueble), vehiculo (compre/vendi), deduccion 50 UIT, triaje de reclamos.
- **Fase 3 - Retencion y proteccion:** recordatorios + Pitazo, onboarding a la Agencia Virtual, simulador de fraccionamiento, verificador anti-suplantacion completo.
- **Fase 4 - Cola larga:** vista consolidada por RUC, derivacion de juegos y espectaculos.

Desglose en epicas e historias en [backlog-priorizado.md](backlog-priorizado.md).

## Decisiones tecnicas que sostienen la vision (a escala)

- **Fuente unica versionada por anio fiscal** para UIT, tramos, tasas y vencimientos; consumida por chat, calculadoras y microcopy. Evita datos vencidos cada enero.
- **LLM del chat:** `deepseek-v4-flash` (modo no-thinking por defecto, thinking opcional via reasoning_effort), leido siempre como variable de entorno `DEEPSEEK_API_KEY`, nunca hardcodeado. Aprovechar prompt caching (cache hit ~50x mas barato) para el system prompt y el catalogo de tramites. Detalle en [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md).
- **Privacy-by-default:** no persistir DNI/placa en logs, minimizar PII enviada al proveedor, cifrado y retencion minima, notificacion de brecha a la ANPD en 48h. Detalle en [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).
- **Resiliencia:** timeouts en toda llamada externa (LLM, consulta de deuda, pasarela), reintentos con backoff exponencial, circuit breaker y degradacion elegante (si el LLM falla, el chat ofrece rutas estaticas verificadas).
- **Accesibilidad WCAG (recomendable 2.1 AA)** en portal y widget de chat: operable por teclado, anuncios ARIA, contraste suficiente.

## Riesgos que condicionan la vision

- Cifras y plazos no confirmados (plazo DJ vehicular, tabla de multas por codigo, vencimientos predial/arbitrios 2026, condiciones de fraccionamiento). El chat los lee de la fuente versionada; no se publican como fijos hasta verificar. Ver [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).
- Proveedor LLM con infraestructura en China para datos de ciudadanos peruanos: evaluar cumplimiento Ley 29733 y retencion del proveedor antes de produccion. Migrar de alias legacy a `deepseek-v4-flash` (deprecacion 2026-07-24).
- Enlaces heredados fragiles (WebSiteV8, VirtualSAT): el chat debe apuntar a destinos verificados; auditar y migrar antes del lanzamiento.

## Fuente

- Brief canonico (chatStrategy, microcopyPrinciples, prioritizedFlows, personas) y hallazgos de investigacion por dominio.
- Investigacion DeepSeek (modelo recomendado, API, cautelas).
- SAT - Acerca del SAT: https://www.sat.gob.pe/WebSiteV9/SobreelSAT/QuienesSomos/AcercadelSAT
- MEF/gob.pe - UIT 2026 (S/ 5,500): https://www.gob.pe/435-valor-de-la-uit-en-el-ano-2026
