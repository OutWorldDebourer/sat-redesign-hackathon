// Pagina Consultar y pagar: una sola entrada (caja universal) + panel guia que
// muestra el resultado y el flujo de pago demo. Consume el adapter satApi.

import { useState } from "react";
import { HeroInfoPanel } from "../components/HeroInfoPanel/HeroInfoPanel";
import { PageFrame } from "../components/PageFrame";
import { UniversalActionBox } from "../components/UniversalActionBox";
import { paymentTabs } from "../data/satData";
import { satApi, type MockResultData } from "../services/satApi";

export default function ConsultPay() {
  const [activeTab, setActiveTab] = useState(paymentTabs[0].id);
  const [searchResult, setSearchResult] = useState<MockResultData | null>(null);
  const [searched, setSearched] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const handleSearch = (query: string, kind?: string) => {
    setStep(2);
    setSearched(true);
    // Demo de exposición: acepta cualquier documento. Datos reales si existen,
    // si no un resultado sintético para mantener visible el flujo de consulta.
    const response = satApi.consultarDemo(query, kind ?? activeTab);
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
          <UniversalActionBox
            onSubmit={handleSearch}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setSearched(false);
              setSearchResult(null);
              setStep(1);
            }}
          />
        </div>
        <div className="hero-visual">
          <HeroInfoPanel
            activeTab={activeTab}
            step={step}
            result={searchResult}
            noResult={searched && searchResult === null}
          />
        </div>
      </div>
    </PageFrame>
  );
}
