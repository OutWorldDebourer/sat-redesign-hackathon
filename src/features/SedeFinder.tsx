// Localizador de sedes: filtra agencias y centros del SAT por distrito y por
// materia/servicio, y sugiere el canal. Consume officeLocations de satData.

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { officeLocations } from "../data/satData";

const ALL = "todos";

export function SedeFinder() {
  const [distrito, setDistrito] = useState(ALL);
  const [materia, setMateria] = useState(ALL);

  const distritos = useMemo(
    () => Array.from(new Set(officeLocations.map((o) => o.district))).sort(),
    [],
  );
  const materias = useMemo(
    () => Array.from(new Set(officeLocations.flatMap((o) => o.services))).sort(),
    [],
  );

  const filtered = officeLocations.filter(
    (o) =>
      (distrito === ALL || o.district === distrito) &&
      (materia === ALL || o.services.includes(materia)),
  );

  return (
    <section className="feature-card" aria-label="Localizador de sedes">
      <header className="feature-head">
        <h3>Encuentra tu sede</h3>
        <p>Filtra por distrito y por el tramite que necesitas. Antes de ir, revisa si se resuelve en linea.</p>
      </header>

      <div className="sede-filters">
        <label className="field-label" htmlFor="sede-distrito">
          Distrito
          <select id="sede-distrito" className="text-input" value={distrito} onChange={(e) => setDistrito(e.target.value)}>
            <option value={ALL}>Todos</option>
            {distritos.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label" htmlFor="sede-materia">
          Tramite o servicio
          <select id="sede-materia" className="text-input" value={materia} onChange={(e) => setMateria(e.target.value)}>
            <option value={ALL}>Todos</option>
            {materias.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="sede-count" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "sede encontrada" : "sedes encontradas"}
      </p>

      {filtered.length === 0 ? (
        <p className="feature-empty">No hay sedes con ese filtro. Prueba otro distrito o materia.</p>
      ) : (
        <ul className="sede-list">
          {filtered.map((office) => (
            <li key={office.id} className="sede-item">
              <span className="sede-icon" aria-hidden="true">
                <MapPin size={18} />
              </span>
              <div>
                <strong>{office.name}</strong>
                <span className="sede-address">{office.address}</span>
                <span className="sede-meta">
                  {office.hours} · {office.services.join(" · ")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
