// Comprobante de pago en pantalla (estado success del simulador). Muestra el
// resumen de la operacion y permite descargar/imprimir el ticket PDF.

import { Check, CheckCircle2, FileText } from "lucide-react";

export function Receipt({
  owner,
  amount,
  opNum,
  onPrint,
}: {
  owner: string | undefined;
  amount: number;
  opNum: string;
  onPrint: () => void;
}) {
  return (
    <div className="pay-sim-success">
      <div className="pay-sim-success-icon" aria-hidden="true">
        <CheckCircle2 size={32} />
      </div>
      <strong>¡Pago confirmado!</strong>
      <div className="pay-sim-receipt">
        <div className="receipt-header">Comprobante SAT Lima</div>
        <div className="receipt-row">
          <span>Titular</span>
          <strong>{owner}</strong>
        </div>
        <div className="receipt-row">
          <span>Monto pagado</span>
          <strong>S/ {amount.toFixed(2)}</strong>
        </div>
        <div className="receipt-row">
          <span>N.° operación</span>
          <strong>{opNum}</strong>
        </div>
        <div className="receipt-row">
          <span>Estado</span>
          <strong className="receipt-ok">
            <Check size={14} aria-hidden="true" /> Cancelado
          </strong>
        </div>
        <div className="receipt-footer">Simulación demo — SAT Lima Hackathon</div>
      </div>
      <button className="receipt-dl-btn" type="button" onClick={onPrint}>
        <FileText size={15} /> Descargar comprobante PDF
      </button>
    </div>
  );
}
