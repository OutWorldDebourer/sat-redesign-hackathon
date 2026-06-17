# Taxonomia de servicios por intencion

Agrupacion de los servicios del SAT para la navegacion web y el chat fijo. Reemplaza la arquitectura por institucion (Websitev9 / WebsiteV8 / VirtualSAT / app / transparenciav3) por una arquitectura por INTENCION del ciudadano y por EVENTO DE VIDA.

## Principio rector

El portal actual organiza por nombre de modulo y superpone los menus "Tramites", "Servicios", "Consultas" y "Pagos"; el ciudadano no sabe donde empezar. La nueva taxonomia titula y enruta por lo que el ciudadano quiere HACER, nunca por el nombre tecnico del sistema. El chat fijo es el punto de entrada que oculta los 5 dominios tecnicos y detecta intencion o evento de vida.

- Nivel 1: 5 verbos de intencion + 1 hub de ayuda.
- Nivel 2: patron repetible por materia (predial, arbitrios, vehicular, alcabala, papeletas, multas, juegos).
- Entrada paralela: eventos de vida ("Compre", "Vendi", "Me multaron", "Quiero un beneficio").

## Nivel 1: categorias por intencion

| Categoria | Verbo ciudadano | Que agrupa | Login |
|---|---|---|---|
| Consultar | "Cuanto debo / en que estado estoy" | Deuda por placa/DNI/RUC/codigo, estado de cuenta consolidado, estado de expediente, verificar canal oficial | Consulta general: no. Mi deuda: si (reserva tributaria) |
| Pagar | "Quiero pagar" | Pago en linea, con descuento vigente, cuota de fraccionamiento, liberar vehiculo | No para iniciar; identificador autodetectado |
| Declarar | "Compre / vendi / modifique un bien" | DJ predial, DJ vehicular (inscripcion/descargo/robo), liquidacion de alcabala, registrar papeleta fisica, acceso a Agencia Virtual | Para presentar: si |
| Reclamar | "No estoy de acuerdo / quiero detener un cobro" | Reclamacion, apelacion, queja Art. 155, descargo de papeleta, suspension de coactiva, prescripcion, devolucion, compensacion, Libro de Reclamaciones, denuncia | Para presentar: si |
| Beneficios y facilidades | "Quiero pagar menos o en cuotas" | Deduccion 50 UIT, fraccionamiento, inafectacion de alcabala, Contribuyente Puntual | Pre-evaluacion: no. Solicitud: si |
| Ayuda y seguridad | "Necesito orientacion o un canal" | Citas, Mesa de Partes, ubicar agencia/deposito, Alo SAT/WhatSAT/Chat, Pitazo, recordatorios, verificador anti-suplantacion, asesor humano | No |

## Nivel 2: patron por materia

Cada materia se cruza con las intenciones aplicables. El patron es repetible para mantener consistencia de navegacion y de microcopy.

### Predial (Cercado de Lima)
- Consultar: deuda por DNI/codigo, estado de cuenta.
- Pagar: al contado o cuota trimestral.
- Declarar: DJ por compra, ampliacion o transferencia.
- Reclamar: reclamacion, prescripcion, devolucion.
- Beneficios: deduccion 50 UIT, fraccionamiento.
- Filtro de entrada: "Tu predio esta en el Cercado de Lima?" (si no, derivar a la municipalidad distrital).

### Arbitrios (Cercado de Lima)
- Consultar: monto por DNI/codigo, cuotas trimestrales.
- Pagar: cuota (feb/may/ago/nov) o al contado.
- Reclamar: reclamacion, prescripcion.
- Beneficios: fraccionamiento (los arbitrios NO entran en la deduccion 50 UIT).
- Desambiguacion: predial es impuesto; arbitrios son servicios (limpieza, parques, serenazgo).

### Vehicular (Lima Metropolitana)
- Consultar: impuesto por placa, cuantos de los 3 anios quedan.
- Pagar: al contado o 4 cuotas.
- Declarar: DJ inscripcion (compra), DJ descargo (venta), DJ robo (tasa 0%).
- Reclamar: reclamacion, prescripcion.
- Beneficios: fraccionamiento, inafectaciones (transporte publico, religiosas, educativas).
- Desambiguacion: impuesto vehicular sigue al vehiculo; papeleta es personal del conductor.

### Alcabala (provincia de Lima)
- Consultar: calculadora 3% sobre exceso de 10 UIT.
- Pagar: al SAT/MML, no en la municipalidad distrital.
- Declarar: liquidacion de alcabala.
- Beneficios: acreditar inafectacion (herencia, anticipo de legitima, primera venta de constructora).
- Alerta de entrada: la paga el comprador; es requisito para la escritura y SUNARP; pago en distrito = pago indebido.

### Papeletas de transito
- Consultar: por placa + semaforo de estado + contador de descuento.
- Pagar: con descuento vigente (83% / 67% / sin descuento codigo M).
- Declarar: registrar papeleta fisica que no aparece.
- Reclamar: descargo/impugnacion, suspension de coactiva, prescripcion.
- Beneficios: fraccionamiento.
- Ayuda: activar Pitazo, localizar vehiculo internado.
- Desambiguacion: SAT Lima (ciudad) vs SUTRAN (carreteras).

### Multas administrativas
- Consultar: por DNI/RUC o numero de multa; motivo y autoridad emisora.
- Pagar: con descuento de campania (15 dias habiles).
- Reclamar: impugnacion.
- Beneficios: fraccionamiento.
- Desambiguacion: multa administrativa (norma municipal) vs papeleta de transito; plazos distintos (15 vs 5 dias habiles).

### Juegos y espectaculos publicos
- Declarar / Pagar: derivacion a especialista o a la pagina de la materia.
- Publico minoritario: el chat detecta "organizo un evento/sorteo" y deriva.

## Entrada paralela: eventos de vida

Atajos que abren el flujo correcto sin que el usuario elija una categoria.

| Evento de vida | Materias que activa | Mensaje clave de entrada |
|---|---|---|
| "Compre un inmueble" | Alcabala, predial | Paga la alcabala al SAT (no al distrito); luego declara el predial |
| "Vendi mi inmueble" | Alcabala (aclaracion) | La alcabala la paga el comprador, no tu |
| "Compre un vehiculo" | Vehicular | Inscribir es inmediato; pagar empieza el anio siguiente |
| "Vendi mi vehiculo" | Vehicular | Presenta DJ de descargo; las papeletas NO se transfieren |
| "Me robaron el vehiculo" | Vehicular | DJ por robo para tasa 0% desde el anio siguiente |
| "Me multaron" (transito) | Papeletas | Semaforo + contador de descuento + pagar/impugnar/fraccionar |
| "Me llego una multa municipal" | Multas administrativas | Es distinta de una papeleta; plazos y descuentos propios |
| "Soy adulto mayor / pensionista" | Beneficios | Pre-evaluador de deduccion 50 UIT |
| "No puedo pagar todo" | Facilidades | Simulador de fraccionamiento |
| "Me estan por embargar" | Reclamar | Causales de suspension de coactiva, traduce la jerga |

## Mapeo de dominios tecnicos (oculto al usuario)

El chat y la nueva IA de informacion abstraen estos destinos. El usuario nunca ve el nombre del modulo.

| Dominio tecnico actual | Que aloja hoy | A que intencion se mapea |
|---|---|---|
| Websitev9 | Informacion, noticias, FAQ | Consultar, contenido de cada materia |
| app.sat.gob.pe (Agencia Virtual) | Transaccional autenticado | Declarar, Pagar, Reclamar, Beneficios (login) |
| WebSiteV8 (heredado) | Formatos, buscador de bancos, TUPA | Migrar a Pagar / Reclamar / Negocios |
| VirtualSAT (heredado) | Pitazo, consultas antiguas | Ayuda (Pitazo), Consultar |
| transparenciav3 | Transparencia, MAPRO | Institucional (fuera del flujo ciudadano) |

## Reglas de navegacion y microcopy

- Titular por intencion y evento de vida, nunca por nombre de modulo.
- Una pregunta a la vez; pedir solo el identificador necesario y explicar para que se usa.
- Desambiguar en zonas de confusion conocida ANTES de actuar (predial vs arbitrios; vehicular vs papeleta; quien paga la alcabala; reclamo vs reclamacion vs queja; SAT vs SUTRAN).
- Separar "consulta general" (sin login) de "mi deuda" (con login por reserva tributaria).
- Banner persistente en flujos de pago: tramites gratis, no pagar a tramitadores, solo @sat.gob.pe.
- Toda cifra con su anio de referencia, leida de fuente unica versionada.

## Relacionados

- Catalogo detallado: [inventario-tramites.md](inventario-tramites.md).
- Datos que necesita cada perfil: [matriz-tramite-usuario-necesidad.md](matriz-tramite-usuario-necesidad.md).
- Como responde el chat por intencion: [../04-chat-ia/matriz-tramite-a-respuesta-chat.md](../04-chat-ia/matriz-tramite-a-respuesta-chat.md).
- Catalogo de intents y prompts del chat: [../04-chat-ia/intenciones-y-prompts-del-chat.md](../04-chat-ia/intenciones-y-prompts-del-chat.md).
