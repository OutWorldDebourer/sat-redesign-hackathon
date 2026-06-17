# Backlog priorizado del rediseno del SAT de Lima

Backlog de epicas e historias de usuario del rediseno, priorizado con MoSCoW (Must / Should / Could / Won't-ahora). El chat fijo es el eje transversal: la epica E0 lo sostiene y casi toda historia lo consume. El orden refleja los flujos priorizados del brief.

Documentos relacionados: vision en [redisenio-vision-producto.md](redisenio-vision-producto.md), criterios de aceptacion en [criterios-de-aceptacion.md](criterios-de-aceptacion.md), validacion en [plan-validacion.md](plan-validacion.md). Flujos: [../02-flujos-usuario/flujos-priorizados.md](../02-flujos-usuario/flujos-priorizados.md).

## Leyenda

- **MoSCoW:** Must (imprescindible para el valor minimo), Should (alto valor, no bloquea el lanzamiento), Could (deseable si hay capacidad), Won't (fuera del alcance de esta version).
- **Fase:** ventana de implementacion sugerida (ver vision). Fase 1 nucleo, Fase 2 eventos de vida, Fase 3 retencion/proteccion, Fase 4 cola larga.
- Las historias siguen el formato "Como [persona] quiero [accion] para [beneficio]".

## Mapa de epicas

| Epica | Nombre | Eje | Fase principal |
|-------|--------|-----|----------------|
| E0 | Chat fijo y plataforma conversacional | Transversal | 1 |
| E1 | Infraestructura de datos y calculo | Habilitador | 1 |
| E2 | Consulta consolidada de deuda | Flujo #1 | 1 |
| E3 | Pago con descuento | Flujo #1 | 1 |
| E4 | Papeletas: semaforo, descuento y rutas | Flujo #2 | 1 |
| E5 | Eventos de vida: inmueble (alcabala) | Flujo #3 | 2 |
| E6 | Eventos de vida: vehiculo (DJ inscripcion/descargo) | Flujo #4 | 2 |
| E7 | Beneficios: deduccion 50 UIT | Flujo #5 | 2 |
| E8 | Triaje de reclamos y recursos | Flujo #6 | 2 |
| E9 | Alertas, recordatorios y Pitazo | Flujo #7 | 3 |
| E10 | Onboarding a la Agencia Virtual y deep-links | Flujo #8 | 3 |
| E11 | Fraccionamiento: simulador y elegibilidad | Flujo #9 | 3 |
| E12 | Proteccion: anti-suplantacion y tramites gratuitos | Flujo #10 | 1-3 |
| E13 | Persona juridica: vista por RUC | Flujo #11 | 4 |
| E14 | Juegos y espectaculos: derivacion | Flujo #12 | 4 |
| E15 | Accesibilidad, privacidad y cumplimiento | Transversal | 1-3 |

---

## E0 - Chat fijo y plataforma conversacional (eje transversal)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E0-1 | Como ciudadano quiero ver un chat siempre visible y no invasivo en toda la web para iniciar cualquier tramite sin buscar en menus | Must | 1 |
| E0-2 | Como ciudadano quiero que el chat me pregunte "que necesitas hacer?" y me enrute a Pagar/Consultar/Declarar/Reclamar/Ayuda para no tener que conocer los modulos tecnicos | Must | 1 |
| E0-3 | Como ciudadano quiero que el chat detecte un evento de vida ("compre", "vendi", "me multaron") y abra el flujo correcto | Must | 1 |
| E0-4 | Como ciudadano quiero que el chat traduzca jerga en linea (coactiva, autovaluo, inafecto, REC) para entender lo que leo | Must | 1 |
| E0-5 | Como ciudadano quiero estados claros de vacio, carga y error en el chat para saber siempre que esta pasando | Must | 1 |
| E0-6 | Como ciudadano quiero un boton "Hablar con un asesor" siempre visible para casos con efectos juridicos | Must | 1 |
| E0-7 | Como SAT quiero que el chat use `deepseek-v4-flash` leyendo la clave de `DEEPSEEK_API_KEY` con streaming y function calling para respuestas rapidas y acciones | Must | 1 |
| E0-8 | Como ciudadano quiero minimizar/reabrir el chat conservando el contexto de mi conversacion para no repetir datos | Should | 1 |
| E0-9 | Como SAT quiero degradacion elegante (si el LLM falla, ofrecer rutas estaticas verificadas) para no dejar al ciudadano sin salida | Should | 1 |
| E0-10 | Como SAT quiero prompt caching del system prompt y catalogo de tramites para bajar costo y latencia a alto volumen | Should | 1 |

Especificacion en [../04-chat-ia/propuesta-chat-fijo.md](../04-chat-ia/propuesta-chat-fijo.md) e [../04-chat-ia/intenciones-y-prompts-del-chat.md](../04-chat-ia/intenciones-y-prompts-del-chat.md).

## E1 - Infraestructura de datos y calculo (habilitador)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E1-1 | Como SAT quiero una fuente unica versionada por anio fiscal (UIT, tramos, tasas, vencimientos) para que ninguna cifra se hardcodee y se muestre siempre con su anio | Must | 1 |
| E1-2 | Como ciudadano quiero una calculadora de dias habiles que excluya feriados peruanos para conocer mi fecha limite exacta | Must | 1 |
| E1-3 | Como ciudadano quiero un detector de identificador (placa/DNI/RUC/codigo) para no tener que elegir el tipo manualmente | Must | 1 |
| E1-4 | Como ciudadano quiero conversores y calculadoras parametrizadas (predial por tramos, alcabala, vehicular) que lean la UIT del anio para obtener estimaciones correctas | Must | 1 |
| E1-5 | Como SAT quiero timeouts, reintentos con backoff y circuit breaker en toda llamada externa para sostener alto volumen sin caidas | Must | 1 |

## E2 - Consulta consolidada de deuda (flujo #1)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E2-1 | Como ciudadano quiero una caja unica donde el chat me pida solo el identificador correcto para consultar sin saber cual usar | Must | 1 |
| E2-2 | Como ciudadano quiero verificar mi jurisdiccion ("tu predio esta en el Cercado de Lima?") antes de continuar para no perder tiempo si no me corresponde el SAT | Must | 1 |
| E2-3 | Como ciudadano autenticado quiero una vista consolidada de toda mi deuda (predial+arbitrios+vehicular+papeletas+multas) para verla en un solo lugar, superando al Saldomatico | Must | 1 |
| E2-4 | Como ciudadano quiero un semaforo de estado (al dia / por vencer / en coactiva / con medida cautelar) para entender mi situacion de un vistazo | Must | 1 |
| E2-5 | Como SAT quiero exigir autenticacion antes de mostrar montos individuales para cumplir la reserva tributaria (Art. 85 CT) | Must | 1 |
| E2-6 | Como ciudadano quiero distinguir consulta general (sin login) de "mi deuda" (con login) y entender por que se pide iniciar sesion | Must | 1 |

Detalle en [../02-flujos-usuario/flujo-consulta-deuda.md](../02-flujos-usuario/flujo-consulta-deuda.md).

## E3 - Pago con descuento (flujo #1)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E3-1 | Como ciudadano quiero pagar desde el flujo (tarjeta/Yape/Plin/banco) sin reingresar el identificador para reducir friccion | Must | 1 |
| E3-2 | Como ciudadano quiero ver el descuento vigente aplicado y cuanto ahorro pagando hoy para decidir con un numero concreto | Must | 1 |
| E3-3 | Como ciudadano quiero un resumen/comprobante tras pagar con aviso de que puede tardar hasta 48h en reflejarse para no preocuparme | Must | 1 |
| E3-4 | Como ciudadano que paga alcabala quiero un aviso de esperar la confirmacion antes de ir a la notaria para no detener mi escritura | Should | 1 |
| E3-5 | Como ciudadano quiero un buscador de banco/agente cercano integrado para pagar por el canal que prefiero | Could | 3 |

Detalle en [../02-flujos-usuario/flujo-pago.md](../02-flujos-usuario/flujo-pago.md).

## E4 - Papeletas: semaforo, descuento y rutas (flujo #2)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E4-1 | Como conductor quiero consultar papeletas por placa y ver un semaforo de estado con el monto a pagar HOY para saber mi situacion sin jerga | Must | 1 |
| E4-2 | Como conductor quiero un contador de dias habiles del descuento ("te quedan X dias para el 83%; despues pagaras S/ Y mas") para no perder el ahorro | Must | 1 |
| E4-3 | Como conductor quiero que el chat me explique la diferencia entre papeleta (personal), impuesto vehicular y multa administrativa para no confundirme | Must | 1 |
| E4-4 | Como conductor en coactiva quiero entender mi etapa, las costas y las causales de suspension en lenguaje claro antes que la amenaza para reducir mi ansiedad | Must | 1 |
| E4-5 | Como conductor quiero rutas claras pagar/impugnar/fraccionar/suspender coactiva desde el resultado para actuar sin buscar | Must | 1 |
| E4-6 | Como conductor quiero localizar mi vehiculo internado (deposito y monto de liberacion) por placa para recuperarlo sin llamadas | Should | 2 |
| E4-7 | Como conductor quiero subir foto de una papeleta fisica que no aparece en el sistema para registrarla y pagar a tiempo | Should | 2 |
| E4-8 | Como conductor quiero un diccionario de codigo de infraccion ("que hice mal" y "cuanto cuesta") para entender mi multa | Could | 2 |

Detalle en [../02-flujos-usuario/flujo-papeletas-infracciones.md](../02-flujos-usuario/flujo-papeletas-infracciones.md). El monto por codigo se lee de fuente verificada; no se hardcodea (ver riesgos).

## E5 - Eventos de vida: inmueble / alcabala (flujo #3)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E5-1 | Como compradora de inmueble quiero una calculadora de alcabala (3% sobre el exceso de 10 UIT) que lea la UIT del anio para saber cuanto pago realmente | Must | 2 |
| E5-2 | Como compradora quiero una alerta anti-pago-indebido (al SAT/MML, no a la municipalidad distrital) antes de pagar para no perder el dinero | Must | 2 |
| E5-3 | Como compradora quiero conocer el plazo (mes siguiente) y que la alcabala es requisito para la escritura/SUNARP para no detener mi tramite | Must | 2 |
| E5-4 | Como compradora quiero que el chat aclare que la alcabala la paga el comprador, no el vendedor, para no equivocarme | Must | 2 |
| E5-5 | Como compradora quiero que el chat detecte casos inafectos (herencia, anticipo de legitima, primera venta de constructor) y me avise antes de pagar | Should | 2 |
| E5-6 | Como compradora quiero un checklist de documentos por tipo de transferencia para liquidar sin regresar otro dia | Should | 2 |

## E6 - Eventos de vida: vehiculo (flujo #4)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E6-1 | Como propietaria de vehiculo quiero un asistente "compre un vehiculo" que distinga inscribir (inmediato) de pagar (anio siguiente) para evitar la multa de ~S/ 2,575 | Must | 2 |
| E6-2 | Como vendedora quiero un asistente "vendi mi vehiculo" que guie la DJ de descargo y advierta que las papeletas no se transfieren para dejar de figurar como deudora | Must | 2 |
| E6-3 | Como propietaria quiero saber cuantos de los 3 anios de afectacion me quedan ingresando el anio de inscripcion SUNARP | Should | 2 |
| E6-4 | Como propietaria quiero verificar por placa si mi concesionaria ya registro la DJ para no declarar dos veces ni quedar omisa | Should | 2 |
| E6-5 | Como victima de robo quiero un flujo "me robaron el vehiculo" que guie la DJ para tasa 0% | Could | 3 |

El plazo de la DJ se lee del dato verificado; no se hardcodea (ver riesgos).

## E7 - Beneficios: deduccion 50 UIT (flujo #5)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E7-1 | Como adulta mayor/pensionista quiero un pre-evaluador de elegibilidad de 4 preguntas para saber si califico antes de juntar documentos | Must | 2 |
| E7-2 | Como adulta mayor quiero una calculadora de ahorro que reste 50 UIT (S/ 275,000 en 2026) al autovaluo para ver cuanto dejaria de pagar | Must | 2 |
| E7-3 | Como adulta mayor quiero lenguaje muy claro y maxima accesibilidad (teclado, lector de pantalla, alto contraste) por mi mayor brecha digital | Must | 2 |
| E7-4 | Como adulta mayor quiero que el chat me aclare que el beneficio no es automatico (hay que solicitarlo) y que no exonera los arbitrios para no tener falsas expectativas | Must | 2 |
| E7-5 | Como adulta mayor quiero un checklist de documentos y enlace al formato/Mesa de Partes para presentar la solicitud sin desplazarme | Should | 2 |

## E8 - Triaje de reclamos y recursos (flujo #6)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E8-1 | Como ciudadano insatisfecho quiero que el chat desambigue Libro de Reclamaciones vs recurso de reclamacion vs queja Art. 155 para usar el canal correcto | Must | 2 |
| E8-2 | Como ciudadano quiero una calculadora de plazos en dias habiles (reclamacion 20, apelacion 15, queja 20) con la fecha limite exacta para no perder el plazo | Must | 2 |
| E8-3 | Como ciudadano quiero un aviso explicito de que el Libro de Reclamaciones no discute la deuda ni detiene plazos para no dejar mi deuda firme por error | Must | 2 |
| E8-4 | Como ciudadano quiero un generador guiado del escrito de reclamacion/descargo con checklist de pruebas para presentarlo sin abogado | Should | 2 |
| E8-5 | Como ciudadano quiero un selector de causal de suspension de coactiva que me diga que prueba adjuntar para frenar el cobro forzoso | Should | 2 |
| E8-6 | Como ciudadano quiero un asistente de prescripcion que detecte deuda de mas de 4 anios y arme la solicitud, advirtiendo que no es automatica | Could | 3 |
| E8-7 | Como ciudadano quiero un detector de pago indebido de alcabala que explique la doble accion (devolucion en el distrito + pago al SAT) | Could | 3 |

## E9 - Alertas, recordatorios y Pitazo (flujo #7)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E9-1 | Como ciudadano quiero recordatorios de vencimientos (predial/arbitrios/vehicular) separados por obligacion para no confundir el 27-feb | Should | 3 |
| E9-2 | Como conductor quiero activar Pitazo (alerta SMS por placa) desde el chat sin ir al modulo heredado para enterarme de nuevas papeletas y capturas | Should | 3 |
| E9-3 | Como ciudadano quiero un boton "agregar a mi calendario" con las cuotas trimestrales para no pagar tarde | Could | 3 |

## E10 - Onboarding a la Agencia Virtual y deep-links (flujo #8)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E10-1 | Como ciudadano quiero que el chat me lleve directo al modulo correcto de la Agencia Virtual (declarar, liquidar, fraccionar) sin saber que es Websitev9/V8/app | Should | 3 |
| E10-2 | Como ciudadano quiero un onboarding guiado del registro en la Agencia Virtual para reducir el abandono por aprobacion diferida | Should | 3 |
| E10-3 | Como ciudadano quiero consultar el estado de mi solicitud de acceso desde el chat | Could | 3 |

## E11 - Fraccionamiento: simulador y elegibilidad (flujo #9)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E11-1 | Como deudor quiero un simulador de cuotas (2-36 meses, cuota minima S/60 / S/30 pensionista) para saber cuanto pagaria al mes | Should | 3 |
| E11-2 | Como deudor quiero un verificador de elegibilidad que revise mis condiciones antes de tramitar para no presentar solicitudes fallidas | Should | 3 |
| E11-3 | Como deudor quiero una advertencia clara de que acogerme implica aceptar la deuda y cerrar reclamos en tramite antes de confirmar | Must | 3 |
| E11-4 | Como deudor quiero recordatorios de la cuota inicial el mismo dia y de las cuotas mensuales para no perder el beneficio | Could | 3 |

Condiciones financieras 2026 sin confirmar; el simulador lee de la fuente versionada (ver riesgos).

## E12 - Proteccion: anti-suplantacion y tramites gratuitos (flujo #10)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E12-1 | Como ciudadano quiero un banner persistente "tramites gratis, no pagues a tramitadores, solo @sat.gob.pe" en todo flujo de pago | Must | 1 |
| E12-2 | Como ciudadano quiero pegar un correo/URL/numero y que el chat me diga si es un canal oficial del SAT para no caer en fraude | Should | 3 |
| E12-3 | Como ciudadano quiero un boton para denunciar cobros indebidos a integridad@sat.gob.pe desde el chat | Should | 3 |

## E13 - Persona juridica: vista por RUC (flujo #11)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E13-1 | Como microempresario quiero una vista consolidada de todas las obligaciones de mi RUC en un solo lugar | Could | 4 |
| E13-2 | Como microempresario quiero distinguir multa administrativa de papeleta de transito (plazos 15 vs 5 dias habiles) para no confundir reglas | Could | 4 |

Se apoya en la capa de consulta consolidada de E2.

## E14 - Juegos y espectaculos: derivacion (flujo #12)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E14-1 | Como organizador quiero que el chat detecte "organizo un evento/sorteo" y me derive al especialista o a la pagina de la materia | Won't (esta version) | 4 |

Materia minoritaria, tasas no verificadas; solo derivacion, no desarrollo profundo.

## E15 - Accesibilidad, privacidad y cumplimiento (transversal)

| ID | Historia | MoSCoW | Fase |
|----|----------|--------|------|
| E15-1 | Como ciudadano quiero un aviso de privacidad visible antes de escribir datos en el chat para saber como se usan | Must | 1 |
| E15-2 | Como ciudadano quiero que el chat se identifique como asistente automatizado y etiquete sus montos como estimacion orientativa | Must | 1 |
| E15-3 | Como ciudadano con discapacidad quiero que el chat sea operable por teclado y compatible con lector de pantalla (anuncios ARIA, contraste) | Must | 1 |
| E15-4 | Como SAT quiero no persistir DNI/placa en logs, minimizar PII y notificar brechas a la ANPD en 48h por diseno | Must | 1 |
| E15-5 | Como ciudadano quiero ejercer mis derechos ARCO/portabilidad desde el chat hacia Mesa de Partes para controlar mis datos | Should | 3 |

Detalle en [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).

## Dependencias clave

- E2, E3 y E4 dependen de E0 (chat) y E1 (datos/calculo).
- E4 y E8 dependen de la calculadora de dias habiles (E1-2).
- E5, E6, E7, E11 dependen de la fuente versionada y calculadoras (E1-1, E1-4).
- E13 depende de la capa de consulta consolidada (E2-3).
- E12-1 y E15 deben adelantarse a Fase 1 aunque su completitud llegue despues.

## Riesgos abiertos que condicionan el backlog

- Plazo DJ vehicular de inscripcion (E6): febrero anio siguiente vs 30 dias calendario; verificar antes de publicar.
- Tabla de multas por codigo (E4): verificar contra el Reglamento Nacional de Transito.
- Vencimientos 2026 predial/arbitrios (E9) y condiciones de fraccionamiento (E11): leer de fuente versionada, no hardcodear.
- Proveedor LLM (DeepSeek) y Ley 29733 (E15, E0): condicion de produccion para todo flujo con PII. Migrar de alias legacy a `deepseek-v4-flash` (deprecacion 2026-07-24).

## Fuente

- Brief canonico (prioritizedFlows, personas, chatStrategy, microcopyPrinciples) y hallazgos por dominio.
- Investigacion DeepSeek (modelo, API, cautelas).
- Detalle de riesgos y pendientes: [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).
