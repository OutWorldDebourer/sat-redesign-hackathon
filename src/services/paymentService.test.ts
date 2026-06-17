import { describe, expect, it } from "vitest";
import { generateReceiptHTML, validateCard } from "./paymentService";

describe("validateCard", () => {
  it("acepta 16 digitos y CVV de 3", () => {
    expect(validateCard({ cardNum: "4557 1234 8890 0021", cvv: "742" })).toBe(true);
  });

  it("rechaza tarjeta incompleta", () => {
    expect(validateCard({ cardNum: "4557 1234", cvv: "742" })).toBe(false);
  });

  it("rechaza CVV invalido", () => {
    expect(validateCard({ cardNum: "4557123488900021", cvv: "74" })).toBe(false);
  });
});

describe("generateReceiptHTML", () => {
  it("incluye titular, monto, operacion y estado", () => {
    const html = generateReceiptHTML({
      owner: "Pedro Alva",
      amount: 450.5,
      opNum: "OP-SAT-12345678",
      detail: "Papeleta SAT",
      fecha: "17 de junio de 2026",
      hora: "10:30",
    });
    expect(html).toContain("Pedro Alva");
    expect(html).toContain("S/ 450.50");
    expect(html).toContain("OP-SAT-12345678");
    expect(html).toContain("CANCELADO");
  });
});
