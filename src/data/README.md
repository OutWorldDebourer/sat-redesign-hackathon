# src/data

Datos tipados y mock en memoria que alimentan la UI del prototipo SAT. Sin I/O de red.

## Files

- `satData.ts` — Catálogo grounded de servicios SAT (fuentes oficiales, navegación, trámites, sedes, FAQs, intents). Exports: `officialSources`, `sourceLinks`, `navItems`, `primaryNav`, `footerNav`, `paymentTabs`, `quickActions`, `quickAccessItems`, `services`, `serviceItems`, `procedures`, `officeLocations`, `faqs`, `assistantIntents`, `satData`.
- `mockApi.ts` — Consulta simulada en memoria por placa/DNI/expediente. Exports: `consultarSAT`, `MockResultData`, `MockApiResponse`.
- `homeData.ts` — Datos de presentación del home y enlaces externos. Exports: `externalLinks`, `routeLanes`, `heroAccessItems`, `urbanIndicators`, `benefitItems`.
- `tabSteps.tsx` — Guion visual del HeroInfoPanel: pasos y mockups por tipo de consulta. Exports: `TAB_STEPS`, `STEP_LABELS`, `TabStep`.
- `chatConfig.ts` — Config del asistente IA: system prompt estable, datos vigentes por anio fiscal y esquema de tools. Exports: `SYSTEM_PROMPT_TEMPLATE`, `DATOS_VIGENTES`, `TOOLS_SCHEMA`, `buildSystemMessages()`, `buildDatosVigentesMessage()`, `ChatApiMessage`, `DatosVigentes`.

## Related

- `../pages/` y `../components/` — consumen `satData`, `homeData` y `tabSteps`.
- `../services/satApi.ts` — adapter que envuelve `mockApi`.
- `../components/assistant/Assistant.tsx` — consume `assistantIntents`, `quickActions`.
