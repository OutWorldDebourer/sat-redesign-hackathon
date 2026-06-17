// Pagina de inicio: hero con la caja de accion universal + panel guia, rutas
// ciudadanas por intencion (envian al asistente), indicadores urbanos y franja
// de beneficios. Consume el adapter satApi para la consulta demo.

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { HeroInfoPanel } from "../components/HeroInfoPanel/HeroInfoPanel";
import { SectionHeading } from "../components/SectionHeading";
import { UniversalActionBox } from "../components/UniversalActionBox";
import { iconFor } from "../components/icons/iconFor";
import { paymentTabs } from "../data/satData";
import { benefitItems, heroAccessItems, routeLanes, urbanIndicators } from "../data/homeData";
import { satApi, type MockResultData } from "../services/satApi";

export default function Home({
  onAssistantIntent,
}: {
  onAssistantIntent: (intentId: string) => void;
}) {
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const activeRouteTimer = useRef<number | null>(null);
  const activeRoute = routeLanes.find((lane) => lane.id === activeRouteId);

  // ── Estado de la consulta inline ─────────────────────────────
  const [activeTab, setActiveTab] = useState(paymentTabs[0].id);
  const [searchResult, setSearchResult] = useState<MockResultData | null>(null);
  const [searchStep, setSearchStep] = useState<1 | 2 | 3 | 4>(1);
  const [searched, setSearched] = useState(false);

  const handleSearch = (query: string) => {
    setSearchStep(2);
    setSearched(true);
    const response = satApi.consultar(query);
    if (response.status === "success") {
      setSearchResult(response.data);
      setSearchStep(3);
    } else {
      setSearchResult(null); // muestra la tarjeta amable "sin multas"
      setSearchStep(3);
    }
  };

  useEffect(() => {
    return () => {
      if (activeRouteTimer.current) {
        window.clearTimeout(activeRouteTimer.current);
      }
    };
  }, []);

  const handleRouteIntent = (lane: (typeof routeLanes)[number]) => {
    if (activeRouteTimer.current) {
      window.clearTimeout(activeRouteTimer.current);
    }

    setActiveRouteId(lane.id);
    onAssistantIntent(lane.intentId);
    activeRouteTimer.current = window.setTimeout(() => {
      setActiveRouteId(null);
      activeRouteTimer.current = null;
    }, 1800);
  };

  return (
    <>
      <section className="home-canvas">
        <section className="hero-band">
          <div className="hero-copy">
            <h1>Empieza con el dato que tienes</h1>
            <p className="philosophy-note">Planificacion, organizacion, direccion y control</p>
            <UniversalActionBox
              onSubmit={handleSearch}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setSearched(false);
                setSearchResult(null);
                setSearchStep(1);
              }}
            />
            <div className="hero-access-grid" aria-label="Accesos rapidos">
              {heroAccessItems.map((item) =>
                "href" in item ? (
                  <a
                    className="hero-access-card"
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{iconFor(item.icon)}</span>
                    {item.label}
                  </a>
                ) : (
                  <Link className="hero-access-card" key={item.label} to={item.path}>
                    <span>{iconFor(item.icon)}</span>
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>
          <div className="hero-visual">
            <HeroInfoPanel
              activeTab={activeTab}
              step={searchStep}
              result={searchResult}
              noResult={searched && searchResult === null}
            />
          </div>
        </section>

        <section className="section-block route-center">
          <SectionHeading
            label="Elige tu ruta"
            title="Rutas ciudadanas mas usadas"
            copy="Agrupadas por intencion, no por nombres internos."
          />
          <p className="sr-only" aria-live="polite">
            {activeRoute ? `Ruta ${activeRoute.title} enviada al asistente SAT.` : ""}
          </p>
          <div className={`route-card-grid${activeRouteId ? " has-active-route" : ""}`}>
            {routeLanes.map((lane, index) => (
              <article
                className={`route-card tone-${lane.tone}${activeRouteId === lane.id ? " is-selected" : ""}`}
                key={lane.id}
                style={{ "--lane-delay": `${120 + index * 45}ms` } as CSSProperties}
              >
                <div className="route-card-head">
                  <span className="route-card-icon">{iconFor(lane.icon)}</span>
                  <h3>{lane.title}</h3>
                  {activeRouteId === lane.id ? (
                    <span className="route-state-mark" aria-hidden="true">
                      <CheckCircle2 size={15} />
                    </span>
                  ) : null}
                </div>
                <p>{lane.cue}</p>
                <div className="route-requirement">
                  <span>Requiere:</span>
                  <strong>{lane.data}</strong>
                </div>
                <button
                  className="route-action"
                  type="button"
                  aria-label={`Abrir copiloto para ${lane.title}`}
                  onClick={() => handleRouteIntent(lane)}
                >
                  <span>Abrir asistente</span>
                  <ArrowRight size={18} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="urban-panorama" aria-labelledby="urban-title">
          <div className="section-heading compact">
            <span className="eyebrow">Tu panorama urbano</span>
            <h2 id="urban-title">Indicadores que te ayudan a decidir</h2>
          </div>
          <div className="indicator-grid">
            {urbanIndicators.map((item) => (
              <article className={`indicator-card tone-${item.tone}`} key={item.title}>
                <span className="indicator-icon">{iconFor(item.icon)}</span>
                <div>
                  <h3>{item.title}</h3>
                  <strong>{item.value}</strong>
                  <p>{item.copy}</p>
                  <span>{item.action}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="benefit-strip" aria-label="Beneficios del rediseño">
        {benefitItems.map((item) => (
          <article className="benefit-item" key={item.title}>
            <span>{iconFor(item.icon)}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
