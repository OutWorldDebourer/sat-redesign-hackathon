// Catalogo de servicios: tributos o papeletas/multas segun `kind`. Filtra
// serviceItems por categoria y los renderiza con ServiceCard.

import { PageFrame } from "../components/PageFrame";
import { ServiceCard } from "../components/ServiceCard";
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
      <div className="service-grid">
        {items.map((item) => (
          <ServiceCard key={item.id} item={item} />
        ))}
      </div>
    </PageFrame>
  );
}
