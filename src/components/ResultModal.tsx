import { ArrowRight, FileText, Info, MapPin, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { MockResultData } from "../data/mockApi";
import { Stepper } from "./Stepper";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultData: MockResultData | null;
  currentStep?: number;
  errorMessage?: string | null;
}

// ── Guía visual según el tipo de consulta ────────────────────────────────────

function VisualGuide({ tipo }: { tipo: MockResultData["tipo"] | undefined }) {
  if (tipo === "placa") {
    return (
      <div className="visual-guide">
        <p className="guide-title">
          <Info size={15} />
          ¿Dónde encuentro mi placa?
        </p>
        <div className="card-mockup plate-mockup" aria-hidden="true">
          <div className="plate-rectangle">
            <div className="plate-text">
              <span className="plate-country">PERÚ</span>
              <strong className="plate-number">ABC · 123</strong>
            </div>
            <div className="plate-highlight-ring" />
          </div>
          <div className="guide-arrow-label">← Placa delantera / trasera del vehículo</div>
        </div>
        <p className="guide-note">
          Ingresa la placa tal como aparece en la tarjeta de propiedad (sin espacios ni guiones).
        </p>
      </div>
    );
  }

  if (tipo === "dni") {
    return (
      <div className="visual-guide">
        <p className="guide-title">
          <Info size={15} />
          ¿Dónde encuentro mi DNI?
        </p>
        <div className="card-mockup dni-mockup" aria-hidden="true">
          <div className="dni-strip" />
          <div className="dni-number-area">
            <span className="dni-label">DNI</span>
            <strong className="dni-number">12 345 678</strong>
            <div className="dni-highlight-ring" />
          </div>
        </div>
        <p className="guide-note">
          Usa el número de 8 dígitos en el anverso de tu DNI. También puedes ingresar tu RUC (11 dígitos).
        </p>
      </div>
    );
  }

  return (
    <div className="visual-guide">
      <p className="guide-title">
        <Info size={15} />
        ¿Dónde encuentro mi número de expediente?
      </p>
      <div className="card-mockup expediente-mockup" aria-hidden="true">
        <div className="exp-header">
          <FileText size={24} />
          <span>Mesa de Partes Digital</span>
        </div>
        <div className="exp-number-row">
          <span>N.° de expediente</span>
          <strong className="exp-highlight">EXP-2024-001</strong>
        </div>
      </div>
      <p className="guide-note">
        El número de expediente aparece en el comprobante que el SAT envía por correo al momento de presentar tu trámite.
      </p>
    </div>
  );
}

// ── Tarjeta de resultado ──────────────────────────────────────────────────────

function ResultCard({ data }: { data: MockResultData }) {
  const amount = data.multa ?? data.monto ?? 0;
  const statusTone =
    data.estado === "Sin deuda" || data.estado === "Pagado"
      ? "success"
      : data.estado === "En coactivo"
        ? "danger"
        : "warning";

  return (
    <div className="result-data-card">
      <div className="result-owner-row">
        <span className="result-avatar" aria-hidden="true">
          {data.owner.charAt(0)}
        </span>
        <div>
          <strong className="result-name">{data.owner}</strong>
          <span className={`result-badge badge-${statusTone}`}>{data.estado ?? "Activo"}</span>
        </div>
      </div>

      {data.tributo && (
        <div className="result-row">
          <span>Tributo</span>
          <strong>{data.tributo}</strong>
        </div>
      )}
      {data.clase && data.clase !== "N/A" && (
        <div className="result-row">
          <span>Clase de infracción</span>
          <strong>{data.clase}</strong>
        </div>
      )}
      {data.detalle && (
        <div className="result-row result-detail">
          <span>Detalle</span>
          <p>{data.detalle}</p>
        </div>
      )}

      <div className="result-amount-row">
        <span>Monto total</span>
        <strong className={amount === 0 ? "amount-zero" : "amount-due"}>
          {amount === 0 ? "Sin deuda" : `S/ ${amount.toFixed(2)}`}
        </strong>
      </div>
    </div>
  );
}

// ── Modal principal ───────────────────────────────────────────────────────────

export function ResultModal({ isOpen, onClose, resultData, currentStep = 3, errorMessage }: ResultModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Accesibilidad: trap focus y cierre con Escape
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal?.();
    } else {
      dialog.close?.();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Resultado de consulta SAT">
      <div className="modal-content" tabIndex={-1}>
        {/* Botón cerrar */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar ventana de resultados" type="button">
          <X size={20} />
        </button>

        {/* 1 ── STEPPER en la parte superior */}
        <div className="modal-header">
          <Stepper currentStep={currentStep} />
        </div>

        {/* Contenido */}
        <div className="modal-body">
          {/* 2 ── LADO IZQUIERDO: resultados */}
          <div className="modal-results">
            {errorMessage ? (
              <div className="modal-error-box">
                <Info size={22} />
                <div>
                  <strong>Sin resultados</strong>
                  <p>{errorMessage}</p>
                  <p className="modal-hint">
                    <strong>Ejemplos válidos:</strong> ABC-123 (placa), 12345678 (DNI), EXP-2024-001 (expediente)
                  </p>
                </div>
              </div>
            ) : resultData ? (
              <>
                <h2 className="modal-section-title">Resultado de tu consulta</h2>
                <ResultCard data={resultData} />

                {(resultData.multa ?? resultData.monto ?? 0) > 0 && (
                  <div className="modal-actions-row">
                    <a
                      className="primary-action large"
                      href="https://www.sat.gob.pe/WebSiteV9/Inicio/ciudadano/p/pagosenlinea"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ir a pagar ahora
                      <ArrowRight size={18} />
                    </a>
                    <a
                      className="secondary-action large"
                      href="https://www.sat.gob.pe/WebSiteV9/CanalesAtencion/CitasSAT"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MapPin size={16} />
                      Agendar cita
                    </a>
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* 3 ── LADO DERECHO: guía visual tipo CVV */}
          <VisualGuide tipo={resultData?.tipo} />
        </div>
      </div>
    </div>
  );
}
