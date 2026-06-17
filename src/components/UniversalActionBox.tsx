// Caja de accion universal: una sola entrada para consultar deuda, papeleta,
// codigo o expediente. Sanea y valida el dato segun la pestaña activa antes de
// delegar la consulta al contenedor. Si el campo va vacio, usa el ejemplo de la
// pestaña para que la demo se pruebe con un clic.

import { useState, type ChangeEvent, type FormEvent } from "react";
import { AlertCircle, Search } from "lucide-react";
import { paymentTabs } from "../data/satData";
import { getConstraints, sanitizeQuery, validateQuery } from "../utils/inputValidation";

export function UniversalActionBox({
  onSubmit,
  onTabChange,
}: {
  onSubmit?: (value: string) => void;
  onTabChange?: (tabId: string) => void;
}) {
  const [tab, setTab] = useState(paymentTabs[0].id);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const active = paymentTabs.find((item) => item.id === tab) ?? paymentTabs[0];
  const constraints = getConstraints(tab);

  const switchTab = (id: string) => {
    setTab(id);
    setValue("");
    setError(null);
    onTabChange?.(id);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(sanitizeQuery(tab, event.target.value));
    if (error) setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // El placeholder permite probar la demo con un solo clic.
    const candidate = value.trim() || active.example;
    const result = validateQuery(tab, candidate);
    if (!result.valid) {
      setError(result.message ?? "Revisa el dato ingresado.");
      return;
    }
    setError(null);
    onSubmit?.(candidate);
  };

  const errorId = "universal-query-error";

  return (
    <form className="action-box gradient-cta" data-active-tab={tab} onSubmit={handleSubmit} noValidate>
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
          className={`text-input${error ? " has-error" : ""}`}
          value={value}
          onChange={handleChange}
          placeholder={active.example}
          inputMode={constraints.inputMode}
          maxLength={constraints.maxLength}
          autoCapitalize={constraints.autoCapitalize}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <button className="primary-action" type="submit">
          Buscar
        </button>
      </div>
      {error ? (
        <p className="input-error" id={errorId} role="alert">
          <AlertCircle size={14} aria-hidden="true" /> {error}
        </p>
      ) : (
        <p>{active.helper}</p>
      )}
    </form>
  );
}
