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
            <UniversalActionBox />
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
          <div className="hero-visual" aria-hidden="true">
            <LimaSkyline />
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
  const [result, setResult] = useState<string | null>(null);

  return (
    <PageFrame
      label="Consultar y pagar"
      title="Una sola entrada para deuda, papeletas y expedientes"
      copy="Este formulario demo muestra como podria empezar un flujo real sin obligar al usuario a adivinar el sistema correcto."
    >
      <div className="dense-grid">
        <div className="feature-panel wide">
          <UniversalActionBox onSubmit={(value) => setResult(value)} />
          {result ? <MockResult query={result} /> : <EmptyState />}
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

function UniversalActionBox({ onSubmit }: { onSubmit?: (value: string) => void }) {
  const [tab, setTab] = useState(paymentTabs[0].id);
  const [value, setValue] = useState("");
  const active = paymentTabs.find((item) => item.id === tab) ?? paymentTabs[0];

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
            onClick={() => setTab(item.id)}
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

function MockResult({ query }: { query: string }) {
  return (
    <div className="mock-result" role="status">
      <CheckCircle2 size={22} />
      <div>
        <strong>Resultado demo para {query}</strong>
        <p>Se encontraron 2 obligaciones simuladas. Puedes pagar, fraccionar o revisar requisitos antes de continuar.</p>
      </div>
    </div>
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

export default App;
