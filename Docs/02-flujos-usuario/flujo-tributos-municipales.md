# Flujo: Tributos municipales (vision general)

Vision general de los cuatro tributos que administra el SAT de Lima (predial, arbitrios, vehicular, alcabala): que son, como se relacionan, quien paga cada uno, con que identificador se consultan y como el chat fijo los desambigua. Es el mapa mental que evita las confusiones #1 del dominio (predial vs arbitrios, vehicular vs papeletas, alcabala la paga el comprador y al SAT). Sirve de paraguas a los flujos detallados.

Flujos detallados: vehicular en [flujo-impuesto-vehicular.md](flujo-impuesto-vehicular.md); alcabala/predial/arbitrios en [flujo-alcabala-predial-arbitrios.md](flujo-alcabala-predial-arbitrios.md); consulta de cuanto debo en [flujo-consulta-deuda.md](flujo-consulta-deuda.md); pago en [flujo-pago.md](flujo-pago.md). Orden de implementacion: ver [flujos-priorizados.md](flujos-priorizados.md).

## Usuario objetivo

- Don Alberto (vecino del Cercado): no distingue predial (impuesto) de arbitrios (servicios) y no entiende por que paga ambos.
- Carla (propietaria de vehiculo): confunde impuesto vehicular (sigue al vehiculo) con papeletas (personales).
- Lucia (compradora de inmueble): descubre la alcabala recien en la notaria y cree que la paga el vendedor.
- Senora Rosa (adulta mayor / pensionista): paga predial de mas por desconocer la deduccion de 50 UIT.
- Transversal: cualquier ciudadano que llega sin saber que tributo le corresponde ni por que.

## Precondiciones

- Saber (o que el chat detecte) sobre que bien o evento de vida consulta: predio, vehiculo, compra de inmueble.
- Identificador segun la materia (ver tabla de Informacion y requisitos).
- Consulta general de "que es / como se calcula": sin login. Consulta de "cuanto debo" (montos individuales): requiere autenticar por reserva tributaria (art. 85 Codigo Tributario). Ver [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).
- Jurisdiccion: el SAT administra predial y arbitrios SOLO del Cercado de Lima; vehicular para obligados de la provincia de Lima; alcabala para inmuebles de la provincia de Lima.

## Pasos reales hoy (as-is)

1. El ciudadano entra a `www.sat.gob.pe` y se enfrenta a menus que se superponen (Tramites, Servicios, Consultas, Pagos) organizados por estructura institucional, no por intencion.
2. Debe deducir por su cuenta a que materia pertenece su caso y en que dominio tecnico vive (Websitev9 informativo, WebsiteV8 heredado, VirtualSAT, app.sat.gob.pe Agencia Virtual).
3. Entra al modulo de la materia (Predial y Arbitrios / Impuesto Vehicular / Impuesto Alcabala) para leer informacion general.
4. Para consultar su monto, repite la consulta en cada modulo con el identificador correcto (DNI/codigo para predial-arbitrios; placa para vehicular; liquidacion para alcabala). No hay vista consolidada de los cuatro tributos.
5. Para declarar, liquidar o pagar, salta a la Agencia Virtual autenticada (registro con aprobacion diferida) o a `pagosenlinea`.
6. La informacion clave (vencimientos, tramos, beneficios) a veces vive enterrada en noticias (aid/...) en vez de paginas permanentes.

## Informacion y requisitos

Los cuatro tributos comparados (cifras 2026 de referencia; leer de fuente unica versionada, NO hardcodear; mostrar siempre con el anio):

| Tributo | Que grava | Quien paga | Periodicidad | Identificador | Tasa / dato clave 2026 |
|---|---|---|---|---|---|
| Predial | Valor del predio (autovaluo) en el Cercado de Lima | Propietario al 1 de enero | Anual | DNI/RUC o codigo de contribuyente | Progresiva acumulativa 0.2% (hasta 15 UIT) / 0.6% (15-60 UIT) / 1% (sobre 60 UIT); minimo 0.6% UIT = S/ 33 |
| Arbitrios | Servicios: limpieza publica + parques y jardines + serenazgo | Propietario/poseedor del predio del Cercado | Anual, en 4 cuotas trimestrales | DNI/RUC o codigo de contribuyente | Tasas por ordenanza anual (Ordenanza 2793 para 2026); no es un % unico |
| Vehicular | Propiedad del vehiculo en sus primeros 3 anios | Propietario al 1 de enero (provincia de Lima) | Anual, 3 anios | Placa | 1% del valor; minimo 1.5% UIT = S/ 82.50 |
| Alcabala | Transferencia de un inmueble en la provincia de Lima | Comprador / adquirente | Una sola vez por transferencia | Liquidacion (minuta/autovaluo) | 3% sobre el exceso de 10 UIT; tramo inafecto S/ 55,000 |

- UIT 2026 = S/ 5,500 (DS 301-2025-EF). Todo umbral en soles cambia con la UIT cada anio.
- Predial y arbitrios se pagan juntos pero son tributos DISTINTOS con reglas y fechas propias.
- El predial nace el anio SIGUIENTE a la compra; los arbitrios desde el 1er dia del mes siguiente a la compra.
- Deduccion de 50 UIT (S/ 275,000 en 2026) para pensionista/adulto mayor: aplica SOLO al predial, no a los arbitrios; no es automatica.

## Fricciones (as-is)

- Confusion predial vs arbitrios: se pagan juntos y el ciudadano no entiende por que paga ambos ni por que suben.
- Confusion vehicular vs papeletas: el impuesto vehicular sigue al vehiculo; la papeleta es personal del conductor (no se transfiere al vender).
- Confusion alcabala: muchos creen que la paga el vendedor; la paga el comprador, y al SAT (no a la municipalidad distrital).
- Jurisdiccion opaca: ciudadanos de otros distritos llegan al SAT por predial/arbitrios que no le corresponden.
- Multiples identificadores (DNI/RUC/placa/codigo/liquidacion) sin guia de cual usar para cada tributo.
- Arquitectura por institucion, no por intencion: 5 dominios tecnicos y menus que se solapan.
- Cifras volatiles (UIT, tramos, tarifas de arbitrios, tabla MEF vehicular) dispersas y a veces desactualizadas.
- Coincidencia de vencimiento 27-feb-2026 para predial, arbitrios y vehicular: alto riesgo de confundir obligaciones.

## Oportunidades del chat (guia, pre-llena, deriva paso a paso)

- Enrutamiento por intencion y evento de vida: "compre un predio / compre un vehiculo / compre un inmueble" abre el flujo correcto y oculta los dominios tecnicos.
- Desambiguador de entrada para las tres confusiones clave (predial vs arbitrios; vehicular vs papeletas; alcabala comprador-y-al-SAT), traduciendo la jerga en linea.
- Auto-deteccion de identificador: reconoce placa, DNI o RUC y pide solo el correcto, una pregunta a la vez.
- Verificador de jurisdiccion antes de cualquier flujo de predial/arbitrios: "tu predio esta en el Cercado de Lima?".
- Vista consolidada (tras autenticar) de predial+arbitrios+vehicular+papeletas+multas, superando al Saldomatico fisico.
- Calculadoras parametrizadas por anio: predial por tramos, vehicular (1% con minimo), alcabala (3% sobre exceso de 10 UIT); etiquetadas como estimacion y derivando a la liquidacion oficial.
- Detector de beneficio 50 UIT para pensionista/adulto mayor, aclarando que solo reduce el predial, no los arbitrios.
- Recordatorios proactivos de vencimientos, separando el mensaje por tributo para no confundir el 27-feb.
- Lectura de cifras desde fuente unica versionada: nunca presentar como fijo lo que cambia por anio (UIT, tramos, tarifas).

## CTA y componentes web

- Chips de intencion en home: "Pagar", "Consultar mi deuda", "Compre algo", "Me multaron", "Reclamar".
- Tarjetas por evento de vida: "Compre/Vendi un vehiculo", "Compre un inmueble", "Soy adulto mayor / pensionista".
- Tabla comparativa accesible "Que tributo me toca?" con identificador y quien paga.
- Caja unica de consulta con auto-deteccion de identificador.
- Calculadora embebida por tributo con disclaimer de estimacion.
- Banner persistente de seguridad: "Los tramites del SAT son gratis. No pagues a tramitadores. El SAT solo usa @sat.gob.pe y www.sat.gob.pe."
- Boton "Hablar con un asesor" para actos con efectos juridicos.

## Estados de error y alerta

- Vacio (sin deuda): "No encontramos deuda a tu nombre hoy" + accion sugerida (recordatorios, Pitazo). No dejar pantalla muerta.
- Carga: indicador de progreso con mensaje "Estoy revisando tu informacion..." y timeout visible.
- Error de servicio: degradacion clara con enlaces oficiales de respaldo y opcion de reintentar (los enlaces heredados WebSiteV8/VirtualSAT pueden fallar).
- Jurisdiccion incorrecta: si el predio no es del Cercado, deriva a la municipalidad distrital correspondiente.
- Requiere identidad: al pedir "mi deuda" sin login, explica la reserva tributaria antes de derivar a autenticacion.
- Confusion de materia: si el ciudadano mezcla papeleta con vehicular, o predial con arbitrios, el chat lo aclara antes de continuar.
- Cifra volatil: toda cifra se muestra con su anio de referencia y etiqueta de estimacion; deriva a la liquidacion oficial.
- Alerta anti-suplantacion: solo @sat.gob.pe y www.sat.gob.pe / app.sat.gob.pe son oficiales; el SAT nunca pide claves ni pagos por correo o redes.

## Fuente

- SAT - Acerca del SAT (materias y alcance): https://www.sat.gob.pe/WebSiteV9/SobreelSAT/QuienesSomos/AcercadelSAT
- SAT - Predial y Arbitrios Informacion: https://www.sat.gob.pe/websitev9/TributosMultas/PredialyArbitrios/Informacion
- SAT - Impuesto Vehicular Informacion: https://www.sat.gob.pe/websitev9/TributosMultas/ImpuestoVehicular/Informacion
- SAT - Impuesto Alcabala Informacion: https://www.sat.gob.pe/websitev9/TributosMultas/ImpuestoAlcabala/Informacion
- SAT - Ordenanza 2793 (arbitrios 2026): https://www.sat.gob.pe/websitev9/Portals/0/Docs/TributosMultas/PredialyArbitrios/Legislacion/Ordenanza%202793.pdf
- MEF/gob.pe - UIT 2026 (S/ 5,500): https://www.gob.pe/435-valor-de-la-uit-en-el-ano-2026
- Infobae - Exoneracion predial adulto mayor 2026 (50 UIT = S/ 275,000): https://www.infobae.com/peru/2026/01/07/exoneracion-del-impuesto-predial-para-adultos-mayores-de-60-anos-como-se-solicita-y-cual-es-el-monto-actualizado-en-2026/
- TUO Codigo Tributario art. 85 (reserva tributaria): https://diariooficial.elperuano.pe/Normas/obtenerDocumento?idNorma=90009

Pendiente de verificacion: tarifas exactas de arbitrios 2026 por categoria de predio (Ordenanza 2793); vencimientos 2026 de predial/arbitrios al contado y por cuotas (confirmados por prensa ~27-28 feb, pagina oficial de vencimientos no cargo); si la deduccion de adulto mayor (60+) y la de pensionista son el mismo beneficio o coexisten; descuento por pronto pago del predial al contado 2026 en el Cercado.
