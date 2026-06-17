# Flujo: Consulta de deuda (cuanto debo)

Flujo de la consulta consolidada de deuda del ciudadano (predial, arbitrios, vehicular, papeletas, multas). Es la puerta de entrada #1 del portal ("cuanto debo") y el mayor diferenciador frente al portal actual fragmentado. Cubre estado actual (as-is), fricciones y como el chat fijo lo resuelve.

Flujo de pago tras la consulta: ver [flujo-pago.md](flujo-pago.md). Caso especifico de papeletas: ver [flujo-papeletas-infracciones.md](flujo-papeletas-infracciones.md). Orden de implementacion: ver [flujos-priorizados.md](flujos-priorizados.md).

## Usuario objetivo

- Don Alberto (vecino del Cercado): "cuanto debo de predial y arbitrios este anio".
- Carla (propietaria de vehiculo): "cuanto debo del impuesto vehicular".
- Jhon (conductor con papeletas): "cuanto debo HOY y cuanto me ahorro pagando ya".
- Miguel (persona juridica): "todas las obligaciones de mi RUC en un lugar".
- Transversal: cualquier ciudadano que solo quiere saber el monto sin necesariamente pagar todavia.

## Precondiciones

- Tener al menos un identificador valido: DNI, RUC, placa, codigo de contribuyente (Codigo Administrado), documento de deuda o compromiso de pago.
- Consulta general (montos referenciales, como se calcula): NO requiere identidad.
- Consulta de "mi deuda" (montos individuales): requiere autenticar identidad por reserva tributaria (art. 85 Codigo Tributario). Ver limites en [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).

## Pasos reales hoy (as-is)

1. El ciudadano entra a `www.sat.gob.pe` y debe decidir entre secciones que se superponen: Tramites, Servicios, Consultas, Pagos.
2. Elige el tipo de consulta correcta segun la materia:
   - Papeletas o vehicular por placa (consulta por placa).
   - Tributos (predial/arbitrios) por DNI/RUC o codigo de contribuyente.
   - Multas administrativas por documento de identidad o numero de multa.
3. Ingresa el identificador en el formulario del modulo correspondiente. El acceso esta repartido entre sistemas (Websitev9, VirtualSAT, app.sat.gob.pe) sin un unico punto claro.
4. El sistema devuelve la deuda de ESA materia. No hay vista consolidada: para ver toda su deuda debe repetir la consulta en cada modulo.
5. Alternativas de consulta rapida fuera de la web: SmartSAT (app movil), Saldomatico (kiosco fisico), WhatSAT, Alo SAT (01) 315-2400.
6. Si quiere ver montos individuales completos o estado de cuenta formal, debe entrar a la Agencia Virtual autenticada (registro con aprobacion diferida, no acceso instantaneo).

## Informacion y requisitos

- Identificadores aceptados: DNI, RUC, placa, codigo de contribuyente / Codigo Administrado, documento de deuda, compromiso de pago.
- Materias y su identificador tipico:
  - Predial y arbitrios (solo Cercado de Lima): DNI/RUC o codigo de contribuyente.
  - Vehicular (provincia de Lima): placa.
  - Papeletas: placa.
  - Multas administrativas: DNI/RUC o numero de multa.
- Consulta gratuita en todos los canales.
- Cifras de referencia 2026 (leer de fuente unica versionada, nunca hardcodear): UIT = S/ 5,500 (DS 301-2025-EF). Ver [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).

## Fricciones (as-is)

- Multiples identificadores posibles (DNI/RUC/placa/codigo) sin guia de cual usar para cada caso.
- Las consultas viven como enlaces sueltos dispersos en el portal; el menu Consultas se solapa con Tramites, Servicios y Pagos.
- No hay vista consolidada: el ciudadano no ve TODA su deuda (predial+arbitrios+vehicular+papeletas+multas) en un solo lugar.
- Inconsistencia de nomenclatura: "Codigo Administrado" (en pagos en linea) vs "codigo de contribuyente" (en consultas) confunde sobre si son lo mismo.
- El ciudadano de otro distrito consulta predial/arbitrios y no sabe que el SAT solo administra el Cercado de Lima.
- La consulta muestra el monto pero no siempre explica el estado (al dia / por vencer / en coactiva) ni el descuento vigente HOY.
- Riesgo de reserva tributaria: consultas por placa/DNI sin login podrian exponer deuda de terceros (pendiente de verificacion).

## Oportunidades del chat (guia, pre-llena, deriva paso a paso)

- Punto unico de consulta: el chat pregunta "que quieres consultar?" y pide solo el identificador correcto, una pregunta a la vez.
- Auto-deteccion del identificador: reconoce si el usuario pego una placa, un DNI o un RUC y enruta solo; no obliga a elegir el tipo.
- Glosario contextual inline: aclara que "Codigo Administrado" = codigo de contribuyente y donde ubicarlo (esquina de la cuponera/notificacion).
- Verificador de jurisdiccion: antes de consultar predial pregunta "tu predio esta en el Cercado de Lima?" y deriva a la municipalidad distrital si no.
- Vista consolidada (tras autenticar): replica y supera al Saldomatico fisico mostrando predial+arbitrios+vehicular+papeletas+multas en una sola conversacion.
- Semaforo de estado por deuda: al dia / por vencer / en coactiva / con medida cautelar, con el monto a pagar HOY y el descuento aplicado.
- Separacion de privacidad: distingue "consulta general" (sin login) de "mi deuda" (con login) y explica por que pide iniciar sesion (reserva tributaria).
- Desambiguacion al inicio: papeleta (personal del conductor) vs impuesto vehicular (del propietario) vs multa administrativa (norma municipal).
- Accion siguiente: tras mostrar la deuda ofrece pagar, activar Pitazo, programar recordatorio o hablar con un asesor.
- Etiqueta de estimacion: todo monto se marca como orientativo y deriva a la liquidacion oficial autenticada; el chat no emite actos vinculantes.

## CTA y componentes web

- CTA primario: "Consulta tu deuda" (caja unica de busqueda con auto-deteccion de identificador).
- Chips de intencion en home: "Pagar", "Consultar mi deuda", "Compre algo", "Me multaron", "Reclamar".
- Componente "tarjeta de deuda" con semaforo de estado (color + etiqueta textual, no solo color, por accesibilidad).
- Resumen consolidado (acordeon por materia) tras autenticar.
- Botones de accion contextual: "Pagar ahora", "Ver detalle", "Activar Pitazo", "Recordarme el vencimiento", "Hablar con un asesor".
- Banner persistente de seguridad: "Los tramites del SAT son gratis. No pagues a tramitadores. El SAT solo usa @sat.gob.pe y www.sat.gob.pe."
- Enlace a iniciar sesion en Agencia Virtual cuando se solicite "mi deuda".

## Estados de error y alerta

- Vacio (sin deuda): mensaje positivo "No encontramos deuda a tu nombre hoy" + accion sugerida (activar Pitazo, recordatorios). No dejar pantalla muerta.
- Carga: indicador de progreso; si el backend tarda, mensaje "Estoy revisando tu informacion..." con timeout visible.
- Error de servicio: degradacion clara ("Ahora no puedo consultar tu deuda. Mientras tanto puedes verla aqui:") con enlaces oficiales y opcion de reintentar.
- Identificador invalido: el chat avisa el formato esperado (placa AAA-123 / DNI 8 digitos / RUC 11 digitos) sin culpar al usuario.
- Requiere identidad: cuando pide "mi deuda" sin login, explica la reserva tributaria antes de derivar a autenticacion.
- Jurisdiccion incorrecta: si el predio no es del Cercado, deriva a la municipalidad distrital correspondiente.
- Alerta anti-suplantacion: ante un correo/URL sospechoso, el chat confirma que solo @sat.gob.pe y www.sat.gob.pe / app.sat.gob.pe son oficiales.

## Fuente

- SAT - Pagos en linea (ciudadano): https://www.sat.gob.pe/WebSiteV9/Inicio/ciudadano/p/pagosenlinea
- SAT - Pagos en Linea (motor, 6 identificadores): https://www.sat.gob.pe/pagosenlinea/
- SAT - SmartSAT: https://www.sat.gob.pe/websitev9/Servicios/SmartSAT
- SAT - Agencia Virtual: https://www.sat.gob.pe/websitev9/Servicios/AgenciaVirtual
- gob.pe - Consultar deudas via SmartSAT: https://www.gob.pe/68807-consultar-deudas-por-impuestos-e-infracciones-de-transito-a-traves-de-la-aplicacion-smartsat-del-sat-lima
- TUO Codigo Tributario art. 85 (reserva tributaria): https://diariooficial.elperuano.pe/Normas/obtenerDocumento?idNorma=90009
- MEF/gob.pe - UIT 2026 (S/ 5,500): https://www.gob.pe/435-valor-de-la-uit-en-el-ano-2026

Pendiente de verificacion: si las consultas rapidas por placa/DNI sin login exponen montos de deuda de terceros (riesgo de reserva tributaria); nomenclatura exacta "Codigo Administrado" = "codigo de contribuyente".
