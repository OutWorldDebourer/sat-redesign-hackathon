import type { CSSProperties } from "react";
import { CheckCircle2 } from "lucide-react";

const STEPS = [
  { id: 1, label: "Inicio" },
  { id: 2, label: "Consulta" },
  { id: 3, label: "Resultados" },
  { id: 4, label: "Pago / Trámite" },
];

interface StepperProps {
  currentStep: number; // 1-based
}

export function Stepper({ currentStep }: StepperProps) {
  return (
    <nav className="stepper" aria-label="Progreso del trámite">
      {STEPS.map((step, index) => {
        const isDone = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isFuture = step.id > currentStep;

        return (
          <div
            key={step.id}
            className={`stepper-step${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}${isFuture ? " is-future" : ""}`}
            style={{ "--step-delay": `${index * 80}ms` } as CSSProperties}
            aria-current={isActive ? "step" : undefined}
          >
            {/* Conector izquierdo */}
            {index > 0 && (
              <div className={`stepper-connector${isDone || isActive ? " filled" : ""}`} aria-hidden="true" />
            )}

            {/* Círculo */}
            <div className="stepper-circle" aria-hidden="true">
              {isDone ? <CheckCircle2 size={16} /> : <span>{step.id}</span>}
            </div>

            {/* Etiqueta */}
            <span className="stepper-label">{step.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
