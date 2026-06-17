// Pre-evaluador del beneficio de pensionista/adulto mayor (deduccion de 50 UIT
// de la base imponible del predial). Cuatro preguntas accesibles (teclado +
// ARIA). El tope en soles se lee de la fuente fiscal versionada. Orientativo.

import { useState } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { FISCAL_2026 } from "../data/fiscal/2026";

type Answer = boolean | null;

const QUESTIONS = [
  { id: "edad", label: "¿Tienes 60 años o más?" },
  { id: "pension", label: "¿Eres pensionista o jubilado/a?" },
  { id: "unico", label: "¿Es el unico predio a tu nombre en el pais?" },
  { id: "vivienda", label: "¿Lo usas como tu vivienda?" },
] as const;

type AnswerId = (typeof QUESTIONS)[number]["id"];

export function Beneficiarios50UIT() {
  const [answers, setAnswers] = useState<Record<AnswerId, Answer>>({
    edad: null,
    pension: null,
    unico: null,
    vivienda: null,
  });

  const set = (id: AnswerId, value: boolean) => setAnswers((prev) => ({ ...prev, [id]: value }));
  const reset = () =>
    setAnswers({ edad: null, pension: null, unico: null, vivienda: null });

  const answered = QUESTIONS.every((q) => answers[q.id] !== null);
  const eligible = QUESTIONS.every((q) => answers[q.id] === true);
  const topeSoles = FISCAL_2026.beneficio50UIT.topeUIT * FISCAL_2026.uit;

  return (
    <section className="feature-card" aria-label="Pre-evaluador beneficio 50 UIT">
      <header className="feature-head">
        <h3>¿Te corresponde el beneficio de 50 UIT?</h3>
        <p>Responde 4 preguntas. Es una orientacion, no una resolucion.</p>
      </header>

      <form className="uit-form">
        {QUESTIONS.map((q) => (
          <fieldset key={q.id} className="uit-question">
            <legend>{q.label}</legend>
            <div className="uit-toggle" role="group" aria-label={q.label}>
              <button
                type="button"
                className={answers[q.id] === true ? "is-active" : ""}
                aria-pressed={answers[q.id] === true}
                onClick={() => set(q.id, true)}
              >
                Si
              </button>
              <button
                type="button"
                className={answers[q.id] === false ? "is-active" : ""}
                aria-pressed={answers[q.id] === false}
                onClick={() => set(q.id, false)}
              >
                No
              </button>
            </div>
          </fieldset>
        ))}
      </form>

      <div className="uit-result" aria-live="polite">
        {!answered ? (
          <p className="uit-pending">
            <Info size={15} aria-hidden="true" /> Responde las 4 preguntas para ver tu orientacion.
          </p>
        ) : eligible ? (
          <div className="uit-eligible">
            <strong>
              <CheckCircle2 size={16} aria-hidden="true" /> Es probable que te corresponda
            </strong>
            <p>
              Podrias deducir hasta <strong>50 UIT (S/ {topeSoles.toLocaleString("es-PE")})</strong> de la base
              imponible {FISCAL_2026.year}. Presenta tu solicitud en Agencia Virtual o Mesa de Partes con tu DNI y
              documento del predio.
            </p>
          </div>
        ) : (
          <div className="uit-not-eligible">
            <strong>
              <XCircle size={16} aria-hidden="true" /> Con estas respuestas, no aplicaria
            </strong>
            <p>El beneficio exige cumplir las cuatro condiciones. Un asesor puede revisar tu caso particular.</p>
          </div>
        )}
        {answered ? (
          <button type="button" className="text-link" onClick={reset}>
            Volver a empezar
          </button>
        ) : null}
      </div>
      <p className="feature-disclaimer">
        Estimacion orientativa {FISCAL_2026.year}. La elegibilidad real la determina el SAT.
      </p>
    </section>
  );
}
