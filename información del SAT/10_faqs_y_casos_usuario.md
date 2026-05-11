# 10. FAQs y casos de usuario

Este archivo resume preguntas frecuentes oficiales del SAT como casos de usuario. No reemplaza el contenido legal o tributario original; sirve como insumo para diseñar rutas, ayudas contextuales y microcopy.

## Predial y arbitrios

Fuente:

- https://www.sat.gob.pe/websitev9/TributosMultas/PredialyArbitrios/PreguntasFrecuentes

### Caso: adquiri un predio en el Cercado de Lima

Necesidad:

- Presentar declaracion jurada ante el SAT.
- Conocer el plazo: hasta el ultimo dia habil de febrero del año siguiente a la compra.
- Presentar documentos de identidad, sustento de adquisicion y acreditacion de domicilio fiscal.
- En caso de representante, acreditar poder.

Implicancia UX:

- Crear flujo "Compre un predio" con checklist de documentos.
- Mostrar diferencia entre persona natural, persona juridica y representante.
- Enlazar a Agencia Virtual y Mesa de Partes si aplica.

### Caso: quiero saber desde cuando pago

Resumen:

- El impuesto predial se genera desde el año siguiente a la compra.
- Los arbitrios se configuran desde el primer dia del mes siguiente a la compra.

Implicancia UX:

- Mostrar una calculadora simple de fecha de compra -> obligaciones aproximadas.

### Caso: modifique o amplie mi predio

Resumen:

- Debe declararse cuando las ampliaciones o modificaciones superan el umbral informado por el SAT.
- El plazo oficial indicado en FAQ es hasta el ultimo dia habil del mes siguiente de terminadas las obras.

Implicancia UX:

- Crear ruta "Actualice mi predio".
- Pedir ficha o informacion de fiscalizacion solo cuando corresponde.

## Impuesto vehicular

Fuente:

- https://www.sat.gob.pe/websitev9/TributosMultas/ImpuestoVehicular/PreguntasFrecuentes

### Caso: compre un vehiculo nuevo

Necesidad:

- Presentar declaracion jurada vehicular si el domicilio fiscal esta en Lima Metropolitana.
- Plazo indicado: hasta el ultimo dia habil de febrero del año siguiente a la adquisicion.
- Documentos frecuentes: identidad, tarjeta de propiedad, documento de compra o transferencia, recibo de servicio para domicilio y poder si actua representante.

Implicancia UX:

- Flujo "Compre un vehiculo" con opcion "lo compre en concesionaria afiliada" y "lo declaro yo".

### Caso: compre en concesionaria afiliada

Resumen:

- El SAT informa que concesionarias afiliadas pueden registrar la declaracion jurada vehicular mediante modulo de inscripcion.
- El usuario puede recibir SMS o correo si proporciono datos de contacto.

Implicancia UX:

- Crear pagina de verificacion de inscripcion por placa.
- Mostrar lista o buscador de concesionarias afiliadas si el enlace oficial esta disponible.

### Caso: vendi o transferi mi vehiculo

Resumen:

- El impuesto es anual y se configura al 1 de enero.
- La FAQ indica que el transferente debe revisar obligaciones del año de transferencia y, en ciertos casos, declaracion jurada de descargo.
- Tambien menciona simplificacion administrativa desde 2016 para transferencias comunicadas por el adquirente.

Implicancia UX:

- Crear asistente "Vendi mi vehiculo" con fecha de transferencia.
- Mostrar advertencia: deuda vehicular y papeletas tienen reglas distintas.

### Caso: no presente declaracion a tiempo

Resumen:

- La FAQ indica que puede corresponder multa tributaria.
- Existen porcentajes de rebaja segun momento de pago o notificacion.

Implicancia UX:

- Mostrar mensajes preventivos antes del vencimiento.
- Crear explicacion visual de descuentos/gradualidad.

## Alcabala

Fuente:

- https://www.sat.gob.pe/websitev9/TributosMultas/ImpuestoAlcabala/PreguntasFrecuentes

### Caso: compre o recibire un inmueble

Resumen:

- El impuesto de alcabala grava transferencias de inmuebles urbanos y rusticos, onerosas o gratuitas, segun la FAQ.
- El obligado al pago es el comprador o adquirente.
- El plazo indicado es hasta el ultimo dia habil del mes siguiente de producida la transferencia.
- El pago es requisito para formalizacion por escritura publica e inscripcion registral.

Implicancia UX:

- Flujo "Compre un inmueble" con calculo, liquidacion, pago y constancia.
- Incluir aviso para operaciones notariales y registrales.

### Caso: pague alcabala en municipalidad distrital

Resumen:

- La FAQ indica que, para Provincia de Lima, el SAT/Municipalidad Metropolitana de Lima es responsable de recaudar alcabala desde 2002.
- Un pago ante municipalidad distrital se considera pago indebido segun la FAQ y no extingue la deuda ante la MML.

Implicancia UX:

- Incluir alerta antes de pagar: "Para inmuebles en Provincia de Lima, verifica que el pago corresponda al SAT/MML".

### Caso: necesito liquidar y pagar

Documentos frecuentes segun FAQ:

- Documento de identidad.
- Documento que conste la transferencia de propiedad.
- Autovaluo del año de transferencia si el predio no esta en Cercado de Lima ni inscrito en SAT.
- Documentos especiales para primera venta, empresa constructora, bienes futuros u otros casos.

Implicancia UX:

- Checklist dinamico por tipo de transferencia.
- Opcion "liquidar en notaria afiliada" cuando corresponda.

## Papeletas e infracciones

Fuente:

- https://www.sat.gob.pe/websitev9/TributosMultas/Papeletas/PreguntasFrecuentes

### Caso: necesito gravamen por multas de transito

Resumen:

- Se obtiene en cajas de agencias SAT con numero de placa y pago por derecho de emision.

Implicancia UX:

- Incluir "solicitar gravamen" como tramite separado, no esconderlo dentro de FAQ.

### Caso: la papeleta no aparece en sistema

Resumen:

- La FAQ indica acudir a cajas de agencias SAT con copia de papeleta o acta de control, llenar declaracion jurada y pagar.
- Tambien remite a Agencia Virtual.

Implicancia UX:

- Crear flujo "Tengo papeleta fisica que no aparece".

### Caso: deuda en cobranza coactiva

Resumen:

- La ejecucion coactiva inicia con notificacion de Resolucion de Ejecucion Coactiva cuando la sancion queda firme.
- Si no se paga dentro del plazo indicado en la FAQ, pueden dictarse medidas cautelares como captura vehicular, retencion bancaria o inscripcion.

Implicancia UX:

- Crear estado de deuda con semaforo: pendiente, en plazo, en cobranza, medida cautelar.
- Explicar costos y costas antes del pago.

### Caso: quiero suspender cobranza coactiva

Causales citadas en FAQ:

- Deuda extinguida o cancelada.
- Deuda prescrita.
- Proceso contra persona distinta.
- Falta de notificacion del acto administrativo.
- Medio impugnatorio en tramite dentro de plazo.
- Convenio de liquidacion judicial o extrajudicial.
- Fraccionamiento concedido.
- Reestructuracion patrimonial.
- Mandato judicial o medida cautelar firme.

Implicancia UX:

- Convertir causales en formulario guiado de evaluacion previa.

### Caso: quiero fraccionar una papeleta

Resumen:

- La FAQ indica condiciones: deuda vencida del año anterior, no tener cuotas vencidas impagas de fraccionamientos de la misma naturaleza, y no haber perdido fraccionamientos similares en los ultimos 12 meses.
- Si existe reclamo o recurso en otro organo, se requiere desistimiento segun FAQ.

Implicancia UX:

- Crear preevaluador de fraccionamiento antes de pedir cita o documentos.

### Caso: vendi un vehiculo con papeletas

Resumen:

- La FAQ indica que las papeletas tienen naturaleza personal y no se transfieren al nuevo propietario.

Implicancia UX:

- Diferenciar en contenido: deuda vehicular del impuesto vs papeletas personales.

