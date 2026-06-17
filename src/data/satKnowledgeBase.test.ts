import { describe, expect, it } from "vitest";
import { buildSatKnowledgeBase, KB_VERSION } from "./satKnowledgeBase";

describe("buildSatKnowledgeBase", () => {
  const kb = buildSatKnowledgeBase();

  it("incluye las secciones canonicas", () => {
    for (const section of [
      "SERVICIOS:",
      "TRAMITES",
      "PREGUNTAS FRECUENTES:",
      "RESPUESTAS GUIA POR INTENCION:",
      "SEDES Y CANALES",
      "ENLACES OFICIALES:",
      "LIMITES DE LA ORIENTACION:",
    ]) {
      expect(kb).toContain(section);
    }
  });

  it("cubre materias y reglas clave del SAT", () => {
    expect(kb).toContain("Cercado de Lima"); // predial/arbitrios scope
    expect(kb).toContain("alcabala"); // alcabala (case del texto)
    expect(kb).toContain("app.sat.gob.pe"); // anti-suplantacion
    expect(kb).toContain(`v${KB_VERSION}`);
  });

  it("es sustancial pero acotado para el prompt", () => {
    expect(kb.length).toBeGreaterThan(1500);
    expect(kb.length).toBeLessThan(30000);
  });
});
