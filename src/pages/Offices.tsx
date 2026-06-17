// Pagina de atencion y sedes: lista las sedes con tipo, direccion, horario y
// servicios disponibles.

import { PageFrame } from "../components/PageFrame";
import { SedeFinder } from "../features/SedeFinder";
import { officeLocations } from "../data/satData";

export default function Offices() {
  return (
    <PageFrame
      label="Atencion y sedes"
      title="Canal correcto segun tema, horario y ubicacion"
      copy="El prototipo muestra sedes y canales como decisiones guiadas, no como una lista suelta."
    >
      <div className="feature-section">
        <SedeFinder />
      </div>
      <div className="office-grid">
        {officeLocations.map((office) => (
          <article className="office-card" key={office.name}>
            <div>
              <span className="status-pill">{office.type}</span>
              <h2>{office.name}</h2>
              <p>{office.address}</p>
            </div>
            <div className="office-meta">
              <span>{office.hours}</span>
              <span>{office.services.join(" · ")}</span>
            </div>
          </article>
        ))}
      </div>
    </PageFrame>
  );
}
