// Logica de pago demo desacoplada de la UI: validacion de tarjeta, simulacion
// de envio y generacion del comprobante imprimible. Funciones puras (salvo
// `submitPayment`/`openReceiptWindow`, que modelan el lado-efecto del pago y la
// impresion). Sin secretos ni I/O de red: la demo no realiza cargos reales.

/** Tiempo simulado de autorizacion antes de confirmar el pago. */
export const PROCESSING_DELAY_MS = 2200;

export type CardDraft = {
  /** Numero de tarjeta tal como se muestra (puede incluir espacios). */
  cardNum: string;
  /** Codigo de seguridad de 3 digitos. */
  cvv: string;
};

export type ReceiptData = {
  owner: string;
  amount: number;
  opNum: string;
  detail: string;
  fecha: string;
  hora: string;
};

/** Valida una tarjeta demo: 16 digitos de numero y 3 de CVV. */
export function validateCard({ cardNum, cvv }: CardDraft): boolean {
  const digits = cardNum.replace(/\D/g, "");
  return digits.length === 16 && /^\d{3}$/.test(cvv);
}

/** Simula la autorizacion del pago; resuelve tras `PROCESSING_DELAY_MS`. */
export function submitPayment(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, PROCESSING_DELAY_MS);
  });
}

/** Abre el comprobante en una ventana nueva y dispara la impresion. */
export function openReceiptWindow(html: string): void {
  const win = window.open("", "_blank", "width=520,height=780");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 600);
  }
}

/** Genera el HTML del comprobante (ticket A5) listo para imprimir/guardar PDF. */
export function generateReceiptHTML(p: ReceiptData): string {
  // Codigo de barras simulado (franjas SVG).
  const bars = Array.from({ length: 60 }, (_, i) =>
    `<rect x="${i * 4}" y="0" width="${i % 3 === 0 ? 3 : i % 5 === 0 ? 2 : 1}" height="48" fill="#0a2463" />`,
  ).join("");

  // QR simulado (cuadricula SVG).
  const qrCells: string[] = [];
  const pattern = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
    [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  ];
  pattern.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell) qrCells.push(`<rect x="${c * 4}" y="${r * 4}" width="3" height="3" fill="#0a2463" />`);
    }),
  );

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Comprobante ${p.opNum}</title>
  <style>
    @page { size: A5; margin: 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #f4f6fb;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 20px;
    }
    .ticket {
      background: white;
      width: 420px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(10,36,99,0.18);
      font-size: 13px;
    }
    /* Header */
    .ticket-header {
      background: linear-gradient(135deg, #0a2463 0%, #1565c0 100%);
      color: white;
      padding: 18px 22px 14px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .ticket-logo {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .ticket-logo .brand-sat {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -1px;
      color: #00e5ff;
    }
    .ticket-logo .brand-sub {
      font-size: 9px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      opacity: 0.8;
    }
    .ticket-header-info {
      margin-left: auto;
      text-align: right;
    }
    .ticket-header-info .tag {
      font-size: 9px;
      opacity: 0.7;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .ticket-header-info .op-num {
      font-size: 13px;
      font-weight: 700;
      font-family: 'Courier New', monospace;
      color: #00e5ff;
    }
    /* Title bar */
    .ticket-title {
      background: #e8f0fe;
      color: #0a2463;
      padding: 8px 22px;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
    }
    /* Body */
    .ticket-body { padding: 16px 22px; display: flex; flex-direction: column; gap: 8px; }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px 0;
      border-bottom: 1px dashed #dee2f0;
      font-size: 12.5px;
    }
    .row:last-child { border-bottom: none; }
    .row .label { color: #6b7280; }
    .row .value { font-weight: 700; color: #0a2463; text-align: right; max-width: 60%; }
    .row .amount { font-size: 17px; color: #1565c0; font-family: 'Courier New', monospace; }
    .row .ok { color: #16a34a; }
    /* Divider */
    .divider {
      border: none;
      border-top: 2px dashed #dee2f0;
      margin: 4px 0;
    }
    /* QR + barcode */
    .ticket-codes {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 22px;
      background: #f8faff;
      border-top: 1px solid #e0e8f5;
    }
    .qr-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .qr-label { font-size: 8px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
    .barcode-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      overflow: hidden;
    }
    .barcode-num {
      font-family: 'Courier New', monospace;
      font-size: 8px;
      color: #6b7280;
      letter-spacing: 0.1em;
    }
    /* Footer */
    .ticket-footer {
      background: #0a2463;
      color: rgba(255,255,255,0.6);
      font-size: 9px;
      text-align: center;
      padding: 10px 22px;
      line-height: 1.6;
    }
    .ticket-footer strong { color: #00e5ff; }
    /* Status badge */
    .badge-ok {
      display: inline-block;
      background: #dcfce7;
      color: #16a34a;
      border: 1px solid #86efac;
      border-radius: 999px;
      padding: 2px 10px;
      font-size: 11px;
      font-weight: 800;
    }
    /* Download note */
    .dl-note {
      text-align: center;
      color: #6b7280;
      font-size: 10px;
      padding: 10px;
      background: #f0f4ff;
    }
    @media print {
      body { background: white; padding: 0; }
      .ticket { box-shadow: none; width: 100%; border-radius: 0; }
      .dl-note { display: none; }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="ticket-header">
      <div class="ticket-logo">
        <span class="brand-sat">SAT</span>
        <span class="brand-sub">Lima &mdash; Servicio</span>
      </div>
      <div class="ticket-header-info">
        <div class="tag">N.° Operación</div>
        <div class="op-num">${p.opNum}</div>
      </div>
    </div>

    <div class="ticket-title">
      <span>Comprobante de Pago</span>
      <span>${p.fecha} &bull; ${p.hora}</span>
    </div>

    <div class="ticket-body">
      <div class="row">
        <span class="label">Titular</span>
        <span class="value">${p.owner}</span>
      </div>
      <div class="row">
        <span class="label">Concepto</span>
        <span class="value">${p.detail}</span>
      </div>
      <div class="row">
        <span class="label">Canal de pago</span>
        <span class="value">Agencia Virtual SAT (demo)</span>
      </div>
      <hr class="divider" />
      <div class="row">
        <span class="label">Monto pagado</span>
        <span class="value amount">S/ ${p.amount.toFixed(2)}</span>
      </div>
      <div class="row">
        <span class="label">Estado</span>
        <span class="value"><span class="badge-ok">CANCELADO</span></span>
      </div>
    </div>

    <div class="ticket-codes">
      <div class="qr-wrap">
        <svg width="84" height="84" viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
          <rect width="84" height="84" fill="white" />
          ${qrCells.join("")}
        </svg>
        <span class="qr-label">Verificar en SAT</span>
      </div>
      <div class="barcode-wrap">
        <svg width="220" height="48" viewBox="0 0 240 48" xmlns="http://www.w3.org/2000/svg">
          ${bars}
        </svg>
        <span class="barcode-num">${p.opNum.replace("OP-SAT-", "")} &bull; SAT-LIMA &bull; 2024</span>
      </div>
    </div>

    <div class="ticket-footer">
      Este comprobante es válido como constancia de pago.<br />
      Conserva este documento. Generado el ${p.fecha} a las ${p.hora}.<br />
      <strong>sat.gob.pe</strong> &mdash; Simulación demo &mdash; SAT Lima Hackathon
    </div>

    <div class="dl-note">
      Para guardar: Archivo &rarr; Imprimir &rarr; Guardar como PDF
    </div>
  </div>
</body>
</html>`;
}
