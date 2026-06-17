# Flujo: Papeletas e infracciones de transito

Flujo del ciudadano con papeletas de transito: consultar por placa, entender el estado, decidir pagar/impugnar/fraccionar/suspender coactiva, y no perder la ventana de descuento. Es el perfil de mayor carga emocional (captura vehicular, embargo). Cubre estado actual (as-is), fricciones y como el chat fijo traduce la jerga y evita la perdida del ahorro.

Consulta general previa: ver [flujo-consulta-deuda.md](flujo-consulta-deuda.md). Pago con descuento: ver [flujo-pago.md](flujo-pago.md). Orden de implementacion: ver [flujos-priorizados.md](flujos-priorizados.md).

## Usuario objetivo

- Jhon, conductor con papeletas en coactiva (25-45 anios): el vehiculo suele ser su herramienta de trabajo. Quiere saber cuanto debe HOY, cuanto ahorra pagando ya, evitar la captura del vehiculo o el embargo, frenar la coactiva si tiene causal valida, y pagar en cuotas si no puede de golpe.
- Tambien: comprador/vendedor de vehiculo usado que teme heredar o arrastrar papeletas.

## Precondiciones

- Placa del vehiculo para la consulta basica (sin login).
- Para ver montos individuales y estado de cuenta completo: autenticar (reserva tributaria).
- Para impugnar/fraccionar/suspender: tener los documentos del caso y la fecha de notificacion de la papeleta.

## Pasos reales hoy (as-is)

1. El ciudadano consulta papeletas por placa en la web (VirtualSAT/Websitev9), Agencia Virtual, WhatSAT, Alo SAT o Saldomatico.
2. El sistema lista las papeletas con codigo de infraccion (codigo M), descripcion, monto y fecha.
3. El ciudadano debe interpretar por su cuenta: en que tramo de descuento esta (debe contar dias habiles manualmente), si la infraccion es muy grave (sin descuento), y si ya entro en cobranza coactiva.
4. Segun su decision:
   - Pagar: con el descuento vigente (83% en 5 dias habiles; 67% en el tramo siguiente). El sistema aplica el descuento en la plataforma digital.
   - Impugnar: presentar descargo/recurso por Mesa de Partes Digital (plazo referencial 5 dias habiles) con medios probatorios.
   - Fraccionar: solicitar facilidades de pago si la deuda califica.
   - Registrar papeleta fisica que no aparece: acudir a cajas de agencia con copia/acta + declaracion jurada.
   - Suspender coactiva: presentar al Ejecutor Coactivo la causal tasada con su prueba.
5. Si esta en coactiva: se notifico la Resolucion de Ejecucion Coactiva (REC); pueden dictarse medidas cautelares (captura vehicular, retencion bancaria, internamiento en deposito). Para liberar el vehiculo internado: pagar deuda + costas en agencia/deposito.
6. Tramites como gravamen, registro de papeleta fisica y causales de suspension viven escondidos en FAQ o noticias (aid/...), no como rutas visibles.

## Informacion y requisitos

- Identificador: placa (consulta basica).
- Para registrar papeleta fisica: copia de la papeleta o acta de control + declaracion jurada.
- Para descargo/impugnacion: escrito + medios probatorios via Mesa de Partes Digital.
- Para fraccionar papeletas: deuda vencida del anio anterior, sin cuotas vencidas impagas, sin perdida de fraccionamientos similares en los ultimos 12 meses.
- Para suspender coactiva: acreditar causal (deuda extinguida/pagada, prescrita, en reclamacion/apelacion dentro de plazo, fraccionamiento aprobado, falta de notificacion, etc.).
- Cifras 2026 (leer de fuente versionada, no hardcodear): UIT = S/ 5,500. Leve 4% UIT = S/ 220; grave 8% UIT = S/ 440; muy grave 12% a 100% UIT = S/ 660 a S/ 5,500. Reincidencia en 12 meses = doble multa.
- Descuento: 83% hasta el 5to dia habil desde la notificacion (paga 17%); 67% en el tramo siguiente; muy graves codigo M sin descuento. En coactiva se pierde el descuento y se suman costas.
- Prescripcion: 4 anios, NO opera de oficio (debe solicitarla el ciudadano). Plazo de respuesta referencial 30 dias habiles.

## Fricciones (as-is)

- Jerga aterradora (cobranza coactiva, REC, medida cautelar, captura) sin traduccion.
- La ventana del descuento 83% (5 dias habiles) es corta y mal difundida; muchos pierden el ahorro por desconocer el plazo o por no saber contar dias habiles.
- El plazo del descuento de 83% suele coincidir con el plazo para impugnar (5 dias habiles): el ciudadano debe decidir rapido entre pagar barato o impugnar.
- Codigo M opaco: el ciudadano ve "M01" pero no entiende que hizo mal ni cuanto cuesta.
- Confusion masiva: cree que las papeletas se transfieren al vender el vehiculo (son personales, NO se transfieren, a diferencia del impuesto vehicular que sigue al vehiculo).
- Costas y gastos suben la deuda sin explicacion clara del estado o la etapa.
- Le capturan el auto sin saber en que deposito esta ni cuanto lo libera.
- La prescripcion no es automatica, pero el ciudadano cree que "se borra sola" a los 4 anios.
- Pitazo vive en el dominio heredado VirtualSAT, poco integrado y poco conocido.

## Oportunidades del chat (guia, pre-llena, deriva paso a paso)

- Consulta por placa + semaforo de estado embebido: al dia / vigente con descuento / en coactiva / con medida cautelar, con el monto a pagar HOY.
- Contador de dias habiles personalizado: "Te quedan 3 dias habiles para pagar con 83% de descuento; despues pagaras S/ X mas." Muestra la fecha limite exacta, excluyendo feriados peruanos.
- Diccionario conversacional de codigos: el usuario pega el codigo M y el chat responde la infraccion en palabras simples, la categoria y el monto en soles del anio vigente.
- Trade-off pagar vs impugnar: el chat fuerza una decision informada antes de que venzan ambos plazos.
- Aclaracion inmediata "las papeletas son tuyas, no del carro" cuando el usuario dice que vendio o va a comprar.
- Asistente coactiva: explica la etapa y la salida ("puedes frenarlo si...") antes que la amenaza; selector de causal de suspension que indica que prueba adjuntar.
- Localizador de vehiculo internado: "Ingresa tu placa y te digo si esta internado, en que deposito y el monto total para liberarlo" (deuda + costas + deposito).
- Flujo "mi papeleta fisica no aparece": guia el registro y permite subir foto de la papeleta/acta desde el chat.
- Generador guiado de escrito de descargo con checklist de pruebas segun el codigo.
- Deteccion proactiva de prescripcion: si una papeleta tiene mas de 4 anios, sugiere solicitarla y aclara que no es automatica.
- Activar Pitazo desde el chat (placa + celular + confirmacion por SMS) sin salir al modulo heredado.
- Simulador de fraccionamiento y pre-evaluador de elegibilidad antes de pedir documentos.
- Tono de aliado, no de cobrador: reduce la ansiedad explicando la etapa y la salida.

## CTA y componentes web

- CTA primario: "Consulta tus papeletas por placa".
- Componente "tarjeta de papeleta" con semaforo de estado, codigo traducido, monto HOY, ahorro y contador de dias habiles (con fecha limite exacta).
- Boton dual "Pagar con descuento" / "Impugnar" con explicacion del trade-off.
- Boton "Activar alertas Pitazo para esta placa".
- Flujo "Mi papeleta no aparece" con carga de foto.
- Localizador de deposito vehicular con mapa y monto de liberacion.
- Selector de causal de suspension de coactiva con checklist de prueba.
- Boton "Hablar con un asesor" para casos con efectos juridicos.
- Banner de seguridad: tramites gratis, no pagar a tramitadores que ofrecen "anular papeletas".

## Estados de error y alerta

- Sin papeletas: confirmacion positiva "No encontramos papeletas para esta placa hoy" + oferta de activar Pitazo.
- Carga: indicador de progreso; mensaje "Estoy revisando las papeletas de tu placa...".
- Error de servicio: degradacion con enlace a la consulta oficial por placa y opcion de reintentar.
- Papeleta sin descuento (muy grave codigo M): el chat lo dice explicitamente para no crear falsa expectativa.
- Descuento por vencer: alerta destacada con la fecha y hora limite y el monto que se perdera.
- En coactiva: explica que ya no hay descuento, que se suman costas, y cuales son las salidas (pagar, fraccionar, suspender con causal valida).
- Vehiculo internado: muestra el deposito, el monto total con costas y los documentos para el retiro; tono de aliado.
- Confusion al vender/comprar: aclara que las papeletas son personales del conductor y no se transfieren.
- Alerta anti-suplantacion / anti-tramitador: el SAT no cobra por anular papeletas; solo @sat.gob.pe es oficial.

## Fuente

- SAT - Papeletas Informacion Codigo de Transito: https://www.sat.gob.pe/websitev9/TributosMultas/Papeletas/InformacionCodigodeTransito
- SAT - Papeletas Preguntas Frecuentes: https://www.sat.gob.pe/websitev9/TributosMultas/Papeletas/PreguntasFrecuentes
- SAT - Conoce si debes una papeleta y accede a descuento de hasta 83% (aid/846): https://www.sat.gob.pe/WebSiteV9/Noticias/aid/846
- SAT - Mas de 19 mil vehiculos a depositos (aid/913): https://www.sat.gob.pe/WebSiteV9/Noticias/aid/913
- Gestion - 79,670 vehiculos con orden de captura por papeletas: https://gestion.pe/peru/sat-tiene-registrados-79670-vehiculos-con-ordenes-de-captura-por-papeletas-en-lima-nndc-noticia/
- Andina - Infracciones que cobra el SAT y sus valores: https://andina.pe/agencia/noticia-conoce-las-infracciones-transito-se-pagan-sat-lima-y-cuales-son-sus-valores-899503.aspx
- SAT - Pitazo preventivo: https://www.sat.gob.pe/VirtualSAT/modulos/pitazo/Default.aspx
- gob.pe - Solicitar prescripcion de papeleta: https://www.gob.pe/69564-solicitar-prescripcion-de-papeleta-por-infraccion-de-transito-en-la-municipalidad
- TUO Ley 26979 - Ejecucion Coactiva (Art. 16 y 31): https://cdn.gacetajuridica.com.pe/laley/Ley%20de%20Procedimiento%20de%20Ejecuci%C3%B3n%20Coactiva.pdf
- MEF/gob.pe - UIT 2026 (S/ 5,500): https://www.gob.pe/435-valor-de-la-uit-en-el-ano-2026

Pendiente de verificacion: tabla completa codigo M -> categoria -> %UIT -> soles (verificar contra Reglamento Nacional de Transito MTC/ATU/SUTRAN); porcentaje exacto del segundo tramo (67%) y posibles tramos intermedios; plazo legal exacto del descargo (referencia 5 dias habiles); tasa de interes y arancel de costas en coactiva; tarifas de internamiento/guardiania; plazo de respuesta de la solicitud de prescripcion (referencia 30 dias habiles); condiciones financieras del fraccionamiento de papeletas.
