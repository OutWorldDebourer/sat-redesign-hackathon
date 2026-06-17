# Flujo: Pago de obligaciones

Flujo de pago de cualquier obligacion tributaria (predial, arbitrios, vehicular, alcabala) o no tributaria (papeletas, multas administrativas, cuotas de fraccionamiento). Cubre estado actual (as-is), fricciones, y como el chat fijo guia el pago aplicando descuentos vigentes y advirtiendo pagos indebidos.

Paso previo (saber cuanto debo): ver [flujo-consulta-deuda.md](flujo-consulta-deuda.md). Caso papeletas con descuento por dias habiles: ver [flujo-papeletas-infracciones.md](flujo-papeletas-infracciones.md). Orden de implementacion: ver [flujos-priorizados.md](flujos-priorizados.md).

## Usuario objetivo

- Don Alberto (vecino del Cercado): paga predial y arbitrios al contado (febrero) o en 4 cuotas trimestrales.
- Carla (propietaria de vehiculo): paga impuesto vehicular al contado o en cuotas.
- Jhon (conductor con papeletas): paga la papeleta con el descuento vigente HOY.
- Lucia (compradora de inmueble): paga alcabala al SAT antes de la escritura, no en la municipalidad distrital.
- Miguel (persona juridica): paga multas administrativas con descuento por pronto pago.

## Precondiciones

- Conocer el monto y el identificador/codigo de la deuda (resultado de la consulta).
- Tener un medio de pago: tarjeta Visa/Mastercard/American Express/Diners, billetera (Yape/Plin) o acceso a banco/agente.
- Para alcabala: haber liquidado el impuesto antes de pagar.
- Para pagar con tarjeta: tarjeta habilitada por el banco para compras por internet.

## Pasos reales hoy (as-is)

1. Obtener el codigo/monto de la deuda mediante una consulta previa (modulo distinto al de pago).
2. Ir al motor de pago `sat.gob.pe/pagosenlinea` (sin login) e ingresar uno de los seis identificadores: DNI, RUC, placa, Doc. Deuda/Papeleta/Multa, Codigo Administrado o Compromiso de pago.
3. Ingresar datos de pago (tipo y numero de documento, correo, celular).
4. Confirmar el pago y elegir el tipo de tarjeta (Visa/Yape/Plin, Mastercard, American Express, Diners).
5. Recibir el "Resumen del pago" como comprobante.
6. Canales alternativos: billeteras Yape/Plin, bancos afiliados (BCP, BBVA, BanBif, Scotiabank, Interbank) via PagoMisCuentas/agentes, agencias SAT. El buscador de bancos/agentes vive en el modulo heredado WebSiteV8.
7. El pago con tarjeta puede tardar hasta 48 horas en reflejarse en el portal principal.

## Informacion y requisitos

- Identificador de la deuda (segun materia): placa para vehicular/papeletas; DNI/RUC/Codigo Administrado para predial/arbitrios; Doc. Deuda para deuda especifica; Compromiso de pago para cuotas de fraccionamiento.
- Medio de pago habilitado.
- Sin costo adicional por usar el canal web (verificar comisiones de terceros: pendiente de verificacion).
- Descuentos aplicables segun materia y campania (leer de fuente versionada, no hardcodear):
  - Papeletas: hasta 83% si se paga en los primeros 5 dias habiles desde la notificacion; 67% en el tramo siguiente; muy graves (codigo M) sin descuento por pronto pago.
  - Multas administrativas: indicio 50/30/10% en 15 dias habiles; campanias extraordinarias hasta 90% (pendiente de verificacion).
  - Predial al contado en febrero: posible descuento por pronto pago segun ordenanza (pendiente de verificacion).
- Calendario vehicular 2026 (verificado): 1ra cuota/anual 27-feb; 2da 29-may; 3ra 31-ago; 4ta 30-nov.
- Predial/arbitrios 2026: al contado/1ra cuota 27-feb; 2da 29-may; 3ra 31-ago; 4ta 30-nov.

## Fricciones (as-is)

- El motor de pago y la consulta de deuda son modulos distintos: el ciudadano debe saber de antemano que identificador y que sistema corresponde a su caso.
- No hay caja unica que autodetecte placa/DNI/codigo.
- El reflejo del pago tarda hasta 48 horas: critico para alcabala (requisito previo a escritura publica e inscripcion registral con plazo corto).
- Inconsistencia de nomenclatura: "Codigo Administrado" vs "codigo de contribuyente".
- El buscador de bancos/agentes vive en un sistema heredado (WebSiteV8) separado del flujo principal.
- Riesgo de pago indebido: pagar alcabala en la municipalidad distrital no extingue la deuda ante la MML.
- El "Resumen del pago" no es claramente una constancia formal sellada; genera dudas para tramites con plazo.
- El ciudadano no sabe si le conviene pagar al contado o en cuotas.

## Oportunidades del chat (guia, pre-llena, deriva paso a paso)

- Pago directo desde el chat: detecta la deuda y ofrece "Pagar con Yape/tarjeta ahora" sin reingresar datos.
- Caja unica: el chat pregunta "que vas a pagar?" y deriva al identificador correcto, autodetectando el formato.
- Aplica automaticamente el descuento vigente y muestra cuanto ahorra y el monto a pagar HOY.
- Contador de dias habiles para el descuento de papeletas: muestra la fecha limite exacta, no "en N dias", y excluye feriados peruanos.
- Comparador contado vs cuotas: muestra fechas de cada vencimiento y si hay descuento por pronto pago.
- Alerta anti-pago-indebido (alcabala): "Para inmuebles en la provincia de Lima la alcabala se paga al SAT/MML, NO en tu municipalidad distrital."
- Mapa/buscador de banco o agente mas cercano integrado, sin enviar al modulo heredado.
- Confirmacion y tranquilidad tras el pago: "Guarda tu Resumen del pago; puede tardar hasta 48h en reflejarse. Si es para tu escritura de alcabala, espera la confirmacion antes de ir a la notaria."
- Recordatorios proactivos de cada cuota (febrero, mayo, agosto, noviembre) con boton de pago directo.
- Banner de seguridad en todo flujo de pago: "Los tramites del SAT son gratis. No pagues a tramitadores."
- Etiqueta de estimacion: el monto del chat es orientativo; el oficial sale de la liquidacion autenticada.

## CTA y componentes web

- CTA primario: "Pagar ahora" tras la consulta de deuda.
- Selector de medio de pago: tarjeta, Yape/Plin, banco/agente.
- Componente "resumen de pago" con monto, descuento aplicado, ahorro y fecha limite.
- Comparador contado vs cuotas (tabla con fechas de vencimiento).
- Buscador de banco/agente con geolocalizacion.
- Banner persistente de tramites gratuitos + boton "Denunciar cobro indebido" (integridad@sat.gob.pe).
- Boton "Descargar Resumen del pago" y aviso de reflejo de hasta 48h.
- Boton "Hablar con un asesor" para casos con efectos juridicos (alcabala contra plazo notarial).

## Estados de error y alerta

- Carga: indicador de progreso durante la pasarela; mensaje "Procesando tu pago, no cierres esta ventana".
- Pago rechazado: mensaje claro ("Tu banco rechazo la operacion") con causas frecuentes (tarjeta no habilitada para compras por internet) y reintento.
- Error de pasarela: degradacion con enlaces oficiales y opcion de pagar por otro canal (banco/agente/Yape).
- Reflejo diferido: aviso explicito de hasta 48h y recomendacion de esperar confirmacion para tramites con plazo (alcabala).
- Pago indebido (alcabala en distrito): el chat explica que no extingue la deuda y guia la doble accion (devolucion en el distrito + pago al SAT).
- Alerta anti-suplantacion: confirma que el SAT solo usa @sat.gob.pe y www.sat.gob.pe / app.sat.gob.pe; nunca pide claves ni pagos por correo o redes.
- Monto cero / sin deuda: confirma que no hay nada que pagar hoy y ofrece activar Pitazo o recordatorios.

## Fuente

- SAT - Pagos en Linea (motor, 6 identificadores, reflejo 48h): https://www.sat.gob.pe/pagosenlinea/
- SAT - Pago en linea (ciudadano): https://www.sat.gob.pe/WebSiteV9/Inicio/ciudadano/p/pagosenlinea
- SAT - Formas y lugares de pago: https://www.sat.gob.pe/WebSiteV9/Inicio/AyudaPagos/FormasLugaresPago
- SAT - Buscador de bancos/agentes (WebSiteV8): http://www.sat.gob.pe/WebSiteV8/Modulos/Atencion/BuscarBancosv2.aspx
- gob.pe - Pagar deudas del SAT Lima via online: https://www.gob.pe/41552-pagar-deudas-del-sat-lima-via-online
- SAT - Descuento hasta 83% en papeletas (aid/846): https://www.sat.gob.pe/WebSiteV9/Noticias/aid/846
- SAT - Descuentos hasta 90% en multas administrativas (aid/1312): https://www.sat.gob.pe/WebSiteV9/Noticias/aid/1312
- SAT - Vencimientos Impuesto Vehicular: https://www.sat.gob.pe/websitev9/TributosMultas/ImpuestoVehicular/Vencimientos
- Gestion - Predial, vehicular y arbitrios vencen el 27 de febrero 2026: https://gestion.pe/peru/impuesto-vehicular-predial-y-arbitrios-vence-el-27-de-febrero-como-consultar-y-pagar-en-linea-noticia/

Pendiente de verificacion: comisiones por tarjeta/billetera; si Yape/Plin/banca tienen el mismo retraso de 48h; existencia de constancia oficial sellada (no solo "Resumen del pago") sin login; porcentajes y vigencia de descuentos de multas administrativas y de pronto pago en predial 2026.
