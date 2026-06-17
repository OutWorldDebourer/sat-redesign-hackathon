# 07-plan-redisenio-web/datos-sinteticos-y-demo.md

Set de datos sinteticos realista para demostrar TODOS los flujos priorizados de Fase 1, como estructurarlo en el mock y como dejar el camino a la API real. Sin cifras vinculantes (toda cifra es demo y debe versionarse por anio fiscal).

## Estado actual (anclado al repo)

- Mock: `src/data/mockApi.ts` (95 LOC). 3 placas, 2 DNI, 1 expediente.
- `MockResultData` (`mockApi.ts:4-14`): plano, sin descuentos, dias habiles, deuda consolidada, alcabala ni beneficio 50 UIT.
- Defectos verificados: nombre "Pedro Alva" repetido 3 veces (`mockApi.ts:24,40,51`); ambos DNI tienen el mismo propietario; pestania `codigo` sin datos (siempre error, `consultarSAT` `mockApi.ts:80-94` no tiene rama `codigo`); ningun registro `estado: "En coactivo"`; montos poco organicos (320.50 / 115 / 450).
- Pestanias de busqueda: `paymentTabs` en `src/data/satData.ts` define `placa`/`dni-ruc`/`codigo`/`expediente`; el mock solo cubre 3.
- Consumo: `App.tsx` usa `searchResult: MockResultData | null` (singular), sin consolidacion multi-tributo.
- Plan de IA que consume estos datos: [./plan-chat-deepseek.md](./plan-chat-deepseek.md).

## Principios del dataset

- Nombres peruanos reales y unicos, mapeados a las personas de Fase 1 (ver [../02-flujos-usuario/](../02-flujos-usuario/)): Don Alberto Chavez (predial Cercado), Carla Diaz (vehicular), Jhon Reyes (papeletas en coactiva), Lucia Martinez (alcabala), Sra Rosa Vasquez (50 UIT, brecha digital), Miguel Rojas (PJ/microempresario).
- Montos organicos, no redondos (`1,847.30`, no `1,000`). Toda cifra es DEMO; jamas hardcodear como verdad. Cifras vivas vienen de fuente versionada (ver Camino a API real).
- Estados variados que ejercitan el semaforo: vigente-con-descuento, sin-descuento, en-coactivo, medida-cautelar.
- Distritos diversos: Cercado de Lima, La Molina, Comas, Ate, San Juan de Lurigancho.
- Determinismo: claves de busqueda fijas y documentadas para QA reproducible.

## Estructura propuesta de `MockResultData`

**Hallazgo actual**: `MockResultData` plano sin campos de valor de negocio.

**Impacto**: la demo no muestra ahorro por dias habiles, consolidacion ni beneficios; el chat no puede "vender" el valor de la IA.

**Propuesta**: extender el tipo (versionado, sin romper el actual). Campos nuevos opcionales.

```ts
export type EstadoDeuda = "Vigente" | "Pendiente" | "En coactivo" | "Medida cautelar" | "En revision" | "Prescrito";

export type DeudaItem = {
  tipo: "papeleta" | "predial" | "arbitrios" | "vehicular" | "alcabala";
  concepto: string;
  monto: number;
  estado: EstadoDeuda;
  diasHabilesParaDescuento?: number;   // contador del descuento
  descuentoPct?: number;               // % por pago anticipado
  montoConDescuento?: number;          // monto a pagar HOY
  beneficio50UIT?: boolean;            // elegibilidad pensionista/adulto mayor
  codigoInfraccion?: string;           // p.ej. M.13
  anioFiscal: number;                  // referencia versionada
};

export type ConsultaConsolidada = {
  owner: string;
  documento: string;
  distrito: string;
  deudas: DeudaItem[];
  totalVencido: number;
  semaforo: "verde" | "amarillo" | "rojo" | "negro";
};
```

**Archivo objetivo**: `src/data/mockApi.ts` y `src/types.ts` (o `src/data/mockApi.ts` si el tipo se mantiene local).

## Personas y registros sinteticos

Claves de busqueda fijas para QA. Montos DEMO, anio fiscal de referencia explicito en cada item.

| Persona | Documento / placa / codigo | Flujo demostrado | Estado clave |
|---|---|---|---|
| Don Alberto Chavez | DNI `08742193` | Predial Cercado consolidado | predial + arbitrios vencidos (rojo) |
| Carla Diaz | DNI `45128837` / placa `BCD-471` | Vehicular + papeleta vigente | papeleta con descuento (amarillo) |
| Jhon Reyes | placa `ABC-250` | Papeleta en coactiva, alta ansiedad | en-coactivo (negro) |
| Lucia Martinez | codigo `CP-2026-018` | Alcabala primera compra | alcabala con desglose 3% |
| Sra Rosa Vasquez | DNI `06318492` | Predial con beneficio 50 UIT | beneficio aplicado (verde) |
| Miguel Rojas | RUC `20554871093` / codigo `CP-2026-031` | Multi-tributo PJ | mixto (rojo + amarillo) |

Ejemplos de registros (DEMO; cifras no vinculantes):

- `ABC-250` (Jhon Reyes): papeleta `M.13`, monto `1,847.30`, `estado: "En coactivo"`, `descuentoPct: 0`, `diasHabilesParaDescuento: 0`. Demuestra semaforo negro + escalamiento humano del chat.
- `BCD-471` (Carla Diaz): papeleta leve, monto `352.10`, `descuentoPct: 83`, `montoConDescuento: 59.86`, `diasHabilesParaDescuento: 4`. Demuestra contador de dias habiles y ahorro.
- DNI `06318492` (Sra Rosa): predial `1,026.40`, `beneficio50UIT: true`, `montoConDescuento` reducido. Demuestra pre-evaluador 50 UIT con maxima accesibilidad.
- DNI `08742193` (Don Alberto): consolidado predial `1,026.40` + arbitrios `488.70`, ambos `Pendiente`, `totalVencido` y `semaforo: "rojo"`. Demuestra consulta consolidada.
- codigo `CP-2026-018` (Lucia Martinez): alcabala con desglose (valor de transferencia, deduccion de 10 UIT, 3% sobre exceso). Demuestra calculo de alcabala del chat.

## Pestania `codigo` (hoy sin datos)

**Hallazgo actual**: `paymentTabs` declara `codigo` en `satData.ts` pero `consultarSAT` (`mockApi.ts:80-94`) no tiene rama; siempre error.

**Impacto**: 1 de 4 formas de busqueda falla en silencio; usuarios con solo el codigo fisico del SAT no pueden consultar.

**Propuesta**: definir formato `CP-YYYY-NNN` y agregar `~20` registros `CP-2026-001..CP-2026-020` que mapean a un tributo/papeleta existente (`{ tipo, referenceId }`). Agregar rama `codigo` en `consultarSAT`. UI: el codigo resuelve y redirige a la consulta correspondiente.

**Archivo objetivo**: `src/data/mockApi.ts`.

## Estados, descuentos y dias habiles

**Hallazgo actual**: ningun registro `En coactivo`; sin logica de descuento (HeroInfoPanel usa `result.multa ?? result.monto`); sin contador de dias habiles.

**Impacto**: el simulador y el semaforo no muestran urgencia ni ahorro; el chat no calcula plazos.

**Propuesta**:

- Poblar `estado` con los 4 estados del semaforo en distintos registros.
- Calcular `montoConDescuento` con `descuentoPct` y `diasHabilesParaDescuento`.
- Contador de dias habiles: utilidad `src/utils/businessDaysCalculator.ts` (nuevo) con feriados versionados por anio. Consumida por `PapeletaSemaforo` y por la tool `contar_dias_habiles` del chat (ver [./plan-chat-deepseek.md](./plan-chat-deepseek.md)).

**Archivo objetivo**: `src/data/mockApi.ts`, `src/utils/businessDaysCalculator.ts` (nuevo).

## Deuda consolidada y semaforo

**Hallazgo actual**: `consultarSAT` devuelve 1 resultado; `App.tsx` lo trata singular; `urbanIndicators` ("3 obligaciones vencen pronto") es hardcoded sin datos.

**Impacto**: no se demuestra la "vista consolidada de deuda", flujo prioritario de Fase 1.

**Propuesta**: agregar `getMisDeudas(documento): ConsultaConsolidada`. UI: tarjeta consolidada con semaforo (verde/amarillo/rojo/negro) y `totalVencido`. El chat responde "tienes N deudas, total S/ X, te quedan M dias habiles".

**Archivo objetivo**: `src/data/mockApi.ts`, consumo en `App.tsx` (pos-modularizacion en `src/pages/ConsultPay.tsx`).

## Alcabala y beneficio 50 UIT

**Hallazgo actual**: sin datos de alcabala ni de beneficio 50 UIT pese a estar en la estrategia.

**Impacto**: flujos "compre un inmueble" (Lucia) y "adulto mayor/pensionista" (Sra Rosa) no son demostrables.

**Propuesta**:

- Alcabala: registros con desglose (valor de transferencia, deduccion 10 UIT, 3% sobre exceso). UIT por anio inyectada desde fuente versionada, no hardcodeada.
- 50 UIT: campo `beneficio50UIT` + estimacion de ahorro. Alimenta el pre-evaluador `Beneficiarios50UIT` (4 preguntas, accesible).

**Archivo objetivo**: `src/data/mockApi.ts`.

## Camino a la API real

**Hallazgo actual**: `mockApi.ts` se importa directo; sin adapter ni gestion de env.

**Impacto**: el switch mock/real bloquea el deploy; mezclar mock en produccion es un riesgo.

**Propuesta**:

- Adapter `src/services/satApi.ts` (mismo del [./plan-chat-deepseek.md](./plan-chat-deepseek.md)): `consultarSAT`/`getMisDeudas` conmutan por `import.meta.env.VITE_API_MODE` (`mock` -> `mockApi.ts`; `real` -> `fetch(VITE_API_BASE_URL + ...)`).
- Versionado de cifras: `src/data/fiscal/2026.ts` (UIT, vencimientos, descuentos, feriados) como fuente unica por anio fiscal. El mock referencia estas cifras; nunca se hardcodean en componentes.
- Banner "MODO DEMO" visible cuando `VITE_API_MODE=mock`.
- Las tools del chat (function-calling) se resuelven en el backend via este adapter (ver [./plan-chat-deepseek.md](./plan-chat-deepseek.md)).

**Archivo objetivo**: `src/services/satApi.ts` (nuevo), `src/data/fiscal/2026.ts` (nuevo), `.env.example`.

## Riesgos abiertos (no hardcodear hasta confirmar fuente SAT)

- Montos reales de multas por codigo de transito (M01, M13, M17), UIT 2026, vencimientos predial/arbitrios/vehicular 2026, % de descuento por pago anticipado, plazo de DJ vehicular, condiciones de fraccionamiento. Todo es DEMO hasta verificar fuente primaria (ver [../00-fuentes-y-metodologia/](../00-fuentes-y-metodologia/)).

## Validacion del bloque

Valida y observa como se vera en modo claro/oscuro y desde la interfaz de PC y celulares y sus funcionalidades usando Google Chrome DevTools. Da libertad de crear datos sinteticos para confirmar las funcionalidades y todo. En la practica: usar el MCP chrome-devtools para abrir la app, alternar tema claro/oscuro, emular viewports (desktop y movil), buscar con cada clave fija de QA (placa `ABC-250`, DNI `06318492`, codigo `CP-2026-018`, RUC `20554871093`) y confirmar semaforo, descuento, contador de dias habiles, consolidacion, alcabala con desglose, beneficio 50 UIT y la pestania `codigo` antes vacia, tomando capturas/snapshots de verificacion.
