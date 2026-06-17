// Catalogo de servicios: tributos o papeletas/multas segun `kind`. Filtra
// serviceItems por categoria y los renderiza con ServiceCard.

import { PageFrame } from "../components/PageFrame";
import { ServiceCard } from "../components/ServiceCard";
import { CalendarVencimientos } from "../features/CalendarVencimientos";
import { MateriaClarification } from "../features/MateriaClarification";
import { PapeletaSemaforo } from "../features/PapeletaSemaforo";
import { serviceItems } from "../data/satData";

export default function Catalog({ kind }: { kind: "tributos" | "papeletas" }) {
  const items =
    kind === "tributos"
      ? serviceItems.filter((item) => item.category === "tributo")
      : serviceItems.filter((item) => item.category === "multa");

  return (
    <PageFrame
      label={kind === "tributos" ? "Tributos" : "Papeletas y multas"}
      title={
        kind === "tributos"
          ? "Obligaciones ordenadas por accion"
          : "Consulta, paga o impugna con contexto"
      }
      copy={
        kind === "tributos"
          ? "Predial, arbitrios, vehicular y alcabala con rutas repetibles: informar, consultar, pagar, declarar y fraccionar."
          : "Papeletas y multas administrativas separadas para evitar confusion entre deuda tributaria y sanciones."
      }
    >
      <MateriaClarification materia={kind} />
      <div className="service-grid">
        {items.map((item) => (
          <ServiceCard key={item.id} item={item} />
        ))}
      </div>
      <div className="feature-section">
        {kind === "papeletas" ? <PapeletaSemaforo /> : <CalendarVencimientos />}
      </div>
    </PageFrame>
  );
}
