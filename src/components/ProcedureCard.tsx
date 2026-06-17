// Tarjeta de tramite: canal, titulo, descripcion y enlace al detalle de pasos.

import { Link } from "react-router-dom";
import type { Procedure } from "../types";

export function ProcedureCard({ procedure }: { procedure: Procedure }) {
  return (
    <article className="procedure-card">
      <div>
        <span className="status-pill">{procedure.channel}</span>
        <h2>{procedure.title}</h2>
        <p>{procedure.description}</p>
      </div>
      <Link className="secondary-action full" to={`/tramite/${procedure.id}`}>
        Ver pasos
      </Link>
    </article>
  );
}
