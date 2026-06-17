// Formulario de pago simulado: vista previa de tarjeta, monto, numero y CVV.
// Componente controlado: recibe valores y handlers del HeroInfoPanel. Demo sin
// cargo real.

import { AlertTriangle, CreditCard } from "lucide-react";
import type { FormEvent } from "react";

export function PaymentForm({
  amount,
  cardNum,
  cvv,
  onCardChange,
  onCvvChange,
  onSubmit,
  onCancel,
}: {
  amount: number;
  cardNum: string;
  cvv: string;
  onCardChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
}) {
  return (
    <form className="pay-sim-form" onSubmit={onSubmit}>
      <div className="pay-sim-card-preview" aria-hidden="true">
        <div className="pay-sim-card">
          <div className="pay-sim-chip" />
          <span className="pay-sim-card-num">
            {cardNum.replace(/\D/g, "").padEnd(16, "•").replace(/(.{4})/g, "$1 ").trim() ||
              "•••• •••• •••• ••••"}
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
        onChange={(e) => onCardChange(e.target.value)}
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
        onChange={(e) => onCvvChange(e.target.value)}
        required
      />
      <div className="pay-sim-actions">
        <button type="submit" className="primary-action full">
          <CreditCard size={16} /> Pagar S/ {amount.toFixed(2)}
        </button>
        <button type="button" className="secondary-action full" onClick={onCancel}>
          Cancelar
        </button>
      </div>
      <p className="pay-sim-disclaimer">
        <AlertTriangle size={14} aria-hidden="true" /> Simulación demo. Ningún cargo real será
        realizado.
      </p>
    </form>
  );
}
