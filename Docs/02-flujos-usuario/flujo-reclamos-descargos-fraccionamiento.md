# Flujo: Reclamos, descargos y fraccionamiento

Flujo del ciudadano que no esta de acuerdo con un cobro, quiere detener una cobranza o necesita pagar en cuotas: triaje entre Libro de Reclamaciones, recurso de reclamacion, apelacion y queja Art. 155; solicitudes no contenciosas (prescripcion, devolucion, compensacion); suspension de cobranza coactiva; y fraccionamiento. Cubre estado actual (as-is), fricciones y como el chat fijo desambigua los nombres casi identicos y calcula los plazos en dias habiles para que el ciudadano no pierda el derecho.

Vision general de tributos: ver [flujo-tributos-municipales.md](flujo-tributos-municipales.md). Consulta de cuanto debo: ver [flujo-consulta-deuda.md](flujo-consulta-deuda.md). Pago: ver [flujo-pago.md](flujo-pago.md). Caso papeletas (coactiva y captura): ver [flujo-papeletas-infracciones.md](flujo-papeletas-infracciones.md). Orden de implementacion: ver [flujos-priorizados.md](flujos-priorizados.md).

## Usuario objetivo

- Jhon, conductor con papeletas en coactiva: quiere frenar la cobranza con causal valida o fraccionar.
- Lucia / cualquier contribuyente que pago de mas o en lugar equivocado (pago indebido de alcabala) y quiere devolucion.
- Miguel, microempresario / persona juridica: impugna o fracciona multas y da seguimiento al expediente.
- Transversal: cualquier ciudadano que recibio una notificacion y no sabe si reclamar, quejarse o pagar.

## Precondiciones

- Tener el documento notificado (Resolucion de Determinacion, Orden de Pago, Resolucion de Multa, papeleta) y su fecha de notificacion (el plazo corre en dias habiles desde el dia siguiente).
- Para reclamar/apelar/quejar: escrito fundamentado y, segun el caso, medios probatorios. NO requiere firma de abogado.
- Para prescripcion: identificar concepto y anio exacto; un formato por concepto y por anio.
- Para suspender coactiva: una causal tasada con su prueba.
- Para fraccionar: deuda que califique, cuota inicial el mismo dia, datos de contacto y domicilio fiscal actualizados.
- "Mi deuda"/datos economicos individuales: autenticar por reserva tributaria. Ver [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).

## Pasos reales hoy (as-is)

### Triaje (que via me toca)
1. El ciudadano recibe una notificacion y debe distinguir, por su cuenta, entre tres tramites de nombre casi identico: Libro de Reclamaciones (mala atencion, NO discute deuda ni detiene plazos), recurso de reclamacion (discrepa del monto, ante el SAT) y queja Art. 155 (defecto de procedimiento, ante el Tribunal Fiscal).

### Recurso de reclamacion -> apelacion
2. Presenta el recurso de reclamacion por Mesa de Partes Digital (24/7) o presencial dentro de los 20 dias habiles; adjunta documentos en JPG/PDF (max 5MB). El SAT tiene hasta 9 meses para resolver.
3. Si el SAT rechaza (o no resuelve en 9 meses, silencio negativo), apela ante el SAT en 15 dias habiles; el SAT eleva el expediente al Tribunal Fiscal (hasta 12 meses).

### Solicitudes no contenciosas
4. Prescripcion: presenta un formato por concepto y anio por Mesa de Partes; no opera de oficio. Devolucion/compensacion: solicita por pago indebido o en exceso (p. ej. alcabala pagada en el distrito); plazo de resolucion 45 dias habiles.

### Suspension de cobranza coactiva
5. Si la deuda esta en coactiva, presenta al Ejecutor Coactivo la causal tasada con su prueba (deuda pagada/extinguida, prescrita, reclamacion/apelacion en plazo, fraccionamiento aprobado, falta de notificacion).

### Fraccionamiento
6. Solicita el fraccionamiento por la Agencia Virtual o presencial, paga la cuota inicial el mismo dia, y el SAT aprueba de forma automatica al cumplir el Reglamento; emite resolucion y plan de pagos.
7. Gran parte de la informacion vive fragmentada entre Websitev9, formatos en WebSiteV8, procedimientos genericos y noticias (aid/873).

## Informacion y requisitos

- Plazos del Codigo Tributario (TUO DS 133-2013-EF), en dias HABILES: reclamacion 20; apelacion 15; queja Art. 155 resuelve el Tribunal en 20; resolucion de reclamacion 9 meses; Tribunal Fiscal 12 meses; comiso/cierre/internamiento 5.
- Solicitudes no contenciosas (devolucion/compensacion): 45 dias habiles.
- Prescripcion: 4 anios con declaracion presentada, 6 sin declaracion (Art. 43-44 CT); interrumpible por notificaciones, pagos parciales o fraccionamientos; tramite ~30 dias segun formato SAT.
- Suspension de coactiva: causales del Art. 16 y 31 del TUO Ley 26979 (deuda municipal/no tributaria) y Art. 119 CT (tributaria).
- Fraccionamiento (Reglamento RJ 001-004-00004807; MAPRO SGCPR0057 v02, vigente 30/01/2026): plazo 2 a 36 meses; cuota mensual minima S/ 60 (S/ 30 para pensionista/adulto mayor con beneficio del predial); aprobacion automatica; suspende la coactiva y el plazo de prescripcion; garantia (carta fianza/hipoteca/garantia mobiliaria) cuando corresponda; requiere actualizar domicilio fiscal; no tener mas de 2 convenios tributarios vigentes ni adeudos del ejercicio en curso.
- Para Orden de Pago: por regla general pagar antes de reclamar, salvo circunstancias que evidencien improcedencia de la cobranza.
- Libro de Reclamaciones: respuesta de reclamos en 7 dias habiles, sugerencias 6 (DS 007-2020-PCM); NO suspende plazos.
- Todos los tramites son gratuitos. UIT 2026 = S/ 5,500 (los umbrales del fraccionamiento en % de UIT se recalculan con la UIT del anio).

## Fricciones (as-is)

- Confusion de nombres casi identicos: "reclamo" del Libro (mala atencion) vs "recurso de reclamacion" (discrepa del monto) vs "queja" Art. 155 (defecto de procedimiento). Usar el canal equivocado deja la deuda firme.
- No sabe contar dias habiles ni desde cuando corre el plazo: se pasa de los 20 dias y pierde el beneficio.
- Cree que necesita abogado (no es obligatorio).
- No distingue Orden de Pago (suele requerir pago previo) de Resolucion de Determinacion/Multa.
- No sabe que la apelacion se presenta ante el SAT (no directamente en el Tribunal Fiscal) ni que el silencio negativo a los 9 meses ya habilita apelar.
- Cree que la deuda "se borra sola" a los 4 anios; la prescripcion no es automatica y el plazo se interrumpe.
- Pago indebido de alcabala en el distrito: no sabe que debe pedir devolucion al distrito y pagar al SAT.
- Pide suspender la coactiva por motivos que no son causal tasada; no entiende que las costas suben mientras no se suspenda.
- No sabe que la cuota inicial del fraccionamiento se paga el MISMO dia, ni que acogerse implica ACEPTAR la deuda y cierra cualquier reclamo en tramite.
- Informacion fragmentada (Websitev9 / WebSiteV8 formatos / noticias aid/873): no hay una sola pagina "No estoy de acuerdo".

## Oportunidades del chat (guia, pre-llena, deriva paso a paso)

- Triaje central: ante "reclamo/queja", el chat pregunta el motivo y enruta a la via correcta (Libro de Reclamaciones / reclamacion / queja Art. 155), advirtiendo que el Libro NO detiene plazos ni discute deuda.
- Calculadora de plazos en dias habiles: ingresa la fecha de notificacion y el chat da la fecha limite exacta y cuantos dias quedan, excluyendo feriados peruanos; muestra fecha, no "dentro de N dias".
- Clasificador de documento: pregunta que recibio (Orden de Pago vs Resolucion) y explica si debe pagar antes de reclamar.
- Linea de tiempo del caso: notificacion -> reclamacion (20d) -> resolucion (9m) -> apelacion (15d) -> Tribunal Fiscal (12m); aviso de silencio negativo a los 9 meses.
- Generador guiado de escritos (reclamacion, descargo, prescripcion, suspension) con checklist de pruebas y recordatorio de que no necesita abogado; genera la cantidad correcta de formatos de prescripcion (uno por anio/concepto).
- Detector de pago indebido de alcabala con explicacion de la doble accion (devolucion en el distrito + pago al SAT) y de que la denegatoria es reclamable.
- Selector de causal de suspension de coactiva: lista las causales en lenguaje simple e indica que prueba adjuntar; atajo "si ya tramitas un fraccionamiento, su aprobacion suspende la coactiva".
- Pre-evaluador de elegibilidad de fraccionamiento + simulador de cuotas (2-36 meses, minimo S/ 60 / S/ 30) respetando reglas; avisa si tiene adeudos del ejercicio o ya 2 convenios vigentes.
- Advertencia clave antes de confirmar fraccionamiento: "acogerte implica aceptar la deuda y cerrar cualquier reclamo en tramite sobre ella"; recordatorio de cuota inicial el mismo dia y de las fechas mensuales.
- Modulo de intervencion excluyente de propiedad para terceros cuyo bien fue embargado por deuda ajena.
- Tono de aliado: explica la etapa y la salida antes que la amenaza; ofrece "hablar con un asesor" para actos con efectos juridicos.

## CTA y componentes web

- CTA primario por intencion: "No estoy de acuerdo con un cobro" (entra al triaje).
- Triaje de 3 vias (atencion / monto / procedimiento) que enruta sin que el usuario elija el nombre tecnico.
- Calculadora de plazos en dias habiles con fecha limite destacada.
- Generador de escrito guiado (reclamacion / descargo / prescripcion / suspension) con carga de adjuntos (JPG/PDF, max 5MB).
- Simulador de fraccionamiento (monto -> cuota inicial, numero de cuotas, cuota mensual) con disclaimer de estimacion.
- Selector de causal de suspension de coactiva con checklist de prueba.
- Seguimiento de expediente por numero.
- Boton "Hablar con un asesor" siempre visible para casos con efectos juridicos.
- Banner persistente de seguridad: tramites gratis, no pagar a tramitadores; solo @sat.gob.pe.

## Estados de error y alerta

- Plazo por vencer: alerta destacada con la fecha y hora limite y la consecuencia ("si no presentas hoy, la deuda queda firme").
- Canal equivocado: si el usuario quiere usar el Libro de Reclamaciones para discutir un monto, el chat lo redirige al recurso de reclamacion y advierte el riesgo de perder el plazo de 20 dias habiles.
- Causal de suspension invalida: el chat explica que la coactiva solo se suspende por causales tasadas y cuales aplican; pedirlo sin causal valida no funciona.
- Fraccionamiento que cierra reclamo: confirmacion explicita de que acogerse implica aceptar la deuda y dar por concluido el reclamo en tramite.
- Bloqueo de fraccionamiento: avisa si tiene adeudos del ejercicio en curso o ya 2 convenios tributarios vigentes.
- Carga / error de servicio: indicador de progreso y degradacion con enlaces a Mesa de Partes Digital y a los formatos oficiales; opcion de reintentar (formatos en WebSiteV8 pueden fallar).
- Requiere identidad: al mostrar deuda o estado de expediente individual, explica la reserva tributaria antes de autenticar.
- Pago indebido de alcabala: explica que el pago en el distrito no cuenta y como recuperar y pagar correctamente.
- Cifra/condicion no confirmada: marca como pendiente los % del fraccionamiento (umbral de deuda y garantia) y deriva al Reglamento/TUPA vigente; no presentar como fijo lo no verificado.
- Alerta anti-suplantacion / anti-tramitador: el SAT no cobra por "anular" ni "agilizar" tramites; solo @sat.gob.pe es oficial; denuncia a integridad@sat.gob.pe.

## Fuente

- SAT - Mesa de Partes Digital: https://www.sat.gob.pe/websitev9/Tramites/MesaPartesDigital
- SAT - Guia de usuario Mesa de Partes Digital: https://www.sat.gob.pe/MesaPartesDigital/guiausuario/
- SAT - Libro de Reclamaciones Virtual: https://www.sat.gob.pe/websitev9/Servicios/Defensoria/LibroReclamaciones
- SAT - Defensoria del Contribuyente Preguntas Frecuentes: https://www.sat.gob.pe/websitev9/Servicios/Defensoria/PreguntasFrecuentes
- SAT - MAPRO Fraccionamiento de Deuda SGCPR0057 v02 (vigente 30/01/2026): https://www.sat.gob.pe/TransparenciaV3/Portals/0/Docs/MAPRO/Procedimientos/SGCPR0057V2.pdf
- El Peruano - Reglamento de Fraccionamiento RJ 001-004-00004807: https://busquedas.elperuano.pe/normaslegales/aprueban-el-reglamento-de-fraccionamiento-de-deudas-tributa-resolucion-jefatural-no-001-004-00004807-2073876-1/
- SAT - Solicitud de Prescripcion de Deuda (formato/guia): https://www.sat.gob.pe/websitev8/Modulos/documentos/Formatos/GSAATDFO001V04_Guia.pdf
- SAT - Solicitud de Compensacion o Devolucion (guia): https://www.sat.gob.pe/websitev8/Modulos/documentos/Formatos/GIMFO001V03_Guia.pdf
- Codigo Tributario - Titulo III Procedimiento Contencioso (SUNAT): https://www.sunat.gob.pe/legislacion/codigo/libro3/titulo3.htm
- Codigo Tributario - Titulo II Cobranza Coactiva (SUNAT): https://www.sunat.gob.pe/legislacion/codigo/libro3/titulo2.htm
- TUO Ley 26979 - Ejecucion Coactiva (Art. 16 y 31): https://cdn.gacetajuridica.com.pe/laley/Ley%20de%20Procedimiento%20de%20Ejecuci%C3%B3n%20Coactiva.pdf
- gob.pe - Solicitar devolucion por pago indebido o en exceso: https://www.gob.pe/7920-solicitar-devolucion-de-impuestos-por-pago-indebido-o-en-exceso
- MEF/gob.pe - UIT 2026 (S/ 5,500): https://www.gob.pe/435-valor-de-la-uit-en-el-ano-2026

Pendiente de verificacion: % minimo de deuda para acceder al fraccionamiento (indicio 7% UIT) y umbral en UIT que obliga a garantia (indicio >35 UIT); TIM/interes de fraccionamiento; numero de cuotas vencidas que gatilla la perdida; plazo del Ejecutor para resolver la suspension (indicio 8 dias habiles); plazo de la solicitud de prescripcion (formato dice 30 dias vs 45 dias habiles del CT para no contenciosas); requisitos exactos del TUPA SAT (DS 164-2020-PCM) para reclamacion y suspension.
