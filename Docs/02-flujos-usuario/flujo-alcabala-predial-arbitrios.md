# Flujo: Alcabala, predial y arbitrios (eventos de inmueble)

Flujo del ciudadano alrededor de un inmueble del Cercado / provincia de Lima: pagar la alcabala al comprar, declarar y pagar el predial y los arbitrios cada anio, y solicitar la deduccion de 50 UIT si es adulto mayor o pensionista. Cubre estado actual (as-is), fricciones y como el chat fijo corrige los errores costosos (pago indebido de alcabala en el distrito, creer que paga el vendedor, confundir predial con arbitrios, pagar predial de mas sin el beneficio).

Vision general de tributos: ver [flujo-tributos-municipales.md](flujo-tributos-municipales.md). Consulta de cuanto debo: ver [flujo-consulta-deuda.md](flujo-consulta-deuda.md). Pago: ver [flujo-pago.md](flujo-pago.md). Orden de implementacion: ver [flujos-priorizados.md](flujos-priorizados.md).

## Usuario objetivo

- Lucia, compradora de inmueble (30-55 anios): debe liquidar y pagar la alcabala antes de la escritura e inscripcion en SUNARP; cree que la paga el vendedor y desconoce el tramo inafecto de 10 UIT.
- Don Alberto, vecino del Cercado (45-65 anios): paga predial y arbitrios cada anio; no distingue uno de otro ni entiende por que suben.
- Senora Rosa, adulta mayor / pensionista (60+): podria dejar de pagar de mas usando la deduccion de 50 UIT, pero no sabe que existe ni que no es automatica.

## Precondiciones

- Inmueble ubicado en la provincia de Lima (alcabala) y, para predial/arbitrios, en el Cercado de Lima. Fuera del Cercado, predial/arbitrios corresponden a la municipalidad distrital.
- Alcabala: tener la minuta/documento de transferencia y el autovaluo del anio.
- Predial/arbitrios: codigo de contribuyente o DNI para consultar; documentos de adquisicion para declarar.
- Deduccion 50 UIT: cumplir requisitos (60+ o pensionista, predio unico-vivienda, ingreso <= 1 UIT/mes).
- "Mi deuda" (montos individuales): autenticar por reserva tributaria. Ver [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).

## Pasos reales hoy (as-is)

### Alcabala (al comprar)
1. El comprador solicita la liquidacion de alcabala en la Agencia Virtual SAT, en una agencia, o por una notaria afiliada al SAT (que liquida y cobra en el acto). Tambien existe el correo `alcabalaenlinea@sat.gob.pe`.
2. La base imponible es el mayor entre el valor de transferencia y el autovaluo ajustado por el IPM; se descuentan las primeras 10 UIT (tramo inafecto) y se aplica 3% sobre el exceso.
3. Paga hasta el ultimo dia habil del mes siguiente a la transferencia. El pago (o constancia de inafectacion) es requisito previo para la escritura publica y la inscripcion en SUNARP.
4. Conserva el comprobante para la notaria/SUNARP; el reflejo del pago con tarjeta puede tardar hasta 48h.

### Predial y arbitrios (cada anio)
5. Al adquirir, presenta la declaracion jurada predial hasta el ultimo dia habil de febrero del anio siguiente. El predial nace el anio siguiente a la compra; los arbitrios desde el 1er dia del mes siguiente.
6. Consulta el monto en el Cuadernillo Tributario / estado de cuenta o por DNI/codigo de contribuyente.
7. Paga al contado (27-feb-2026) o en 4 cuotas trimestrales (27-feb, 29-may, 31-ago, 30-nov de 2026).

### Deduccion 50 UIT (pensionista / adulto mayor)
8. Verifica requisitos, reune documentos y presenta la solicitud ante el SAT (formato de pensionista / adulto mayor no pensionista) en agencia o Mesa de Partes. No es automatica.

## Informacion y requisitos

- Identificadores: alcabala -> liquidacion (minuta/autovaluo); predial/arbitrios -> DNI/RUC o codigo de contribuyente.
- Alcabala documentos: DNI del adquirente; copia simple del documento de transferencia (minuta/contrato/testimonio); copia del autovaluo del anio si el predio no esta inscrito en el SAT; en primera venta de constructor, acreditar la condicion.
- Predial documentos (nuevo propietario): DNI; sustento de adquisicion (minuta/escritura); acreditacion de domicilio fiscal; poder si actua representante.
- Deduccion 50 UIT requisitos: 60+ o pensionista; predio unico destinado a vivienda; ingreso bruto <= 1 UIT/mes; documentacion que acredite la condicion.
- Cifras 2026 (leer de fuente versionada, NO hardcodear; mostrar con el anio):
  - UIT 2026 = S/ 5,500 (DS 301-2025-EF).
  - Alcabala: 3% sobre el exceso de 10 UIT; tramo inafecto = S/ 55,000.
  - Predial: progresivo 0.2% (hasta 15 UIT = S/ 82,500) / 0.6% (15-60 UIT, hasta S/ 330,000) / 1% (sobre S/ 330,000); minimo 0.6% UIT = S/ 33.
  - Arbitrios: tasas por Ordenanza 2793 (2026); no es un % unico (dependen de uso, area, zona, frecuencia).
  - Deduccion 50 UIT = S/ 275,000 (NO el S/ 220,000 desactualizado); aplica SOLO al predial, no a los arbitrios.
- Inafectaciones de alcabala: anticipo de legitima; transferencias por causa de muerte; division/particion entre copropietarios originarios; resolucion del contrato antes de pagar el precio; primera venta del constructor (salvo la parte del terreno).

## Fricciones (as-is)

- Alcabala - pago indebido distrital: pagar en la municipalidad distrital no extingue la deuda con el SAT/MML; sigue debiendo y debe pedir devolucion al distrito.
- Cree que la alcabala la paga el vendedor: la paga el comprador.
- Desconoce el tramo inafecto de 10 UIT y cree que paga 3% sobre todo el valor.
- Descubre la alcabala recien en la notaria, contra el plazo; no sabe que sin alcabala pagada el notario no eleva la escritura ni SUNARP inscribe.
- El reflejo del pago tarda hasta 48h y la cita notarial tiene plazo.
- Confunde predial (impuesto) con arbitrios (servicios) y no entiende por que paga ambos ni por que suben.
- No entiende la escala progresiva acumulativa ni el autovaluo.
- Cree que el SAT cobra predial en todos los distritos (solo Cercado).
- Coincidencia del 27-feb (predial+arbitrios+vehicular) genera confusion de obligaciones.
- Deduccion 50 UIT: muchos la desconocen y siguen pagando de mas; creen que es automatica o que exonera los arbitrios; circula la cifra desactualizada S/ 220,000.
- Brecha digital del adulto mayor frente a un ecosistema de 4 dominios y autenticacion.

## Oportunidades del chat (guia, pre-llena, deriva paso a paso)

- Asistente "Compre un inmueble": detecta el tipo de operacion (compraventa, donacion, anticipo de legitima, herencia, primera venta de constructor) y dice si esta afecta o inafecta.
- Alerta anti-pago-indebido fuerte ANTES de pagar: "para inmuebles en la provincia de Lima la alcabala se paga al SAT/MML, no en la municipalidad distrital".
- Calculadora de alcabala: pide valor de transferencia y autovaluo, toma el mayor, resta 10 UIT y aplica 3%, mostrando cada cifra; etiqueta de estimacion y derivacion a la liquidacion oficial.
- Aclaracion inmediata "la alcabala la paga el comprador" cuando el usuario dice "vendi mi inmueble".
- Recordatorio del plazo (mes siguiente) y aviso "antes de ir a la notaria, liquida y espera la confirmacion del pago (hasta 48h)".
- Flujo "compre un depa nuevo a constructora": explica la inafectacion parcial y estima alcabala solo sobre el terreno.
- Explicador "predial vs arbitrios" en lenguaje simple, con ejemplos; descomposicion del predial por tramos ("por que pago esto").
- Verificador de jurisdiccion del predio ("esta en el Cercado de Lima?") antes de iniciar predial/arbitrios.
- Pre-evaluador de la deduccion 50 UIT en 4 preguntas ("tienes 60+? es tu unica casa? vives ahi? tu ingreso mensual es menor a S/ 5,500?") con calculadora de ahorro y aviso de que NO es automatica ni exonera arbitrios.
- Recordatorios proactivos de las 4 cuotas trimestrales y de la DJ predial.
- Lenguaje extra-claro y accesible para el perfil adulto mayor; lectura desde fuente unica versionada (corrige S/ 220,000 -> S/ 275,000).

## CTA y componentes web

- Tarjetas por evento de vida: "Compre un inmueble", "Vivo en el Cercado (predial y arbitrios)", "Soy adulto mayor / pensionista".
- Calculadora de alcabala embebida con desglose paso a paso y disclaimer de estimacion.
- Calculadora de predial por tramos con comparativa anio anterior.
- Pre-evaluador de elegibilidad 50 UIT (4 preguntas) + calculadora de ahorro.
- Selector de tipo de operacion de alcabala (compraventa / donacion / anticipo de legitima / herencia / constructora) que ajusta afectacion y documentos.
- Boton "Liquidar alcabala" (3 rutas: online, presencial, notaria afiliada).
- Boton "Comparar contado vs 4 cuotas" y "Agregar vencimientos a mi calendario".
- Boton "Hablar con un asesor" para actos con efectos juridicos.
- Banner persistente de seguridad y anti-pago-indebido.

## Estados de error y alerta

- Vacio (sin deuda predial/arbitrios): "No encontramos deuda a tu nombre hoy" + recordatorios. No dejar pantalla muerta.
- Carga: indicador de progreso con mensaje "Estoy revisando tu informacion...".
- Error de servicio: degradacion con enlaces oficiales y reintento (la liquidacion vive en app.sat.gob.pe; enlaces heredados pueden fallar).
- Jurisdiccion incorrecta: si el predio no es del Cercado, deriva a la municipalidad distrital (predial/arbitrios); la alcabala sigue siendo del SAT si el inmueble esta en la provincia de Lima.
- Pago indebido detectado: si el usuario dice que pago alcabala en el distrito, explica que es pago indebido y la doble accion (devolucion en el distrito + pago al SAT).
- Operacion inafecta: si el caso parece inafecto (herencia, anticipo de legitima), avisa que no se paga pero ofrece tramitar la constancia de inafectacion para la notaria/SUNARP.
- Reflejo de pago pendiente: "si es para tu escritura de alcabala, espera la confirmacion (hasta 48h) antes de ir a la notaria".
- Beneficio 50 UIT mal entendido: aclara que solo reduce el predial, no los arbitrios, y que hay que solicitarlo.
- Requiere identidad: al pedir el monto individual, explica la reserva tributaria.
- Alerta anti-suplantacion / anti-tramitador: tramites gratis; solo @sat.gob.pe y www.sat.gob.pe son oficiales.

## Fuente

- SAT - Impuesto Alcabala Informacion: https://www.sat.gob.pe/websitev9/TributosMultas/ImpuestoAlcabala/Informacion
- SAT - Impuesto Alcabala Preguntas Frecuentes: https://www.sat.gob.pe/websitev9/TributosMultas/ImpuestoAlcabala/PreguntasFrecuentes
- El Peruano - liquidar y pagar alcabala en notarias afiliadas: https://www.elperuano.pe/noticia/160470-sat-contribuyentes-pueden-liquidar-y-pagar-el-impuesto-de-alcabala-en-notarias-afiliadas
- SAT - Predial y Arbitrios Informacion: https://www.sat.gob.pe/WebSiteV9/TributosMultas/PredialyArbitrios/Informacion
- SAT - Predial y Arbitrios Vencimientos: https://www.sat.gob.pe/websitev9/TributosMultas/PredialyArbitrios/Vencimientos
- SAT - Ordenanza 2793 (arbitrios 2026): https://www.sat.gob.pe/websitev9/Portals/0/Docs/TributosMultas/PredialyArbitrios/Legislacion/Ordenanza%202793.pdf
- SAT - Beneficios pensionistas y adultos mayores (aid/679): https://www.sat.gob.pe/WebSiteV9/Noticias/aid/679
- gob.pe - Beneficio al impuesto predial para adultos mayores: https://www.gob.pe/705-beneficio-al-impuesto-predial-para-adultos-mayores
- Gestion - Predial, vehicular y arbitrios vencen el 27 de febrero 2026: https://gestion.pe/peru/impuesto-vehicular-predial-y-arbitrios-vence-el-27-de-febrero-como-consultar-y-pagar-en-linea-noticia/
- Infobae - Exoneracion predial adulto mayor 2026 (50 UIT = S/ 275,000): https://www.infobae.com/peru/2026/01/07/exoneracion-del-impuesto-predial-para-adultos-mayores-de-60-anos-como-se-solicita-y-cual-es-el-monto-actualizado-en-2026/
- MEF/gob.pe - UIT 2026 (S/ 5,500): https://www.gob.pe/435-valor-de-la-uit-en-el-ano-2026

Pendiente de verificacion: tarifas exactas de arbitrios 2026 por categoria de predio (Ordenanza 2793); vencimientos 2026 al contado y por cuotas (confirmados por prensa, pagina oficial no cargo); costo y plazo del tramite de beneficio 50 UIT en el TUPA; si la deduccion de adulto mayor (60+) y la de pensionista son el mismo beneficio o coexisten; canal exacto (SAT/MML) y documentos vigentes 2026 del beneficio; existencia de descuento por pronto pago del predial al contado 2026; procedimiento y plazo de devolucion de pago indebido de alcabala; buscador oficial de notarias afiliadas.
