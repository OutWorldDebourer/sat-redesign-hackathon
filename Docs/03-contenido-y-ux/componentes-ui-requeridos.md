# Componentes UI requeridos

Inventario de componentes para la web del SAT y el chat fijo, con su responsabilidad, datos que consume y estados (vacio / carga / error / exito). Cada componente respeta el lenguaje ciudadano, la reserva tributaria y la regla de no hardcodear montos.

## Reglas transversales a todos los componentes

- Toda cifra (UIT, tramos, tasas, vencimientos, descuentos) se lee de la fuente unica versionada por anio y se muestra con su anio de referencia. Nunca hardcodear.
- Todo monto del chat o de una calculadora es estimacion orientativa; deriva a la liquidacion oficial autenticada.
- Datos economicos individuales solo tras autenticar identidad (reserva tributaria).
- Operables por teclado, foco visible, etiquetas ARIA, contraste suficiente.
- Cada componente implementa explicitamente sus estados vacio / carga / error.
- Tokens de color del sistema: primario #16236E, secundario #337AB7, acento/enlace #006DB3, fondo #FFFFFF, texto #555555.

## 1. Buscador universal de deuda/pago

Caja unica de entrada que autodetecta el tipo de identificador y enruta a la consulta o pago correcto. Es el componente accionable principal del home.

- Funcion: el ciudadano escribe un dato; el componente reconoce el formato (DNI 8 digitos, RUC 11 digitos, placa ABC-123, codigo de contribuyente, documento de deuda) y no obliga a elegir el tipo.
- Selector de identificador: oculto por defecto; aparece como ayuda solo si la deteccion es ambigua ("Es un DNI o un RUC?").
- Ayuda contextual: "Donde encuentro mi codigo?" con guia visual de la cuponera/notificacion.
- Separa consulta general (sin login) de "mi deuda" (con login).
- Estados:
  - Vacio: placeholder "Escribe tu DNI, RUC o placa".
  - Escribiendo: validacion en vivo del formato detectado.
  - Carga: skeleton mientras consulta.
  - Sin resultados: "No encontre nada con ese dato. Revisa el numero o preguntame que necesitas hacer."
  - Error: "Ahora no puedo consultar. Reintenta o usa este enlace oficial: [enlace]."
  - Identificador invalido: "No reconozco ese dato. Escribe tu DNI (8 numeros), RUC (11 numeros) o placa (ABC-123)."

## 2. Tarjeta de tramite

Unidad de navegacion por intencion/materia. Resume un tramite y enruta al flujo.

- Contenido: titulo por intencion o evento de vida, una linea de que es, CTA dominante, etiqueta de login si aplica.
- No usar tres columnas identicas; agrupacion asimetrica por prioridad.
- Estados: normal, hover/focus visible, deshabilitado (con motivo: "Disponible solo para predios del Cercado de Lima").

## 3. Resultado de consulta de deuda (vista consolidada)

Muestra la deuda consolidada (predial + arbitrios + vehicular + papeletas + multas) tras autenticar. Replica y supera al Saldomatico.

- Semaforo de estado por obligacion: al dia / por vencer / vencida / en cobranza coactiva / con medida cautelar.
- Monto a pagar HOY con descuento ya aplicado y fecha limite exacta (no "en N dias").
- Desglose: deuda + intereses + costas cuando aplica.
- Cada cifra etiquetada como estimacion con su anio de referencia y enlace a liquidacion oficial.
- Estados:
  - Requiere identidad: "Por la reserva tributaria, inicia sesion para ver tu deuda exacta."
  - Vacio (sin deuda): "No encontramos deuda a tu nombre hoy." + sugerencia de activar Pitazo/recordatorios.
  - Carga: skeleton por seccion.
  - Error parcial: muestra lo disponible y marca la fuente caida ("No pudimos cargar papeletas ahora").
  - Error total: fallback a enlaces oficiales de consulta.

## 4. Semaforo de papeleta + contador de descuento

Componente especifico de papeletas: traduce el estado a un semaforo accionable.

- Estado: vigente con descuento / sin descuento (codigo M) / en coactiva / con medida cautelar.
- Contador de dias habiles hasta la fecha limite del descuento (excluye sabados, domingos y feriados); muestra la fecha exacta.
- Rutas: pagar con descuento / impugnar (descargo) / fraccionar / suspender coactiva / activar Pitazo.
- Trade-off explicito pagar vs impugnar cuando ambos plazos coinciden.
- Localizador de vehiculo internado: deposito asignado y monto total de liberacion.
- Estados: vacio (sin papeletas), carga, error de servicio, sin descuento disponible (con explicacion).

## 5. Calculadoras (predial, alcabala, vehicular, fraccionamiento)

Calculadoras conversacionales y de pagina, parametrizadas por anio.

- Predial: ingresa autovaluo, devuelve desglose por tramos (alicuotas leidas de la fuente versionada).
- Alcabala: 3% sobre el exceso del tramo inafecto de 10 UIT; base = mayor entre precio y autovaluo ajustado.
- Vehicular: 1% del valor con monto minimo (1.5% de la UIT vigente); muestra cuantos de los 3 anios quedan.
- Fraccionamiento: simula cuota inicial y cuotas mensuales respetando la cuota minima vigente y el rango de meses.
- Disclaimer fijo: "Esto es un estimado orientativo, no tu liquidacion oficial."
- Estados: vacio (campos pidiendo un dato a la vez), calculando, resultado con anio de referencia, error si falta la fuente versionada.

## 6. Flujo de pago

Paga cualquier obligacion; integra los identificadores y medios verificados.

- Aplica automaticamente el descuento vigente y muestra el ahorro.
- Medios: tarjeta (Visa/Mastercard/Amex/Diners), Yape, Plin, bancos y agentes afiliados.
- Aviso de reflejo de hasta 48h; advertencia reforzada en alcabala (esperar confirmacion antes de la notaria).
- Alerta anti-pago-indebido en alcabala (pagar al SAT, no en la municipalidad distrital).
- Banner de seguridad persistente (tramites gratis, no tramitadores, solo @sat.gob.pe).
- Estados:
  - Vacio: resumen de la deuda y medios disponibles.
  - Procesando: indicador no cancelable con mensaje claro.
  - Exito: Resumen del pago descargable + "guarda este comprobante".
  - Error de banco: "Tu banco no autorizo el pago. Revisa que tu tarjeta este habilitada o prueba otro medio."
  - Servicio caido: fallback a canales de pago alternativos (banco, agente, Agencia Virtual).

## 7. Chat fijo (componente central)

Asistente conversacional siempre visible. Punto de entrada que oculta los dominios tecnicos.

- Presentacion: FAB contraido; panel expandido (~min(420px, 100vw) escritorio, pantalla completa movil < 768px); modo destacado en home con chips de intencion.
- Persistente en todas las paginas; recuerda estado por sesion; un solo auto-open opcional la primera visita.
- Una pregunta a la vez; autodetecta el identificador; traduce jerga inline la primera vez.
- Disclaimer persistente y discreto; boton "Hablar con un asesor" siempre visible; handoff de contexto a WhatSAT/cita sin recomenzar.
- ARIA: anuncio de mensajes nuevos, operable por teclado, alto contraste.
- Estados:
  - Vacio (primera apertura): saludo + chips + recordatorio de seguridad.
  - Escribiendo/carga: indicador de typing; "Estoy revisando tu informacion..." con timeout visible.
  - Error LLM/backend: "Ahora no puedo responder. Mientras tanto puedes consultar aqui:" + enlaces oficiales + reintentar.
  - Sin resultados: confirmacion positiva + accion sugerida (Pitazo, recordatorios).
  - Requiere identidad: explica la reserva tributaria antes de enviar a login.

Detalle de comportamiento y limites: ver [../04-chat-ia/propuesta-chat-fijo.md](../04-chat-ia/propuesta-chat-fijo.md).

## 8. Formularios y generador de escritos

Formularios guiados y pre-llenado de escritos (descargo, reclamacion, prescripcion, devolucion) hacia Mesa de Partes Digital.

- Una pregunta a la vez; explica para que se usa cada dato; minimiza PII.
- Checklist dinamico de documentos segun el caso (tipo de transferencia, tipo de deudor).
- Adjuntos: JPG/PDF, hasta 5 MB por archivo, con validacion clara.
- Advertencias contextuales (ej. "acogerte al fraccionamiento implica aceptar la deuda y cierra reclamos en tramite").
- Estados: vacio, validacion en vivo por campo, error de archivo (formato/peso), envio en curso, exito con cargo y numero de seguimiento.

## 9. Calendario de vencimientos

Muestra los vencimientos del periodo (predial, arbitrios, vehicular) y permite recordatorios.

- Fechas leidas de la fuente versionada, con su anio de referencia; separa mensajes por tributo (el 27-feb concentra varios).
- Acciones: "Recordarme antes del vencimiento", "Agregar a mi calendario".
- Simulador contado vs cuotas con cada fecha de vencimiento.
- Estados: vacio (sin obligaciones del periodo), carga, error (fallback a la pagina oficial de vencimientos), fechas pendientes de confirmar marcadas como tal.

## 10. Mapa de sedes y depositos

Localiza agencias, Centro MAC y depositos vehiculares; sugiere la sede mas conveniente.

- Sugiere sede por distrito/materia con su horario vigente; opcion de mapa.
- Antes de derivar a sede, verifica si el tramite se resuelve 100% en linea.
- Aviso de seguridad al derivar a Camana (no aceptar ayuda de tramitadores).
- Depositos: localiza por placa el deposito asignado y el monto de liberacion.
- Estados: vacio (sin geolocalizacion: lista por distrito), carga, error (lista estatica de sedes), datos a revalidar por cartilla anual marcados.

## 11. Alertas y banners

Franja de avisos del sistema: seguridad, anti-pago-indebido, campanias, vencimientos.

- Banner de seguridad persistente en flujos de pago.
- Alertas contextuales por materia (papeletas personales, alcabala distrital, dias habiles).
- Verificador anti-suplantacion embebido (pega correo/URL/numero).
- Estados: informativa, advertencia, critica (coactiva/captura), descartable vs persistente segun severidad.

Detalle de jerarquia de alertas y disclaimers: ver [errores-vacios-alertas.md](errores-vacios-alertas.md).

## 12. Verificador anti-suplantacion

Comprueba si un correo, URL o numero es oficial del SAT.

- Regla simple: solo @sat.gob.pe y www.sat.gob.pe / app.sat.gob.pe son oficiales.
- Marca explicitamente el correo falso conocido como fraude.
- Estados: vacio (campo + instruccion), verificando, oficial (confirmacion verde), no oficial (advertencia + que hacer).

## 13. Acceso a salida humana

Componente de escalamiento siempre disponible.

- Boton "Hablar con un asesor" visible en chat y fichas con efectos juridicos.
- Deriva al canal vigente segun hora (Agencia Virtual / Mesa de Partes 24/7 cuando no hay humanos; WhatSAT al numero/turno correcto).
- Estados: disponible (en horario), fuera de horario (ofrece canales 24/7), error de derivacion (muestra todos los canales).

## Pendiente de verificacion

Los componentes que muestran vencimientos, tarifas de arbitrios, descuentos por campania, condiciones de fraccionamiento, numeros y horarios de canales leen de la fuente versionada y se confirman antes del lanzamiento. Detalle en [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).

## Relacionados

- [lenguaje-directo-y-microcopy.md](lenguaje-directo-y-microcopy.md) — copy que consumen los componentes.
- [arquitectura-informacion-propuesta.md](arquitectura-informacion-propuesta.md) — donde se ubica cada componente.
- [errores-vacios-alertas.md](errores-vacios-alertas.md) — estados, alertas y fallback en detalle.
- [../02-flujos-usuario/](../02-flujos-usuario/) — flujos que orquestan estos componentes.
- [../04-chat-ia/propuesta-chat-fijo.md](../04-chat-ia/propuesta-chat-fijo.md) — el chat fijo en detalle.
