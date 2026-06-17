// Semaforo de papeletas: traduce el estado de cada papeleta a un color
// accionable (verde/amarillo/rojo/negro) y muestra el contador de dias habiles
// hasta el limite del descuento. Datos sinteticos DEMO; las cifras de descuento
// y los feriados vienen de la fuente fiscal versionada, no hardcodeados aqui.

import { Clock, Gavel, ShieldAlert } from "lucide-react";
import { FISCAL_2026 } from "../data/fiscal/2026";
import { addBusinessDays, businessDaysUntil, localTodayISO } from "../utils/businessDaysCalculator";

type SemaforoColor = "verde" | "amarillo" | "rojo" | "negro";

type DemoPapeleta = {
  placa: string;
  owner: string;
  infraccion: string;
  monto: number;
  color: SemaforoColor;
  descuentoPct?: number;
  limiteISO?: string;
};

const COLOR_META: Record<SemaforoColor, { label: string; hint: string }> = {
  verde: { label: "Al dia", hint: "Sin papeletas pendientes." },
  amarillo: { label: "Con descuento vigente", hint: "Paga pronto y ahorra." },
  rojo: { label: "Sin descuento", hint: "Paga o presenta un descargo." },
  negro: { label: "En cobranza coactiva", hint: "Habla con un asesor antes de pagar." },
};

function formatFecha(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-PE", { day: "2-digit", month: "long" });
}

function money(value: number): string {
  return value.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PapeletaSemaforo() {
  const today = localTodayISO();
  const papeletas: DemoPapeleta[] = [
    {
      placa: "BCD-471",
      owner: "Carla Diaz",
      infraccion: "L-01 (leve)",
      monto: 352.1,
      color: "amarillo",
      descuentoPct: FISCAL_2026.descuentoPapeletaPct,
      limiteISO: addBusinessDays(today, 4),
    },
    { placa: "XYZ-318", owner: "Marisol Quispe", infraccion: "G-57 (grave)", monto: 684.0, color: "rojo" },
    { placa: "ABC-250", owner: "Jhon Reyes", infraccion: "M.13 (muy grave)", monto: 1847.3, color: "negro" },
  ];

  return (
    <section className="feature-card" aria-label="Semaforo de papeletas">
      <header className="feature-head">
        <h3>Semaforo de papeletas</h3>
        <p>Estado de cada papeleta y cuanto te queda para pagar con descuento.</p>
      </header>

      <ul className="semaforo-legend" aria-hidden="true">
        {(Object.keys(COLOR_META) as SemaforoColor[]).map((color) => (
          <li key={color}>
            <span className={`semaforo-dot tone-${color}`} />
            {COLOR_META[color].label}
          </li>
        ))}
      </ul>

      <ul className="semaforo-list">
        {papeletas.map((p) => {
          const dias = p.limiteISO ? businessDaysUntil(p.limiteISO, FISCAL_2026.holidays, today) : 0;
          const conDescuento = p.descuentoPct ? p.monto * (1 - p.descuentoPct / 100) : p.monto;
          return (
            <li key={p.placa} className="semaforo-item">
              <span className={`semaforo-dot tone-${p.color}`} role="img" aria-label={COLOR_META[p.color].label} />
              <div className="semaforo-body">
                <div className="semaforo-row-top">
                  <strong>{p.placa}</strong>
                  <span className="semaforo-owner">{p.owner}</span>
                </div>
                <span className="semaforo-infraccion">{p.infraccion}</span>
                {p.color === "amarillo" && p.limiteISO ? (
                  <p className="semaforo-detail">
                    <Clock size={14} aria-hidden="true" />
                    Te quedan <strong>{dias} dias habiles</strong> (hasta el {formatFecha(p.limiteISO)}). Pagas{" "}
                    <strong>S/ {money(conDescuento)}</strong> en vez de S/ {money(p.monto)} con {p.descuentoPct}% de
                    descuento.
                  </p>
                ) : p.color === "negro" ? (
                  <p className="semaforo-detail semaforo-danger">
                    <Gavel size={14} aria-hidden="true" />
                    S/ {money(p.monto)} en cobranza coactiva. No pagues a tramitadores: usa un canal oficial o un
                    asesor.
                  </p>
                ) : (
                  <p className="semaforo-detail">
                    <ShieldAlert size={14} aria-hidden="true" />
                    S/ {money(p.monto)} sin descuento vigente. Puedes pagar o presentar un descargo.
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="feature-disclaimer">Datos demo. Confirma montos y plazos en la liquidacion oficial del SAT.</p>
    </section>
  );
}
