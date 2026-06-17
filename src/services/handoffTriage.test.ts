import { describe, expect, it } from "vitest";
import type { ChatMessage } from "../types";
import { triageHandoff } from "./handoffTriage";

function u(content: string, i = 0): ChatMessage {
  return { id: `u-${i}`, role: "user", content, createdAt: "" };
}

describe("triageHandoff", () => {
  it("deriva caso coactivo como critico con contacto humano", () => {
    const a = triageHandoff([u("mi placa esta en cobranza coactiva y me embargan")]);
    expect(a.handoffRequired).toBe(true);
    expect(a.priority).toBe("critical");
    expect(a.userContactNeeded).toBe(true);
    expect(a.reasonCode).toBe("legal_coactiva");
  });

  it("marca pago fallido como alta prioridad", () => {
    const a = triageHandoff([u("pague pero fallo el pago y me cobraron igual")]);
    expect(a.handoffRequired).toBe(true);
    expect(a.priority).toBe("high");
    expect(a.reasonCode).toBe("pago_fallido");
  });

  it("no deriva una consulta simple", () => {
    const a = triageHandoff([u("como pago mi predial")]);
    expect(a.handoffRequired).toBe(false);
  });

  it("deriva tras multiples intentos sin resolver", () => {
    const a = triageHandoff([u("hola", 1), u("no se", 2), u("ayuda", 3), u("sigo sin entender", 4)]);
    expect(a.handoffRequired).toBe(true);
    expect(a.reasonCode).toBe("intentos_multiples");
  });
});
