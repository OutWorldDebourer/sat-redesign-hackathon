// Tarjeta de servicio (tributo o multa): icono, etiqueta de categoria, titulo,
// descripcion, acciones disponibles y enlace a la fuente oficial.

import { ArrowRight } from "lucide-react";
import { serviceItems } from "../data/satData";
import { iconFor } from "./icons/iconFor";

export function ServiceCard({ item }: { item: (typeof serviceItems)[number] }) {
  return (
    <article className="service-card">
      <span className="service-icon">{iconFor(item.icon)}</span>
      <div>
        <span className="status-pill">{item.category === "tributo" ? "Tributo" : "Multa"}</span>
        <h2>{item.title}</h2>
        <p>{item.description}</p>
      </div>
      <ul className="check-list compact">
        {item.actions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ul>
      <a href={item.source.url} target="_blank" rel="noreferrer" className="text-link">
        Fuente oficial <ArrowRight size={16} />
      </a>
    </article>
  );
}
