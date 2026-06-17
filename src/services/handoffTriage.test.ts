import { describe, expect, it } from "vitest";
import type { ChatMessage } from "../types";
import { triageHandoff } from "./handoffTriage";

function u(content: string, i = 0): ChatMessage {
  return { id: `u-${i}`, role: "user", content, createdAt: "" };
}
function a(content: string, i = 0): ChatMessage {
  return { id: `a-${i}`, role: "assistant", content, createdAt: "" };
}

describe("triageHandoff", () => {
  it("deriva caso coactivo como critico con contacto humano", () => {
    const r = triageHandoff([u("mi placa esta en cobranza coactiva y me embargan")]);
    expect(r.handoffRequired).toBe(true);
    expect(r.priority).toBe("critical");
    expect(r.userContactNeeded).toBe(true);
    expect(r.reasonCode).toBe("legal_coactiva");
  });

  it("captura del vehiculo sigue siendo critico (verdadero positivo)", () => {
    expect(triageHandoff([u("me hicieron la captura del vehiculo")]).reasonCode).toBe("legal_coactiva");
  });

  it("NO marca critico una captura de pantalla (falso positivo evitado)", () => {
    const r = triageHandoff([u("te paso una captura de pantalla del recibo de pago")]);
    expect(r.priority).not.toBe("critical");
    expect(r.reasonCode).not.toBe("legal_coactiva");
  });

  it("NO deriva 'esto es un pago de predial' (frustracion no se sobre-dispara)", () => {
    expect(triageHandoff([u("esto es un pago de predial, verdad?")]).handoffRequired).toBe(false);
  });

  it("marca pago fallido como alta prioridad", () => {
    const r = triageHandoff([u("pague pero fallo el pago y me cobraron igual")]);
    expect(r.handoffRequired).toBe(true);
    expect(r.priority).toBe("high");
    expect(r.reasonCode).toBe("pago_fallido");
  });

  it("deriva consulta juridica compleja (impugnacion/prescripcion) como alta", () => {
    const r = triageHandoff([u("quiero impugnar la papeleta y alegar prescripcion")]);
    expect(r.handoffRequired).toBe(true);
    expect(r.priority).toBe("high");
    expect(r.reasonCode).toBe("consulta_compleja_juridica");
    expect(r.userContactNeeded).toBe(true);
  });

  it("reserva tributaria: deuda propia NO deriva a humano, pide autenticacion", () => {
    const r = triageHandoff([u("quiero ver mi deuda, cuanto debo")]);
    expect(r.reasonCode).toBe("reserva_tributaria");
    expect(r.handoffRequired).toBe(false);
    expect(r.userContactNeeded).toBe(false);
    expect(r.suggestedNextAction.toLowerCase()).toContain("sesion");
  });

  it("baja confianza / fuera de alcance: deriva tras fallback repetido", () => {
    const r = triageHandoff([
      u("una cosa rara", 1),
      a("Puedo orientarte mejor si me dices que necesitas", 1),
      u("otra cosa", 2),
      a("Puedo orientarte mejor si me dices que necesitas", 2),
    ]);
    expect(r.handoffRequired).toBe(true);
    expect(r.reasonCode).toBe("baja_confianza");
  });

  it("no deriva una consulta simple", () => {
    const r = triageHandoff([u("como pago mi predial")]);
    expect(r.handoffRequired).toBe(false);
    expect(r.reasonCode).toBe("ninguno");
  });

  it("deriva tras multiples intentos sin resolver", () => {
    const r = triageHandoff([u("hola", 1), u("no se", 2), u("ayuda", 3), u("sigo sin entender", 4)]);
    expect(r.handoffRequired).toBe(true);
    expect(r.reasonCode).toBe("intentos_multiples");
  });
});
