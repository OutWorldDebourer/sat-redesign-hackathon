import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  ClipboardList,
  CreditCard,
  FileQuestion,
  FileText,
  Heart,
  Landmark,
  MapPin,
  Menu,
  PanelRight,
  Rocket,
  Search,
  Shield,
  ShieldCheck,
  Smartphone,
  ThumbsUp,
  Wallet,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Assistant, type AssistantCommand } from "./components/assistant/Assistant";
import { consultarSAT, type MockResultData } from "./data/mockApi";
import {
  navItems,
  officeLocations,
  paymentTabs,
  procedures,
  serviceItems,
  sourceLinks,
} from "./data/satData";

const externalLinks = {
  agenciaVirtual: "https://www.sat.gob.pe/websitev9/Servicios/AgenciaVirtual",
  mesaPartes: "https://www.sat.gob.pe/WebSiteV9/Tramites/MesaPartesDigital",
  citas: "https://www.sat.gob.pe/WebSiteV9/CanalesAtencion/CitasSAT",
  pagos: "https://www.sat.gob.pe/WebSiteV9/Inicio/ciudadano/p/pagosenlinea",
};

const routeLanes = [
  {
    id: "papeleta",
    title: "Papeleta",
    cue: "Consulta, descargos y pago de papeletas.",
    data: "Placa o N. de papeleta",
    next: "Ver descuentos y opciones de pago",
    path: "/papeletas-multas",
    icon: "shield",
    tone: "consultar",
    intentId: "intent-consultar-deuda",
  },
  {
    id: "vehiculo",
    title: "Vehiculo",
    cue: "Tramites, transferencias y consultas vehiculares.",
    data: "Placa",
    next: "Revisar deuda o declaracion",
    path: "/tributos",
    icon: "car",
    tone: "pagar",
    intentId: "intent-declarar",
  },
  {
    id: "predio",
    title: "Predio",
    cue: "Impuestos, arbitrios y consultas de predio.",
    data: "Codigo de predio",
    next: "Consultar o declarar",
    path: "/tributos",
    icon: "home",
    tone: "predio",
    intentId: "intent-consultar-deuda",
  },
  {
    id: "alcabala",
    title: "Alcabala",
    cue: "Compra de inmuebles y declaracion jurada.",
    data: "DNI / RUC",
    next: "Liquidar requisitos",
    path: "/tributos",
    icon: "file",
    tone: "alcabala",
    intentId: "intent-declarar",
  },
  {
    id: "fraccionamiento",
    title: "Fraccionar",
    cue: "Fracciona y regulariza tus deudas.",
    data: "Deuda pendiente",
    next: "Simular facilidad",
    path: "/fraccionamiento",
    icon: "rocket",
    tone: "fraccionar",
    intentId: "intent-fraccionar",
  },
  {
    id: "sede",
    title: "Sede",
    cue: "Atencion presencial, horarios y ubicacion.",
    data: "Distrito o sede",
    next: "Elegir canal",
    path: "/atencion-sedes",
    icon: "map",
    tone: "sedes",
    intentId: "intent-contactar",
  },
];

const heroAccessItems = [
  { label: "Agencia Virtual", icon: "shield", href: externalLinks.agenciaVirtual },
  { label: "Mesa de Partes", icon: "form", href: externalLinks.mesaPartes },
  { label: "Citas", icon: "calendar", href: externalLinks.citas },
  { label: "Sedes y canales", icon: "map", path: "/atencion-sedes" },
];

const urbanIndicators = [
  {
    title: "Plazos proximos",
    value: "3 obligaciones",
    copy: "vencen pronto",
    action: "Ver calendario",
    icon: "clock",
    tone: "consultar",
  },
  {
    title: "Ahorra tiempo",
    value: "Paga en linea",
    copy: "y evita colas",
    action: "Ir a pagar",
    icon: "wallet",
    tone: "pagar",
  },
  {
    title: "Evita recargos",
    value: "Manten tus pagos",
    copy: "al dia",
    action: "Mas informacion",
    icon: "calendarDays",
    tone: "alcabala",
  },
  {
    title: "Canales oficiales",
    value: "Sedes, telefonicos",
    copy: "y digitales",
    action: "Ver canales",
    icon: "map",
    tone: "sedes",
  },
];

const benefitItems = [
  { title: "Mas claro", copy: "Encontrar lo que necesitas en menos pasos.", icon: "heart" },
  { title: "Mas rapido", copy: "Rutas guiadas que te llevan directo.", icon: "workflow" },
  { title: "Mas humano", copy: "Un copiloto que te acompana siempre.", icon: "assistant" },
  { title: "Mas confiable", copy: "Informacion oficial, directa y actualizada.", icon: "badge" },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assistantCommand, setAssistantCommand] = useState<AssistantCommand | null>(null);
  const location = useLocation();

  const triggerAssistant = (intentId: string) => {
    setAssistantCommand({ id: `${intentId}-${Date.now()}`, intentId });
  };

  return (
    <div className="app-shell">
      <div className="site-region">
        <header className="site-header">
          <Link className="brand" to="/" aria-label="Ir al inicio SAT">
            <span className="brand-mark">SAT</span>
            <span>
              <strong>Lima</strong>
              <small>Servicio SAT</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Navegacion principal">
            {navItems.slice(0, 6).map((item) => (
              <NavLink key={item.path} to={item.path}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <a className="ghost-link" href={externalLinks.mesaPartes} target="_blank" rel="noreferrer">
              Mesa de Partes
            </a>
            <a className="ghost-link" href={externalLinks.citas} target="_blank" rel="noreferrer">
              Citas
            </a>
            <Link className="primary-action" to="/consultar-pagar">
              Consultar
              <ArrowRight size={18} />
            </Link>
            <button
              className="icon-button mobile-only"
              type="button"
              aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {mobileMenuOpen ? (
          <nav className="mobile-nav" aria-label="Menu movil">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                {item.label}
                <ChevronRight size={16} />
              </NavLink>
            ))}
          </nav>
        ) : null}

        <main className="main-content" key={location.pathname}>
          <Routes>
            <Route path="/" element={<HomePage onAssistantIntent={triggerAssistant} />} />
            <Route path="/consultar-pagar" element={<ConsultPayPage />} />
            <Route path="/tributos" element={<CatalogPage kind="tributos" />} />
            <Route path="/papeletas-multas" element={<CatalogPage kind="papeletas" />} />
            <Route path="/tramites-digitales" element={<ProceduresPage />} />
            <Route path="/fraccionamiento" element={<InstallmentsPage />} />
            <Route path="/atencion-sedes" element={<OfficesPage />} />
            <Route path="/institucion" element={<InstitutionPage />} />
            <Route path="/tramite/:id" element={<ProcedureDetailPage />} />
          </Routes>
        </main>
      </div>

      <Assistant pagePath={location.pathname} command={assistantCommand} />
    </div>
  );
}

function HomePage({ onAssistantIntent }: { onAssistantIntent: (intentId: string) => void }) {
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const activeRouteTimer = useRef<number | null>(null);
  const activeRoute = routeLanes.find((lane) => lane.id === activeRouteId);

  // ── Inline search state (replaces modal) ──────────────────────
  const [activeTab, setActiveTab] = useState(paymentTabs[0].id);
  const [searchResult, setSearchResult] = useState<MockResultData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchStep, setSearchStep] = useState<1 | 2 | 3 | 4>(1);
  const [searched, setSearched] = useState(false);

  const handleSearch = (query: string) => {
    setSearchStep(2);
    setSearched(true);
    const response = consultarSAT(query);
    if (response.status === "success") {
      setSearchResult(response.data);
      setSearchError(null);
      setSearchStep(3);
    } else {
      setSearchResult(null);
      setSearchError(null); // show friendly "sin multas" card
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
                setSearchError(null);
                setSearchStep(1);
              }}
            />
            <div className="hero-access-grid" aria-label="Accesos rapidos">
              {heroAccessItems.map((item) =>
                "href" in item ? (
                  <a className="hero-access-card" key={item.label} href={item.href} target="_blank" rel="noreferrer">
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
              searched={searched}
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

function LimaSkyline() {
  return (
    <svg className="lima-skyline" viewBox="0 0 820 390" role="img" aria-label="Ilustracion lineal de Lima">
      <defs>
        <linearGradient id="skylineWash" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#dff0ff" />
          <stop offset="100%" stopColor="#9fc7f6" />
        </linearGradient>
      </defs>
      <path
        className="skyline-haze"
        fill="url(#skylineWash)"
        d="M54 322 C155 258 248 276 339 223 C456 155 552 173 766 100 L766 355 L54 355 Z"
      />
      <g className="skyline-line">
        <path d="M68 342 H764" />
        <path d="M138 342 V184 L168 151 L199 184 V342" />
        <path d="M151 184 V134 H184 V184" />
        <path d="M158 134 C160 109 176 109 178 134" />
        <path d="M162 253 H175 M162 283 H175 M162 313 H175" />
        <path d="M238 342 V209 L283 132 L328 209 V342" />
        <path d="M283 132 V82 M271 96 H296" />
        <path d="M258 236 H309 M270 268 H297 M265 302 H302" />
        <path d="M368 342 V205 H491 V342" />
        <path d="M388 205 C401 150 458 150 471 205" />
        <path d="M414 205 V139 H444 V205" />
        <path d="M423 139 C424 116 436 116 437 139" />
        <path d="M392 239 H467 M392 273 H467 M392 307 H467" />
        <path d="M540 342 V170 L568 139 L598 170 V342" />
        <path d="M552 170 V116 H586 V170" />
        <path d="M559 116 C561 94 577 94 579 116" />
        <path d="M560 238 H580 M560 272 H580 M560 306 H580" />
        <path d="M628 342 V189 L661 151 L694 189 V342" />
        <path d="M640 189 V132 H682 V189" />
        <path d="M648 132 C651 104 671 104 674 132" />
        <path d="M648 236 H674 M648 270 H674 M648 304 H674" />
        <path d="M710 342 V221 H744 V342" />
        <path d="M727 221 V168 M710 168 H744" />
        <path d="M84 178 C104 162 125 162 145 178" />
        <path d="M483 103 C503 88 522 88 541 103" />
        <path d="M600 91 C617 79 632 79 649 91" />
        <path d="M90 342 C98 313 117 293 139 282" />
        <path d="M116 342 C114 313 124 292 149 270" />
        <path d="M107 295 C88 291 75 298 65 315" />
        <path d="M119 287 C137 276 153 279 169 294" />
      </g>
    </svg>
  );
}

function ConsultPayPage() {
  const [searchResult, setSearchResult] = useState<MockResultData | null>(null);
  const [searched, setSearched] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const handleSearch = (query: string) => {
    setStep(2);
    setSearched(true);
    const response = consultarSAT(query);
    if (response.status === "success") {
      setSearchResult(response.data);
      setStep(3);
    } else {
      setSearchResult(null);
      setStep(3);
    }
  };

  return (
    <PageFrame
      label="Consultar y pagar"
      title="Una sola entrada para deuda, papeletas y expedientes"
      copy="Este formulario demo muestra como podria empezar un flujo real sin obligar al usuario a adivinar el sistema correcto."
    >
      <div className="dense-grid">
        <div className="feature-panel wide">
          <UniversalActionBox onSubmit={handleSearch} />
          {searched ? (
            searchResult ? (
              <InlineResultCard data={searchResult} step={step} />
            ) : (
              <NoResultCard />
            )
          ) : (
            <EmptyState />
          )}
        </div>
        <div className="feature-panel">
          <h2>Medios disponibles</h2>
          <ul className="check-list">
            <li>Web SAT y Agencia Virtual.</li>
            <li>Bancos, agentes autorizados y agencias SAT.</li>
            <li>Pago con DNI/RUC, placa, codigo de pago o expediente.</li>
          </ul>
          <a className="secondary-action full" href={externalLinks.pagos} target="_blank" rel="noreferrer">
            Ir al pago oficial
          </a>
        </div>
      </div>
    </PageFrame>
  );
}

function CatalogPage({ kind }: { kind: "tributos" | "papeletas" }) {
  const items =
    kind === "tributos"
      ? serviceItems.filter((item) => item.category === "tributo")
      : serviceItems.filter((item) => item.category === "multa");

  return (
    <PageFrame
      label={kind === "tributos" ? "Tributos" : "Papeletas y multas"}
      title={kind === "tributos" ? "Obligaciones ordenadas por accion" : "Consulta, paga o impugna con contexto"}
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

function ProceduresPage() {
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

function InstallmentsPage() {
  const [amount, setAmount] = useState("840");
  const parsedAmount = Number(amount) || 0;
  const initial = Math.max(parsedAmount * 0.2, 0);
  const monthly = Math.max((parsedAmount - initial) / 6, 0);

  return (
    <PageFrame
      label="Fraccionamiento"
      title="Un preevaluador simple antes de pedir documentos"
      copy="La demo convierte informacion dispersa en una ruta clara para deuda tributaria y no tributaria."
    >
      <div className="dense-grid">
        <div className="feature-panel">
          <label className="field-label" htmlFor="debt-amount">
            Monto aproximado de deuda
          </label>
          <input
            id="debt-amount"
            className="text-input"
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <div className="estimate-card">
            <span>Cuota inicial referencial</span>
            <strong>S/ {initial.toFixed(2)}</strong>
          </div>
          <div className="estimate-card">
            <span>6 cuotas referenciales</span>
            <strong>S/ {monthly.toFixed(2)}</strong>
          </div>
        </div>
        <div className="feature-panel wide">
          <h2>Antes de iniciar</h2>
          <ol className="step-list">
            <li>Verifica si la deuda esta vencida y si admite facilidad de pago.</li>
            <li>Confirma que no tienes cuotas vencidas del mismo tipo de fraccionamiento.</li>
            <li>Prepara documentos y revisa si debes desistir de un reclamo pendiente.</li>
            <li>Inicia en Agencia Virtual o solicita orientacion si el caso es mixto.</li>
          </ol>
        </div>
      </div>
    </PageFrame>
  );
}

function OfficesPage() {
  return (
    <PageFrame
      label="Atencion y sedes"
      title="Canal correcto segun tema, horario y ubicacion"
      copy="El prototipo muestra sedes y canales como decisiones guiadas, no como una lista suelta."
    >
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

function InstitutionPage() {
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
            Promover el cumplimiento oportuno de obligaciones tributarias y no tributarias a
            traves de un servicio transparente y de calidad para la Municipalidad Metropolitana
            de Lima.
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

function ProcedureDetailPage() {
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
          <a className="primary-action full" href={procedure.source.url} target="_blank" rel="noreferrer">
            Abrir fuente oficial
          </a>
        </div>
      </div>
    </PageFrame>
  );
}

function UniversalActionBox({
  onSubmit,
  onTabChange,
}: {
  onSubmit?: (value: string) => void;
  onTabChange?: (tabId: string) => void;
}) {
  const [tab, setTab] = useState(paymentTabs[0].id);
  const [value, setValue] = useState("");
  const active = paymentTabs.find((item) => item.id === tab) ?? paymentTabs[0];

  const switchTab = (id: string) => {
    setTab(id);
    setValue("");
    onTabChange?.(id);
  };

  return (
    <form
      className="action-box"
      data-active-tab={tab}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value || active.example);
      }}
    >
      <div className="action-header">
        <span>
          <Search size={18} />
          Consulta o paga
        </span>
        <small>Demo navegable</small>
      </div>
      <div className="tab-list" aria-label="Tipo de consulta">
        {paymentTabs.map((item) => (
          <button
            key={item.id}
            className={item.id === tab ? "is-active" : ""}
            type="button"
            aria-pressed={item.id === tab}
            onClick={() => switchTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <label className="field-label" htmlFor="universal-query">
        {active.prompt}
      </label>
      <div className="query-row">
        <input
          id="universal-query"
          className="text-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={active.example}
        />
        <button className="primary-action" type="submit">
          Buscar
        </button>
      </div>
      <p>{active.helper}</p>
    </form>
  );
}

function PageFrame({ label, title, copy, children }: { label: string; title: string; copy: string; children: React.ReactNode }) {
  return (
    <section className="page-frame">
      <div className="page-heading">
        <span className="eyebrow">{label}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {children}
    </section>
  );
}

function SectionHeading({ label, title, copy }: { label: string; title: string; copy: string }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{label}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}

function ServiceCard({ item }: { item: (typeof serviceItems)[number] }) {
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

function ProcedureCard({ procedure }: { procedure: (typeof procedures)[number] }) {
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


function EmptyState() {
  return (
    <div className="empty-state">
      <FileQuestion size={26} />
      <div>
        <strong>Empieza con el dato que tengas</strong>
        <p>Si no sabes que ingresar, abre el asistente y elige “No sé dónde empezar”.</p>
      </div>
    </div>
  );
}

function Channel({ label, value }: { label: string; value: string }) {
  return (
    <div className="channel-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function iconFor(icon: string) {
  const icons = {
    badge: <BadgeCheck size={22} />,
    pay: <CircleDollarSign size={22} />,
    car: <Car size={22} />,
    building: <Building2 size={22} />,
    calendar: <CalendarClock size={22} />,
    calendarDays: <CalendarDays size={22} />,
    clock: <Clock size={22} />,
    card: <CreditCard size={22} />,
    shield: <ShieldCheck size={22} />,
    shieldSimple: <Shield size={22} />,
    phone: <Smartphone size={22} />,
    map: <MapPin size={22} />,
    form: <ClipboardList size={22} />,
    file: <FileText size={22} />,
    heart: <Heart size={22} />,
    home: <Building2 size={22} />,
    institution: <Landmark size={22} />,
    assistant: <PanelRight size={22} />,
    bot: <PanelRight size={22} />,
    rocket: <Rocket size={22} />,
    thumbs: <ThumbsUp size={22} />,
    wallet: <Wallet size={22} />,
    workflow: <Workflow size={22} />,
  };

  return icons[icon as keyof typeof icons] ?? <ArrowRight size={22} />;
}

// ──────────────────────────────────────────────────────────────────
// HERO INFO PANEL — reemplaza el skyline de Lima con guía dinámica
// ──────────────────────────────────────────────────────────────────

const TAB_STEPS: Record<
  string,
  { label: string; hint: string; visual: React.ReactNode; stepLabel: string }[]
> = {
  placa: [
    {
      label: "Ingresa la placa",
      hint: "Escribe la placa de tu vehículo en el formato ABC-123.",
      stepLabel: "Inicio",
      visual: (
        <div className="hip-visual">
          <div className="hip-plate-wrap">
            <div className="hip-plate">
              <span className="hip-plate-country">PERÚ</span>
              <strong className="hip-plate-num">ABC · 123</strong>
            </div>
            <div className="hip-plate-ring" />
          </div>
          <p className="hip-tip">Placa delantera o trasera del vehículo</p>
        </div>
      ),
    },
    {
      label: "Buscando papeletas",
      hint: "Consultando registros de infracciones de tránsito...",
      stepLabel: "Consulta",
      visual: (
        <div className="hip-visual">
          <div className="hip-loading-ring" aria-hidden="true">
            <div className="hip-spinner" />
            <ShieldCheck size={26} className="hip-spinner-icon" />
          </div>
          <p className="hip-tip">Verificando infracciones y multas</p>
        </div>
      ),
    },
    {
      label: "Resultados de papeleta",
      hint: "Aquí ves el estado de tus multas y opciones para pagarlas o apelar.",
      stepLabel: "Resultados",
      visual: (
        <div className="hip-visual">
          <div className="hip-doc-stack" aria-hidden="true">
            <div className="hip-doc hip-doc-back" />
            <div className="hip-doc hip-doc-front">
              <div className="hip-doc-header"><ShieldCheck size={14} />Papeleta SAT</div>
              <div className="hip-doc-row"><span>Infracción</span><strong>M.13</strong></div>
              <div className="hip-doc-row"><span>Monto</span><strong className="hip-doc-amount">S/ 450.50</strong></div>
              <div className="hip-doc-badge">Pendiente</div>
            </div>
          </div>
          <p className="hip-tip">Consulta, paga o inicia un descargo</p>
        </div>
      ),
    },
    {
      label: "Opciones de pago",
      hint: "Paga en línea, en agencias o con descuento anticipado.",
      stepLabel: "Pago / Trámite",
      visual: (
        <div className="hip-visual">
          <div className="hip-pay-grid" aria-hidden="true">
            <div className="hip-pay-card"><CircleDollarSign size={20} /><span>En línea</span></div>
            <div className="hip-pay-card"><CreditCard size={20} /><span>Agencia</span></div>
            <div className="hip-pay-card"><Rocket size={20} /><span>Fraccionar</span></div>
          </div>
          <p className="hip-tip">Elige cómo regularizar tu deuda</p>
        </div>
      ),
    },
  ],
  dni: [
    {
      label: "Ingresa tu DNI o RUC",
      hint: "Escribe tu número de 8 dígitos (DNI) o 11 dígitos (RUC).",
      stepLabel: "Inicio",
      visual: (
        <div className="hip-visual">
          <div className="hip-dni-card" aria-hidden="true">
            <div className="hip-dni-strip" />
            <div className="hip-dni-body">
              <span className="hip-dni-label">DNI</span>
              <strong className="hip-dni-num">12 345 678</strong>
              <div className="hip-dni-ring" />
            </div>
          </div>
          <p className="hip-tip">Número en el anverso de tu DNI</p>
        </div>
      ),
    },
    {
      label: "Consultando tributos",
      hint: "Buscando deudas de predial, vehicular y arbitrios...",
      stepLabel: "Consulta",
      visual: (
        <div className="hip-visual">
          <div className="hip-loading-ring">
            <div className="hip-spinner" />
            <CircleDollarSign size={26} className="hip-spinner-icon" />
          </div>
          <p className="hip-tip">Revisando obligaciones tributarias</p>
        </div>
      ),
    },
    {
      label: "Obligaciones encontradas",
      hint: "Tributos vigentes asociados a tu número de documento.",
      stepLabel: "Resultados",
      visual: (
        <div className="hip-visual">
          <div className="hip-doc-stack">
            <div className="hip-doc hip-doc-back" />
            <div className="hip-doc hip-doc-front">
              <div className="hip-doc-header"><CircleDollarSign size={14} />Tributo SAT</div>
              <div className="hip-doc-row"><span>Tipo</span><strong>Imp. Vehicular</strong></div>
              <div className="hip-doc-row"><span>Monto</span><strong className="hip-doc-amount">S/ 1,200</strong></div>
              <div className="hip-doc-badge hip-badge-warn">Año 2024</div>
            </div>
          </div>
          <p className="hip-tip">Paga o fracciona antes del vencimiento</p>
        </div>
      ),
    },
    {
      label: "Opciones disponibles",
      hint: "Pago en línea, fraccionamiento o declaración jurada.",
      stepLabel: "Pago / Trámite",
      visual: (
        <div className="hip-visual">
          <div className="hip-pay-grid">
            <div className="hip-pay-card"><CircleDollarSign size={20} /><span>Pagar</span></div>
            <div className="hip-pay-card"><Rocket size={20} /><span>Fraccionar</span></div>
            <div className="hip-pay-card"><ClipboardList size={20} /><span>Declarar</span></div>
          </div>
          <p className="hip-tip">Elige la acción que necesitas</p>
        </div>
      ),
    },
  ],
  codigo: [
    {
      label: "Ingresa el código de pago",
      hint: "El código aparece en la notificación impresa del SAT.",
      stepLabel: "Inicio",
      visual: (
        <div className="hip-visual">
          <div className="hip-doc-stack">
            <div className="hip-doc hip-doc-back" />
            <div className="hip-doc hip-doc-front">
              <div className="hip-doc-header"><FileText size={14} />Notificación SAT</div>
              <div className="hip-doc-row"><span>Código</span><strong className="hip-doc-amount">SAT-24-001</strong></div>
              <div className="hip-doc-badge">Ver al dorso</div>
            </div>
          </div>
          <p className="hip-tip">Código impreso al dorso del documento</p>
        </div>
      ),
    },
    {
      label: "Verificando código",
      hint: "Buscando la deuda o expediente asociado...",
      stepLabel: "Consulta",
      visual: (
        <div className="hip-visual">
          <div className="hip-loading-ring">
            <div className="hip-spinner" />
            <FileText size={26} className="hip-spinner-icon" />
          </div>
          <p className="hip-tip">Consultando base de datos SAT</p>
        </div>
      ),
    },
    {
      label: "Deuda identificada",
      hint: "Se encontró la obligación. Revisa el monto y opciones.",
      stepLabel: "Resultados",
      visual: (
        <div className="hip-visual">
          <div className="hip-doc-stack">
            <div className="hip-doc hip-doc-back" />
            <div className="hip-doc hip-doc-front">
              <div className="hip-doc-header"><CheckCircle2 size={14} />Deuda localizada</div>
              <div className="hip-doc-row"><span>Código</span><strong>SAT-24-001</strong></div>
              <div className="hip-doc-row"><span>Estado</span><strong className="hip-doc-amount">Pendiente</strong></div>
            </div>
          </div>
          <p className="hip-tip">Confirma y elige cómo pagar</p>
        </div>
      ),
    },
    {
      label: "Ir a pagar",
      hint: "Puedes pagar en línea o en cualquier agencia autorizada.",
      stepLabel: "Pago / Trámite",
      visual: (
        <div className="hip-visual">
          <div className="hip-pay-grid">
            <div className="hip-pay-card"><CircleDollarSign size={20} /><span>En línea</span></div>
            <div className="hip-pay-card"><CreditCard size={20} /><span>Agencia</span></div>
            <div className="hip-pay-card"><MapPin size={20} /><span>Sede</span></div>
          </div>
          <p className="hip-tip">Completa tu pago en segundos</p>
        </div>
      ),
    },
  ],
  expediente: [
    {
      label: "Ingresa tu N.° de expediente",
      hint: "Lo encuentras en el correo de confirmación de Mesa de Partes Digital.",
      stepLabel: "Inicio",
      visual: (
        <div className="hip-visual">
          <div className="hip-doc-stack">
            <div className="hip-doc hip-doc-back" />
            <div className="hip-doc hip-doc-front">
              <div className="hip-doc-header"><ClipboardList size={14} />Mesa de Partes</div>
              <div className="hip-doc-row"><span>Expediente</span><strong className="hip-doc-amount">EXP-2024-001</strong></div>
              <div className="hip-doc-badge">Ver en correo</div>
            </div>
          </div>
          <p className="hip-tip">Número de 13 dígitos en tu correo SAT</p>
        </div>
      ),
    },
    {
      label: "Rastreando expediente",
      hint: "Consultando el estado de tu trámite en Mesa de Partes...",
      stepLabel: "Consulta",
      visual: (
        <div className="hip-visual">
          <div className="hip-loading-ring">
            <div className="hip-spinner" />
            <ClipboardList size={26} className="hip-spinner-icon" />
          </div>
          <p className="hip-tip">Rastreando tu trámite</p>
        </div>
      ),
    },
    {
      label: "Estado del trámite",
      hint: "Revisa en qué etapa se encuentra tu expediente.",
      stepLabel: "Resultados",
      visual: (
        <div className="hip-visual">
          <div className="hip-doc-stack">
            <div className="hip-doc hip-doc-back" />
            <div className="hip-doc hip-doc-front">
              <div className="hip-doc-header"><ClipboardList size={14} />EXP-2024-001</div>
              <div className="hip-doc-row"><span>Estado</span><strong>En revisión</strong></div>
              <div className="hip-doc-row"><span>Área</span><strong>Mesa Partes</strong></div>
              <div className="hip-doc-badge hip-badge-warn">En proceso</div>
            </div>
          </div>
          <p className="hip-tip">Tu trámite está siendo procesado</p>
        </div>
      ),
    },
    {
      label: "Próximos pasos",
      hint: "Sigue el estado y recibe notificaciones al correo registrado.",
      stepLabel: "Seguimiento",
      visual: (
        <div className="hip-visual">
          <div className="hip-pay-grid">
            <div className="hip-pay-card"><CalendarClock size={20} /><span>Seguir</span></div>
            <div className="hip-pay-card"><Smartphone size={20} /><span>Notificar</span></div>
            <div className="hip-pay-card"><MapPin size={20} /><span>Sede</span></div>
          </div>
          <p className="hip-tip">Mantente informado del avance</p>
        </div>
      ),
    },
  ],
};

const STEP_LABELS = ["Inicio", "Consulta", "Resultados", "Pago / Trámite"];

function HeroInfoPanel({
  activeTab,
  searched,
  step,
  result,
  noResult,
}: {
  activeTab: string;
  searched: boolean;
  step: 1 | 2 | 3 | 4;
  result: MockResultData | null;
  noResult: boolean;
}) {
  const tabKey = activeTab in TAB_STEPS ? activeTab : "placa";
  const stepData = TAB_STEPS[tabKey][step - 1];

  // ── Estado de pago simulado ────────────────────────────────
  const [payState, setPayState] = useState<"idle" | "form" | "processing" | "success">("idle");
  const [cardNum, setCardNum] = useState("");
  const [cvv, setCvv] = useState("");
  const [opNum] = useState(() => `OP-SAT-${Date.now().toString().slice(-8)}`);

  // Resetear al buscar de nuevo
  useEffect(() => {
    setPayState("idle");
    setCardNum("");
    setCvv("");
  }, [result, noResult]);

  const handlePagar = () => {
    setPayState("form");
  };

  const handleConfirmarPago = (e: React.FormEvent) => {
    e.preventDefault();
    setPayState("processing");
    setTimeout(() => setPayState("success"), 2200);
  };

  const amount = result ? (result.multa ?? result.monto ?? 0) : 0;

  const handlePrintReceipt = () => {
    const now = new Date();
    const fecha = now.toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
    const hora  = now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
    const html = buildReceiptHTML({
      owner: result?.owner ?? "",
      amount,
      opNum,
      detail: result?.tributo ?? result?.clase ?? "Papeleta / Tributo",
      fecha,
      hora,
    });
    const win = window.open("", "_blank", "width=520,height=780");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 600);
    }
  };

  return (
    <div className="hip-container">
      {/* Stepper encima */}
      <nav className="hip-stepper" aria-label="Progreso de consulta">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const isDone = payState === "success" ? n <= 4 : n < step;
          const isActive = payState === "success" ? false : n === step;
          return (
            <div
              key={label}
              className={`hip-step${
                isDone ? " done" : isActive ? " active" : " future"
              }`}
            >
              {i > 0 && (
                <div
                  className={`hip-connector${isDone || isActive ? " filled" : ""}`}
                  aria-hidden="true"
                />
              )}
              <div className="hip-step-dot" aria-hidden="true">
                {isDone ? <CheckCircle2 size={14} /> : <span>{n}</span>}
              </div>
              <span className="hip-step-label">{label}</span>
            </div>
          );
        })}
      </nav>

      {/* Panel dinámico */}
      <div className="hip-panel" key={`${activeTab}-${step}-${noResult}-${payState}`}>
        {/* Cabecera */}
        <div className="hip-panel-head">
          <strong>
            {payState === "form"
              ? "Confirma tu pago"
              : payState === "processing"
              ? "Procesando pago..."
              : payState === "success"
              ? "¡Pago realizado!"
              : stepData.label}
          </strong>
          <p>
            {payState === "form"
              ? "Revisa el monto y completa los datos de tu tarjeta."
              : payState === "processing"
              ? "Conectando con la pasarela SAT. No cierres esta ventana."
              : payState === "success"
              ? "Tu obligación ha sido cancelada. Guarda tu comprobante."
              : stepData.hint}
          </p>
        </div>

        {/* ── Casos ── */}
        {payState === "form" ? (
          <form className="pay-sim-form" onSubmit={handleConfirmarPago}>
            <div className="pay-sim-card-preview" aria-hidden="true">
              <div className="pay-sim-card">
                <div className="pay-sim-chip" />
                <span className="pay-sim-card-num">
                  {cardNum.replace(/\D/g, "").padEnd(16, "•").replace(/(.{4})/g, "$1 ").trim() || "•••• •••• •••• ••••"}
                </span>
                <div className="pay-sim-card-meta">
                  <span>SAT LIMA</span>
                  <span>12/27</span>
                </div>
              </div>
            </div>
            <div className="pay-sim-amount-row">
              <span>Monto a pagar</span>
              <strong>S/ {amount.toFixed(2)}</strong>
            </div>
            <label className="pay-sim-label" htmlFor="sim-card">
              Número de tarjeta
            </label>
            <input
              id="sim-card"
              className="pay-sim-input"
              type="text"
              inputMode="numeric"
              maxLength={19}
              placeholder="4557 1234 8890 0021"
              value={cardNum}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                setCardNum(raw.replace(/(.{4})/g, "$1 ").trim());
              }}
              required
            />
            <label className="pay-sim-label" htmlFor="sim-cvv">
              CVV
            </label>
            <input
              id="sim-cvv"
              className="pay-sim-input pay-sim-cvv"
              type="text"
              inputMode="numeric"
              maxLength={3}
              placeholder="742"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
              required
            />
            <div className="pay-sim-actions">
              <button type="submit" className="primary-action full">
                <CreditCard size={16} /> Pagar S/ {amount.toFixed(2)}
              </button>
              <button
                type="button"
                className="secondary-action full"
                onClick={() => setPayState("idle")}
              >
                Cancelar
              </button>
            </div>
            <p className="pay-sim-disclaimer">
              ⚠️ Simulación demo. Ningún cargo real será realizado.
            </p>
          </form>
        ) : payState === "processing" ? (
          <div className="pay-sim-processing">
            <div className="hip-loading-ring">
              <div className="hip-spinner" />
              <CreditCard size={24} className="hip-spinner-icon" />
            </div>
            <div className="pay-sim-process-steps">
              <span className="ps-step ps-done"><CheckCircle2 size={13} /> Validando tarjeta</span>
              <span className="ps-step ps-active"><div className="ps-dot" /> Autorizando pago...</span>
              <span className="ps-step ps-future">&bull; Generando comprobante</span>
            </div>
          </div>
        ) : payState === "success" ? (
          <div className="pay-sim-success">
            <div className="pay-sim-success-icon" aria-hidden="true">
              <CheckCircle2 size={32} />
            </div>
            <strong>¡Pago confirmado!</strong>
            <div className="pay-sim-receipt">
              <div className="receipt-header">Comprobante SAT Lima</div>
              <div className="receipt-row"><span>Titular</span><strong>{result?.owner}</strong></div>
              <div className="receipt-row"><span>Monto pagado</span><strong>S/ {amount.toFixed(2)}</strong></div>
              <div className="receipt-row"><span>N.° operación</span><strong>{opNum}</strong></div>
              <div className="receipt-row"><span>Estado</span><strong className="receipt-ok">✔ Cancelado</strong></div>
              <div className="receipt-footer">Simulación demo — SAT Lima Hackathon</div>
            </div>
            <button className="receipt-dl-btn" type="button" onClick={handlePrintReceipt}>
              <FileText size={15} /> Descargar comprobante PDF
            </button>
          </div>
        ) : step === 3 && noResult ? (
          <div className="hip-no-result">
            <div className="hip-no-result-icon" aria-hidden="true">
              <CheckCircle2 size={36} />
            </div>
            <strong>¡Todo en orden!</strong>
            <p>
              No se encontraron multas, papeletas ni deudas pendientes
              asociadas a los datos ingresados.
            </p>
            <span className="hip-no-result-note">
              Si crees que hay un error, usa el asistente SAT o visita una sede.
            </span>
          </div>
        ) : step === 3 && result ? (
          <div className="hip-result-inline">
            <div className="hip-result-owner">
              <span className="hip-avatar">{result.owner.charAt(0)}</span>
              <div>
                <strong>{result.owner}</strong>
                <span
                  className={`hip-badge${
                    result.estado === "Sin deuda" || result.estado === "Pagado"
                      ? " hip-badge-ok"
                      : result.estado === "En coactivo"
                      ? " hip-badge-danger"
                      : " hip-badge-warn"
                  }`}
                >
                  {result.estado ?? "Activo"}
                </span>
              </div>
            </div>
            {result.tributo && (
              <div className="hip-result-row">
                <span>Tributo</span>
                <strong>{result.tributo}</strong>
              </div>
            )}
            {result.clase && result.clase !== "N/A" && (
              <div className="hip-result-row">
                <span>Infracción</span>
                <strong>{result.clase}</strong>
              </div>
            )}
            <div className="hip-result-amount">
              <span>Total</span>
              <strong
                className={
                  (result.multa ?? result.monto ?? 0) === 0
                    ? "hip-amount-zero"
                    : "hip-amount-due"
                }
              >
                {(result.multa ?? result.monto ?? 0) === 0
                  ? "Sin deuda"
                  : `S/ ${(result.multa ?? result.monto ?? 0).toFixed(2)}`}
              </strong>
            </div>
            {(result.multa ?? result.monto ?? 0) > 0 && (
              <button
                className="primary-action full"
                type="button"
                onClick={handlePagar}
              >
                <CreditCard size={16} /> Pagar ahora (demo)
              </button>
            )}
          </div>
        ) : (
          stepData.visual
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// INLINE RESULT CARD — usado en /consultar-pagar
// ──────────────────────────────────────────────────────────────────

function InlineResultCard({ data }: { data: MockResultData }) {
  const amount = data.multa ?? data.monto ?? 0;
  const [payState, setPayState] = useState<"idle" | "form" | "processing" | "success">("idle");
  const [cardNum, setCardNum] = useState("");
  const [cvv, setCvv] = useState("");
  const [opNum] = useState(() => `OP-SAT-${Date.now().toString().slice(-8)}`);
  const statusClass =
    data.estado === "Sin deuda" || data.estado === "Pagado"
      ? "hip-badge-ok"
      : data.estado === "En coactivo"
      ? "hip-badge-danger"
      : "hip-badge-warn";

  const handleConfirmarPago = (e: React.FormEvent) => {
    e.preventDefault();
    setPayState("processing");
    setTimeout(() => setPayState("success"), 2200);
  };

  const handlePrintReceipt = () => {
    const now = new Date();
    const fecha = now.toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
    const hora  = now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
    const html = buildReceiptHTML({
      owner: data.owner,
      amount,
      opNum,
      detail: data.tributo ?? data.clase ?? "Papeleta / Tributo",
      fecha,
      hora,
    });
    const win = window.open("", "_blank", "width=520,height=780");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 600);
    }
  };

  if (payState === "form") {
    return (
      <form className="inline-result-card pay-sim-form" onSubmit={handleConfirmarPago}>
        <div className="pay-sim-card-preview" aria-hidden="true">
          <div className="pay-sim-card">
            <div className="pay-sim-chip" />
            <span className="pay-sim-card-num">
              {cardNum.replace(/\D/g, "").padEnd(16, "•").replace(/(.{4})/g, "$1 ").trim() || "•••• •••• •••• ••••"}
            </span>
            <div className="pay-sim-card-meta"><span>SAT LIMA</span><span>12/27</span></div>
          </div>
        </div>
        <div className="pay-sim-amount-row"><span>Total</span><strong>S/ {amount.toFixed(2)}</strong></div>
        <label className="pay-sim-label" htmlFor="ic-card">Número de tarjeta</label>
        <input id="ic-card" className="pay-sim-input" type="text" inputMode="numeric" maxLength={19}
          placeholder="4557 1234 8890 0021" value={cardNum}
          onChange={(e) => { const r = e.target.value.replace(/\D/g, "").slice(0, 16); setCardNum(r.replace(/(.{4})/g, "$1 ").trim()); }} required />
        <label className="pay-sim-label" htmlFor="ic-cvv">CVV</label>
        <input id="ic-cvv" className="pay-sim-input pay-sim-cvv" type="text" inputMode="numeric"
          maxLength={3} placeholder="742" value={cvv}
          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} required />
        <div className="pay-sim-actions">
          <button type="submit" className="primary-action full"><CreditCard size={16} /> Pagar S/ {amount.toFixed(2)}</button>
          <button type="button" className="secondary-action full" onClick={() => setPayState("idle")}>Cancelar</button>
        </div>
        <p className="pay-sim-disclaimer">⚠️ Simulación demo. Ningún cargo real.</p>
      </form>
    );
  }

  if (payState === "processing") {
    return (
      <div className="inline-result-card pay-sim-processing">
        <div className="hip-loading-ring"><div className="hip-spinner" /><CreditCard size={24} className="hip-spinner-icon" /></div>
        <div className="pay-sim-process-steps">
          <span className="ps-step ps-done"><CheckCircle2 size={13} /> Validando tarjeta</span>
          <span className="ps-step ps-active"><div className="ps-dot" /> Autorizando pago...</span>
          <span className="ps-step ps-future">&bull; Generando comprobante</span>
        </div>
      </div>
    );
  }

  if (payState === "success") {
    return (
      <div className="inline-result-card pay-sim-success">
        <div className="pay-sim-success-icon"><CheckCircle2 size={32} /></div>
        <strong>¡Pago confirmado!</strong>
        <div className="pay-sim-receipt">
          <div className="receipt-header">Comprobante SAT Lima</div>
          <div className="receipt-row"><span>Titular</span><strong>{data.owner}</strong></div>
          <div className="receipt-row"><span>Monto pagado</span><strong>S/ {amount.toFixed(2)}</strong></div>
          <div className="receipt-row"><span>N.° operación</span><strong>{opNum}</strong></div>
          <div className="receipt-row"><span>Estado</span><strong className="receipt-ok">✔ Cancelado</strong></div>
          <div className="receipt-footer">Simulación demo — SAT Lima Hackathon</div>
        </div>
        <button className="receipt-dl-btn" type="button" onClick={handlePrintReceipt}>
          <FileText size={15} /> Descargar comprobante PDF
        </button>
      </div>
    );
  }

  return (
    <div className="inline-result-card" role="status" aria-live="polite">
      <div className="hip-result-owner">
        <span className="hip-avatar">{data.owner.charAt(0)}</span>
        <div>
          <strong>{data.owner}</strong>
          <span className={`hip-badge ${statusClass}`}>{data.estado ?? "Activo"}</span>
        </div>
      </div>
      {data.tributo && (<div className="hip-result-row"><span>Tributo</span><strong>{data.tributo}</strong></div>)}
      {data.clase && data.clase !== "N/A" && (<div className="hip-result-row"><span>Clase</span><strong>{data.clase}</strong></div>)}
      {data.detalle && (
        <div className="hip-result-row" style={{ flexDirection: "column", gap: "0.2rem" } as React.CSSProperties}>
          <span>Detalle</span>
          <p style={{ fontSize: "0.82rem", color: "var(--color-text)" }}>{data.detalle}</p>
        </div>
      )}
      <div className="hip-result-amount">
        <span>Total</span>
        <strong className={amount === 0 ? "hip-amount-zero" : "hip-amount-due"}>
          {amount === 0 ? "Sin deuda" : `S/ ${amount.toFixed(2)}`}
        </strong>
      </div>
      {amount > 0 && (
        <button className="primary-action full" type="button" onClick={() => setPayState("form")}>
          <CreditCard size={16} /> Pagar ahora (demo)
        </button>
      )}
    </div>
  );
}

function NoResultCard() {
  return (
    <div className="no-result-card" role="status" aria-live="polite">
      <div className="no-result-icon" aria-hidden="true">
        <CheckCircle2 size={32} />
      </div>
      <div>
        <strong>¡Sin deudas ni multas pendientes!</strong>
        <p>
          No se encontraron papeletas, tributos ni expedientes asociados
          a los datos que ingresaste. Estás al día con el SAT Lima.
        </p>
        <p className="no-result-note">
          Si crees que hay un error o tienes una notificación física,
          visita una sede o usa el asistente SAT.
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// buildReceiptHTML — genera el HTML del ticket PDF
// ──────────────────────────────────────────────────────────────────

function buildReceiptHTML(p: {
  owner: string;
  amount: number;
  opNum: string;
  detail: string;
  fecha: string;
  hora: string;
}): string {
  // Genera un código de barras simulado (franjas SVG)
  const bars = Array.from({ length: 60 }, (_, i) =>
    `<rect x="${i * 4}" y="0" width="${i % 3 === 0 ? 3 : i % 5 === 0 ? 2 : 1}" height="48" fill="#0a2463" />`
  ).join("");

  // QR simulado (cuadrícula SVG)
  const qrCells: string[] = [];
  const pattern = [
    [1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,1],
    [0,1,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0],
    [1,1,1,0,1,1,0,1,1,0,1,1,0,0,1,1,0,1,1,0,1],
    [0,0,0,1,0,0,0,1,0,1,0,0,1,1,0,0,1,0,0,1,0],
    [1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,0,1,0,0,1,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,1,0,1,1,0,1,0,1],
  ];
  pattern.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell) qrCells.push(`<rect x="${c*4}" y="${r*4}" width="3" height="3" fill="#0a2463" />`);
    })
  );

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Comprobante ${p.opNum}</title>
  <style>
    @page { size: A5; margin: 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #f4f6fb;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 20px;
    }
    .ticket {
      background: white;
      width: 420px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(10,36,99,0.18);
      font-size: 13px;
    }
    /* Header */
    .ticket-header {
      background: linear-gradient(135deg, #0a2463 0%, #1565c0 100%);
      color: white;
      padding: 18px 22px 14px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .ticket-logo {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .ticket-logo .brand-sat {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -1px;
      color: #00e5ff;
    }
    .ticket-logo .brand-sub {
      font-size: 9px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      opacity: 0.8;
    }
    .ticket-header-info {
      margin-left: auto;
      text-align: right;
    }
    .ticket-header-info .tag {
      font-size: 9px;
      opacity: 0.7;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .ticket-header-info .op-num {
      font-size: 13px;
      font-weight: 700;
      font-family: 'Courier New', monospace;
      color: #00e5ff;
    }
    /* Title bar */
    .ticket-title {
      background: #e8f0fe;
      color: #0a2463;
      padding: 8px 22px;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
    }
    /* Body */
    .ticket-body { padding: 16px 22px; display: flex; flex-direction: column; gap: 8px; }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px 0;
      border-bottom: 1px dashed #dee2f0;
      font-size: 12.5px;
    }
    .row:last-child { border-bottom: none; }
    .row .label { color: #6b7280; }
    .row .value { font-weight: 700; color: #0a2463; text-align: right; max-width: 60%; }
    .row .amount { font-size: 17px; color: #1565c0; font-family: 'Courier New', monospace; }
    .row .ok { color: #16a34a; }
    /* Divider */
    .divider {
      border: none;
      border-top: 2px dashed #dee2f0;
      margin: 4px 0;
    }
    /* QR + barcode */
    .ticket-codes {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 22px;
      background: #f8faff;
      border-top: 1px solid #e0e8f5;
    }
    .qr-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .qr-label { font-size: 8px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
    .barcode-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      overflow: hidden;
    }
    .barcode-num {
      font-family: 'Courier New', monospace;
      font-size: 8px;
      color: #6b7280;
      letter-spacing: 0.1em;
    }
    /* Footer */
    .ticket-footer {
      background: #0a2463;
      color: rgba(255,255,255,0.6);
      font-size: 9px;
      text-align: center;
      padding: 10px 22px;
      line-height: 1.6;
    }
    .ticket-footer strong { color: #00e5ff; }
    /* Status badge */
    .badge-ok {
      display: inline-block;
      background: #dcfce7;
      color: #16a34a;
      border: 1px solid #86efac;
      border-radius: 999px;
      padding: 2px 10px;
      font-size: 11px;
      font-weight: 800;
    }
    /* Download note */
    .dl-note {
      text-align: center;
      color: #6b7280;
      font-size: 10px;
      padding: 10px;
      background: #f0f4ff;
    }
    @media print {
      body { background: white; padding: 0; }
      .ticket { box-shadow: none; width: 100%; border-radius: 0; }
      .dl-note { display: none; }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="ticket-header">
      <div class="ticket-logo">
        <span class="brand-sat">SAT</span>
        <span class="brand-sub">Lima &mdash; Servicio</span>
      </div>
      <div class="ticket-header-info">
        <div class="tag">N.° Operación</div>
        <div class="op-num">${p.opNum}</div>
      </div>
    </div>

    <div class="ticket-title">
      <span>Comprobante de Pago</span>
      <span>${p.fecha} &bull; ${p.hora}</span>
    </div>

    <div class="ticket-body">
      <div class="row">
        <span class="label">Titular</span>
        <span class="value">${p.owner}</span>
      </div>
      <div class="row">
        <span class="label">Concepto</span>
        <span class="value">${p.detail}</span>
      </div>
      <div class="row">
        <span class="label">Canal de pago</span>
        <span class="value">Agencia Virtual SAT (demo)</span>
      </div>
      <hr class="divider" />
      <div class="row">
        <span class="label">Monto pagado</span>
        <span class="value amount">S/ ${p.amount.toFixed(2)}</span>
      </div>
      <div class="row">
        <span class="label">Estado</span>
        <span class="value"><span class="badge-ok">✔ CANCELADO</span></span>
      </div>
    </div>

    <div class="ticket-codes">
      <div class="qr-wrap">
        <svg width="84" height="84" viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
          <rect width="84" height="84" fill="white" />
          ${qrCells.join("")}
        </svg>
        <span class="qr-label">Verificar en SAT</span>
      </div>
      <div class="barcode-wrap">
        <svg width="220" height="48" viewBox="0 0 240 48" xmlns="http://www.w3.org/2000/svg">
          ${bars}
        </svg>
        <span class="barcode-num">${p.opNum.replace("OP-SAT-", "")} &bull; SAT-LIMA &bull; 2024</span>
      </div>
    </div>

    <div class="ticket-footer">
      Este comprobante es válido como constancia de pago.<br />
      Conserva este documento. Generado el ${p.fecha} a las ${p.hora}.<br />
      <strong>sat.gob.pe</strong> &mdash; Simulación demo &mdash; SAT Lima Hackathon
    </div>

    <div class="dl-note">
      Para guardar: Archivo &rarr; Imprimir &rarr; Guardar como PDF
    </div>
  </div>
</body>
</html>`;
}

export default App;
