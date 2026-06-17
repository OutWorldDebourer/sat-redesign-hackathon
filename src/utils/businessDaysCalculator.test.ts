import { describe, expect, it } from "vitest";
import { addBusinessDays, businessDaysUntil, countBusinessDays } from "./businessDaysCalculator";

// Feriados de prueba (incluye 2026-05-01, Dia del Trabajo).
const HOLIDAYS = ["2026-05-01"];

describe("countBusinessDays", () => {
  it("cuenta lun-vie sin feriados (start exclusivo, end inclusivo)", () => {
    // 2026-02-23 (lun) -> 2026-02-27 (vie): mar, mie, jue, vie = 4.
    expect(countBusinessDays("2026-02-23", "2026-02-27", [])).toBe(4);
  });

  it("excluye fines de semana y feriados", () => {
    // 2026-04-30 (jue) -> 2026-05-04 (lun): vie 1-may (feriado), sab, dom, lun = 1.
    expect(countBusinessDays("2026-04-30", "2026-05-04", HOLIDAYS)).toBe(1);
  });

  it("devuelve 0 si la fecha fin no es posterior", () => {
    expect(countBusinessDays("2026-02-27", "2026-02-27", [])).toBe(0);
    expect(countBusinessDays("2026-03-01", "2026-02-01", [])).toBe(0);
  });
});

describe("addBusinessDays", () => {
  it("suma dias habiles saltando fin de semana", () => {
    // 2026-02-27 (vie) + 3 habiles = 2026-03-04 (mie).
    expect(addBusinessDays("2026-02-27", 3, [])).toBe("2026-03-04");
  });
});

describe("businessDaysUntil", () => {
  it("usa el hoy provisto", () => {
    expect(businessDaysUntil("2026-02-27", [], "2026-02-23")).toBe(4);
  });
});
