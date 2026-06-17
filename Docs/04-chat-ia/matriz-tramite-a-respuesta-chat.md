# Matriz tramite-a-respuesta del chat

Tabla operativa: para cada intencion/tramite, que responde el chat, a que destino deriva (enlace oficial / flujo / humano) y que datos puede pre-llenar.

## Convenciones

- Toda cifra mostrada por el chat es estimacion orientativa con anio de referencia; el monto oficial sale de la liquidacion autenticada.
- "Login" = requiere autenticacion por reserva tributaria antes de mostrar deuda individual.
- Los enlaces son destinos oficiales verificados; los marcados "Pendiente de verificacion" deben confirmarse y migrarse a paginas permanentes antes del lanzamiento.
- Catalogo de intents: ver [intenciones-y-prompts-del-chat.md](intenciones-y-prompts-del-chat.md).

## Consultar

| Intent / tramite | Que responde el chat | Deriva a | Datos que pre-llena |
|---|---|---|---|
| Consultar deuda consolidada | Vista unica de predial+arbitrios+vehicular+papeletas+multas con semaforo (al dia / por vencer / coactiva / con medida cautelar) | Agencia Virtual (login) https://app.sat.gob.pe/avisat/CiudadanoPublico | DNI/RUC ya capturado; materia |
| Consultar papeletas por placa | Lista de papeletas + semaforo + monto a pagar HOY con descuento vigente + fecha limite en dias habiles | Pago en linea https://www.sat.gob.pe/pagosenlinea/ | Placa |
| Consultar impuesto vehicular por placa | Monto estimado + cuantos de los 3 anios de afectacion quedan | Pago en linea / Agencia Virtual | Placa |
| Consultar tributos por DNI/RUC o codigo | Predial/arbitrios pendientes; aclara que solo cubre Cercado de Lima | Agencia Virtual (login) | DNI/RUC o codigo de contribuyente |
| Estado de expediente | Estado del tramite por numero de expediente | Agencia Virtual / Mesa de Partes Digital | Numero de expediente |
| Verificar descuento de papeleta hoy | Calcula tramo vigente (83% / 67% / sin descuento codigo M) y fecha limite exacta | Pago en linea | Placa, fecha de notificacion |
| Localizar vehiculo internado | Deposito asignado + desglose de monto de liberacion (deuda + costas) | Depositos SAT / Subgerencia Ejecucion Coactiva | Placa |
| Verificar canal oficial (anti-suplantacion) | Confirma si correo/URL/numero es oficial (@sat.gob.pe, www/app.sat.gob.pe) | integridad@sat.gob.pe para denunciar | Correo/URL/numero pegado |

## Pagar

| Intent / tramite | Que responde el chat | Deriva a | Datos que pre-llena |
|---|---|---|---|
| Pagar tributo o multa | Aplica descuento vigente, muestra cuanto ahorra, advierte reflejo hasta 48h | Pago en linea https://www.sat.gob.pe/pagosenlinea/ | Identificador autodetectado (placa/DNI/RUC/Doc. Deuda/Codigo Administrado/Compromiso de pago) |
| Pagar papeleta con descuento | Monto con 83%/67% segun tramo; fuerza decision pagar-vs-impugnar antes del vencimiento | Pago en linea | Placa, doc. de deuda |
| Pagar alcabala | Alerta anti-pago-indebido distrital + recordatorio "requisito para escritura" | Liquidacion en Agencia Virtual; alcabalaenlinea@sat.gob.pe | Valor de transferencia, identidad |
| Liberar vehiculo internado | Monto total para liberar (deuda + costas + deposito si aplica) y deposito correcto | Deposito SAT correspondiente | Placa |
| Pagar cuota de fraccionamiento | Cuota vigente y fecha de vencimiento; alerta para no perder el beneficio | Agencia Virtual | Compromiso de pago |

## Declarar

| Intent / tramite | Que responde el chat | Deriva a | Datos que pre-llena |
|---|---|---|---|
| DJ predial (compra) | Checklist de documentos + plazo (ultimo dia habil de febrero del anio siguiente); verifica jurisdiccion Cercado | Agencia Virtual (DJ predial) | Datos del predio, fecha de compra |
| DJ predial (ampliacion/obra) | Plazo: ultimo dia habil del mes siguiente al termino de obras | Agencia Virtual | Datos de obra |
| DJ vehicular de inscripcion (compra) | Aclara inscribir-vs-pagar; verifica si la concesionaria ya registro; advierte multa por omision | Agencia Virtual (DJ vehicular) | Placa, fecha de compra. Plazo: Pendiente de verificacion (ultimo dia habil de febrero vs 30 dias) |
| DJ vehicular de descargo (venta) | Recuerda pagar el impuesto del anio de venta; aclara que papeletas NO se transfieren | Agencia Virtual | Placa, datos de transferencia |
| DJ vehicular por robo (tasa 0%) | Checklist: denuncia policial + anotacion registral; aplica desde el anio siguiente | Agencia Virtual | Placa, datos de denuncia. Plazo: Pendiente de verificacion |
| Liquidacion de alcabala | Calculadora 3% sobre exceso de 10 UIT + checklist por tipo de transferencia | Agencia Virtual; alcabalaenlinea@sat.gob.pe | Valor, autovaluo, tipo de operacion |
| Registrar papeleta fisica que no aparece | Pasos para registrar con copia/acta + DJ; permite subir foto | Agencias SAT (cajas) / Agencia Virtual | Placa, foto de papeleta/acta |
| Solicitar acceso a Agencia Virtual | Onboarding paso a paso; reduce abandono en aprobacion diferida | Solicitud https://www.sat.gob.pe/ciudadanopublico | DNI/RUC, correo |

## Reclamar

| Intent / tramite | Que responde el chat | Deriva a | Datos que pre-llena |
|---|---|---|---|
| Triaje de reclamos | Desambigua Libro vs reclamacion vs queja Art. 155; calcula dias habiles | Canal correcto segun caso | Fecha de notificacion |
| Recurso de reclamacion tributaria | 20 dias habiles; no requiere abogado; distingue Orden de Pago (pago previo) de Resolucion | Mesa de Partes Digital https://www.sat.gob.pe/websitev9/Tramites/MesaPartesDigital | Acto reclamado, fecha de notificacion, escrito guiado |
| Recurso de apelacion (Tribunal Fiscal) | 15 dias habiles; se presenta ante el SAT que eleva al Tribunal; explica silencio negativo | Mesa de Partes Digital | Resolucion apelada, fecha |
| Queja por defecto de procedimiento (Art. 155) | Para coactiva indebida/falta de notificacion; se presenta ante el Tribunal Fiscal | Tribunal Fiscal (MEF) | Descripcion del vicio |
| Descargo / impugnacion de papeleta | Evalua trade-off impugnar vs pagar con descuento; checklist de pruebas | Mesa de Partes Digital | Datos de papeleta, pruebas |
| Suspension de cobranza coactiva | Selector de causal tasada (pagada/prescrita/impugnada en plazo/fraccionada/sin notificacion) + prueba | Mesa de Partes Digital / Ejecutor Coactivo | Causal, medio probatorio |
| Prescripcion de deuda | Aclara que no opera de oficio; 4 anios (con DJ) / 6 (sin DJ); 1 formato por anio y concepto | Mesa de Partes Digital | Concepto, anio, formato |
| Devolucion por pago indebido/exceso | Detecta pago indebido de alcabala distrital; explica doble accion (devolucion distrito + pago SAT) | Mesa de Partes Digital | Concepto, periodo, monto, constancias |
| Compensacion | Diferencia compensacion (aplica saldo) de devolucion (reintegra) | Mesa de Partes Digital | Saldo a favor, deuda destino |
| Libro de Reclamaciones | Solo mala atencion; advierte que NO detiene plazos ni discute deuda | https://www.sat.gob.pe/websitev9/Servicios/Defensoria/LibroReclamaciones | Datos de contacto, hecho |
| Denunciar cobro indebido / corrupcion | Banner anti-tramitadores; canal de integridad | integridad@sat.gob.pe | Descripcion del hecho |

## Beneficios y facilidades

| Intent / tramite | Que responde el chat | Deriva a | Datos que pre-llena |
|---|---|---|---|
| Deduccion 50 UIT (pensionista / adulto mayor) | Pre-evaluador de 4 preguntas + calculadora de ahorro (50 UIT = S/ 275,000 en 2026); aclara que NO exonera arbitrios | Agencias SAT / Mesa de Partes Digital | Edad/pension, predio unico, vivienda, ingreso |
| Fraccionamiento / facilidades de pago | Verificador de elegibilidad + simulador (2-36 meses, cuota minima S/ 60 / S/ 30); advierte que acogerse acepta la deuda y cierra reclamos en tramite | Agencia Virtual; facilidadesdepago@sat.gob.pe | Monto de deuda, tipo de deudor. Condiciones financieras: Pendiente de verificacion |
| Acreditar inafectacion de alcabala | Detecta herencia / anticipo de legitima / primera venta de constructora; ofrece constancia | Agencia Virtual; alcabalaenlinea@sat.gob.pe | Tipo de operacion, documentos |
| Programa Contribuyente Puntual | Informa si califica y que beneficios obtiene | Seccion institucional SAT | - |

## Alertas y seguimiento

| Intent / tramite | Que responde el chat | Deriva a | Datos que pre-llena |
|---|---|---|---|
| Activar Pitazo (alerta SMS por placa) | Afilia placa + celular dentro del chat; confirma con codigo | Modulo Pitazo (sin sacar al usuario al modulo heredado) | Placa, celular |
| Recordatorios de vencimientos | Agrega fechas (predial/arbitrios/vehicular); separa obligaciones del 27-feb | Recordatorio interno / calendario | Materia, identificador |
| Seguimiento de expediente | Estado por numero en buzon electronico | Agencia Virtual | Numero de expediente |

## Ayuda y canales

| Intent / tramite | Que responde el chat | Deriva a | Datos que pre-llena |
|---|---|---|---|
| Reservar cita presencial / videollamada | Sugiere sede mas cercana + horario vigente + documentos a llevar | Agencia Virtual (citas) / WhatsApp citas | Materia, distrito, fecha |
| Mesa de Partes Digital | Genera escrito correcto segun caso y lo prellena | https://www.sat.gob.pe/WebSiteV9/Tramites/MesaPartesDigital | Tipo de escrito, adjuntos |
| Ubicar agencia o deposito | Mapa + horario de la sede/deposito correcto | Canales de atencion SAT | Distrito / placa |
| Contactar por Alo SAT / WhatSAT / Chat | Resuelve al numero/turno correcto segun hora; un solo punto de entrada | Canal vigente (6 lineas WhatSAT segun turno) | Materia. Horarios/numeros: Pendiente de verificacion (cartilla anual) |
| Hablar con un asesor (humano) | Escala con contexto traspasado; deriva a 24/7 si no hay humanos | Asesor humano / Agencia Virtual / Mesa de Partes 24/7 | Contexto de la conversacion |

## Negocios / persona juridica

| Intent / tramite | Que responde el chat | Deriva a | Datos que pre-llena |
|---|---|---|---|
| Vista consolidada por RUC | Predial/vehicular/multas/expedientes del RUC en un resumen | Agencia Virtual (login) | RUC |
| Pagar multa administrativa con descuento | Distingue multa administrativa de papeleta; aplica descuento de campania vigente | Pago en linea | RUC o numero de multa. Descuentos: Pendiente de verificacion |
| Impugnar o fraccionar multa | Recurso o simulador segun caso | Mesa de Partes Digital / Agencia Virtual | Numero de multa |
| Juegos y espectaculos publicos | Deriva a especialista; checklist para organizadores | Pagina de la materia / asesor | Tipo de evento. Tasas: Pendiente de verificacion |

## Fuera de alcance

| Caso | Que responde el chat | Deriva a |
|---|---|---|
| Papeleta de carretera | Aclara que es SUTRAN, no SAT Lima | SUTRAN |
| Predial de otro distrito | Aclara que el SAT solo cubre Cercado de Lima | Municipalidad distrital correspondiente |
| Tema no tributario / no SAT | Reconoce limite y orienta al organismo correcto | Canal externo pertinente |

Cifras y plazos sujetos a verificacion (UIT, tramos, tablas de multas, vencimientos 2026, condiciones de fraccionamiento): el chat los lee de la fuente unica versionada, nunca hardcoded. Detalle en [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).
