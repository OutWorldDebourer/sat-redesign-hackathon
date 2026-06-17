// Shell de la aplicacion: header + navegacion, router con paginas cargadas por
// React.lazy (un chunk por ruta) y el chat fijo (Assistant) montado fuera de
// <Routes> para que sobreviva a los cambios de ruta. Sin logica de dominio.

import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
import { Suspense, lazy, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { Assistant, type AssistantCommand } from "./components/assistant/Assistant";
import { ThemeToggle } from "./components/ThemeToggle";
import { externalLinks } from "./data/homeData";
import { navItems } from "./data/satData";

const Home = lazy(() => import("./pages/Home"));
const ConsultPay = lazy(() => import("./pages/ConsultPay"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Procedures = lazy(() => import("./pages/Procedures"));
const Installments = lazy(() => import("./pages/Installments"));
const Offices = lazy(() => import("./pages/Offices"));
const Institution = lazy(() => import("./pages/Institution"));
const ProcedureDetail = lazy(() => import("./pages/ProcedureDetail"));

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

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
            <ThemeToggle />
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
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home onAssistantIntent={triggerAssistant} />} />
              <Route path="/consultar-pagar" element={<ConsultPay />} />
              <Route path="/tributos" element={<Catalog kind="tributos" />} />
              <Route path="/papeletas-multas" element={<Catalog kind="papeletas" />} />
              <Route path="/tramites-digitales" element={<Procedures />} />
              <Route path="/fraccionamiento" element={<Installments />} />
              <Route path="/atencion-sedes" element={<Offices />} />
              <Route path="/institucion" element={<Institution />} />
              <Route path="/tramite/:id" element={<ProcedureDetail />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      <Assistant pagePath={location.pathname} command={assistantCommand} />
    </div>
  );
}

export default App;
