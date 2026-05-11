# 05. Consultas y pagos

## Consultas rapidas detectadas

Fuente base:

- https://www.sat.gob.pe/Websitev9

Consultas visibles o enlazadas desde el ecosistema SAT:

- Papeletas por placa.
- Impuesto vehicular por placa.
- Tributos por DNI/RUC.
- Consulta de expedientes.
- Consulta de compensaciones y devoluciones.
- Consulta de deuda tributaria y no tributaria en Agencia Virtual.
- Consulta de estados de cuenta.

Enlaces relevantes:

- https://www.sat.gob.pe/WebSiteV9/Inicio/ciudadano/ciudadano
- https://www.sat.gob.pe/websitev8/modulos/consultas/Buscador_Expedientesv2.aspx
- https://www.sat.gob.pe/websitev8/modulos/consultas/Buscador_ExpedientesTR.aspx

## Pago en linea

Fuente:

- https://www.sat.gob.pe/WebSiteV9/Inicio/ciudadano/p/pagosenlinea

Acceso critico para pagar tributos y papeletas. Durante la investigacion se detecto que el enlace puede depender de disponibilidad del servicio transaccional.

Recomendacion para rediseño:

- Mantener boton persistente "Pagar".
- Mostrar alternativas si el servicio no carga.
- Permitir iniciar por placa, DNI/RUC, codigo de pago, codigo de contribuyente o documento de deuda.

## Formas y lugares de pago

Fuente:

- https://www.sat.gob.pe/WebSiteV9/Inicio/AyudaPagos/FormasLugaresPago

La pagina informa medios de pago y lugares autorizados. Debe convertirse en un modulo filtrable.

Canales de pago detectados:

- Web SAT.
- Bancos.
- Agentes autorizados.
- Agencias SAT.
- Tarjetas.
- Efectivo.
- Cheques segun condiciones.
- Billeteras digitales indicadas en cartillas, como Yape.

Buscador de bancos/agentes:

- http://www.sat.gob.pe/WebSiteV8/Modulos/Atencion/BuscarBancosv2.aspx

## Identificadores de pago utiles

El sitio y cartillas mencionan distintos identificadores posibles:

- DNI.
- RUC.
- Placa.
- Codigo de pago.
- Codigo de contribuyente.
- Documento de deuda.

Recomendacion para rediseño:

- Crear una caja unica de busqueda/pago con selector de identificador.
- Explicar donde encontrar cada codigo.
- Evitar que el usuario tenga que saber de antemano que sistema corresponde a su caso.

## Casos prioritarios

### Pagar papeleta

Entrada sugerida:

1. Ingresar placa.
2. Ver papeletas pendientes.
3. Revisar descuento y plazo.
4. Pagar.
5. Descargar constancia.

### Pagar impuesto vehicular

Entrada sugerida:

1. Ingresar placa.
2. Ver deuda.
3. Elegir cuota o total.
4. Pagar.
5. Descargar constancia.

### Pagar predial/arbitrios

Entrada sugerida:

1. Ingresar DNI/RUC o codigo de contribuyente.
2. Ver deuda por periodo.
3. Elegir cuotas.
4. Pagar.
5. Descargar constancia.

### Pagar alcabala

Entrada sugerida:

1. Iniciar liquidacion.
2. Adjuntar documentos.
3. Obtener monto.
4. Pagar.
5. Descargar constancia.

