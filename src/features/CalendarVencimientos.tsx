// Calendario de vencimientos: muestra las fechas del periodo (predial,
// arbitrios, vehicular) leidas de la fuente fiscal versionada, con el contador
// de dias habiles que faltan y un recordatorio demo.

import { useState } from "react";
import { BellRing, CalendarClock, Check } from "lucide-react";
import { FISCAL_2026 } from "../data/fiscal/2026";
import { businessDaysUntil, localTodayISO } from "../utils/businessDaysCalculator";

function formatFecha(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function CalendarVencimientos() {
  const today = localTodayISO();
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const items = [...FISCAL_2026.vencimientos].sort((a, b) => a.iso.localeCompare(b.iso));

  const toggle = (key: string) => setReminders((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section className="feature-card" aria-label="Calendario de vencimientos">
      <header className="feature-head">
        <h3>Vencimientos {FISCAL_2026.year}</h3>
        <p>Fechas del periodo y cuanto te queda en dias habiles. Activa un recordatorio.</p>
      </header>

      <ul className="venc-list">
        {items.map((v) => {
          const key = `${v.tributo}-${v.iso}`;
          const dias = businessDaysUntil(v.iso, FISCAL_2026.holidays, today);
          const vencido = v.iso < today;
          const reminded = Boolean(reminders[key]);
          return (
            <li key={key} className={`venc-item${vencido ? " is-past" : ""}`}>
              <span className="venc-icon" aria-hidden="true">
                <CalendarClock size={18} />
              </span>
              <div className="venc-body">
                <strong>
                  {v.tributo} <span className="venc-tag">{v.etiqueta}</span>
                </strong>
                <span className="venc-date">{formatFecha(v.iso)}</span>
              </div>
              <span className="venc-status">
                {vencido ? "Vencido" : dias === 0 ? "Vence hoy" : `${dias} dias habiles`}
              </span>
              <button
                type="button"
                className={`venc-remind${reminded ? " is-on" : ""}`}
                aria-pressed={reminded}
                onClick={() => toggle(key)}
              >
                {reminded ? <Check size={15} aria-hidden="true" /> : <BellRing size={15} aria-hidden="true" />}
                {reminded ? "Recordatorio activo" : "Recordarme"}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="feature-disclaimer">Fechas demo {FISCAL_2026.year}. Confirma en la pagina oficial de vencimientos del SAT.</p>
    </section>
  );
}
