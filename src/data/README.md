# src/data

Datos tipados y mock en memoria que alimentan la UI del prototipo SAT. Sin I/O de red.

## Files

- `satData.ts` — Catálogo grounded de servicios SAT (fuentes oficiales, navegación, trámites, sedes, FAQs, intents). Exports: `officialSources`, `sourceLinks`, `navItems`, `paymentTabs`, `quickActions`, `quickAccessItems`, `services`, `serviceItems`, `procedures`, `officeLocations`, `faqs`, `assistantIntents`, `satData`.
- `mockApi.ts` — Consulta simulada en memoria por placa/DNI/expediente. Exports: `consultarSAT`, `MockResultData`, `MockApiResponse`.
- `homeData.ts` — Datos de presentación del home y enlaces externos. Exports: `externalLinks`, `routeLanes`, `heroAccessItems`, `urbanIndicators`, `benefitItems`.

## Related

- `../App.tsx` — consume `homeData` y `satData` para páginas y rutas.
- `../components/assistant/Assistant.tsx` — consume `assistantIntents`, `quickActions`.
