import { describe, it, expect } from "vitest";
import { sanitizeQuery, validateQuery, getConstraints } from "./inputValidation";

describe("sanitizeQuery", () => {
  it("formatea la placa con guion (3 letras + 3 digitos)", () => {
    expect(sanitizeQuery("placa", "abc123")).toBe("ABC-123");
  });
  it("descarta no-digitos en DNI/RUC", () => {
    expect(sanitizeQuery("dni-ruc", "12a34b")).toBe("1234");
  });
  it("limita el RUC a 11 digitos", () => {
    expect(sanitizeQuery("dni-ruc", "123456789012345")).toBe("12345678901");
  });
});

describe("validateQuery", () => {
  it("acepta una placa valida", () => {
    expect(validateQuery("placa", "ABC-123").valid).toBe(true);
  });
  it("rechaza una placa con formato invalido", () => {
    expect(validateQuery("placa", "AB-12").valid).toBe(false);
  });
  it("acepta DNI de 8 digitos y RUC de 11", () => {
    expect(validateQuery("dni-ruc", "12345678").valid).toBe(true);
    expect(validateQuery("dni-ruc", "12345678901").valid).toBe(true);
  });
  it("rechaza un valor vacio", () => {
    expect(validateQuery("placa", "").valid).toBe(false);
  });
});

describe("getConstraints", () => {
  it("placa: maxLength 7 y mayusculas", () => {
    const c = getConstraints("placa");
    expect(c.maxLength).toBe(7);
    expect(c.autoCapitalize).toBe("characters");
  });
  it("dni-ruc: teclado numerico", () => {
    expect(getConstraints("dni-ruc").inputMode).toBe("numeric");
  });
});
