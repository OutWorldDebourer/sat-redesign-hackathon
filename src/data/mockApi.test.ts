import { describe, it, expect } from "vitest";
import { consultarDemo, consultarSAT } from "./mockApi";

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

  it("resuelve un codigo de pago (pestaña codigo)", () => {
    const r = consultarSAT("CP-2026-018");
    expect(r.status).toBe("success");
    if (r.status === "success") expect(r.type).toBe("codigo");
  });

  it("resuelve un RUC y expone el estado en coactivo", () => {
    expect(consultarSAT("20554871093").status).toBe("success");
    const r = consultarSAT("ABC-250");
    if (r.status === "success") expect(r.data.estado).toBe("En coactivo");
  });

  it("devuelve error ante un dato desconocido", () => {
    expect(consultarSAT("ZZZ-999").status).toBe("error");
  });
});

describe("consultarDemo (exposicion)", () => {
  it("devuelve los datos reales cuando el documento existe", () => {
    const r = consultarDemo("ABC-123", "placa");
    expect(r.status).toBe("success");
    if (r.status === "success") {
      expect(r.data.owner).toBe("Diego Salazar");
      expect(r.data.demo).toBeUndefined();
    }
  });

  it("sintetiza un resultado demo-friendly para un documento inventado", () => {
    const r = consultarDemo("DEMO-EXPO-123", "placa");
    expect(r.status).toBe("success");
    if (r.status === "success") {
      expect(r.type).toBe("placa");
      expect(r.data.demo).toBe(true);
      expect(r.data.owner).toBeTruthy();
      expect(r.data.multa ?? r.data.monto ?? 0).toBeGreaterThan(0);
    }
  });

  it("mapea la pestaña al tipo de resultado sintetico", () => {
    const dni = consultarDemo("texto-libre", "dni-ruc");
    const exp = consultarDemo("texto-libre", "expediente");
    if (dni.status === "success") expect(dni.type).toBe("dni");
    if (exp.status === "success") {
      expect(exp.type).toBe("expediente");
      expect(exp.data.monto).toBe(0); // expediente: trámite, no deuda
    }
  });

  it("es determinista: el mismo dato produce el mismo monto", () => {
    const a = consultarDemo("XYZ-INVENTADO", "codigo");
    const b = consultarDemo("XYZ-INVENTADO", "codigo");
    if (a.status === "success" && b.status === "success") {
      expect(a.data.monto).toBe(b.data.monto);
    }
  });

  it("no sintetiza ante un dato vacio (lo bloquea el formulario)", () => {
    expect(consultarDemo("   ", "placa").status).toBe("error");
  });
});
