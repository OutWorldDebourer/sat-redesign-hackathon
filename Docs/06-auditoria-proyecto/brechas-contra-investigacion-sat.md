# Brechas: prototipo actual vs investigación Fase 1

Gap analysis brecha por brecha entre lo implementado en el repo y lo que pide la investigación (Docs/01-05). Cada fila incluye estado actual, lo que pide la doc, propuesta, archivo objetivo y prioridad.

> Cruce base: [../01-mapa-tramites/taxonomia-servicios.md](../01-mapa-tramites/taxonomia-servicios.md), [../02-flujos-usuario/flujos-priorizados.md](../02-flujos-usuario/flujos-priorizados.md), [../03-contenido-y-ux/arquitectura-informacion-propuesta.md](../03-contenido-y-ux/arquitectura-informacion-propuesta.md), [../03-contenido-y-ux/componentes-ui-requeridos.md](../03-contenido-y-ux/componentes-ui-requeridos.md), [../04-chat-ia/propuesta-chat-fijo.md](../04-chat-ia/propuesta-chat-fijo.md).

Prioridad: P0 bloquea estrategia · P1 alta · P2 media · P3 menor.

---

## 1. Navegación por intención

- **Hallazgo actual:** Nivel 1 = 6 módulos técnicos (`navItems` en `src/data/satData.ts`: Consultar/Tributos/Papeletas/Trámites/Fraccionamiento/Atención) y `desktop-nav` solo muestra `navItems.slice(0,6)` (omite sedes e institución). En home, `routeLanes` (inline en `App.tsx:57+`) mezcla intención y materia vía el campo `tone` (`consultar`/`pagar`/`predio`/`alcabala`).
- **Lo que pide la doc:** Nivel 1 = 6 verbos de intención (Consultar / Pagar / Declarar / Reclamar / Beneficios / Ayuda) + entrada paralela por evento de vida ("compré", "vendí", "me multaron"), ocultando los dominios técnicos ([../01-mapa-tramites/taxonomia-servicios.md](../01-mapa-tramites/taxonomia-servicios.md), [../03-contenido-y-ux/arquitectura-informacion-propuesta.md](../03-contenido-y-ux/arquitectura-informacion-propuesta.md)).
- **Impacto:** el ciudadano navega por nombre técnico ("Tributos") y no por su objetivo ("Quiero pagar"); sin evento de vida pierde el triaje (alcabala vs predial al comprar).
- **Propuesta:** migrar `navItems` a 6 verbos (Nivel 1) + patrón repetible Nivel 2 por materia (predial/vehicular/alcabala/papeletas/multas), conservando la nav técnica como submenú avanzado; añadir tira de eventos de vida en el home. Cambio de UX profundo: validar con cliente antes de implementar.
- **Archivo objetivo:** `src/data/satData.ts` (`navItems`), `src/App.tsx` (header/nav y `routeLanes`).
- **Prioridad:** P1.

## 2. Desambiguación de entrada por materia

- **Hallazgo actual:** no existe paso 0 de desambiguación; se entra directo al módulo.
- **Lo que pide la doc:** cada ficha de materia abre desambiguando confusiones costosas (alcabala la paga el comprador al SAT, no en la municipalidad; impuesto vehicular sigue al auto, papeleta es del conductor; predial vs arbitrios) ([../03-contenido-y-ux/arquitectura-informacion-propuesta.md](../03-contenido-y-ux/arquitectura-informacion-propuesta.md), [../04-chat-ia/intenciones-y-prompts-del-chat.md](../04-chat-ia/intenciones-y-prompts-del-chat.md)).
- **Impacto:** sin desambiguación el ciudadano cae en error costoso (pago indebido de alcabala en municipalidad, que no extingue la deuda).
- **Propuesta:** componente `MateriaClarification` (card/alert paso 0) en el inicio de cada materia, con CTA "Continuar".
- **Archivo objetivo:** nuevo `src/components/MateriaClarification.tsx`; integrar en `CatalogPage`/`ConsultPayPage` por materia.
- **Prioridad:** P2.

---

## 3. Chat fijo con IA (eje arquitectónico)

- **Hallazgo actual:** chat fijo existe y está bien resuelto en UX (`Assistant.tsx`, 449 LOC: persistente, no invasivo, accesible), pero es CANNED: `setTimeout(420ms)` + `buildIntentResponse` (pattern-match sobre 6 `assistantIntents`). Sin LLM, streaming, function-calling ni backend.
- **Lo que pide la doc:** el chat es el eje transversal que enruta por intención, traduce jerga, calcula/simula, consolida deuda, separa consulta general de "mi deuda" (login por reserva tributaria), deriva a humano y protege contra fraude ([../04-chat-ia/propuesta-chat-fijo.md](../04-chat-ia/propuesta-chat-fijo.md), [../05-roadmap-implementacion/redisenio-vision-producto.md](../05-roadmap-implementacion/redisenio-vision-producto.md)).
- **Impacto:** sin LLM no resuelve queries abiertas, no calcula días hábiles, no desambigua materia, no escala a humano; limita el valor a 6 intents estáticos. Es el bloqueador de toda la estrategia de IA.
- **Propuesta:** backend serverless `api/chat.ts` (DeepSeek `deepseek-v4-flash`, OpenAI-compatible, streaming + function-calling) que lee `DEEPSEEK_API_KEY` del entorno del servidor; el cliente nunca ve la clave. Refactorizar `Assistant.tsx` en `AssistantUI.tsx` + `hooks/useAssistantChat.ts` (streaming, `AbortController`, retry, fallback canned). Detalle de seguridad y API en [../04-chat-ia/deepseek-api-plan.md](../04-chat-ia/deepseek-api-plan.md) y [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).
- **Archivo objetivo:** nuevo `api/chat.ts`; nuevo `src/data/chatConfig.ts`; `src/components/assistant/Assistant.tsx`.
- **Prioridad:** P0.

> Valida y observa cómo se verá en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sintéticos para confirmar las funcionalidades y todo. En la práctica: con chrome-devtools, abrir el chat en desktop y móvil, ambos temas, enviar consultas sintéticas (placa/DNI ficticios) y confirmar streaming, fallback y escalamiento.

---

## 4. Componentes de estrategia faltantes

| Componente (Docs/03) | Estado actual | Propuesta | Archivo objetivo | Prioridad |
|---|---|---|---|---|
| Calendario de vencimientos | FALTA | Leer vencimientos de fuente versionada; semáforo por tributo; "Recordarme" (useLocalStorage) + agregar a calendario | nuevo `src/components/CalendarVencimientos.tsx`; datos en `src/data/satData.ts` | P1 |
| Mapa de sedes filtrable | `OfficesPage` es lista simple de `officeLocations` | Filtros por distrito/materia, mapa, sugerir sede cercana, verificar si el trámite es 100% online | refactor `OfficesPage` en `src/App.tsx`; nuevo `src/components/SedeFinder.tsx` | P2 |
| Contador de días hábiles | FALTA | `businessDaysUntil(targetDate)` excluyendo feriados peruanos del año fiscal; transversal a papeletas y reclamos | nuevo `src/utils/businessDaysCalculator.ts` | P1 |
| Semáforo de papeleta | Parcial (`hip-badge` genérico) | Estados verde/amarillo/rojo/negro (vigente-con-descuento / sin-descuento / coactiva / captura), monto a pagar hoy, días hábiles, rutas pagar/impugnar/fraccionar | nuevo `src/components/PapeletaSemaforo.tsx`; integrar en HeroInfoPanel | P1 |
| Banner anti-suplantación + verificador | FALTA | Banner persistente "trámites gratis, no tramitadores, solo @sat.gob.pe" + verificador (pega correo/URL/número) en flujos de pago | nuevo `src/components/VerificadorAntiSuplantacion.tsx`; integrar en flujo de pago de `App.tsx` | P1 |
| Pre-evaluador 50 UIT | FALTA (solo nota en FAQ) | 4 preguntas + calculadora de ahorro, máxima accesibilidad (persona Sra Rosa, brecha digital) | nueva `src/pages/Beneficiarios50UIT.tsx`; ruta `/beneficios` | P1 |

Referencia: [../03-contenido-y-ux/componentes-ui-requeridos.md](../03-contenido-y-ux/componentes-ui-requeridos.md), [../02-flujos-usuario/flujos-priorizados.md](../02-flujos-usuario/flujos-priorizados.md), [../02-flujos-usuario/flujo-papeletas-infracciones.md](../02-flujos-usuario/flujo-papeletas-infracciones.md).

> Valida y observa cómo se verá en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sintéticos para confirmar las funcionalidades y todo. En la práctica: ejercitar cada componente nuevo con datos sintéticos (papeletas en distinto estado, perfil 50 UIT) en ambos temas y viewports, y capturar el semáforo en sus 4 estados.

---

## 5. Flujos de negocio no demostrables (datos mock pobres)

- **Hallazgo actual:** `src/data/mockApi.ts` tiene 3 placas, 2 DNI, 1 expediente; pestaña "codigo" siempre falla; nombre "Pedro Alva" repetido; sin estado "En coactivo", sin descuentos, sin deuda consolidada, sin alcabala ni beneficio 50 UIT. Una sola deuda por consulta (`searchResult` singular).
- **Lo que pide la doc:** consulta consolidada con semáforo, ahorro por días hábiles, alcabala (3% sobre exceso de 10 UIT), beneficio 50 UIT; personas reales (Alberto, Carla, Jhon, Lucía, Rosa, Miguel) ([../02-flujos-usuario/flujo-consulta-deuda.md](../02-flujos-usuario/flujo-consulta-deuda.md), [../01-mapa-tramites/matriz-tramite-usuario-necesidad.md](../01-mapa-tramites/matriz-tramite-usuario-necesidad.md)).
- **Impacto:** la demo no muestra el valor de negocio (consolidación, ahorro, beneficios) que justifica la IA; la pestaña "codigo" falla en silencio.
- **Propuesta:** expandir mock con dataset por persona (nombres peruanos únicos), multi-estado (incluido "En coactivo"), datos para "codigo", descuentos por días hábiles, deuda consolidada (`getMisDeudas(dni)` -> array), alcabala con desglose y beneficio 50 UIT; detrás de un adapter `src/services/satApi.ts` (switch mock/real por `import.meta.env.VITE_API_MODE`). NO hardcodear cifras tributarias hasta confirmar fuente primaria (ver [riesgos-tecnicos.md](riesgos-tecnicos.md)).
- **Archivo objetivo:** `src/data/mockApi.ts`; nuevo `src/services/satApi.ts`; `src/App.tsx` (resultado consolidado).
- **Prioridad:** P1.

---

## 6. Microcopy y tono

- **Hallazgo actual:** copy institucional ("Planificación, organización, dirección y control", `App.tsx:~311`) y 4 "pilares" no documentados ("Más claro/rápido/humano/confiable", `App.tsx:~168-173`). Estados vacío/error genéricos ("No encontré nada").
- **Lo que pide la doc:** habla por intención no por institución; traduce jerga inline; una pregunta a la vez; consecuencia + cifra concreta; cuenta días hábiles por el usuario; tono de aliado, no cobrador; banner anti-tramitadores. 16 mensajes de error y 7 de vacío definidos ([../03-contenido-y-ux/lenguaje-directo-y-microcopy.md](../03-contenido-y-ux/lenguaje-directo-y-microcopy.md), [../03-contenido-y-ux/errores-vacios-alertas.md](../03-contenido-y-ux/errores-vacios-alertas.md)).
- **Impacto:** copy no verificado contra la estrategia genera fricción y desalinea la promesa visual con el contenido.
- **Propuesta:** reescribir hero y benefitItems mapeando a principios de tono ciudadano (ej. "Ruta guiada" en vez de "Más claro"); implementar estados vacío/error específicos del catálogo. Los 4 pilares y los 6 verbos requieren aprobación de cliente.
- **Archivo objetivo:** `src/App.tsx` (`~311`, `~168-173`, estados vacíos); textos centralizables en `src/data/`.
- **Prioridad:** P2.

---

## 7. Fuente única versionada de datos

- **Hallazgo actual:** datos de navegación y home duplicados inline en `App.tsx` (`routeLanes`, `heroAccessItems`, `urbanIndicators`, `benefitItems`) vs `satData.ts`; cifras (UIT, vencimientos, descuentos) hardcodeadas o ausentes; sin versionado por año fiscal.
- **Lo que pide la doc:** ninguna cifra hardcodeada; fuente única versionada por año fiscal, mostrada con su año de referencia, como estimación que deriva a la liquidación oficial ([../00-fuentes-y-metodologia/supuestos-y-riesgos.md](../00-fuentes-y-metodologia/supuestos-y-riesgos.md), [../02-flujos-usuario/flujos-priorizados.md](../02-flujos-usuario/flujos-priorizados.md)).
- **Impacto:** desincronización (cambiar una ruta no se refleja en el otro lugar) y riesgo de mostrar cifras incorrectas.
- **Propuesta:** centralizar `routeLanes` y el contenido de home en `src/data/` (eliminar duplicados inline); estructura versionada por año fiscal para UIT/vencimientos/descuentos. No fijar cifras volátiles hasta confirmar fuente primaria SAT.
- **Archivo objetivo:** `src/data/satData.ts` (o `src/data/` por dominio), `src/App.tsx`.
- **Prioridad:** P2.

---

## 8. Guardrails PII y escalamiento

- **Hallazgo actual:** `ChatMessage` persiste en localStorage (`Assistant.tsx:~76`) con DNI/placa sin anonimizar; sin flag PII; sin escalamiento automático ante coactiva/captura/embargo; sin banner anti-suplantación.
- **Lo que pide la doc:** minimizar PII (Ley 29733), no loguear DNI/placa, escalamiento humano, banner anti-fraude ([../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md)).
- **Impacto:** riesgo legal (Ley 29733, reserva tributaria art. 85); bloquea producción con DeepSeek (infra en China).
- **Propuesta:** `ChatMessage.containsPII`, detección/anonimización de DNI/placa pre-envío, truncado en UI, "Eliminar conversación" siempre visible; escalamiento por keywords. Detalle en [riesgos-tecnicos.md](riesgos-tecnicos.md).
- **Archivo objetivo:** `src/components/assistant/Assistant.tsx`, `src/types.ts`, `api/chat.ts`.
- **Prioridad:** P1.

---

## Resumen de brechas por prioridad

| # | Brecha | Prioridad |
|---|---|---|
| 3 | Chat con IA (backend DeepSeek seguro) | P0 |
| 1 | Navegación por intención + eventos de vida | P1 |
| 4 | Componentes: días hábiles, semáforo, anti-suplantación, 50 UIT, calendario | P1 |
| 5 | Datos mock ricos + adapter satApi | P1 |
| 8 | Guardrails PII + escalamiento | P1 |
| 2 | Desambiguación de materia | P2 |
| 4 | Mapa de sedes filtrable | P2 |
| 6 | Microcopy ciudadano y estados específicos | P2 |
| 7 | Fuente única versionada de datos | P2 |

---

## Relacionados

- [estado-ui-ux-actual.md](estado-ui-ux-actual.md) — sistema de diseño y tema actual.
- [riesgos-tecnicos.md](riesgos-tecnicos.md) — riesgos y deuda crítica que condiciona estas brechas.
