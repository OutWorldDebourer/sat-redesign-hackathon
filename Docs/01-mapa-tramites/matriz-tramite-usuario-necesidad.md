# Matriz tramite x usuario x informacion necesaria

Para cada tramite: que perfil ciudadano lo usa y que informacion exacta necesita para completarlo. Insumo para que el chat pida solo lo necesario, autodetecte identificadores y pre-llene formularios.

## Convenciones

- Perfiles (ver brief de personas): **Alberto** (vecino del Cercado, predial/arbitrios), **Carla** (propietaria de vehiculo), **Jhon** (conductor con papeletas/coactiva), **Lucia** (compradora de inmueble), **Rosa** (adulta mayor/pensionista), **Miguel** (microempresario/persona juridica), **Todos** (transversal).
- "Identidad (login)" = el dato se valida con autenticacion por reserva tributaria antes de mostrar deuda individual.
- "Autodetectable" = el chat reconoce el formato del identificador (placa vs DNI vs RUC) sin obligar a elegir.
- Una pregunta a la vez: el chat solicita los datos en el orden de la columna, explicando para que sirve cada uno.

## Consultar

| Tramite | Perfil principal | Informacion necesaria | Notas |
|---|---|---|---|
| Consultar papeletas por placa | Jhon, Carla | Placa (autodetectable) | Consulta general sin login; no exponer deuda de terceros |
| Consultar impuesto vehicular por placa | Carla | Placa | Devuelve monto estimado y anios de afectacion restantes |
| Consultar tributos por DNI/codigo | Alberto, Rosa | DNI o codigo de contribuyente (autodetectable) | Aclara que solo cubre Cercado de Lima |
| Vista de deuda consolidada | Todos | Identidad (login): DNI/RUC | Predial+arbitrios+vehicular+papeletas+multas con semaforo |
| Consultar tributos por RUC | Miguel | RUC (autodetectable) | Vista consolidada de la persona juridica |
| Estado de expediente | Todos | Numero de expediente | Buzon electronico / Agencia Virtual |
| Verificar descuento de papeleta hoy | Jhon | Placa + fecha de notificacion | El chat cuenta dias habiles y da fecha limite |
| Localizar vehiculo internado | Jhon | Placa | Devuelve deposito + monto de liberacion (deuda + costas) |
| Verificar canal oficial (anti-suplantacion) | Todos | Correo / URL / numero pegado | Regla: solo @sat.gob.pe, www/app.sat.gob.pe |

## Pagar

| Tramite | Perfil principal | Informacion necesaria | Notas |
|---|---|---|---|
| Pagar predial | Alberto | Codigo de contribuyente o DNI; monto/cuota | Al contado o cuota trimestral |
| Pagar arbitrios | Alberto | Codigo de contribuyente o DNI; cuota | Vencimientos feb/may/ago/nov |
| Pagar impuesto vehicular | Carla | Placa o codigo de pago | Minimo S/ 82.50 (2026) |
| Pagar papeleta con descuento | Jhon | Placa o documento de deuda; fecha de notificacion | Aplica 83%/67%; advierte ventana en dias habiles |
| Pagar alcabala | Lucia | Liquidacion previa (valor de transferencia, autovaluo) | Alerta anti-pago-indebido distrital; reflejo hasta 48h |
| Pagar multa administrativa | Miguel | RUC/DNI o numero de multa | Descuento de campania (15 dias habiles) |
| Pagar cuota de fraccionamiento | Todos | Compromiso de pago | Alerta para no perder el beneficio |
| Liberar vehiculo internado | Jhon | Placa; medio de pago | Monto total = deuda + costas + deposito |
| Pago en linea (cualquier deuda) | Todos | Un identificador (DNI/RUC/placa/Doc. Deuda/Codigo Administrado/Compromiso de pago); medio de pago; correo y celular | Identificador autodetectado |

## Declarar

| Tramite | Perfil principal | Informacion necesaria | Notas |
|---|---|---|---|
| DJ predial (compra) | Alberto | Identidad (login); datos del predio; sustento de adquisicion (minuta/escritura); fecha de compra | Plazo: ultimo dia habil de febrero del anio siguiente |
| DJ predial (ampliacion/obra) | Alberto | Identidad (login); datos de la obra; fecha de termino | Plazo: ultimo dia habil del mes siguiente al termino |
| DJ vehicular de inscripcion (compra) | Carla | Identidad (login); placa; comprobante de compra; fecha de adquisicion | Verifica si la concesionaria ya registro; plazo: pendiente |
| DJ vehicular de descargo (venta) | Carla | Identidad (login); placa; contrato/comprobante de transferencia | Pagar el impuesto del anio de venta |
| DJ vehicular por robo (tasa 0%) | Carla | Identidad (login); placa; copia certificada de denuncia policial; anotacion registral | Plazo: pendiente |
| Liquidacion de alcabala | Lucia | Identidad; minuta/contrato; autovaluo del anio; tipo de operacion | Checklist por tipo de transferencia |
| Registrar papeleta fisica que no aparece | Jhon | Placa; copia/acta de la papeleta (foto); declaracion jurada | Permite subir foto desde el chat |
| Solicitar acceso a Agencia Virtual | Todos | DNI o RUC; datos personales; correo | Aprobacion diferida del SAT |

## Reclamar

| Tramite | Perfil principal | Informacion necesaria | Notas |
|---|---|---|---|
| Triaje de reclamos | Todos | Motivo (atencion / monto / procedimiento); fecha de notificacion | Desambigua Libro vs reclamacion vs queja |
| Recurso de reclamacion tributaria | Todos | Acto reclamado (Orden de Pago / Resolucion); fecha de notificacion; escrito con fundamentos | 20 dias habiles; sin abogado |
| Recurso de apelacion (Tribunal Fiscal) | Todos | Resolucion apelada; fecha; escrito | 15 dias habiles; se presenta ante el SAT |
| Queja por defecto de procedimiento (Art. 155) | Jhon | Descripcion del vicio (coactiva indebida/falta de notificacion) | Va al Tribunal Fiscal |
| Descargo / impugnacion de papeleta | Jhon | Datos de la papeleta; medios probatorios (fotos/videos) | Trade-off impugnar vs pagar con descuento |
| Suspension de cobranza coactiva | Jhon | Causal tasada; medio probatorio | Causales: pagada/prescrita/impugnada en plazo/fraccionada/sin notificacion |
| Prescripcion de deuda | Todos | Concepto y anio; si presento declaracion; un formato por concepto/anio | No opera de oficio; el plazo se interrumpe |
| Devolucion por pago indebido/exceso | Lucia, Todos | Concepto, periodo, monto; constancias de pago | Detecta pago indebido de alcabala distrital |
| Compensacion | Todos | Saldo a favor; deuda destino | Aplica saldo en vez de reintegrar |
| Libro de Reclamaciones | Todos | Datos de contacto; descripcion del hecho de atencion | NO discute deuda ni detiene plazos |
| Denunciar cobro indebido / corrupcion | Todos | Descripcion del hecho; evidencia opcional | integridad@sat.gob.pe |

## Beneficios y facilidades

| Tramite | Perfil principal | Informacion necesaria | Notas |
|---|---|---|---|
| Deduccion 50 UIT (pensionista / adulto mayor) | Rosa | Edad o condicion de pensionista; predio unico (si/no); uso vivienda; ingreso mensual (<= 1 UIT) | Pre-evaluador de 4 preguntas antes de pedir documentos |
| Fraccionamiento / facilidades de pago | Jhon, Miguel, Todos | Monto de deuda; tipo de deudor (natural/juridica/pensionista); convenios vigentes; adeudos del ejercicio | Simulador 2-36 meses, cuota minima S/ 60 / S/ 30 |
| Acreditar inafectacion de alcabala | Lucia | Tipo de operacion (herencia/anticipo/primera venta); documentos | Ofrece constancia para el notario |
| Programa Contribuyente Puntual | Todos | Identidad (login) | Informa si califica |

## Alertas, seguimiento y ayuda

| Tramite | Perfil principal | Informacion necesaria | Notas |
|---|---|---|---|
| Activar Pitazo (alerta SMS) | Jhon, Carla | Placa; numero de celular; codigo de confirmacion | Afiliacion dentro del chat |
| Recordatorios de vencimientos | Alberto, Carla | Materia; identificador | Separa obligaciones que vencen el 27-feb |
| Seguimiento de expediente | Todos | Numero de expediente | Estado en buzon electronico |
| Reservar cita presencial / videollamada | Todos | Materia; distrito; fecha preferida | Sugiere sede mas cercana + documentos a llevar |
| Mesa de Partes Digital | Todos | Tipo de escrito; adjuntos JPG/PDF (max 5MB) | El chat genera y pre-llena el escrito |
| Ubicar agencia o deposito | Todos | Distrito o placa | Mapa + horario de la sede/deposito correcto |
| Contactar por Alo SAT / WhatSAT / Chat | Todos | Materia; hora (para resolver al turno correcto) | Un solo punto de entrada; numeros/horarios: pendiente |
| Hablar con un asesor (humano) | Todos | Contexto de la conversacion | Escala con contexto; deriva a 24/7 si no hay humanos |

## Negocios / persona juridica

| Tramite | Perfil principal | Informacion necesaria | Notas |
|---|---|---|---|
| Vista consolidada por RUC | Miguel | Identidad (login): RUC | Predial/vehicular/multas/expedientes en un resumen |
| Pagar multa administrativa con descuento | Miguel | RUC o numero de multa | Distingue multa administrativa de papeleta |
| Impugnar o fraccionar multa | Miguel | Numero de multa; escrito o monto de deuda | Recurso o simulador segun caso |
| Juegos y espectaculos publicos | Miguel | Tipo de evento | Deriva a especialista; tasas: pendiente |

## Reglas transversales de captura de datos

- Pedir el minimo identificador necesario y explicar para que se usa antes de pedirlo.
- Autenticar (login) SIEMPRE antes de mostrar deuda o datos economicos individuales (reserva tributaria, Art. 85 CT).
- No persistir DNI/placa en logs; minimizar PII (Ley 29733).
- Contar dias habiles por el usuario y mostrar la fecha limite exacta, no "dentro de N dias".
- Toda cifra (UIT, tramos, tasas, vencimientos) se lee de fuente unica versionada por anio, nunca hardcoded.

## Pendientes de verificacion

- Plazos exactos de DJ vehicular de inscripcion y por robo.
- Documentos exactos 2026 de: DJ predial de nuevo propietario, deduccion 50 UIT (TUPA), constancia de inafectacion de alcabala.
- Condiciones financieras del fraccionamiento (% minimo de deuda, garantia, TIM).
- Numeros y horarios vigentes de WhatSAT / Alo SAT / Chat / citas (cartilla anual).

## Relacionados

- Catalogo de tramites: [inventario-tramites.md](inventario-tramites.md).
- Taxonomia de navegacion: [taxonomia-servicios.md](taxonomia-servicios.md).
- Respuesta del chat por intencion: [../04-chat-ia/matriz-tramite-a-respuesta-chat.md](../04-chat-ia/matriz-tramite-a-respuesta-chat.md).
- Riesgos y cifras volatiles: [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).
