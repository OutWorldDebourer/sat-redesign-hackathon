import { describe, it, expect } from "vitest";
import { consultarSAT } from "./mockApi";

describe("consultarSAT", () => {
  it("encuentra una placa conocida", () => {
    const r = consultarSAT("ABC-123");
    expect(r.status).toBe("success");
    if (r.status === "success") {
      expect(r.type).toBe("placa");
      expect(r.data.owner).toBeTruthy();
    }
  });

  it("normaliza a mayusculas (case-insensitive en placa)", () => {
    expect(consultarSAT("abc-123").status).toBe("success");
  });

  it("encuentra un DNI conocido", () => {
    const r = consultarSAT("12345678");
    expect(r.status).toBe("success");
    if (r.status === "success") expect(r.type).toBe("dni");
  });

  it("encuentra un expediente conocido", () => {
    expect(consultarSAT("EXP-2024-001").status).toBe("success");
  });

  it("devuelve error ante un dato desconocido", () => {
    expect(consultarSAT("ZZZ-999").status).toBe("error");
  });
});
