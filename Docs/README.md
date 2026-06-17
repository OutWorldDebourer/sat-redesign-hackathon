# Rediseño del SAT de Lima — Índice de documentación (Docs/)

Repositorio de investigación, diseño de producto y especificación del rediseño de la web del SAT de Lima centrado en un **chat fijo siempre visible** como punto de entrada. El chat reemplaza la navegación fragmentada (5 dominios técnicos: Websitev9, WebSiteV8, VirtualSAT, app.sat.gob.pe, transparenciav3) por una experiencia organizada por **intención** (Pagar / Consultar / Declarar / Reclamar / Beneficios / Ayuda) y por **evento de vida** ("compré", "vendí", "me multaron"). Estos documentos son el insumo de la Fase 2: analizar el portal actual y luego rediseñar e implementar.

> **Estado:** las 8 secciones (00–07) tienen contenido (38 documentos). 00–05 son la investigación y estrategia de Fase 1; 06–07 son la auditoría del proyecto actual y el plan de implementación de Fase 2. Toda cifra (UIT, tramos, tasas, vencimientos) está etiquetada por su nivel de confianza; las marcadas como "pendiente de verificación" deben reconfirmarse en fuente primaria antes de publicar (ver Riesgos y pendientes).

---

## Orden recomendado de lectura

Lee de arriba abajo. Cada paso prepara el siguiente.

1. **Visión** — [`05-roadmap-implementacion/redisenio-vision-producto.md`](05-roadmap-implementacion/redisenio-vision-producto.md). El "por qué": problema, principios, North Star Metric, rol del chat como eje. Empieza aquí.
2. **Método y fuentes** — [`00-fuentes-y-metodologia/`](00-fuentes-y-metodologia/): cómo se investigó, qué fuentes oficiales se usaron y qué supuestos/riesgos quedan abiertos.
3. **Qué hace el SAT** — [`01-mapa-tramites/taxonomia-servicios.md`](01-mapa-tramites/taxonomia-servicios.md) e [`inventario-tramites.md`](01-mapa-tramites/inventario-tramites.md). El universo de trámites y cómo se organizan por intención.
4. **Para quién** — [`01-mapa-tramites/matriz-tramite-usuario-necesidad.md`](01-mapa-tramites/matriz-tramite-usuario-necesidad.md). Personas (Alberto, Carla, Jhon, Lucía, Rosa, Miguel) y dato exacto que necesita cada trámite.
5. **Cómo se resuelve** — [`02-flujos-usuario/flujos-priorizados.md`](02-flujos-usuario/flujos-priorizados.md) y los flujos de esa carpeta. El embudo paso a paso de los flujos de alto impacto.
6. **Contenido y UX** — [`03-contenido-y-ux/`](03-contenido-y-ux/): arquitectura de información, componentes, estados y microcopy directo.
7. **El asistente** — [`04-chat-ia/propuesta-chat-fijo.md`](04-chat-ia/propuesta-chat-fijo.md), luego intenciones, matriz de respuesta, plan DeepSeek y límites de seguridad.
8. **Cómo se construye** — [`05-roadmap-implementacion/`](05-roadmap-implementacion/): backlog, criterios de aceptación, plan de validación.

Atajo por rol: **PM/negocio** → 1, 3, 7. **Diseño/UX** → 3, 4, 6. **Ingeniería** → 6, 7, 8. **Investigación/cumplimiento** → 2 y [`04-chat-ia/seguridad-privacidad-y-limites.md`](04-chat-ia/seguridad-privacidad-y-limites.md).

---

## Resumen de secciones

### 00 — Fuentes y metodología [`00-fuentes-y-metodologia/`](00-fuentes-y-metodologia/)
La base verificable del repo: de dónde sale cada dato y qué tan confiable es.
- [`fuentes-oficiales.md`](00-fuentes-y-metodologia/fuentes-oficiales.md) — Tabla de fuentes oficiales (URL, qué cubre, confianza), dominios oficiales del SAT y advertencia anti-suplantación.
- [`metodologia-investigacion.md`](00-fuentes-y-metodologia/metodologia-investigacion.md) — Alcance (SAT de Lima), método (corpus local + verificación web), criterios de confianza (verificado/parcial/pendiente) y límites.
- [`supuestos-y-riesgos.md`](00-fuentes-y-metodologia/supuestos-y-riesgos.md) — Registro consolidado de supuestos, riesgos y "pendiente de verificación".

### 01 — Mapa de trámites [`01-mapa-tramites/`](01-mapa-tramites/)
El universo de servicios del SAT en lenguaje ciudadano.
- [`inventario-tramites.md`](01-mapa-tramites/inventario-tramites.md) — Catálogo de cada trámite: qué es, quién lo usa, canal, costo/plazo, nivel de confianza y URL fuente.
- [`taxonomia-servicios.md`](01-mapa-tramites/taxonomia-servicios.md) — Taxonomía de navegación por intención (Consultar/Pagar/Declarar/Reclamar/Beneficios/Ayuda) y por evento de vida; mapeo de dominios legacy a intenciones.
- [`matriz-tramite-usuario-necesidad.md`](01-mapa-tramites/matriz-tramite-usuario-necesidad.md) — Tabla trámite × persona × dato exacto requerido; alimenta el prompting de campos del chat, la autodetección de identificador y el pre-llenado.

### 02 — Flujos de usuario [`02-flujos-usuario/`](02-flujos-usuario/)
Especificación paso a paso (as-is, fricciones, oportunidad del chat, CTAs, estados de error) de los flujos.
- [`flujos-priorizados.md`](02-flujos-usuario/flujos-priorizados.md) — Tabla comparativa y **orden de implementación** de los flujos priorizados por fase; dependencias transversales y riesgos abiertos. Entrada de la sección.
- [`flujo-consulta-deuda.md`](02-flujos-usuario/flujo-consulta-deuda.md) — Consulta consolidada ("cuánto debo"): identificadores, verificación de jurisdicción, vista consolidada, semáforo de estado, gating por reserva tributaria.
- [`flujo-pago.md`](02-flujos-usuario/flujo-pago.md) — Pago de cualquier obligación: motor pagosenlinea, canales (tarjetas/Yape/Plin/bancos), reflejo de 48h, descuentos, alerta anti-pago-indebido de alcabala.
- [`flujo-papeletas-infracciones.md`](02-flujos-usuario/flujo-papeletas-infracciones.md) — Papeletas: consulta por placa, semáforo, contador de días hábiles del descuento, rutas pagar/impugnar/fraccionar/suspender coactiva, localizador de vehículo internado.
- [`flujo-tributos-municipales.md`](02-flujos-usuario/flujo-tributos-municipales.md) — Visión general de predial, arbitrios, vehicular y alcabala: cómo se relacionan e identifican.
- [`flujo-impuesto-vehicular.md`](02-flujos-usuario/flujo-impuesto-vehicular.md) — Vehicular: DJ de inscripción (compra) y de descargo (venta), consulta por placa, pago, plazos.
- [`flujo-alcabala-predial-arbitrios.md`](02-flujos-usuario/flujo-alcabala-predial-arbitrios.md) — Alcabala (comprador, 3% sobre exceso de 10 UIT, anti-pago-indebido), predial y arbitrios del Cercado.
- [`flujo-reclamos-descargos-fraccionamiento.md`](02-flujos-usuario/flujo-reclamos-descargos-fraccionamiento.md) — Reclamación, descargo, suspensión de cobranza coactiva y fraccionamiento.

### 03 — Contenido y UX [`03-contenido-y-ux/`](03-contenido-y-ux/)
Sistema de diseño, componentes y lenguaje del rediseño.
- [`arquitectura-informacion-propuesta.md`](03-contenido-y-ux/arquitectura-informacion-propuesta.md) — IA del sitio, navegación nivel 1/2, home priorizado, jerarquía de contenido y dónde vive el chat fijo en el layout.
- [`componentes-ui-requeridos.md`](03-contenido-y-ux/componentes-ui-requeridos.md) — Inventario de componentes (buscador universal con selector de identificador, tarjetas de trámite, consulta de deuda, pago, chat fijo, formularios, calendario de vencimientos, mapa de sedes, alertas) y sus estados.
- [`errores-vacios-alertas.md`](03-contenido-y-ux/errores-vacios-alertas.md) — Estados vacío/carga/error, alertas, disclaimers, escalamiento humano y fallback cuando el servicio transaccional no carga.
- [`lenguaje-directo-y-microcopy.md`](03-contenido-y-ux/lenguaje-directo-y-microcopy.md) — Glosario oficial → ciudadano, ejemplos antes/después, principios de tono y microcopy de botones/errores/vacíos.

### 04 — Chat IA [`04-chat-ia/`](04-chat-ia/)
Diseño e integración del asistente ciudadano siempre visible, sobre DeepSeek.
- [`propuesta-chat-fijo.md`](04-chat-ia/propuesta-chat-fijo.md) — Visión del chat fijo: ubicación en layout, comportamiento, UX minimizable/no invasiva, onboarding, estados vacío/carga/error, casos de uso prioritarios, límites.
- [`intenciones-y-prompts-del-chat.md`](04-chat-ia/intenciones-y-prompts-del-chat.md) — Catálogo de intenciones, desambiguación de zonas de confusión, plantilla de system prompt (sin claves), conversaciones de ejemplo, guardrails.
- [`matriz-tramite-a-respuesta-chat.md`](04-chat-ia/matriz-tramite-a-respuesta-chat.md) — Matriz intención/trámite → respuesta → destino (enlace oficial/flujo/humano) → dato pre-llenable.
- [`deepseek-api-plan.md`](04-chat-ia/deepseek-api-plan.md) — Integración DeepSeek: modelo recomendado (`deepseek-v4-flash`), `DEEPSEEK_API_KEY` (env var, nunca hardcodeada), base URL, parámetros, compatibilidad OpenAI, costos, timeout/retry/fallback, rate limiting.
- [`seguridad-privacidad-y-limites.md`](04-chat-ia/seguridad-privacidad-y-limites.md) — PII, Ley 29733, reserva tributaria, límites de respuesta, escalamiento humano, logging seguro, accesibilidad, retención, ítems por verificar.

### 05 — Roadmap de implementación [`05-roadmap-implementacion/`](05-roadmap-implementacion/)
Del concepto a la entrega, con el chat como eje transversal.
- [`redisenio-vision-producto.md`](05-roadmap-implementacion/redisenio-vision-producto.md) — Visión, principios, North Star Metric (trámites completados por sesión sin contacto humano ni pago a terceros), driver metrics, alcance por fases, decisiones de escala.
- [`backlog-priorizado.md`](05-roadmap-implementacion/backlog-priorizado.md) — Épicas (E0–E15) e historias con MoSCoW y fase; plataforma de chat (E0) e infra de datos/cálculo (E1) como habilitadores; mapeo a los flujos priorizados.
- [`criterios-de-aceptacion.md`](05-roadmap-implementacion/criterios-de-aceptacion.md) — Criterios por épica/flujo en Given/When/Then (Gherkin) más Definition of Done transversal.
- [`plan-validacion.md`](05-roadmap-implementacion/plan-validacion.md) — Hipótesis, pruebas de usabilidad por persona, KPIs, instrumentación de eventos, experimentación, criterios de éxito y cumplimiento.

### 06 — Auditoría del proyecto actual [`06-auditoria-proyecto/`](06-auditoria-proyecto/) — Fase 2
Estado real del código del prototipo, verificado leyendo el repo (`ruta:línea`).
- [`inventario-tecnico.md`](06-auditoria-proyecto/inventario-tecnico.md) — Stack, scripts, dependencias, LOC por archivo, monolitos y deuda.
- [`mapa-rutas-componentes.md`](06-auditoria-proyecto/mapa-rutas-componentes.md) — Rutas, árbol de componentes, datos que consume cada uno y código muerto verificado.
- [`estado-ui-ux-actual.md`](06-auditoria-proyecto/estado-ui-ux-actual.md) — Sistema de diseño actual, responsive, ausencia de modo oscuro, qué preservar.
- [`brechas-contra-investigacion-sat.md`](06-auditoria-proyecto/brechas-contra-investigacion-sat.md) — Brecha por brecha entre el código actual y la estrategia de Fase 1.
- [`riesgos-tecnicos.md`](06-auditoria-proyecto/riesgos-tecnicos.md) — Riesgos por dimensión (build, a11y, seguridad, performance, SEO, Vercel) con severidad y deuda crítica.

### 07 — Plan de rediseño web [`07-plan-redisenio-web/`](07-plan-redisenio-web/) — Fase 2
Cómo llevar la web a primer nivel sin romper lo que funciona.
- [`vision-implementacion.md`](07-plan-redisenio-web/vision-implementacion.md) — Visión, principios, qué se preserva, deuda crítica a saldar primero.
- [`arquitectura-paginas-componentes.md`](07-plan-redisenio-web/arquitectura-paginas-componentes.md) — Arquitectura modular objetivo (descomponer App.tsx y styles.css, dark mode, carpetas).
- [`plan-chat-deepseek.md`](07-plan-redisenio-web/plan-chat-deepseek.md) — Backend serverless `/api/chat`, modelo `deepseek-v4-flash`, streaming, function calling, guardrails. Clave solo por `DEEPSEEK_API_KEY`.
- [`datos-sinteticos-y-demo.md`](07-plan-redisenio-web/datos-sinteticos-y-demo.md) — Datos sintéticos realistas para demostrar todos los flujos priorizados.
- [`checklist-calidad-devtools.md`](07-plan-redisenio-web/checklist-calidad-devtools.md) — Validación con Chrome DevTools: claro/oscuro, PC/móvil, cada funcionalidad con datos sintéticos.
- [`secuencia-implementacion.md`](07-plan-redisenio-web/secuencia-implementacion.md) — Bloques implementables priorizados (0 a 8), con criterio de aceptación y validación obligatoria por bloque.

---

## Hallazgos clave

1. **El portal organiza por institución, no por intención.** Mezcla 5 dominios técnicos y superpone menús (Trámites/Servicios/Consultas/Pagos). El ciudadano no debería saber que existen módulos técnicos: el chat los oculta y enruta por lo que la persona quiere hacer.
2. **"¿Cuánto debo?" es la fricción #1 y el mayor diferenciador.** La consulta/pago consolidado por placa o DNI/RUC supera al Saldómatico físico y resuelve la fragmentación desde el primer toque; es la puerta de entrada de casi todas las personas.
3. **El descuento del 83% en papeletas se pierde por desconocimiento.** Solo aplica en los primeros días hábiles desde la notificación; un contador de días hábiles y un semáforo de estado evitan la pérdida del ahorro. (Magnitudes de vehículos con orden de captura/internados: pendiente de verificación en fuente oficial.)
4. **Confusiones recurrentes y costosas que el chat debe desambiguar antes de actuar:** predial vs arbitrios; impuesto vehicular (sigue al vehículo) vs papeleta (personal, no se transfiere al vender); alcabala la paga el comprador y al SAT/MML, no en la municipalidad distrital (pagar ahí es pago indebido que no extingue la deuda); Libro de Reclamaciones vs recurso de reclamación vs queja Art. 155.
5. **Ninguna cifra se hardcodea.** UIT, tramos, tasas y vencimientos se leen de una fuente única versionada por año fiscal y se muestran con su año de referencia, siempre etiquetadas como estimación orientativa que deriva a la liquidación oficial. El chat no emite actos con efectos jurídicos.
6. **Beneficio de 50 UIT subutilizado y mal informado.** La deducción para pensionista/adulto mayor (50 UIT) no es automática (hay que solicitarla) y solo aplica al predial, no a los arbitrios. El monto exacto en soles depende de la UIT vigente y debe leerse de la fuente versionada (evitar la cifra desactualizada que circula).
7. **Tono de aliado, no de cobrador.** En coactiva o multa, el flujo reduce ansiedad explicando la etapa y la salida ("puedes frenarlo si...") antes que la amenaza, y traduce la jerga (coactiva, autovalúo, inafecto, REC) en línea.
8. **Protección activa contra fraude por defecto.** Banner persistente "trámites gratis, no pagues a tramitadores, solo @sat.gob.pe" y verificador anti-suplantación en todo flujo de pago, frente a falsos tramitadores y correos/dominios suplantados.

---

## El rol del chat fijo

El chat **no es una épica más ni un widget de soporte**: es la capa transversal que atraviesa todas las épicas y el punto de entrada del rediseño. Es el eje arquitectónico, no un anexo a un portal viejo. Sus capacidades:

- **Guía** por intención y evento de vida; oculta los 5 dominios técnicos.
- **Explica** traduciendo jerga en tiempo real y descomponiendo "por qué pago esto".
- **Calcula y simula** (predial, alcabala, vehicular, fraccionamiento, contador de días hábiles), siempre como estimación que deriva a la liquidación oficial.
- **Consolida** toda la deuda en una vista tras autenticar, con semáforo de estado y monto a pagar hoy con descuento aplicado.
- **Deriva con inteligencia:** separa consulta general (sin login) de "mi deuda" (con login por reserva tributaria); ofrece salida humana siempre visible.
- **Pre-llena y reduce fricción:** arma escritos, prellena solicitudes, pre-evalúa elegibilidad antes de pedir documentos.
- **Alerta y protege:** banner anti-tramitadores, aviso anti-pago-indebido de alcabala, recordatorios y activación de Pitazo.
- **Triaja para no perder plazos** y es **transparente y seguro por diseño** (se identifica como automatizado, no emite montos vinculantes, minimiza PII, accesible por teclado/lector de pantalla, Ley 29733 y reserva tributaria).

Especificación completa en [`04-chat-ia/`](04-chat-ia/); rol como eje en [`redisenio-vision-producto.md`](05-roadmap-implementacion/redisenio-vision-producto.md).

---

## Riesgos y pendientes principales

**Datos por verificar antes de publicar (no presentar como fijo lo que es temporal o no confirmado):**
- Plazo exacto de la DJ vehicular de inscripción: "último día hábil de febrero del año siguiente" vs "30 días" — discrepancia entre fuentes. El chat debe leer el dato verificado, no hardcodearlo.
- Montos atados a la UIT vigente (multa por omisión de DJ vehicular, deducción de 50 UIT, tramo inafecto de alcabala de 10 UIT): validar contra la tabla del año fiscal en curso.
- Tablas de multas de tránsito por código, segundo tramo de descuento, tarifas de arbitrios y vencimientos del año, condiciones de fraccionamiento y descuentos de multas administrativas: provienen de ordenanzas/resoluciones o fuentes terceras; reconfirmar en fuente primaria del SAT/MML.
- Canales vigentes (números de WhatSAT, horarios de Aló SAT/Chat SAT, direcciones de agencias y depósitos): centralizar en fuente única y reconfirmar por cartilla anual.

**Cumplimiento y arquitectura:**
- Privacidad/accesibilidad del SAT no verificadas públicamente (política accesible, RNPD, versión WCAG obligatoria; riesgo de reserva tributaria si consultas por placa/DNI sin login exponen deuda de terceros).
- Proveedor LLM (DeepSeek, infraestructura en China) para datos de ciudadanos peruanos: evaluar Ley 29733, minimizar/anonimizar PII, revisar retención y usar el identificador oficial `deepseek-v4-flash` (los alias `deepseek-chat`/`deepseek-reasoner` se deprecan el 2026-07-24).
- Enlaces heredados frágiles (WebSiteV8, VirtualSAT) e información crítica enterrada en noticias: auditar y migrar a páginas permanentes versionadas antes del lanzamiento.

Registro completo en [`00-fuentes-y-metodologia/supuestos-y-riesgos.md`](00-fuentes-y-metodologia/supuestos-y-riesgos.md), [`02-flujos-usuario/flujos-priorizados.md`](02-flujos-usuario/flujos-priorizados.md), [`05-roadmap-implementacion/backlog-priorizado.md`](05-roadmap-implementacion/backlog-priorizado.md) y [`04-chat-ia/seguridad-privacidad-y-limites.md`](04-chat-ia/seguridad-privacidad-y-limites.md).

---

## Cómo usar esto en la Fase 2

La Fase 2 tiene dos movimientos: **analizar el proyecto actual** y luego **rediseñar e implementar**. Esta documentación es el contrato entre ambos.

**A. Analizar el proyecto actual (auditoría as-is)**
1. Parte de [`taxonomia-servicios.md`](01-mapa-tramites/taxonomia-servicios.md) y su mapeo de dominios legacy: contrasta cada módulo real del portal (Websitev9/V8/VirtualSAT/app/transparenciav3) con la intención ciudadana que debería servir. Lo que no mapea a una intención es candidato a ocultar o reorganizar.
2. Usa los flujos de [`02-flujos-usuario/`](02-flujos-usuario/) como guion de recorrido: reproduce cada flujo en el portal actual y registra fricciones contra las ya documentadas (jerga sin traducir, pago indebido de alcabala, descuento perdido, plazos en días hábiles no contados).
3. Cruza con las personas de [`matriz-tramite-usuario-necesidad.md`](01-mapa-tramites/matriz-tramite-usuario-necesidad.md): valida qué dato pide hoy cada trámite y cuántos pasos cuesta, contra lo que la matriz dice que debería pedir.
4. Verifica datos volátiles contra fuente primaria (sección Riesgos): antes de codificar cualquier cifra, confírmala y déjala en la fuente única versionada.

**B. Rediseñar e implementar**
1. Ancla el alcance en [`backlog-priorizado.md`](05-roadmap-implementacion/backlog-priorizado.md): empieza por los habilitadores E0 (plataforma de chat) y E1 (infra de datos/cálculo) — sin ellos, ningún flujo transaccional funciona.
2. Implementa los flujos en el orden de [`flujos-priorizados.md`](02-flujos-usuario/flujos-priorizados.md): consulta consolidada y papeletas primero (mayor volumen e impacto).
3. Construye el chat según [`propuesta-chat-fijo.md`](04-chat-ia/propuesta-chat-fijo.md), [`intenciones-y-prompts-del-chat.md`](04-chat-ia/intenciones-y-prompts-del-chat.md) y [`matriz-tramite-a-respuesta-chat.md`](04-chat-ia/matriz-tramite-a-respuesta-chat.md); integra el LLM con [`deepseek-api-plan.md`](04-chat-ia/deepseek-api-plan.md).
4. Aplica el sistema de diseño y microcopy de [`03-contenido-y-ux/`](03-contenido-y-ux/) y cumple los guardrails de [`seguridad-privacidad-y-limites.md`](04-chat-ia/seguridad-privacidad-y-limites.md) desde el inicio: gating por reserva tributaria, minimización de PII, accesibilidad, sin montos vinculantes.
5. Cierra cada entrega contra [`criterios-de-aceptacion.md`](05-roadmap-implementacion/criterios-de-aceptacion.md) (Gherkin + DoD) y mide con [`plan-validacion.md`](05-roadmap-implementacion/plan-validacion.md) frente a la North Star Metric.
