# src/services

I/O and domain-logic layer, decoupled from UI. Pages and components depend on these adapters, never on raw data modules.

## Files

- `satApi.ts` — Data adapter (mock/real by `VITE_API_MODE`); wraps the in-memory query so pages are source-agnostic. Exports: `satApi`, `MockApiResponse`, `MockResultData`.
- `paymentService.ts` — Demo payment logic: card validation, simulated submit, printable receipt HTML and print window. Exports: `validateCard()`, `submitPayment()`, `generateReceiptHTML()`, `openReceiptWindow()`, `PROCESSING_DELAY_MS`, `CardDraft`, `ReceiptData`.

## Related

- `../data/mockApi.ts` — in-memory source wrapped by `satApi`.
- `../components/HeroInfoPanel/` — consumes `paymentService`.
