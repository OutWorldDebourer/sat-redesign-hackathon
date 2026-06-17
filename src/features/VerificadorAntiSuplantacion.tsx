// Verificador anti-suplantacion: el ciudadano pega un correo, URL o numero y
// confirma si es un canal oficial del SAT. Regla simple y verificada: solo los
// dominios sat.gob.pe / www.sat.gob.pe / app.sat.gob.pe y los correos
// @sat.gob.pe son oficiales. Marca el fraude conocido de "correo.sunat.gob.pe".

import { useState } from "react";
import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

type Verdict = "oficial" | "fraude" | "sospechoso";

function verify(raw: string): Verdict | null {
  const value = raw.trim().toLowerCase();
  if (!value) return null;
  // Fraude conocido: el SAT no usa dominios de sunat ni correo.sunat.
  if (/sunat\.gob\.pe|correo\.sunat/.test(value)) return "fraude";
  // Correo @sat.gob.pe o subdominio.
  if (/@([a-z0-9-]+\.)*sat\.gob\.pe$/.test(value)) return "oficial";
  // URL o dominio sat.gob.pe / www / app.
  if (/^(https?:\/\/)?([a-z0-9-]+\.)*sat\.gob\.pe(\/|$|\?)/.test(value)) return "oficial";
  return "sospechoso";
}

const VERDICT_META: Record<
  Verdict,
  { icon: typeof ShieldCheck; title: string; detail: string; tone: string }
> = {
  oficial: {
    icon: ShieldCheck,
    title: "Es un canal oficial del SAT",
    detail: "Coincide con sat.gob.pe / app.sat.gob.pe. Aun asi, nunca compartas contrasenas.",
    tone: "ok",
  },
  fraude: {
    icon: ShieldX,
    title: "Cuidado: NO es del SAT",
    detail: "Usa un dominio de suplantacion conocido. No respondas ni pagues. Denuncia a integridad@sat.gob.pe.",
    tone: "danger",
  },
  sospechoso: {
    icon: ShieldAlert,
    title: "No reconozco ese canal",
    detail: "El SAT solo usa sat.gob.pe, www.sat.gob.pe y app.sat.gob.pe, y correos @sat.gob.pe.",
    tone: "warn",
  },
};

export function VerificadorAntiSuplantacion() {
  const [value, setValue] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setVerdict(verify(value));
  };

  const meta = verdict ? VERDICT_META[verdict] : null;
  const Icon = meta?.icon;

  return (
    <section className="feature-card" aria-label="Verificador anti-suplantacion">
      <header className="feature-head">
        <h3>¿Es un canal oficial del SAT?</h3>
        <p>Pega un correo, enlace o numero y verifica antes de responder o pagar.</p>
      </header>

      <form className="verificador-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="verificador-input">
          Correo, URL o numero a verificar
        </label>
        <div className="query-row">
          <input
            id="verificador-input"
            className="text-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="ej. notificaciones@sat.gob.pe"
            autoComplete="off"
          />
          <button className="primary-action" type="submit">
            Verificar
          </button>
        </div>
      </form>

      <div className="verificador-result" aria-live="polite">
        {meta && Icon ? (
          <div className={`verificador-verdict tone-${meta.tone}`}>
            <Icon size={20} aria-hidden="true" />
            <div>
              <strong>{meta.title}</strong>
              <p>{meta.detail}</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
