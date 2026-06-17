// Pagina institucional: mision sintetizada del SAT y fuentes oficiales vivas.
// Capa institucional, despues de las tareas ciudadanas de alta demanda.

import { PageFrame } from "../components/PageFrame";
import { sourceLinks } from "../data/satData";

export default function Institution() {
  return (
    <PageFrame
      label="Institucion"
      title="El SAT como servicio que ordena ingresos y obligaciones de Lima"
      copy="La capa institucional se conserva, pero queda despues de las tareas ciudadanas de alta demanda."
    >
      <div className="dense-grid">
        <div className="feature-panel wide">
          <h2>Mision sintetizada</h2>
          <p>
            Promover el cumplimiento oportuno de obligaciones tributarias y no tributarias a traves
            de un servicio transparente y de calidad para la Municipalidad Metropolitana de Lima.
          </p>
          <div className="token-row">
            <span>Fiscaliza</span>
            <span>Recauda</span>
            <span>Orienta</span>
            <span>Resuelve</span>
          </div>
        </div>
        <div className="feature-panel">
          <h2>Fuentes vivas</h2>
          <ul className="source-list">
            {sourceLinks.slice(0, 5).map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageFrame>
  );
}
