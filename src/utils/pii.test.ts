import { describe, expect, it } from "vitest";
import { anonymizePII, containsPII } from "./pii";

describe("containsPII", () => {
  it("detecta DNI, RUC y placa", () => {
    expect(containsPII("mi dni es 48592013")).toBe(true);
    expect(containsPII("ruc 20123456789")).toBe(true);
    expect(containsPII("placa ABC-123")).toBe(true);
    expect(containsPII("placa ABC123")).toBe(true);
  });

  it("detecta DNI con separadores y placa de moto", () => {
    expect(containsPII("dni 4859 2013")).toBe(true);
    expect(containsPII("placa MA-1234")).toBe(true);
    expect(containsPII("mi celular 948592013")).toBe(true);
  });

  it("detecta correo y telefono fijo", () => {
    expect(containsPII("contacto ana@sat.gob.pe")).toBe(true);
    expect(containsPII("fijo 6125555")).toBe(true);
  });

  it("no marca texto sin identificadores", () => {
    expect(containsPII("como pago mi predial")).toBe(false);
    expect(containsPII("vence el 27 de febrero")).toBe(false);
    expect(containsPII("son S/ 1,847.30")).toBe(false);
  });
});

describe("anonymizePII", () => {
  it("enmascara identificadores", () => {
    expect(anonymizePII("dni 48592013 y placa ABC-123")).toBe("dni [DNI] y placa [PLACA]");
    expect(anonymizePII("ruc 20123456789")).toBe("ruc [RUC]");
  });

  it("enmascara DNI con espacios, celular y placa de moto", () => {
    expect(anonymizePII("dni 4859 2013")).toBe("dni [DNI]");
    expect(anonymizePII("placa MA-1234")).toBe("placa [PLACA]");
    expect(anonymizePII("mi numero 948592013")).toBe("mi numero [TEL]");
  });

  it("enmascara correo y telefono fijo", () => {
    expect(anonymizePII("escribeme a juan.perez@gmail.com")).toBe("escribeme a [CORREO]");
    expect(anonymizePII("mi telefono fijo es 6125555")).toBe("mi telefono fijo es [TEL]");
  });

  it("no confunde un RUC con un DNI", () => {
    expect(anonymizePII("20123456789")).toBe("[RUC]");
  });

  it("deja intacto el texto sin PII y los montos", () => {
    expect(anonymizePII("quiero fraccionar mi deuda")).toBe("quiero fraccionar mi deuda");
    expect(anonymizePII("son S/ 1,847.30")).toBe("son S/ 1,847.30");
  });
});
