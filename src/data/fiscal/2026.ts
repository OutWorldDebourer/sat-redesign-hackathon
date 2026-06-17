// Fuente fiscal unica versionada por anio (DEMO/orientativa). Centraliza UIT,
// feriados, vencimientos, descuentos y parametros de alcabala/50 UIT para que
// los componentes NUNCA hardcodeen cifras. Las cifras se confirman con la fuente
// primaria del SAT antes de produccion.

export type Vencimiento = { tributo: string; etiqueta: string; iso: string };

export type FiscalYear = {
  year: number;
  /** Unidad Impositiva Tributaria del anio (S/). DEMO. */
  uit: number;
  /** Feriados no laborables (ISO YYYY-MM-DD) para el contador de dias habiles. DEMO. */
  holidays: string[];
  /** Vencimientos del periodo (DEMO, confirmar con el SAT). */
  vencimientos: Vencimiento[];
  /** Descuento por pago voluntario de papeleta dentro del plazo (%). DEMO. */
  descuentoPapeletaPct: number;
  /** Alcabala: tramo inafecto en UIT y tasa sobre el exceso. */
  alcabala: { tramoInafectoUIT: number; tasaPct: number };
  /** Impuesto vehicular: tasa anual y anios afectos. */
  vehicular: { tasaPct: number; anios: number };
  /** Beneficio pensionista/adulto mayor: tope de base imponible deducible en UIT. */
  beneficio50UIT: { topeUIT: number };
};

export const FISCAL_2026: FiscalYear = {
  year: 2026,
  uit: 5350,
  // Feriados nacionales 2026 (referenciales).
  holidays: [
    "2026-01-01", // Ano Nuevo
    "2026-04-02", // Jueves Santo
    "2026-04-03", // Viernes Santo
    "2026-05-01", // Dia del Trabajo
    "2026-06-29", // San Pedro y San Pablo
    "2026-07-23", // Dia de la Fuerza Aerea
    "2026-07-28", // Fiestas Patrias
    "2026-07-29", // Fiestas Patrias
    "2026-08-06", // Batalla de Junin
    "2026-08-30", // Santa Rosa de Lima
    "2026-10-08", // Combate de Angamos
    "2026-11-01", // Todos los Santos
    "2026-12-08", // Inmaculada Concepcion
    "2026-12-09", // Batalla de Ayacucho
    "2026-12-25", // Navidad
  ],
  vencimientos: [
    { tributo: "Predial y arbitrios", etiqueta: "1.a cuota", iso: "2026-02-27" },
    { tributo: "Predial y arbitrios", etiqueta: "2.a cuota", iso: "2026-05-29" },
    { tributo: "Impuesto vehicular", etiqueta: "Cuota unica", iso: "2026-03-31" },
    { tributo: "Predial y arbitrios", etiqueta: "3.a cuota", iso: "2026-08-31" },
    { tributo: "Predial y arbitrios", etiqueta: "4.a cuota", iso: "2026-11-30" },
  ],
  descuentoPapeletaPct: 83,
  alcabala: { tramoInafectoUIT: 10, tasaPct: 3 },
  vehicular: { tasaPct: 1, anios: 3 },
  beneficio50UIT: { topeUIT: 50 },
};

/** Devuelve la configuracion fiscal del anio (hoy solo 2026). */
export function getFiscalYear(_year?: number): FiscalYear {
  return FISCAL_2026;
}
