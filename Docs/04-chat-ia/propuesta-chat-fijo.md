# Propuesta del chat fijo (asistente ciudadano del SAT)

Vision del asistente conversacional SIEMPRE VISIBLE que reemplaza la navegacion fragmentada del portal actual y guia al ciudadano por intencion y por evento de vida.

## Que es y por que es el valor central

El chat fijo es el nuevo punto de entrada del rediseno. No es un widget de soporte secundario: es la capa que oculta los 5 dominios tecnicos del SAT (Websitev9, WebsiteV8, VirtualSAT, app.sat.gob.pe, transparenciav3) y traduce todo a un lenguaje de "que necesitas hacer".

- Resuelve la friccion #1 ("cuanto debo") consolidando deuda en una sola vista.
- Traduce jerga burocratica en tiempo real (coactiva, autovaluo, inafecto, REC).
- Enruta por intencion (Pagar / Consultar / Declarar / Reclamar / Ayuda) y por evento de vida ("compre", "vendi", "me multaron").
- Pre-llena formularios y deriva al modulo correcto sin que el usuario sepa que es Websitev9/V8/app.

Detalle de intenciones y prompts: ver [intenciones-y-prompts-del-chat.md](intenciones-y-prompts-del-chat.md). Mapeo tramite-a-respuesta: ver [matriz-tramite-a-respuesta-chat.md](matriz-tramite-a-respuesta-chat.md).

## Ubicacion en el layout

- Posicion: anclado abajo a la derecha en escritorio (`position: fixed`, esquina inferior derecha), respetando area segura. En movil, ocupa barra inferior persistente con boton de apertura a pantalla completa.
- Persistencia: visible en TODAS las paginas del portal, incluida home, fichas de tramite, calculadoras y flujos de pago.
- Estados de presentacion:
  - Burbuja contraida (FAB) con etiqueta breve "Te ayudo con tu tramite".
  - Panel expandido (ancho ~`min(420px, 100vw)` en escritorio; pantalla completa en movil < 768px).
  - Modo destacado: en la home, el chat puede abrirse semi-expandido con 4-5 chips de intencion ("Pagar", "Consultar mi deuda", "Compre algo", "Me multaron", "Reclamar").
- Z-index: reservado en la capa de overlays del sistema (junto a nav y modales), no `z-50` arbitrario.
- No invasivo: nunca abre solo en cada pagina; recuerda el estado (abierto/cerrado) por sesion. Un unico auto-open opcional la primera visita, descartable y no repetitivo.

Coherencia visual con el sistema de diseno del portal: ver [../03-contenido-y-ux/](../03-contenido-y-ux/).

## Comportamiento

- Minimizable y reanudable: el usuario contrae a burbuja sin perder el hilo de la conversacion en la sesion.
- Handoff de contexto entre canales: si el ciudadano salta a WhatSAT o pide cita, el chat traslada el contexto (materia, identificador ya capturado) y no lo obliga a recomenzar.
- Una pregunta a la vez: nunca pide varios datos en un mismo mensaje. Auto-detecta el formato del identificador (placa vs DNI vs RUC) y no obliga a elegir el tipo.
- Disclaimer persistente y discreto: "Soy un asistente automatizado del SAT. Te doy orientacion; los montos oficiales salen de tu liquidacion."
- Salida humana siempre visible: boton "Hablar con un asesor" disponible en todo momento, con derivacion al canal vigente segun hora.
- Operable por teclado y compatible con lectores de pantalla (anuncios ARIA de mensajes nuevos, foco visible, alto contraste). Requisito legal: ver [seguridad-privacidad-y-limites.md](seguridad-privacidad-y-limites.md).

## Estados de interfaz (vacio / carga / error)

- Vacio (primera apertura): saludo breve + chips de intencion + recordatorio de seguridad ("Los tramites del SAT son gratis. No pagues a tramitadores.").
- Escribiendo / carga: indicador de typing; si una consulta a backend tarda, mensaje "Estoy revisando tu informacion..." con timeout visible.
- Error de servicio LLM o backend: mensaje claro de degradacion ("Ahora no puedo responder. Mientras tanto puedes consultar aqui:") con enlaces oficiales directos y opcion de reintentar. Nunca dejar al usuario sin salida; ver fallback en [deepseek-api-plan.md](deepseek-api-plan.md).
- Sin resultados (placa/DNI sin deuda): confirmacion positiva ("No encontramos deuda a tu nombre hoy") con accion sugerida (activar Pitazo, recordatorios).
- Requiere identidad: cuando el ciudadano pide "mi deuda", el chat explica por que pide iniciar sesion (reserva tributaria) antes de enviar a autenticacion.

## Onboarding (como ensenia el chat)

1. Saludo de una linea + pregunta de intencion: "Hola, soy el asistente del SAT. Que necesitas hacer hoy?"
2. Chips de intencion y eventos de vida (Pagar, Consultar, Compre, Vendi, Me multaron, Reclamar, Ayuda).
3. Microtour opcional descartable: 3 pasos cortos mostrando que puede calcular, consultar y derivar.
4. Cada termino burocratico se traduce inline la primera vez que aparece (par oficial->ciudadano del glosario del brief).
5. El chat anticipa la siguiente accion util ("Quieres que te recuerde el vencimiento?" / "Activo Pitazo para esta placa?").

## Como acerca al usuario a las bondades del chat

- Reemplaza la navegacion: en lugar de menus Tramites/Servicios/Consultas/Pagos superpuestos, el ciudadano pregunta y el chat enruta.
- Replica y supera al Saldomatico fisico: vista consolidada de toda la deuda (predial + arbitrios + vehicular + papeletas + multas) en una sola conversacion (tras autenticar).
- Calculadoras conversacionales (predial por tramos, alcabala 3% sobre exceso de 10 UIT, vehicular 1% con minimo, fraccionamiento) etiquetadas como estimacion.
- Contador de dias habiles para el descuento de papeletas (83% en 5 dias habiles): muestra la fecha limite exacta, no "en N dias".
- Verificador anti-suplantacion: el usuario pega un correo/URL/numero y el chat confirma si es oficial (@sat.gob.pe / www.sat.gob.pe / app.sat.gob.pe).
- Pre-llenado de escritos (descargo, reclamo, prescripcion, devolucion) y solicitudes hacia Mesa de Partes Digital.

## Casos de uso prioritarios

Alineados con los flujos priorizados del brief (prioridad alta):

1. Consulta consolidada de deuda + pago con descuento (papeletas por placa, tributos por DNI/RUC).
2. Semaforo de papeleta + contador de descuento + ruta pagar/impugnar/fraccionar/suspender coactiva.
3. Asistente "Compre un inmueble" (alcabala): calculadora + alerta anti-pago-indebido distrital + plazo notaria.
4. Asistente "Compre / Vendi un vehiculo": DJ inscripcion vs descargo + diferenciar papeleta de impuesto vehicular.
5. Pre-evaluador y solicitud de deduccion 50 UIT (pensionista / adulto mayor).
6. Triaje de reclamos: Libro de Reclamaciones vs recurso de reclamacion vs queja Art. 155 con calculadora de dias habiles.

Casos de prioridad media/baja (recordatorios + Pitazo, onboarding a Agencia Virtual, simulador de fraccionamiento, verificador anti-suplantacion, vista por RUC, derivacion juegos y espectaculos) en [matriz-tramite-a-respuesta-chat.md](matriz-tramite-a-respuesta-chat.md).

## Limites del chat

- No emite actos con efectos juridicos (liquidaciones definitivas, resoluciones, dictamenes). Toda cifra es estimacion orientativa y deriva a la liquidacion oficial autenticada.
- No muestra deuda ni datos economicos individuales sin autenticar identidad (reserva tributaria, art. 85 Codigo Tributario).
- No da asesoria legal vinculante; en actos con efectos juridicos ofrece salida humana.
- No hardcodea montos: toda cifra (UIT, tramos, tasas, vencimientos) se lee de una fuente unica versionada por anio y se muestra con su anio de referencia.
- Se identifica siempre como asistente automatizado y minimiza PII (no persiste DNI/placa en logs).

Pendiente de verificacion (no presentar como fijo): plazo exacto de DJ vehicular de inscripcion, tabla de multas por codigo M, tarifas de arbitrios 2026, vencimientos oficiales 2026, condiciones financieras del fraccionamiento. El chat debe LEER estos datos de la fuente verificada, no hardcodear. Detalle de riesgos: ver [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).
