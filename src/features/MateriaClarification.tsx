// Desambiguacion "paso 0" por materia (Bloque 6): aclara las confusiones
// costosas conocidas ANTES de que el ciudadano se equivoque (predial solo
// Cercado, alcabala al SAT y no a la municipalidad, papeleta vs multa). Usa
// <details>/<summary> nativos: accesible y operable por teclado sin JS extra.

import { HelpCircle } from "lucide-react";
import { FISCAL_2026 } from "../data/fiscal/2026";

type Materia = "tributos" | "papeletas";

const { alcabala, vehicular } = FISCAL_2026;

const CLARIFICATIONS: Record<Materia, { q: string; a: string }[]> = {
  tributos: [
    {
      q: "¿Predial o arbitrios?",
      a: "El SAT administra predial y arbitrios SOLO del Cercado de Lima. Si tu predio esta en otro distrito, paga en tu municipalidad distrital.",
    },
    {
      q: "¿Impuesto vehicular?",
      a: `Es de toda la provincia de Lima. Se paga ${vehicular.tasaPct}% del valor del vehiculo por ${vehicular.anios} anios. No es lo mismo que una papeleta.`,
    },
    {
      q: "¿Alcabala (compre un inmueble)?",
      a: `En la provincia de Lima la alcabala se paga al SAT, NO a la municipalidad distrital. Es ${alcabala.tasaPct}% sobre el exceso de ${alcabala.tramoInafectoUIT} UIT del valor de transferencia.`,
    },
  ],
  papeletas: [
    {
      q: "¿Papeleta de transito?",
      a: "Infraccion asociada a una placa (codigo M/G/L). Revisa si tienes descuento por pago voluntario dentro del plazo.",
    },
    {
      q: "¿Multa administrativa?",
      a: "Es una sancion distinta a la de transito (por ejemplo, de un establecimiento). Se consulta y paga por separado.",
    },
    {
      q: "¿Ya esta en cobranza coactiva?",
      a: "Si la deuda esta en coactiva, habla con un asesor antes de pagar y nunca recurras a tramitadores.",
    },
  ],
};

export function MateriaClarification({ materia }: { materia: Materia }) {
  const items = CLARIFICATIONS[materia];
  return (
    <section className="materia-clarif" aria-label="Antes de empezar: aclara tu caso">
      <div className="materia-clarif-head">
        <span className="materia-clarif-icon" aria-hidden="true">
          <HelpCircle size={18} />
        </span>
        <div>
          <strong>Antes de empezar, identifica tu caso</strong>
          <p>Evita pagar de mas o en el lugar equivocado.</p>
        </div>
      </div>
      <div className="materia-clarif-list">
        {items.map((item) => (
          <details key={item.q} className="materia-clarif-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
