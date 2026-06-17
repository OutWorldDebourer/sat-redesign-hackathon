// Detalle de tramite (/tramite/:id): ruta sugerida, requisitos y enlace a la
// fuente oficial. Cae al primer tramite si el id no existe.

import { useParams } from "react-router-dom";
import { PageFrame } from "../components/PageFrame";
import { procedures } from "../data/satData";

export default function ProcedureDetail() {
  const { id } = useParams();
  const procedure = procedures.find((item) => item.id === id) ?? procedures[0];

  return (
    <PageFrame label="Detalle de tramite" title={procedure.title} copy={procedure.description}>
      <div className="dense-grid">
        <div className="feature-panel wide">
          <h2>Ruta sugerida</h2>
          <ol className="step-list">
            {procedure.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="feature-panel">
          <h2>Requisitos</h2>
          <ul className="check-list">
            {procedure.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
          <a
            className="primary-action full"
            href={procedure.source.url}
            target="_blank"
            rel="noreferrer"
          >
            Abrir fuente oficial
          </a>
        </div>
      </div>
    </PageFrame>
  );
}
