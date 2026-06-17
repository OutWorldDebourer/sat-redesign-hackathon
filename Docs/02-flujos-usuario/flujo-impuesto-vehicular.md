# Flujo: Impuesto vehicular (compre / vendi / me robaron)

Flujo del propietario de vehiculo ante el SAT de Lima: inscribir el vehiculo recien comprado, pagar el impuesto durante los 3 anios de afectacion, declarar el descargo al vender y la tasa 0% por robo. Cubre estado actual (as-is), fricciones y como el chat fijo resuelve la confusion masiva inscribir-vs-pagar y vehicular-vs-papeleta sin hardcodear el plazo en disputa.

Vision general de tributos: ver [flujo-tributos-municipales.md](flujo-tributos-municipales.md). Consulta de cuanto debo: ver [flujo-consulta-deuda.md](flujo-consulta-deuda.md). Pago: ver [flujo-pago.md](flujo-pago.md). Papeletas (distintas del impuesto): ver [flujo-papeletas-infracciones.md](flujo-papeletas-infracciones.md). Orden de implementacion: ver [flujos-priorizados.md](flujos-priorizados.md).

## Usuario objetivo

- Carla, propietaria de vehiculo (30-50 anios): compro un auto en los ultimos 3 anios y debe declararlo y pagar; quiere evitar la multa de ~S/ 2,575, saber cuantos de los 3 anios le quedan, pagar al contado o en cuotas y, al vender, dejar de figurar como deudora.
- Tambien: comprador que no sabe si la concesionaria ya registro la DJ; vendedor que cree que al vender deja de deber; victima de robo que sigue pagando por no declarar.

## Precondiciones

- Domicilio fiscal en Lima Metropolitana (obligacion en la provincia de Lima).
- Para inscribir: fecha de primera inscripcion en SUNARP y comprobante de compra.
- Para consultar "mi deuda" por placa: montos individuales requieren autenticar por reserva tributaria. Consulta general (que es, como se calcula): sin login. Ver [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).
- Para descargo (venta) o robo: documentos del caso (contrato de transferencia / denuncia policial).

## Pasos reales hoy (as-is)

1. Tras la compra, el ciudadano debe presentar la declaracion jurada de inscripcion. Tres vias: (a) la concesionaria afiliada la registra automaticamente; (b) la Agencia Virtual SAT (`app.sat.gob.pe/avisat`, 24h); (c) presencial en agencia.
2. La inscripcion es obligatoria aunque el pago recien empiece el anio siguiente. No declarar a tiempo genera multa por omision.
3. Para conocer cuanto debe, el ciudadano consulta por placa en la web o en la Agencia Virtual. El monto se calcula como 1% del valor (tabla referencial del MEF), con minimo de 1.5% UIT.
4. Paga al contado (hasta el ultimo dia habil de febrero) o en 4 cuotas trimestrales (febrero, mayo, agosto, noviembre) por web, banco, agente, agencia o Yape.
5. Al vender, debe presentar la declaracion jurada de descargo (hasta el ultimo dia habil del mes siguiente a la transferencia) y pagar el impuesto del anio de la venta.
6. Por robo, presenta una declaracion jurada con copia certificada de la denuncia para aplicar tasa 0% desde el ejercicio siguiente; si recupera el vehiculo, declara de nuevo.
7. El ecosistema esta fragmentado: la informacion vive en Websitev9, las DJ en app.sat.gob.pe; el ciudadano no sabe cual es el canal vigente.

## Informacion y requisitos

- Identificador de consulta: placa.
- Para inscribir (DJ de inscripcion): DNI o RUC; comprobante de compra / tarjeta de propiedad; carta poder notariada si actua un representante.
- Para descargo (venta): DNI; comprobante o contrato de transferencia; poder notariado si aplica.
- Para robo (tasa 0%): DNI; copia certificada de la denuncia policial; anotacion del robo en el registro vehicular.
- Cifras 2026 (leer de fuente versionada, NO hardcodear; mostrar con el anio):
  - UIT 2026 = S/ 5,500 (DS 301-2025-EF).
  - Tasa: 1% de la base imponible (valor de adquisicion, no menor a la tabla referencial anual del MEF).
  - Pago minimo: 1.5% UIT = S/ 82.50 en 2026.
  - Afectacion: 3 anios desde el anio siguiente a la primera inscripcion en SUNARP. Al 4to anio ya no se paga.
  - Interes moratorio: 1% mensual sobre la deuda vencida.
- Vehiculos afectos: automoviles, camionetas, station wagons, camiones, buses y omnibuses (las motos NO estan afectas a este impuesto).
- Vencimiento principal 2026 reportado: 27 de febrero (anual o 1ra cuota); 2da 29-may; 3ra 31-ago; 4ta 30-nov.

## Fricciones (as-is)

- Confusion masiva inscribir-vs-pagar: el ciudadano cree que pagar en la concesionaria ya cumple la inscripcion, o que debe pagar de inmediato (el pago empieza el anio siguiente).
- No sabe si la concesionaria ya registro la DJ, y asume que si: cae en omision y multa.
- Confusion vehicular-vs-papeleta: cree que la papeleta sigue al vehiculo (es personal del conductor) o que el impuesto no lo sigue (si lo sigue al propietario del anio).
- El vendedor cree que al vender deja de deber sin presentar la DJ de descargo: el SAT le sigue cobrando.
- No entiende la regla de los 3 anios ni que se cuentan desde la inscripcion en SUNARP, no desde la factura.
- No sabe que el calculo usa el valor de tabla del MEF (no lo que pago) ni que existe un monto minimo.
- Discrepancia de fuentes en el plazo de la DJ de inscripcion (ver Estados de error): el chat debe leer el dato verificado, no hardcodearlo.

## Oportunidades del chat (guia, pre-llena, deriva paso a paso)

- Asistente "Compre un vehiculo": pregunta la fecha de compra/inscripcion y responde exactamente "debes inscribir antes del [fecha] y empezar a pagar en [anio]"; detecta persona natural vs juridica y muestra requisitos distintos.
- Verificador de inscripcion: "ingresa tu placa y te digo si ya estas inscrito en el SAT" (evita la doble declaracion o la omision por asumir que la concesionaria ya lo hizo).
- Calculadora del impuesto: ingresa placa o modelo+anio y devuelve el monto estimado del anio vigente, explicando "se calcula sobre el valor de tabla del MEF" y avisando del minimo (S/ 82.50 en 2026); etiqueta de estimacion.
- Calculadora de la regla de 3 anios: ingresa el anio de primera inscripcion y muestra los anios exactos en que paga y cuando deja de pagar.
- Asistente "Vendi mi vehiculo": guia la DJ de descargo, advierte que debe pagar el impuesto del anio de venta y aclara que las papeletas son personales y no se transfieren.
- Asistente "Me robaron el vehiculo": checklist de denuncia + DJ para tasa 0% y aviso de volver a declarar si lo recupera.
- Recordatorios proactivos de cada cuota trimestral y del cierre de la afectacion ("tu vehiculo ya cumplio 3 anios, deja de estar afecto").
- Lectura del plazo de la DJ desde fuente unica verificada (no hardcodear) por la discrepancia de fuentes vigente.
- Buscador de concesionarias afiliadas y aclaracion de que la fecha que cuenta es la de SUNARP.

## CTA y componentes web

- CTA primario: "Consulta tu impuesto vehicular por placa".
- Tarjetas por evento de vida: "Compre un vehiculo", "Vendi mi vehiculo", "Me robaron el vehiculo".
- Calculadora embebida (placa o modelo+anio) con disclaimer de estimacion y enlace a la liquidacion oficial.
- Visualizador de la regla de 3 anios (linea de tiempo: inscripcion -> anios de pago -> fin de afectacion).
- Selector persona natural / juridica que ajusta el checklist de requisitos.
- Boton "Comparar contado vs 4 cuotas" con fechas de vencimiento.
- Boton "Activar alertas de vencimiento".
- Boton "Hablar con un asesor" para casos con efectos juridicos (omision, descargo en disputa).
- Banner persistente de seguridad: tramites gratis, solo @sat.gob.pe y www.sat.gob.pe.

## Estados de error y alerta

- Sin deuda: "No encontramos impuesto vehicular pendiente para esta placa hoy" + oferta de recordatorios.
- Carga: indicador de progreso con mensaje "Estoy revisando el impuesto de tu placa...".
- Error de servicio: degradacion con enlace a la consulta oficial por placa y a la Agencia Virtual; opcion de reintentar (paginas heredadas pueden fallar).
- Requiere identidad: al pedir el monto individual exacto, explica la reserva tributaria antes de derivar a autenticacion.
- Plazo de DJ en disputa: el chat muestra el plazo desde la fuente verificada y advierte que esta confirmandose; NUNCA presenta como fijo un dato no verificado. Mostrar fecha limite exacta, no "dentro de N dias".
- Riesgo de omision: si la compra fue el anio anterior y no figura inscripcion, alerta del plazo y de la multa estimada.
- Confusion vehicular vs papeleta: aclara que el impuesto sigue al propietario del anio y la papeleta es personal del conductor.
- Alerta anti-suplantacion / anti-tramitador: el SAT no cobra por declarar ni inscribir; solo @sat.gob.pe es oficial.

## Fuente

- SAT - Impuesto Vehicular Informacion: https://www.sat.gob.pe/websitev9/TributosMultas/ImpuestoVehicular/Informacion
- SAT - Impuesto Vehicular y robo vehicular: https://www.sat.gob.pe/websitev9/TributosMultas/ImpuestoVehicular/Informacion/ImpuestoVehicularRoboVehicular
- SAT - Vencimientos Impuesto Vehicular: https://www.sat.gob.pe/websitev9/TributosMultas/ImpuestoVehicular/Vencimientos
- MEF - Impuesto al Patrimonio Vehicular 2026: https://www.mef.gob.pe/index.php?option=com_content&view=article&id=8660&Itemid=100242&lang=es
- gob.pe - Pagar el impuesto vehicular: https://www.gob.pe/22057-pagar-el-impuesto-vehicular
- gob.pe/munilima - SAT: como presentar tu declaracion de impuesto vehicular de manera virtual: https://www.gob.pe/institucion/munilima/noticias/527729-sat-de-lima-conoce-como-presentar-tu-declaracion-de-impuesto-vehicular-de-manera-virtual
- Radio Nacional - declara tu vehiculo y evita multa de S/ 2,575: https://www.radionacional.gob.pe/noticias/locales/declara-tu-vehiculo-ante-el-sat-de-lima-y-evita-una-multa-de-hasta-s2-575
- RPP/SAT - Impuesto vehicular 2026 (tasa, base, vencimiento 27 feb): https://rpp.pe/economia/economia/impuesto-vehicular-2026-hoy-vence-el-plazo-para-170000-autos-en-lima-como-y-donde-pagarlo-sat-noticia-1677805
- MEF/gob.pe - UIT 2026 (S/ 5,500): https://www.gob.pe/435-valor-de-la-uit-en-el-ano-2026

Pendiente de verificacion: plazo exacto de la DJ de inscripcion (corpus dice "ultimo dia habil de febrero del anio siguiente"; Escuela SAT/gob.pe mencionan "30 dias calendario desde la compra" - confirmar fuente primaria SAT); plazo de la DJ por robo para tasa 0% ("120 dias calendario" vs "ultimo dia habil del ejercicio siguiente"); monto exacto de la multa por omision (S/ 2,575 = 50% UIT 2025 vs S/ 2,750 = 50% UIT 2026 - validar tabla de multas vigente); numero exacto de la RM del MEF con la tabla de valores referenciales 2026.
