// Pagina de tramites digitales: lista los tramites con ProcedureCard, cada uno
// enlaza a su detalle de pasos.

import { PageFrame } from "../components/PageFrame";
import { ProcedureCard } from "../components/ProcedureCard";
import { procedures } from "../data/satData";

export default function Procedures() {
  return (
    <PageFrame
      label="Tramites digitales"
      title="Agencia Virtual y Mesa de Partes como centro de operaciones"
      copy="Cada tramite muestra requisitos, canal, plazo referencial y pasos demo antes de enviar al sistema oficial."
    >
      <div className="procedure-grid">
        {procedures.map((procedure) => (
          <ProcedureCard key={procedure.id} procedure={procedure} />
        ))}
      </div>
    </PageFrame>
  );
}
