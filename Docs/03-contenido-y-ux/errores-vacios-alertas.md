# Errores, estados vacios y alertas

Catalogo de estados de interfaz (vacio / carga / error), alertas, disclaimers, escalamiento humano, enlaces oficiales y fallback cuando el servicio transaccional no carga. Aplica a la web del SAT y al chat fijo. Objetivo: el ciudadano nunca queda sin salida ni sin entender que paso.

## Estados de carga

- Skeleton por seccion en consultas de deuda y resultados; nunca pantalla en blanco.
- Indicador de typing en el chat; si el backend tarda: "Estoy revisando tu informacion..." con timeout visible.
- Procesos no cancelables (pago en curso): mensaje claro "Estamos procesando tu pago, no cierres esta ventana".
- Timeout en toda llamada externa (LLM, consulta, pago). Al vencer, pasa a estado de error con reintento, nunca a carga infinita.

## Estados vacios

El vacio confirma, tranquiliza y propone la siguiente accion.

| Estado vacio | Mensaje | Accion sugerida |
|---|---|---|
| Sin deuda a tu nombre | "No encontramos deuda a tu nombre hoy." | Activar Pitazo / recordatorios |
| Sin papeletas por placa | "Esta placa no tiene papeletas pendientes hoy." | Activar aviso por SMS para esta placa |
| Sin resultados de busqueda | "No encontre nada con ese dato." | Revisar el numero o preguntar al chat |
| Conversacion nueva (chat) | "Hola, soy el asistente del SAT. Que necesitas hacer hoy?" | Chips de intencion |
| Sin expedientes | "No tienes expedientes en tramite." | Escribir numero de seguimiento |
| Sin citas | "No tienes citas agendadas." | Reservar cita presencial o videollamada |
| Sin obligaciones del periodo | "No tienes vencimientos este periodo." | Ver calendario / activar recordatorios |

## Estados de error

Cada error dice que paso, por que y la siguiente accion. Nunca codigos crudos ni culpa al usuario.

| Error | Mensaje | Salida |
|---|---|---|
| Servicio de consulta caido | "Ahora no puedo consultar tu deuda. No es tu conexion, es nuestro sistema." | Reintentar + enlace oficial de consulta |
| LLM/chat caido | "Ahora no puedo responder. Mientras tanto puedes consultar aqui:" | Enlaces oficiales por intencion + reintentar |
| Pago rechazado por banco | "Tu banco no autorizo el pago. Revisa que tu tarjeta este habilitada para internet." | Otro medio (Yape/banco/agente) |
| Servicio de pago caido | "No podemos cobrar en linea ahora." | Canales alternos: banco, agente, Agencia Virtual |
| Sesion expirada | "Por tu seguridad cerramos la sesion." | Volver a iniciar sesion donde estaba |
| Archivo no valido | "Ese archivo no se puede subir." | Indicar formato (JPG/PDF) y peso (hasta 5 MB) |
| Identificador invalido | "No reconozco ese dato." | Mostrar formatos esperados |
| Jurisdiccion incorrecta | "El SAT solo cobra predial y arbitrios del Cercado de Lima." | Derivar a la municipalidad distrital correspondiente |
| Plazo vencido | "Ese plazo ya vencio." | Mostrar opciones que aun quedan |
| Error parcial (consolidada) | "No pudimos cargar [materia] ahora; te muestro lo demas." | Reintentar solo esa seccion |

## Fallback cuando el servicio transaccional no carga

Los dominios heredados (WebSiteV8, VirtualSAT) y la Agencia Virtual pueden fallar o redirigir. Regla: el ciudadano siempre recibe una alternativa verificada.

- Degradacion por capas: si el modulo transaccional cae, ofrecer (1) reintento, (2) enlace oficial directo a la pagina de la materia, (3) canal humano vigente segun hora.
- El chat, ante backend caido, responde con enlaces oficiales por intencion y nunca inventa montos.
- Enlaces oficiales de respaldo (destinos verificados, no aid/NNN fragiles):
  - Pago en linea: https://www.sat.gob.pe/pagosenlinea/
  - Agencia Virtual: https://app.sat.gob.pe/avisat/CiudadanoPublico
  - Mesa de Partes Digital: https://www.sat.gob.pe/WebSiteV9/Tramites/MesaPartesDigital
  - Predial y arbitrios: https://www.sat.gob.pe/websitev9/TributosMultas/PredialyArbitrios/Informacion
  - Impuesto vehicular: https://www.sat.gob.pe/websitev9/TributosMultas/ImpuestoVehicular/Informacion
  - Alcabala: https://www.sat.gob.pe/websitev9/TributosMultas/ImpuestoAlcabala/Informacion
  - Papeletas: https://www.sat.gob.pe/websitev9/TributosMultas/Papeletas/InformacionCodigodeTransito
  - Multas administrativas: https://www.sat.gob.pe/websitev9/TributosMultas/MultasAdministrativas/Informacion
- Migracion previa al lanzamiento: la informacion critica que hoy vive en noticias (fraccionamiento, descuentos) debe moverse a paginas permanentes versionadas antes de depender de ella en el fallback.

## Alertas (jerarquia por severidad)

| Severidad | Cuando | Comportamiento |
|---|---|---|
| Critica | Coactiva, orden de captura, medida cautelar, plazo a punto de vencer | Persistente, no descartable hasta resolver; tono de aliado, explica la salida primero |
| Advertencia | Pago indebido (alcabala distrital), papeletas personales, dias habiles, descuento por vencer | Visible en el flujo; descartable tras leerla |
| Informativa | Vencimientos del periodo, campanias de descuento vigentes | Discreta; con anio de referencia |
| Seguridad | Cualquier flujo de pago o tramite | Banner persistente fijo (no descartable) |

## Alertas de contenido obligatorias

Textos que el sistema y el chat repiten en sus contextos:

- ANTI-SUPLANTACION: "El SAT solo usa @sat.gob.pe y www.sat.gob.pe / app.sat.gob.pe. Cualquier correo, URL o cuenta distinta es fraude. El SAT nunca pide claves ni pagos por correo o redes."
- TRAMITES GRATUITOS: "Los tramites del SAT son gratis. No pagues a tramitadores. Reporta cobros indebidos a integridad@sat.gob.pe."
- ALCABALA: "Para inmuebles en la provincia de Lima la alcabala se paga al SAT, NO en la municipalidad distrital. Pagar en el distrito es pago indebido: no extingue tu deuda."
- PAPELETAS PERSONALES: "Las papeletas de transito son del conductor infractor y NO se transfieren al nuevo dueno al vender el vehiculo."
- RECLAMOS: "El Libro de Reclamaciones es solo para la calidad de atencion; NO discute la deuda ni detiene plazos. Para el monto, usa el recurso de reclamacion."
- DIAS HABILES: "Cuento los dias habiles por ti. Te muestro la fecha limite exacta, no sabados, domingos ni feriados."
- RESERVA TRIBUTARIA: "Tu deuda es informacion privada. Por eso te pido iniciar sesion antes de mostrartela."

## Disclaimers

- Estimacion: "Esto es un estimado orientativo, no tu liquidacion oficial. El monto exacto sale de tu liquidacion autenticada."
- Asistente automatizado: "Soy un asistente automatizado del SAT. Te doy orientacion; no emito documentos con efectos legales."
- Cifras volatiles: toda cifra se muestra con su anio de referencia y se lee de la fuente versionada; las no confirmadas se marcan como pendientes de verificacion, no como dato fijo.
- Reflejo de pago: "Tu pago puede tardar hasta 48 horas en aparecer en el sistema. Guarda tu Resumen del pago."

## Escalamiento humano

- Boton "Hablar con un asesor" visible en el chat y en toda ficha con efectos juridicos (coactiva, impugnacion, fraccionamiento que cierra reclamos).
- Derivacion segun hora: en horario, al canal humano (Alo SAT, Chat SAT, WhatSAT al numero/turno correcto); fuera de horario, a canales 24/7 (Agencia Virtual, Mesa de Partes Digital).
- Handoff de contexto: traslada materia e identificador ya capturado; el ciudadano no recomienza.
- El chat ofrece salida humana de forma proactiva ante actos con efectos juridicos, antes de que el usuario se frustre.

## Pendiente de verificacion

Numeros y horarios de canales (WhatSAT, Alo SAT, Chat SAT), direcciones de agencias y depositos, vencimientos del periodo, porcentajes de descuento por campania y condiciones de fraccionamiento se leen de la fuente versionada y se reconfirman cada anio (cartillas anuales). Centralizar en una sola fuente de verdad. Detalle en [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/) y [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).

## Relacionados

- [componentes-ui-requeridos.md](componentes-ui-requeridos.md) — componentes que implementan estos estados.
- [lenguaje-directo-y-microcopy.md](lenguaje-directo-y-microcopy.md) — copy de errores y vacios.
- [arquitectura-informacion-propuesta.md](arquitectura-informacion-propuesta.md) — donde aparece cada alerta en el layout.
- [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md) — limites del chat y privacidad.
- [../02-flujos-usuario/flujo-pago.md](../02-flujos-usuario/flujo-pago.md) — fallback en el flujo de pago.
