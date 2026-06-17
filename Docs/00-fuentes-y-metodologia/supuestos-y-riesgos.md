# Supuestos, riesgos y pendientes de verificacion

Consolidado de supuestos, riesgos transversales y datos pendientes de verificacion de toda la investigacion. Es la lista maestra de cifras y plazos que NO deben presentarse como fijos sin revalidar.

## Principio rector

- Toda cifra (UIT, tramos, tasas, vencimientos, horarios, montos de multas, % de descuento) es volatil por anio fiscal o por campania. Se centraliza en una fuente unica versionada por anio; el chat la lee y la muestra con su anio de referencia. NUNCA se hardcodea en texto.
- El chat marca todo monto como estimacion orientativa y deriva a la liquidacion oficial autenticada. No emite actos con efectos juridicos ni montos vinculantes.

## Supuestos de trabajo

- Supuesto: el chat fijo reemplaza la navegacion fragmentada como punto de entrada principal; abstrae los 5 dominios tecnicos (Websitev9, WebsiteV8, VirtualSAT, app.sat.gob.pe, transparenciav3).
- Supuesto: el proveedor LLM sera DeepSeek con el modelo `deepseek-v4-flash`; los alias legacy se deprecan el 2026-07-24 y no se usan.
- Supuesto (INFERIDO): muchos contribuyentes de otros distritos llegan al SAT por error creyendo que cobra predial/arbitrios fuera del Cercado.
- Supuesto (INFERIDO): el perfil adulto mayor/pensionista tiene la mayor brecha digital y de accesibilidad; el flujo debe ser extra-claro y accesible.
- Supuesto (INFERIDO): el tramite presencial es dificil para personas con movilidad reducida; priorizar rutas en linea o a domicilio.
- Supuesto: las consultas rapidas por placa/DNI sin login podrian exponer deuda de terceros (riesgo de reserva tributaria); se asume que deben restringirse o autenticarse.

## Cifras y tasas pendientes de verificacion

| Tema | Dato en duda | Estado | Accion |
|---|---|---|---|
| UIT | S/ 5,500 (2026, DS 301-2025-EF) | verified | Leer de fuente versionada; recalcular cada enero |
| Multa por omision de DJ vehicular | Notas citan S/ 2,575 (50% UIT 2025); con UIT 2026 seria S/ 2,750 | Pendiente de verificacion | Validar contra tabla de multas vigente 2026 |
| Tabla de multas de transito por codigo | Mapeo M01/M17... -> %UIT -> soles de terceros | Pendiente de verificacion | Confirmar en Reglamento Nacional de Transito (MTC/ATU/SUTRAN) y legislacion SAT |
| Descuento papeletas 83% | 83% en 5 dias habiles desde notificacion | partial (mejor sustentado) | Revalidar en ordenanza/FAQ oficial |
| Segundo tramo de descuento papeletas | 67% en tramo posterior; posible tramo intermedio | Pendiente de verificacion | Confirmar % y plazos exactos en norma SAT |
| Infracciones muy graves (codigo M) | Sin descuento por pronto pago | partial | Confirmar excepcion en norma |
| Descuentos multas administrativas | Indicio 50/30/10% en 15 dias habiles; campanas hasta 90-95% | Pendiente de verificacion | Confirmar contra Ordenanza 2200-MML y campania activa |
| Tarifas arbitrios 2026 Cercado | Por categoria de predio (Ordenanza 2793) | Pendiente de verificacion | Leer PDF de la Ordenanza; no hay cifras unitarias |
| Descuento por pronto pago predial al contado | Rango 5-8% generico de municipalidades | Pendiente de verificacion | Confirmar si el SAT aplica beneficio 2026 y su % |
| Tasas juegos y espectaculos | No verificadas en fuente SAT | unverified | Confirmar en Ley de Tributacion Municipal y SAT |

## Plazos pendientes de verificacion

| Tema | Discrepancia | Estado | Accion |
|---|---|---|---|
| DJ vehicular de inscripcion | "Ultimo dia habil de febrero del anio siguiente" (MEF/munilima/SAT) vs "30 dias calendario desde la compra" (gob.pe/Escuela SAT) | Pendiente de verificacion | Confirmar en FAQ primaria del SAT; el chat lee el dato, no lo fija |
| DJ vehicular por robo (tasa 0%) | "120 dias calendario" (America TV) vs "ultimo dia habil del ejercicio siguiente" | Pendiente de verificacion | Confirmar en pagina oficial ImpuestoVehicularRoboVehicular |
| Prescripcion - plazo de respuesta SAT | Formato dice 30 dias vs 45 dias habiles para no contenciosas (Codigo Tributario) | Pendiente de verificacion | Confirmar en TUPA del SAT |
| Suspension de coactiva - plazo del Ejecutor | Indicio 8 dias habiles | Pendiente de verificacion | Confirmar en fuente oficial SAT |
| Vencimientos predial/arbitrios 2026 | Contado/1ra cuota ~27-28 feb (prensa) | partial | Confirmar en pagina oficial de Vencimientos (no cargo) |
| Recursos tributarios municipales | Plazos por acto (reclamacion 20, apelacion 15, queja 20 dias habiles) | verified (Codigo Tributario) | Confirmar variantes por acto en TUPA SAT |

Nota de vencimientos confirmados por prensa para 2026: vehicular 1ra cuota/contado 27-feb; 2da 29-may; 3ra 31-ago; 4ta 30-nov. Predial/arbitrios contado ~27-28 feb. Revalidar en fuente oficial.

## Condiciones de fraccionamiento pendientes

- Verificado (MAPRO SGCPR0057 v02, vigente 30/01/2026): plazo 2 a 36 meses; cuota minima S/ 60 (S/ 30 para pensionista/adulto mayor con beneficio del predial); aprobacion automatica; suspende la cobranza coactiva; no mas de 2 convenios tributarios vigentes ni adeudos del ejercicio en curso.
- Pendiente de verificacion: % minimo de deuda para acceder (indicio 7% UIT); umbral de garantia (indicio mayor a 35 UIT); TIM/interes de fraccionamiento; numero de cuotas vencidas que gatillan la perdida. El MAPRO remite al Reglamento RJ 001-004-00004807, que no fue fetchable.

## Riesgos de arquitectura y enlaces

- Ecosistema fragmentado: el portal expone 5 dominios tecnicos (Websitev9, WebsiteV8, VirtualSAT, app.sat.gob.pe, transparenciav3) organizados por institucion, no por intencion. El chat debe colapsarlos a Pagar/Consultar/Declarar/Reclamar/Ayuda y por evento de vida.
- Enlaces heredados fragiles: modulos en WebSiteV8 (buscador de bancos, tramites TUPA) y VirtualSAT (Pitazo) pueden romper o redirigir. Auditar y migrar antes del lanzamiento; el chat debe apuntar a destinos verificados.
- Informacion critica enterrada en noticias (aid/NNN): fraccionamiento (aid/873) y descuentos (aid/760, aid/799, aid/846, aid/1312) viven en noticias temporales. Migrar a paginas permanentes versionadas.
- Paginas oficiales con acceso intermitente: vencimientos, FAQ y canales bloquearon el fetch automatizado (cierre de socket / HTTP 418/403). Revalidar manualmente.
- Duplicidad estructural de canales: ruta vigente /WebSiteV9/CanalesAtencion/ vs ruta heredada /Contactenos/AgenciasSAT/. Unificar a una sola arquitectura.

## Riesgos de canales y contacto (revalidar cada anio)

- Numeros WhatSAT: el corpus lista 1 numero (999431111); gob.pe lista 6 numeros con turnos manana/tarde. Centralizar en fuente unica y reconfirmar asignacion de turnos.
- Horarios inconsistentes: Alo SAT (corpus L-V 8-17, Sab 9-13 vs anuncios de horario ampliado/nocturno); Chat SAT (L-V 8-17 vs L-V 8-20, Sab 8-14). Confirmar cartilla vigente.
- Sedes y depositos: direcciones de los 4 depositos vehiculares provienen de un agregador; confirmar en fuente oficial. Revalidar horarios y vigencia de cada agencia (Camana, Argentina, Plaza Camacho, SJM, MAC Lima Norte).
- Citas: dos numeros de WhatsApp para citas (956213510 / 956212913) vs uno en el corpus; confirmar en nota oficial.
- Pendiente de verificacion: si WhatSAT/Alo SAT permiten pagos o solo consultas.

## Confusiones recurrentes que el chat debe desactivar

- Predial (impuesto anual) vs arbitrios (tasas por servicios): reglas y fechas distintas.
- Impuesto vehicular (sigue al vehiculo) vs papeletas (personales, no se transfieren al vender).
- Inscribir vs pagar el vehiculo: inscripcion inmediata; el pago empieza el anio siguiente.
- Alcabala: la paga el COMPRADOR y al SAT/MML (no en la municipalidad distrital = pago indebido).
- Reclamo (Libro de Reclamaciones, mala atencion) vs recurso de reclamacion tributaria (discrepa del monto, 20 dias habiles) vs queja Art. 155 (defecto de procedimiento). Nombres casi iguales, tramites distintos.
- SAT Lima (transito en Lima Metropolitana) vs SUTRAN (carreteras).
- Dias habiles vs dias calendario: el chat cuenta dias habiles por el usuario y muestra la fecha limite exacta.

## Riesgos legales y de privacidad

- Reserva tributaria (art. 85 Codigo Tributario): nunca mostrar deuda o datos economicos individuales sin autenticar identidad. Consultas por placa/DNI sin login no deben exponer deuda de terceros.
- Ley 29733 y DS 016-2024-JUS: aviso de privacidad antes de pedir datos; minimizar PII; designar DPO; notificar brechas a la ANPD en 48h; informar sobre decisiones automatizadas.
- Pendiente de verificacion: si el SAT tiene Politica de Privacidad accesible, DPO designado y bancos de datos en el RNPD (no verificable publicamente en la sesion).
- Decisiones automatizadas: el chat se identifica como asistente automatizado, no emite montos vinculantes y ofrece salida humana para actos con efectos juridicos.
- Proveedor LLM con infraestructura en China (DeepSeek): para datos de ciudadanos peruanos, minimizar/anonimizar PII y revisar retencion del proveedor antes de produccion.

## Riesgos de accesibilidad

- Accesibilidad obligatoria para portales del Estado (DL 1412 / DS 029-2021-PCM; RM 126-2009-PCM cita WCAG 2.0 nivel A obligatorio).
- Pendiente de verificacion: version/NTP de WCAG exigible al SAT. Recomendable apuntar a WCAG 2.1 AA.
- El widget de chat debe ser operable por teclado, compatible con lectores de pantalla y con anuncios ARIA; los widgets de terceros suelen fallar accesibilidad por defecto.

## Riesgos de seguridad ciudadana (anti-fraude)

- Suplantacion por correo: correo FALSO `info@correo.sunat.gob.pe` con nombre "SAT-LIMA". Solo `@sat.gob.pe` es oficial.
- Dominios oficiales: `www.sat.gob.pe` y `app.sat.gob.pe`. El chat debe ofrecer un verificador anti-suplantacion (pegar URL/correo/numero y confirmar si es oficial).
- Falsos tramitadores: todos los tramites son gratuitos; banner persistente en todo flujo de pago y boton de denuncia a `integridad@sat.gob.pe`.

## Referencias

- Indice de fuentes y dominios oficiales: [fuentes-oficiales.md](fuentes-oficiales.md).
- Metodo y criterios de confianza: [metodologia-investigacion.md](metodologia-investigacion.md).
