// Guion visual del HeroInfoPanel: por cada tipo de consulta (placa, dni-ruc,
// codigo, expediente) define los 4 pasos (inicio, consulta, resultados,
// pago/tramite) con su etiqueta, pista y mockup ilustrativo. Extraido de
// HeroInfoPanel para que el componente solo orqueste. Datos, no logica.

import type { ReactNode } from "react";
import {
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  FileText,
  MapPin,
  Rocket,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

export type TabStep = {
  label: string;
  hint: string;
  visual: ReactNode;
  stepLabel: string;
};

export const STEP_LABELS = ["Inicio", "Consulta", "Resultados", "Pago / Trámite"];

export const TAB_STEPS: Record<string, TabStep[]> = {
  placa: [
    {
      label: "Ingresa la placa",
      hint: "Escribe la placa de tu vehículo en el formato ABC-123.",
      stepLabel: "Inicio",
      visual: (
        <div className="hip-visual">
          <div className="hip-plate-wrap">
            <div className="hip-plate">
              <span className="hip-plate-country">PERÚ</span>
              <strong className="hip-plate-num">ABC · 123</strong>
            </div>
            <div className="hip-plate-ring" />
          </div>
          <p className="hip-tip">Placa delantera o trasera del vehículo</p>
        </div>
      ),
    },
    {
      label: "Buscando papeletas",
      hint: "Consultando registros de infracciones de tránsito...",
      stepLabel: "Consulta",
      visual: (
        <div className="hip-visual">
          <div className="hip-loading-ring" aria-hidden="true">
            <div className="hip-spinner" />
            <ShieldCheck size={26} className="hip-spinner-icon" />
          </div>
          <p className="hip-tip">Verificando infracciones y multas</p>
        </div>
      ),
    },
    {
      label: "Resultados de papeleta",
      hint: "Aquí ves el estado de tus multas y opciones para pagarlas o apelar.",
      stepLabel: "Resultados",
      visual: (
        <div className="hip-visual">
          <div className="hip-doc-stack" aria-hidden="true">
            <div className="hip-doc hip-doc-back" />
            <div className="hip-doc hip-doc-front">
              <div className="hip-doc-header"><ShieldCheck size={14} />Papeleta SAT</div>
              <div className="hip-doc-row"><span>Infracción</span><strong>M.13</strong></div>
              <div className="hip-doc-row"><span>Monto</span><strong className="hip-doc-amount">S/ 450.50</strong></div>
              <div className="hip-doc-badge">Pendiente</div>
            </div>
          </div>
          <p className="hip-tip">Consulta, paga o inicia un descargo</p>
        </div>
      ),
    },
    {
      label: "Opciones de pago",
      hint: "Paga en línea, en agencias o con descuento anticipado.",
      stepLabel: "Pago / Trámite",
      visual: (
        <div className="hip-visual">
          <div className="hip-pay-grid" aria-hidden="true">
            <div className="hip-pay-card"><CircleDollarSign size={20} /><span>En línea</span></div>
            <div className="hip-pay-card"><CreditCard size={20} /><span>Agencia</span></div>
            <div className="hip-pay-card"><Rocket size={20} /><span>Fraccionar</span></div>
          </div>
          <p className="hip-tip">Elige cómo regularizar tu deuda</p>
        </div>
      ),
    },
  ],
  "dni-ruc": [
    {
      label: "Ingresa tu DNI o RUC",
      hint: "Escribe tu número de 8 dígitos (DNI) o 11 dígitos (RUC).",
      stepLabel: "Inicio",
      visual: (
        <div className="hip-visual">
          <div className="hip-dni-card" aria-hidden="true">
            <div className="hip-dni-strip" />
            <div className="hip-dni-body">
              <span className="hip-dni-label">DNI</span>
              <strong className="hip-dni-num">12 345 678</strong>
              <div className="hip-dni-ring" />
            </div>
          </div>
          <p className="hip-tip">Número en el anverso de tu DNI</p>
        </div>
      ),
    },
    {
      label: "Consultando tributos",
      hint: "Buscando deudas de predial, vehicular y arbitrios...",
      stepLabel: "Consulta",
      visual: (
        <div className="hip-visual">
          <div className="hip-loading-ring">
            <div className="hip-spinner" />
            <CircleDollarSign size={26} className="hip-spinner-icon" />
          </div>
          <p className="hip-tip">Revisando obligaciones tributarias</p>
        </div>
      ),
    },
    {
      label: "Obligaciones encontradas",
      hint: "Tributos vigentes asociados a tu número de documento.",
      stepLabel: "Resultados",
      visual: (
        <div className="hip-visual">
          <div className="hip-doc-stack">
            <div className="hip-doc hip-doc-back" />
            <div className="hip-doc hip-doc-front">
              <div className="hip-doc-header"><CircleDollarSign size={14} />Tributo SAT</div>
              <div className="hip-doc-row"><span>Tipo</span><strong>Imp. Vehicular</strong></div>
              <div className="hip-doc-row"><span>Monto</span><strong className="hip-doc-amount">S/ 1,200</strong></div>
              <div className="hip-doc-badge hip-badge-warn">Año 2024</div>
            </div>
          </div>
          <p className="hip-tip">Paga o fracciona antes del vencimiento</p>
        </div>
      ),
    },
    {
      label: "Opciones disponibles",
      hint: "Pago en línea, fraccionamiento o declaración jurada.",
      stepLabel: "Pago / Trámite",
      visual: (
        <div className="hip-visual">
          <div className="hip-pay-grid">
            <div className="hip-pay-card"><CircleDollarSign size={20} /><span>Pagar</span></div>
            <div className="hip-pay-card"><Rocket size={20} /><span>Fraccionar</span></div>
            <div className="hip-pay-card"><ClipboardList size={20} /><span>Declarar</span></div>
          </div>
          <p className="hip-tip">Elige la acción que necesitas</p>
        </div>
      ),
    },
  ],
  codigo: [
    {
      label: "Ingresa el código de pago",
      hint: "El código aparece en la notificación impresa del SAT.",
      stepLabel: "Inicio",
      visual: (
        <div className="hip-visual">
          <div className="hip-doc-stack">
            <div className="hip-doc hip-doc-back" />
            <div className="hip-doc hip-doc-front">
              <div className="hip-doc-header"><FileText size={14} />Notificación SAT</div>
              <div className="hip-doc-row"><span>Código</span><strong className="hip-doc-amount">SAT-24-001</strong></div>
              <div className="hip-doc-badge">Ver al dorso</div>
            </div>
          </div>
          <p className="hip-tip">Código impreso al dorso del documento</p>
        </div>
      ),
    },
    {
      label: "Verificando código",
      hint: "Buscando la deuda o expediente asociado...",
      stepLabel: "Consulta",
      visual: (
        <div className="hip-visual">
          <div className="hip-loading-ring">
            <div className="hip-spinner" />
            <FileText size={26} className="hip-spinner-icon" />
          </div>
          <p className="hip-tip">Consultando base de datos SAT</p>
        </div>
      ),
    },
    {
      label: "Deuda identificada",
      hint: "Se encontró la obligación. Revisa el monto y opciones.",
      stepLabel: "Resultados",
      visual: (
        <div className="hip-visual">
          <div className="hip-doc-stack">
            <div className="hip-doc hip-doc-back" />
            <div className="hip-doc hip-doc-front">
              <div className="hip-doc-header"><CheckCircle2 size={14} />Deuda localizada</div>
              <div className="hip-doc-row"><span>Código</span><strong>SAT-24-001</strong></div>
              <div className="hip-doc-row"><span>Estado</span><strong className="hip-doc-amount">Pendiente</strong></div>
            </div>
          </div>
          <p className="hip-tip">Confirma y elige cómo pagar</p>
        </div>
      ),
    },
    {
      label: "Ir a pagar",
      hint: "Puedes pagar en línea o en cualquier agencia autorizada.",
      stepLabel: "Pago / Trámite",
      visual: (
        <div className="hip-visual">
          <div className="hip-pay-grid">
            <div className="hip-pay-card"><CircleDollarSign size={20} /><span>En línea</span></div>
            <div className="hip-pay-card"><CreditCard size={20} /><span>Agencia</span></div>
            <div className="hip-pay-card"><MapPin size={20} /><span>Sede</span></div>
          </div>
          <p className="hip-tip">Completa tu pago en segundos</p>
        </div>
      ),
    },
  ],
  expediente: [
    {
      label: "Ingresa tu N.° de expediente",
      hint: "Lo encuentras en el correo de confirmación de Mesa de Partes Digital.",
      stepLabel: "Inicio",
      visual: (
        <div className="hip-visual">
          <div className="hip-doc-stack">
            <div className="hip-doc hip-doc-back" />
            <div className="hip-doc hip-doc-front">
              <div className="hip-doc-header"><ClipboardList size={14} />Mesa de Partes</div>
              <div className="hip-doc-row"><span>Expediente</span><strong className="hip-doc-amount">EXP-2024-001</strong></div>
              <div className="hip-doc-badge">Ver en correo</div>
            </div>
          </div>
          <p className="hip-tip">Número de 13 dígitos en tu correo SAT</p>
        </div>
      ),
    },
    {
      label: "Rastreando expediente",
      hint: "Consultando el estado de tu trámite en Mesa de Partes...",
      stepLabel: "Consulta",
      visual: (
        <div className="hip-visual">
          <div className="hip-loading-ring">
            <div className="hip-spinner" />
            <ClipboardList size={26} className="hip-spinner-icon" />
          </div>
          <p className="hip-tip">Rastreando tu trámite</p>
        </div>
      ),
    },
    {
      label: "Estado del trámite",
      hint: "Revisa en qué etapa se encuentra tu expediente.",
      stepLabel: "Resultados",
      visual: (
        <div className="hip-visual">
          <div className="hip-doc-stack">
            <div className="hip-doc hip-doc-back" />
            <div className="hip-doc hip-doc-front">
              <div className="hip-doc-header"><ClipboardList size={14} />EXP-2024-001</div>
              <div className="hip-doc-row"><span>Estado</span><strong>En revisión</strong></div>
              <div className="hip-doc-row"><span>Área</span><strong>Mesa Partes</strong></div>
              <div className="hip-doc-badge hip-badge-warn">En proceso</div>
            </div>
          </div>
          <p className="hip-tip">Tu trámite está siendo procesado</p>
        </div>
      ),
    },
    {
      label: "Próximos pasos",
      hint: "Sigue el estado y recibe notificaciones al correo registrado.",
      stepLabel: "Seguimiento",
      visual: (
        <div className="hip-visual">
          <div className="hip-pay-grid">
            <div className="hip-pay-card"><CalendarClock size={20} /><span>Seguir</span></div>
            <div className="hip-pay-card"><Smartphone size={20} /><span>Notificar</span></div>
            <div className="hip-pay-card"><MapPin size={20} /><span>Sede</span></div>
          </div>
          <p className="hip-tip">Mantente informado del avance</p>
        </div>
      ),
    },
  ],
};
