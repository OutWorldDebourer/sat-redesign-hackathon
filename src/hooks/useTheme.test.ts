import { describe, expect, it } from "vitest";

import { resolveTheme } from "./useTheme";

// Contrato del default visual: claro salvo eleccion explicita de oscuro.
describe("resolveTheme", () => {
  it("usa claro por defecto cuando no hay valor guardado (visita nueva / storage limpio)", () => {
    expect(resolveTheme(null)).toBe("light");
  });

  it("aplica oscuro solo con el valor explicito 'dark'", () => {
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("respeta 'light' guardado", () => {
    expect(resolveTheme("light")).toBe("light");
  });

  it("cae a claro con el valor legacy 'system' (migracion suave)", () => {
    expect(resolveTheme("system")).toBe("light");
  });

  it("cae a claro con cadena vacia o valores invalidos", () => {
    expect(resolveTheme("")).toBe("light");
    expect(resolveTheme("DARK")).toBe("light");
    expect(resolveTheme("oscuro")).toBe("light");
  });
});
