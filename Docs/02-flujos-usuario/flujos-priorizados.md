# Flujos priorizados (resumen comparativo y orden de implementacion)

Resumen comparativo de los flujos del rediseno del SAT de Lima y su orden de implementacion. Consolida `brief.prioritizedFlows` en una sola vista para decidir que construir primero. El criterio rector: el chat fijo siempre visible es la capa que enruta por intencion y por evento de vida, y los flujos de alta prioridad son los que mas acercan al ciudadano a sus bondades.

Flujos detallados disponibles: [flujo-consulta-deuda.md](flujo-consulta-deuda.md), [flujo-pago.md](flujo-pago.md), [flujo-papeletas-infracciones.md](flujo-papeletas-infracciones.md). Inventario de tramites: ver [../01-mapa-tramites/](../01-mapa-tramites/). Diseno del chat: ver [../04-chat-ia/](../04-chat-ia/).

## Criterios de priorizacion

- Volumen e impacto: cuantos ciudadanos lo usan y su efecto recaudatorio o de derechos.
- Diferenciacion: cuanto supera al portal actual fragmentado y al Saldomatico fisico.
- Carga emocional / riesgo de perdida: ansiedad (coactiva, captura) y plazos que, si se pierden, dejan la deuda firme o cierran derechos.
- Dependencia tecnica: si depende de servicios autenticados no auditables externamente o de capas ya priorizadas.
- Transversalidad: si habilita o refuerza varios flujos a la vez (calculadora de dias habiles, consulta consolidada).

## Tabla comparativa

| # | Flujo | Prioridad | Persona principal | Por que (impacto / diferenciacion) | Dependencias |
|---|-------|-----------|-------------------|-------------------------------------|--------------|
| 1 | Consulta consolidada de deuda + pago con descuento (papeletas por placa, tributos por DNI/RUC) | Alta | Transversal (todos) | Puerta de entrada #1 ("cuanto debo"); mayor diferenciador vs portal fragmentado; supera al Saldomatico; alto volumen e impacto recaudatorio | Capa de consulta consolidada + autenticacion |
| 2 | Semaforo de papeleta + contador de descuento + ruta pagar/impugnar/fraccionar/suspender coactiva | Alta | Jhon (papeletas en coactiva) | Perfil de mayor carga emocional; la ventana del 83% en 5 dias habiles se pierde por desconocimiento; ~80,000 vehiculos con orden de captura, +19,000 internados | Contador de dias habiles; consulta por placa |
| 3 | Asistente "Compre un inmueble" (alcabala): calculadora + alerta anti-pago-indebido + plazo notaria | Alta | Lucia (compradora de inmueble) | Pago indebido distrital frecuente y costoso; alcabala es requisito para escritura/SUNARP con plazo corto; alto valor por transaccion | Calculadora parametrizada por UIT |
| 4 | Asistente "Compre / Vendi un vehiculo": DJ inscripcion vs descargo + diferenciar papeleta de impuesto | Alta | Carla (propietaria de vehiculo) | Confusion masiva inscribir-vs-pagar y papeleta-vs-impuesto; declarar tarde genera multa ~S/ 2,575 | Dato de plazo DJ verificado (ver openRisks) |
| 5 | Pre-evaluador y solicitud de deduccion 50 UIT (pensionista / adulto mayor) | Alta | Senora Rosa (adulta mayor) | Beneficio de alto impacto social (S/ 275,000) que muchos desconocen; exige flujo guiado, lenguaje claro y accesibilidad | Calculadora de ahorro; accesibilidad WCAG |
| 6 | Triaje de reclamos: Libro de Reclamaciones vs reclamacion vs queja Art. 155 + calculadora de plazos | Alta | Transversal (insatisfecho) | Confusion de nombres casi identicos hace usar el canal equivocado y perder el plazo de 20 dias habiles; riesgo legal y de derechos | Calculadora de dias habiles (transversal) |
| 7 | Recordatorios proactivos de vencimientos (predial/arbitrios/vehicular) + activacion de Pitazo | Media | Don Alberto / Carla | Reduce mora e intereses; el 27-feb concentra 3 obligaciones; Pitazo (+1.1M afiliados) vive en dominio heredado | Integracion con Pitazo y calendario |
| 8 | Onboarding guiado a la Agencia Virtual + deep-link al modulo correcto | Media | Transversal | El registro con aprobacion diferida genera abandono; el chat abstrae los 5 dominios tecnicos | Servicios autenticados no auditables |
| 9 | Simulador de fraccionamiento (2-36 meses, cuota minima S/60 / S/30) + verificador de elegibilidad | Media | Jhon / Miguel | Reglas distintas por tipo de deuda enterradas en noticias; pre-evaluar reduce solicitudes fallidas | Reglamento de fraccionamiento (parcial) |
| 10 | Verificador anti-suplantacion (URL/correo/numero oficial) + recordatorio "tramites gratuitos" | Media | Transversal | El SAT alerta sobre correo falso y falsos tramitadores; protege al ciudadano y la confianza institucional | Fuente unica de canales oficiales |
| 11 | Vista consolidada de obligaciones por RUC (persona juridica / microempresario) | Baja | Miguel (persona juridica) | Publico menor en volumen; depende de la misma capa de consulta consolidada (#1) | Capa de consulta consolidada |
| 12 | Derivacion guiada para juegos y espectaculos publicos | Baja | Organizadores | Materia minoritaria, publico especializado, tasas no verificadas; basta derivar a especialista | Pagina de la materia |

## Orden de implementacion sugerido

### Fase 1 (alta prioridad, nucleo del valor)

1. **Consulta consolidada de deuda + pago con descuento** (#1). Es el cimiento: habilita casi todos los demas flujos y resuelve la friccion #1. Incluye caja unica con auto-deteccion de identificador y semaforo de estado.
2. **Papeletas: semaforo + contador de descuento + rutas** (#2). Mayor carga emocional y mayor riesgo de perdida de ahorro; reutiliza la consulta por placa de #1.
3. **Calculadora de dias habiles** (transversal, base de #2 y #6). No es un flujo de cara al usuario por si solo, pero es infraestructura que varios flujos consumen; construir temprano.

### Fase 2 (alta prioridad, eventos de vida)

4. **Compre un inmueble / alcabala** (#3): calculadora 3% sobre exceso de 10 UIT + alerta anti-pago-indebido + plazo notaria.
5. **Compre / Vendi un vehiculo** (#4): DJ inscripcion vs descargo, diferenciar papeleta de impuesto. Requiere confirmar el plazo de la DJ (ver openRisks) antes de mostrarlo; el chat lee el dato, no lo hardcodea.
6. **Deduccion 50 UIT** (#5): pre-evaluador de 4 preguntas + calculadora de ahorro, con maxima accesibilidad para el perfil de mayor brecha digital.
7. **Triaje de reclamos** (#6): desambiguar Libro vs reclamacion vs queja Art. 155 con la calculadora de dias habiles de Fase 1.

### Fase 3 (media prioridad, retencion y proteccion)

8. **Recordatorios de vencimientos + Pitazo** (#7).
9. **Onboarding a la Agencia Virtual + deep-link** (#8).
10. **Simulador de fraccionamiento** (#9).
11. **Verificador anti-suplantacion** (#10). Transversal a todos los flujos de pago; puede adelantarse como banner desde Fase 1.

### Fase 4 (baja prioridad)

12. **Vista consolidada por RUC** (#11): se apoya en la capa de consulta consolidada ya construida.
13. **Derivacion juegos y espectaculos** (#12): solo derivacion a especialista; no justifica desarrollo profundo.

## Dependencias transversales que conviene construir primero

- **Fuente unica versionada por anio fiscal** (UIT, tramos, tasas, vencimientos): toda cifra se lee de aqui, nunca se hardcodea en texto.
- **Calculadora de dias habiles** (excluye feriados peruanos): base de papeletas (#2) y reclamos (#6).
- **Capa de consulta consolidada + autenticacion** (reserva tributaria): base de #1, #2 y #11.
- **Banner anti-suplantacion / tramites gratuitos**: transversal a todo flujo de pago, desde Fase 1.
- **Accesibilidad WCAG (recomendable 2.1 AA)** en el portal y en el widget de chat: requisito legal del Estado y critico para el perfil de #5.

## Riesgos abiertos que condicionan el orden

- Plazo exacto de la DJ vehicular de inscripcion (febrero del anio siguiente vs 30 dias calendario): condiciona #4; verificar en fuente primaria antes de publicar.
- Tabla de multas de transito por codigo (M01, M17...): condiciona el diccionario de #2; verificar contra el Reglamento Nacional de Transito.
- Condiciones financieras del fraccionamiento 2026 (% minimo, umbral de garantia, TIM): condiciona #9.
- Vencimientos 2026 de predial/arbitrios y descuentos por pronto pago: condicionan #1 y #7.
- Proveedor LLM (DeepSeek, infraestructura en China) y cumplimiento Ley 29733: condicion de produccion para todos los flujos con PII. Ver [../04-chat-ia/seguridad-privacidad-y-limites.md](../04-chat-ia/seguridad-privacidad-y-limites.md).

## Fuente

- Brief canonico (prioritizedFlows, personas, chatStrategy) y hallazgos de investigacion por dominio.
- SAT - Acerca del SAT (institucional): https://www.sat.gob.pe/WebSiteV9/SobreelSAT/QuienesSomos/AcercadelSAT
- MEF/gob.pe - UIT 2026 (S/ 5,500): https://www.gob.pe/435-valor-de-la-uit-en-el-ano-2026
- Detalle de riesgos y pendientes: ver [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/).
