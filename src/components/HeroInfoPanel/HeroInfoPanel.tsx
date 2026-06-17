// Panel guia del hero: stepper de 4 pasos + panel dinamico que, segun el estado,
// muestra el mockup ilustrativo del paso, el resultado real de la consulta, el
// estado "sin deuda" o el flujo de pago demo (form/processing/success). Orquesta;
// la logica de pago vive en usePaymentState + paymentService.

import { CheckCircle2, CreditCard } from "lucide-react";
import type { MockResultData } from "../../services/satApi";
import { generateReceiptHTML, openReceiptWindow } from "../../services/paymentService";
import { STEP_LABELS, TAB_STEPS } from "../../data/tabSteps";
import { usePaymentState } from "./hooks/usePaymentState";
import { PaymentForm } from "./PaymentForm";
import { Receipt } from "./Receipt";

export function HeroInfoPanel({
  activeTab,
  step,
  result,
  noResult,
}: {
  activeTab: string;
  step: 1 | 2 | 3 | 4;
  result: MockResultData | null;
  noResult: boolean;
}) {
  const tabKey = activeTab in TAB_STEPS ? activeTab : "placa";
  const stepData = TAB_STEPS[tabKey][step - 1];

  const { payState, cardNum, cvv, opNum, updateCard, updateCvv, startPayment, cancelPayment, confirmPayment } =
    usePaymentState({ result, noResult });

  const amount = result ? (result.multa ?? result.monto ?? 0) : 0;

  const handlePrintReceipt = () => {
    const now = new Date();
    const fecha = now.toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
    const hora = now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
    openReceiptWindow(
      generateReceiptHTML({
        owner: result?.owner ?? "",
        amount,
        opNum,
        detail: result?.tributo ?? result?.clase ?? "Papeleta / Tributo",
        fecha,
        hora,
      }),
    );
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
            <div key={label} className={`hip-step${isDone ? " done" : isActive ? " active" : " future"}`}>
              {i > 0 && (
                <div className={`hip-connector${isDone || isActive ? " filled" : ""}`} aria-hidden="true" />
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
          <PaymentForm
            amount={amount}
            cardNum={cardNum}
            cvv={cvv}
            onCardChange={updateCard}
            onCvvChange={updateCvv}
            onSubmit={confirmPayment}
            onCancel={cancelPayment}
          />
        ) : payState === "processing" ? (
          <div className="pay-sim-processing">
            <div className="hip-loading-ring">
              <div className="hip-spinner" />
              <CreditCard size={24} className="hip-spinner-icon" />
            </div>
            <div className="pay-sim-process-steps">
              <span className="ps-step ps-done">
                <CheckCircle2 size={13} /> Validando tarjeta
              </span>
              <span className="ps-step ps-active">
                <div className="ps-dot" /> Autorizando pago...
              </span>
              <span className="ps-step ps-future">&bull; Generando comprobante</span>
            </div>
          </div>
        ) : payState === "success" ? (
          <Receipt owner={result?.owner} amount={amount} opNum={opNum} onPrint={handlePrintReceipt} />
        ) : step === 3 && noResult ? (
          <div className="hip-no-result">
            <div className="hip-no-result-icon" aria-hidden="true">
              <CheckCircle2 size={36} />
            </div>
            <strong>¡Todo en orden!</strong>
            <p>No se encontraron multas, papeletas ni deudas pendientes asociadas a los datos ingresados.</p>
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
            {result.detalle && (
              <div className="hip-result-row hip-result-detail">
                <span>Detalle</span>
                <p>{result.detalle}</p>
              </div>
            )}
            <div className="hip-result-amount">
              <span>Total</span>
              <strong
                className={
                  (result.multa ?? result.monto ?? 0) === 0 ? "hip-amount-zero" : "hip-amount-due"
                }
              >
                {(result.multa ?? result.monto ?? 0) === 0
                  ? "Sin deuda"
                  : `S/ ${(result.multa ?? result.monto ?? 0).toFixed(2)}`}
              </strong>
            </div>
            {(result.multa ?? result.monto ?? 0) > 0 && (
              <button className="primary-action full" type="button" onClick={startPayment}>
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
