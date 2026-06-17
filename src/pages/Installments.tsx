// Pagina de fraccionamiento: preevaluador simple que estima cuota inicial y
// cuotas mensuales referenciales antes de pedir documentos.

import { useState } from "react";
import { PageFrame } from "../components/PageFrame";
import { Beneficiarios50UIT } from "../features/Beneficiarios50UIT";

export default function Installments() {
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
      <div className="feature-section">
        <Beneficiarios50UIT />
      </div>
    </PageFrame>
  );
}
