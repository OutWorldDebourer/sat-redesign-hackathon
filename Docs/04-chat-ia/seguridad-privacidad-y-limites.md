# Seguridad, privacidad y limites del chat

Reglas de manejo de PII, cumplimiento legal (Ley 29733, reserva tributaria, accesibilidad), limites de respuesta, escalamiento humano, logging y retencion para el asistente del SAT.

## Marco legal aplicable

- Ley 29733 (Proteccion de Datos Personales) y su Reglamento DS 016-2024-JUS (vigente desde marzo 2025): el chat trata datos personales (DNI, RUC, placa, codigo de contribuyente, correo) y queda obligado.
- Reserva tributaria (art. 85 Codigo Tributario): la deuda, base imponible y datos economicos del contribuyente son confidenciales; no se exponen sin autenticar identidad.
- Procedimiento Administrativo General (TUO Ley 27444) y recursos del Codigo Tributario para enrutar reclamos correctamente.
- Accesibilidad del Estado (DL 1412 / DS 029-2021-PCM; RM 126-2009-PCM, base WCAG 2.0 nivel A obligatorio). Recomendable apuntar a WCAG 2.1 AA.

## Manejo de PII y datos del contribuyente

- Minimizacion: pedir solo el identificador estrictamente necesario para la consulta (placa, DNI, RUC o codigo), y explicar para que se usa antes de pedirlo.
- Separacion de consultas:
  - Consulta general (como se calcula un arbitrio, plazos, definiciones): SIN login.
  - "Mi deuda" o datos economicos individuales: CON autenticacion (reserva tributaria). El chat explica por que pide iniciar sesion.
- No exponer deuda de terceros: una consulta por placa/DNI sin login no debe revelar deuda individual de otra persona. Pendiente de verificacion: si las consultas rapidas actuales del SAT exponen deuda de terceros (riesgo de reserva tributaria).
- No pedir claves NUNCA. El SAT no solicita contrasenas por chat, correo ni redes.
- Aviso de privacidad visible antes de que el usuario escriba datos; boton siempre accesible "Como uso tus datos" que abre la Politica de Privacidad.
- Derechos ARCO + portabilidad: el chat puede generar y derivar una solicitud a Mesa de Partes Digital, prellenando el formulario.

## No enviar datos sensibles al LLM sin minimizacion

- Anonimizar/seudonimizar antes de enviar al proveedor: enviar al LLM solo lo imprescindible para generar la respuesta; los identificadores reales se resuelven en backend (tools), no en el prompt cuando se pueda evitar.
- No incluir PII en el system prompt ni en ejemplos.
- DeepSeek tiene infraestructura en China: para PII de ciudadanos peruanos, minimizar/anonimizar, revisar retencion del proveedor y evaluar cumplimiento Ley 29733 antes de produccion. Detalle de integracion: ver [deepseek-api-plan.md](deepseek-api-plan.md).
- Decisiones automatizadas: el chat informa que es un asistente automatizado y permite intervencion humana cuando hay efectos juridicos o se afectan derechos.

## Limites de respuesta (que el chat NO hace)

- NO asesoria legal vinculante. Orienta; deriva a asesor humano para impugnaciones, coactiva, prescripcion y actos con efectos juridicos.
- NO emite actos con efectos juridicos (liquidaciones definitivas, resoluciones, dictamenes).
- NO da montos no confirmados como hechos: toda cifra es estimacion orientativa, lleva anio de referencia y deriva a la liquidacion oficial autenticada.
- NO hardcodea cifras (UIT, tramos, tasas, vencimientos): las lee de la fuente unica versionada por anio; lo no verificado se marca y deriva a fuente oficial.
- NO se presenta como humano: se identifica como asistente automatizado.

## Seguridad y confianza en cada flujo

- Banner persistente en todo flujo de pago: "Los tramites del SAT son gratis. No pagues a tramitadores. El SAT solo usa @sat.gob.pe, www.sat.gob.pe y app.sat.gob.pe."
- Verificador anti-suplantacion: el ciudadano pega un correo/URL/numero y el chat confirma si es oficial; alerta sobre el correo FALSO info@correo.sunat.gob.pe ("SAT-LIMA").
- Alerta anti-pago-indebido de alcabala (provincia de Lima se paga al SAT, no a la municipalidad distrital).
- Boton para denunciar cobros indebidos / corrupcion a integridad@sat.gob.pe.

## Escalamiento humano

- Boton "Hablar con un asesor" siempre visible.
- Se escala con handoff de contexto (materia e identificador ya capturado), sin obligar a recomenzar.
- Derivacion al canal vigente segun hora: si no hay atencion humana, deriva a Agencia Virtual / Mesa de Partes 24/7.
- Casos que fuerzan oferta de salida humana: impugnaciones, suspension de coactiva, prescripcion, vehiculo internado, y cualquier acto con efectos juridicos.

## Logging seguro

- Logging estructurado con correlation IDs para trazabilidad, SIN PII y SIN la API key.
- No persistir DNI/placa/RUC en logs; seudonimizar o truncar identificadores en cualquier registro necesario.
- Cifrado en transito y en reposo; control de acceso a los registros.
- Privacy-by-default: la conversacion no guarda mas de lo necesario; opcion "Eliminar esta conversacion".

## Notificacion de brechas

- Ante incidente de seguridad con datos personales: notificar a la ANPD dentro de 48 horas de tomar conocimiento y comunicar a los afectados si corresponde.
- Plan de respuesta a incidentes documentado; un chat que loguee PII amplia la superficie de brecha (otra razon para no loguear PII).

## Rate limiting

- Limites por usuario, por IP y global; responder 429 con `Retry-After` en exceso.
- Backpressure y colas para picos (campanas de vencimiento).
- Timeouts en toda llamada externa (LLM, backend, consultas). Ver resiliencia en [deepseek-api-plan.md](deepseek-api-plan.md).

## Accesibilidad (requisito legal)

- Chat operable 100% por teclado, foco visible, modo alto contraste.
- Compatible con lectores de pantalla: anuncios ARIA de mensajes nuevos, etiquetas correctas.
- Lenguaje claro por defecto (frases cortas, voz activa, sin siglas sin desarrollar). Cumple WCAG; apuntar a 2.1 AA.

## Retencion de datos

- Retencion minima: conservar el contexto de la conversacion solo durante la sesion salvo necesidad acreditada.
- Definir y publicar plazos de retencion alineados a la finalidad; eliminar al expirar.
- Pendiente de verificacion: politica de retencion del proveedor LLM (DeepSeek) y si el SAT cuenta con Politica de Privacidad accesible, DPO designado y bancos de datos inscritos en el RNPD de la ANPD.

## Pendientes de verificacion (no presentar como cerrado)

- Si el SAT tiene Politica de Privacidad accesible, DPO publicado y bancos de datos en el RNPD.
- Si las consultas por placa/DNI sin login exponen deuda de terceros.
- Version de WCAG exigible (RM 126-2009-PCM cita 2.0 A; recomendable 2.1 AA).
- Retencion y tratamiento de PII por DeepSeek bajo Ley 29733.
- Plazos exactos de recursos tributarios municipales y condiciones financieras del fraccionamiento.

Referencias cruzadas: limites y guardrails de conversacion en [intenciones-y-prompts-del-chat.md](intenciones-y-prompts-del-chat.md); comportamiento y estados del chat en [propuesta-chat-fijo.md](propuesta-chat-fijo.md); fuentes y riesgos abiertos en [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).
