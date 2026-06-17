# Criterios de aceptacion por epica y flujo clave

Criterios de aceptacion del rediseno del SAT de Lima en formato Dado / Cuando / Entonces (Gherkin). Cubren las epicas y flujos priorizados; cada bloque referencia su epica del backlog. El chat fijo es el eje, por lo que sus criterios (E0) aplican de fondo a todos los demas.

Documentos relacionados: backlog en [backlog-priorizado.md](backlog-priorizado.md), vision en [redisenio-vision-producto.md](redisenio-vision-producto.md), validacion en [plan-validacion.md](plan-validacion.md). Flujos: [../02-flujos-usuario/](../02-flujos-usuario/).

## E0 - Chat fijo y plataforma conversacional

### Visibilidad y enrutamiento

- **Dado** que estoy en cualquier pagina de la web, **cuando** la pagina termina de cargar, **entonces** el chat es visible y accesible sin scroll, sin tapar el contenido principal, y puede minimizarse y reabrirse conservando el contexto.
- **Dado** que abro el chat por primera vez, **cuando** veo el primer mensaje, **entonces** el chat se identifica como asistente automatizado del SAT, muestra el aviso de privacidad y pregunta "que necesitas hacer?".
- **Dado** que escribo "me multaron" / "compre un depa" / "vendi mi carro", **cuando** el chat procesa la intencion, **entonces** abre el flujo correcto por evento de vida sin pedirme que elija un modulo tecnico.
- **Dado** que escribo una intencion ambigua, **cuando** el chat no puede enrutar con certeza, **entonces** ofrece las opciones Pagar/Consultar/Declarar/Reclamar/Ayuda en lenguaje claro.

### Traduccion y limites

- **Dado** que aparece un termino burocratico (coactiva, autovaluo, inafecto, REC), **cuando** el chat lo usa por primera vez, **entonces** lo traduce en linea con el par oficial->ciudadano sin obligarme a buscar un glosario.
- **Dado** que el chat muestra un monto, **cuando** lo presenta, **entonces** lo etiqueta como estimacion orientativa con su anio de referencia y deriva a la liquidacion oficial autenticada.
- **Dado** un caso con efectos juridicos, **cuando** lo planteo, **entonces** el boton "Hablar con un asesor" esta visible y el chat no emite actos vinculantes.

### Estados y resiliencia

- **Dado** que el chat espera respuesta, **cuando** hay latencia, **entonces** muestra un estado de carga claro (no se queda en blanco).
- **Dado** que el LLM o un servicio externo falla o supera el timeout, **cuando** ocurre el error, **entonces** el chat informa el problema en lenguaje claro y ofrece rutas estaticas verificadas (canales oficiales, enlaces a destinos validados).
- **Dado** que no hay deuda ni resultados, **cuando** la consulta retorna vacio, **entonces** el chat muestra un estado vacio util con el siguiente paso sugerido.

### Tecnico

- **Dado** el backend del chat, **cuando** invoca al LLM, **entonces** usa el modelo `deepseek-v4-flash`, lee la clave desde la variable de entorno `DEEPSEEK_API_KEY` (nunca hardcodeada) y aplica timeout, reintentos con backoff y prompt caching del system prompt.

## E1 - Infraestructura de datos y calculo

- **Dado** que cualquier componente muestra una cifra (UIT, tramo, tasa, vencimiento), **cuando** la renderiza, **entonces** la lee de la fuente unica versionada por anio fiscal y la muestra con su anio; no existe ninguna cifra hardcodeada en el texto.
- **Dado** que ingreso una fecha de notificacion, **cuando** la calculadora de dias habiles corre, **entonces** excluye sabados, domingos y feriados peruanos y devuelve la fecha limite exacta, no "dentro de N dias".
- **Dado** que pego o escribo un identificador, **cuando** el detector lo analiza, **entonces** reconoce automaticamente si es placa, DNI, RUC o codigo y enruta sin pedirme elegir el tipo.

## E2 - Consulta consolidada de deuda (flujo #1)

- **Dado** que quiero consultar, **cuando** el chat me pide un dato, **entonces** solicita solo el identificador estrictamente necesario y explica para que se usa antes de pedirlo.
- **Dado** que inicio una consulta de predial/arbitrios, **cuando** empieza el flujo, **entonces** el chat verifica primero si el predio esta en el Cercado de Lima y, si no, deriva a la municipalidad distrital correspondiente.
- **Dado** que soy un usuario no autenticado, **cuando** pido "cuanto debo", **entonces** el chat NO muestra montos individuales y me explica que por la reserva tributaria debo iniciar sesion.
- **Dado** que estoy autenticado, **cuando** consulto mi deuda, **entonces** veo una vista consolidada (predial+arbitrios+vehicular+papeletas+multas) con un semaforo de estado (al dia / por vencer / en coactiva / con medida cautelar) y el monto a pagar HOY con descuento aplicado.
- **Dado** una consulta general (como se calcula un arbitrio), **cuando** la hago sin login, **entonces** el chat responde con informacion general sin exponer deuda de terceros.

Detalle: [../02-flujos-usuario/flujo-consulta-deuda.md](../02-flujos-usuario/flujo-consulta-deuda.md).

## E3 - Pago con descuento (flujo #1)

- **Dado** que veo mi deuda con descuento vigente, **cuando** elijo pagar, **entonces** puedo iniciar el pago (tarjeta/Yape/Plin/banco) sin reingresar el identificador y veo cuanto ahorro pagando hoy.
- **Dado** que completo el pago, **cuando** termina, **entonces** recibo un resumen/comprobante y un aviso de que puede tardar hasta 48h en reflejarse, indicandome guardarlo.
- **Dado** que el pago es de alcabala, **cuando** confirmo, **entonces** el chat me advierte esperar la confirmacion antes de ir a la notaria.
- **Dado** cualquier flujo de pago, **cuando** estoy en el, **entonces** el banner "los tramites del SAT son gratis; no pagues a tramitadores; solo @sat.gob.pe" esta visible.

Detalle: [../02-flujos-usuario/flujo-pago.md](../02-flujos-usuario/flujo-pago.md).

## E4 - Papeletas: semaforo, descuento y rutas (flujo #2)

- **Dado** que ingreso mi placa, **cuando** consulto papeletas, **entonces** veo un semaforo de estado (en plazo / con descuento / en coactiva / con medida cautelar) y el monto a pagar HOY, sin jerga sin traducir.
- **Dado** una papeleta con descuento vigente, **cuando** la veo, **entonces** el chat muestra un contador de dias habiles ("te quedan X dias para el 83%; despues pagaras S/ Y mas") calculado por mi, no en dias calendario.
- **Dado** que confundo conceptos, **cuando** consulto, **entonces** el chat distingue explicitamente papeleta (personal del conductor), impuesto vehicular (del propietario) y multa administrativa.
- **Dado** que mi papeleta esta en coactiva, **cuando** la reviso, **entonces** el chat me explica la etapa, las costas que se suman y las causales de suspension en tono de aliado antes que de amenaza.
- **Dado** un resultado de papeleta, **cuando** lo veo, **entonces** tengo rutas claras de pagar / impugnar / fraccionar / suspender coactiva.
- **Dado** una papeleta fisica que no aparece, **cuando** subo su foto/acta, **entonces** el chat inicia el registro para poder pagar dentro del plazo.
- **Dado** un vehiculo internado, **cuando** consulto por placa, **entonces** el chat indica el deposito y el monto total de liberacion (deuda + costas).

Detalle: [../02-flujos-usuario/flujo-papeletas-infracciones.md](../02-flujos-usuario/flujo-papeletas-infracciones.md). El monto por codigo se lee de fuente verificada.

## E5 - Eventos de vida: inmueble / alcabala (flujo #3)

- **Dado** que digo "compre un inmueble en Lima", **cuando** inicia el flujo, **entonces** el chat aclara que la alcabala la paga el comprador y al SAT/MML, no en la municipalidad distrital.
- **Dado** que ingreso el valor y el autovaluo, **cuando** uso la calculadora, **entonces** el chat toma el mayor, resta el tramo inafecto de 10 UIT (S/ 55,000 en 2026), aplica 3% sobre el exceso y muestra el desglose, etiquetado como estimacion.
- **Dado** que voy a pagar, **cuando** el chat detecta provincia de Lima, **entonces** muestra la alerta anti-pago-indebido antes de continuar.
- **Dado** que tengo una cita notarial, **cuando** consulto el plazo, **entonces** el chat calcula la fecha limite (ultimo dia habil del mes siguiente a la transferencia) y recuerda que la alcabala es requisito para la escritura/SUNARP.
- **Dado** un caso potencialmente inafecto (herencia, anticipo de legitima, primera venta de constructor), **cuando** lo describo, **entonces** el chat me avisa que podria no pagar y ofrece tramitar la constancia de inafectacion antes de pagar.

## E6 - Eventos de vida: vehiculo (flujo #4)

- **Dado** que digo "compre un vehiculo", **cuando** inicia el flujo, **entonces** el chat distingue inscribir (obligacion inmediata) de pagar (empieza el anio siguiente) y advierte la multa por omision de DJ.
- **Dado** que digo "vendi mi vehiculo", **cuando** inicia el flujo, **entonces** el chat guia la DJ de descargo y advierte que las papeletas (personales) no se transfieren y que el impuesto del anio de venta lo pago yo.
- **Dado** que ingreso el anio de inscripcion en SUNARP, **cuando** consulto, **entonces** el chat me indica cuantos de los 3 anios de afectacion me quedan y desde cuando dejo de pagar.
- **Dado** el plazo de la DJ, **cuando** el chat lo muestra, **entonces** lo lee del dato verificado en la fuente versionada y no de un valor hardcodeado.

## E7 - Beneficios: deduccion 50 UIT (flujo #5)

- **Dado** que soy adulta mayor/pensionista, **cuando** uso el pre-evaluador, **entonces** respondo 4 preguntas (60+ o pensionista, predio unico, vivienda, ingreso <= 1 UIT/mes) y el chat me dice si parezco calificar antes de pedir documentos.
- **Dado** que ingreso mi autovaluo, **cuando** uso la calculadora de ahorro, **entonces** el chat resta 50 UIT (S/ 275,000 en 2026, no S/ 220,000) y muestra cuanto dejaria de pagar.
- **Dado** que pregunto por el beneficio, **cuando** el chat responde, **entonces** aclara que no es automatico (hay que solicitarlo) y que no exonera los arbitrios.
- **Dado** el perfil de mayor brecha digital, **cuando** uso el flujo, **entonces** es operable por teclado, compatible con lector de pantalla y con contraste suficiente, en lenguaje muy claro.

## E8 - Triaje de reclamos y recursos (flujo #6)

- **Dado** que digo "quiero reclamar/quejarme", **cuando** inicia el triaje, **entonces** el chat pregunta el motivo y enruta a Libro de Reclamaciones (mala atencion), recurso de reclamacion (discrepo del monto) o queja Art. 155 (defecto de procedimiento).
- **Dado** que ingreso la fecha de notificacion, **cuando** el chat calcula el plazo, **entonces** muestra la fecha limite exacta en dias habiles (reclamacion 20, apelacion 15, queja 20).
- **Dado** que mi caso es discrepar del monto, **cuando** menciono el Libro de Reclamaciones, **entonces** el chat me advierte explicitamente que NO discute la deuda ni detiene plazos y me lleva a la reclamacion correcta.
- **Dado** un reclamo procedente, **cuando** lo armo, **entonces** el chat genera un escrito guiado con checklist de pruebas y recuerda que no necesito abogado.
- **Dado** que pague alcabala en la municipalidad distrital, **cuando** lo menciono, **entonces** el chat lo identifica como pago indebido y explica la doble accion (devolucion en el distrito + pago al SAT).

## E9 - Alertas, recordatorios y Pitazo (flujo #7)

- **Dado** que tengo obligaciones que vencen, **cuando** activo recordatorios, **entonces** recibo avisos separados por obligacion (predial, arbitrios, vehicular) para no confundir el 27-feb.
- **Dado** que quiero alertas de papeletas, **cuando** activo Pitazo desde el chat, **entonces** registro placa y celular y confirmo sin salir a un modulo heredado.

## E10 - Onboarding a la Agencia Virtual y deep-links (flujo #8)

- **Dado** que el chat detecta una intencion transaccional (declarar, liquidar, fraccionar), **cuando** me deriva, **entonces** abre el modulo correcto de la Agencia Virtual sin que yo sepa si es Websitev9/V8/app.
- **Dado** que necesito registrarme, **cuando** inicio el onboarding, **entonces** el chat me guia paso a paso explicando que el acceso tiene aprobacion diferida para reducir el abandono.

## E11 - Fraccionamiento: simulador y elegibilidad (flujo #9)

- **Dado** que ingreso mi deuda, **cuando** uso el simulador, **entonces** el chat estima cuota inicial y cuotas mensuales (2-36 meses) respetando la cuota minima S/60 (S/30 pensionista), etiquetado como estimacion.
- **Dado** que voy a confirmar el fraccionamiento, **cuando** llego al paso final, **entonces** el chat me advierte que acogerme implica aceptar la deuda y cerrar cualquier reclamo en tramite sobre ella.
- **Dado** que pre-evaluo elegibilidad, **cuando** el chat la revisa, **entonces** me avisa si tengo adeudos del ejercicio en curso o ya 2 convenios vigentes que bloquean el acceso.

Condiciones financieras 2026 sin confirmar; el simulador lee de la fuente versionada.

## E12 - Proteccion: anti-suplantacion y tramites gratuitos (flujo #10)

- **Dado** cualquier flujo de pago o tramite, **cuando** estoy en el, **entonces** el banner "tramites gratis; no pagues a tramitadores; solo @sat.gob.pe" esta visible de forma persistente.
- **Dado** que pego un correo/URL/numero, **cuando** uso el verificador, **entonces** el chat me dice si es un canal oficial del SAT (regla: solo @sat.gob.pe / www.sat.gob.pe / app.sat.gob.pe) y advierte del correo falso info@correo.sunat.gob.pe.
- **Dado** que detecto un cobro indebido, **cuando** quiero denunciar, **entonces** el chat ofrece un boton para escribir a integridad@sat.gob.pe.

## E13 - Persona juridica: vista por RUC (flujo #11)

- **Dado** que consulto por RUC autenticado, **cuando** veo el resultado, **entonces** obtengo una vista consolidada de todas las obligaciones del RUC en un solo lugar.
- **Dado** que veo multas, **cuando** las reviso, **entonces** el chat distingue multa administrativa (15 dias habiles) de papeleta de transito (5 dias habiles).

## E15 - Accesibilidad, privacidad y cumplimiento (transversal)

- **Dado** que voy a escribir datos en el chat, **cuando** lo abro, **entonces** veo un aviso de privacidad y un enlace "Como uso tus datos" antes de ingresar PII.
- **Dado** que navego solo con teclado, **cuando** uso el chat, **entonces** puedo abrir, escribir, enviar, recibir y minimizar sin mouse, con foco visible y anuncios ARIA de mensajes nuevos.
- **Dado** el backend del chat, **cuando** registra logs, **entonces** no persiste DNI/placa en claro, minimiza PII enviada al proveedor y aplica retencion minima.
- **Dado** un incidente de seguridad con datos personales, **cuando** se detecta, **entonces** existe el proceso para notificar a la ANPD dentro de 48h.

Detalle: [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).

## Definicion de listo (Definition of Done) transversal

Una historia se considera terminada cuando:

- Cumple sus criterios Dado/Cuando/Entonces y pasa pruebas de los 3 estados (vacio, carga, error).
- No hardcodea ninguna cifra; toda cifra se lee de la fuente versionada con su anio.
- Es accesible (teclado + lector de pantalla) en el componente afectado.
- No persiste PII innecesaria y respeta la reserva tributaria (autenticacion antes de montos individuales).
- El chat no emite montos vinculantes y mantiene visible la salida humana cuando aplica.
- Colapsa a una sola columna en pantallas < 768px.

## Fuente

- Brief canonico (microcopyPrinciples, prioritizedFlows, chatStrategy, topAlerts) y hallazgos por dominio.
- Investigacion DeepSeek (modelo `deepseek-v4-flash`, `DEEPSEEK_API_KEY`).
- Riesgos y pendientes: [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).
