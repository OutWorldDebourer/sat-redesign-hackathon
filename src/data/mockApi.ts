// Mock API — reemplaza el script PHP para la demo de la hackathon.
// En produccion, aqui se haria fetch() a la API real del SAT.
// Datos sinteticos DEMO: nombres peruanos unicos, montos organicos y estados
// variados (incluye "En coactivo") para ejercitar el semaforo y el chat.
// Claves de busqueda fijas para QA reproducible.

export type MockResultData = {
  owner: string;
  tipo: "placa" | "dni" | "expediente" | "codigo";
  estado?: string;
  clase?: string;
  multa?: number;
  tributo?: string;
  monto?: number;
  expediente?: string;
  detalle?: string;
  /** Resultado sintético generado para la demo (dato no encontrado en la base). */
  demo?: boolean;
};

export type MockApiResponse =
  | { status: "success"; type: "placa" | "dni" | "expediente" | "codigo"; data: MockResultData }
  | { status: "error"; message: string };

// ── Base de datos en memoria ──────────────────────────────────────────────────

const placas: Record<string, MockResultData> = {
  "ABC-982": {
    owner: "Luis Torres",
    tipo: "placa",
    multa: 320.5,
    estado: "Pendiente",
    clase: "G-57",
    detalle: "Infracción Grave detectada por sistema de cámaras.",
  },
  "FGT-415": {
    owner: "Mariana Quispe",
    tipo: "placa",
    multa: 115.0,
    estado: "Pendiente",
    clase: "L-01",
    detalle: "Infracción Leve — Estacionamiento indebido.",
  },
  "ABC-123": {
    owner: "Diego Salazar",
    tipo: "placa",
    multa: 450.5,
    estado: "Pendiente",
    clase: "Grave",
    detalle: "Infracción M.13 — Conducir sin SOAT vigente.",
  },
  "BCD-471": {
    owner: "Carla Diaz",
    tipo: "placa",
    multa: 352.1,
    estado: "Pendiente",
    clase: "L-01",
    detalle: "Infracción Leve — aun dentro del plazo de descuento por pago voluntario.",
  },
  "ABC-250": {
    owner: "Jhon Reyes",
    tipo: "placa",
    multa: 1847.3,
    estado: "En coactivo",
    clase: "M.13",
    detalle: "Papeleta en cobranza coactiva. No pagues a tramitadores; usa un canal oficial.",
  },
};

// DNI y RUC comparten el lookup por cadena de digitos.
const documentos: Record<string, MockResultData> = {
  "48592013": {
    owner: "Carla Diaz",
    tipo: "dni",
    tributo: "Impuesto Vehicular",
    monto: 450.0,
    estado: "Pendiente",
    detalle: "Cuota única del año 2026.",
  },
  "12345678": {
    owner: "Diego Salazar",
    tipo: "dni",
    tributo: "Impuesto Vehicular",
    monto: 1200.0,
    estado: "Pendiente",
    detalle: "Año gravable 2026. Vence el 31 de marzo.",
  },
  "08742193": {
    owner: "Alberto Chavez",
    tipo: "dni",
    tributo: "Predial y arbitrios (Cercado de Lima)",
    monto: 1515.1,
    estado: "En coactivo",
    detalle: "Predial 1,026.40 + arbitrios 488.70 vencidos. Consolidado del año 2026.",
  },
  "06318492": {
    owner: "Rosa Vasquez",
    tipo: "dni",
    tributo: "Predial (beneficio 50 UIT)",
    monto: 0,
    estado: "Sin deuda",
    detalle: "Predio con deducción de 50 UIT aplicada (pensionista). Sin saldo del periodo.",
  },
  "20554871093": {
    owner: "Miguel Rojas",
    tipo: "dni",
    tributo: "Multi-tributo (RUC)",
    monto: 2310.8,
    estado: "Pendiente",
    detalle: "Vehicular vencido + arbitrios del establecimiento comercial. Año 2026.",
  },
};

const expedientes: Record<string, MockResultData> = {
  "EXP-2024-001": {
    owner: "Carlos Ríos",
    tipo: "expediente",
    estado: "En revisión",
    detalle: "Mesa de Partes Digital — Descargo de papeleta. Ingresado el 05/05/2024.",
    monto: 0,
  },
};

// Pestaña "codigo": codigo de pago/contribuyente CP-YYYY-NNN que resuelve a una obligacion.
const codigos: Record<string, MockResultData> = {
  "CP-2026-018": {
    owner: "Lucia Martinez",
    tipo: "codigo",
    tributo: "Alcabala (primera compra)",
    monto: 4350.0,
    estado: "Pendiente",
    detalle: "Alcabala: 3% sobre el exceso de 10 UIT del valor de transferencia. Año 2026.",
  },
  "CP-2026-031": {
    owner: "Miguel Rojas",
    tipo: "codigo",
    tributo: "Arbitrios (establecimiento)",
    monto: 980.4,
    estado: "Pendiente",
    detalle: "Arbitrios municipales del local comercial. Año 2026.",
  },
  "SAT-24-001": {
    owner: "Diego Salazar",
    tipo: "codigo",
    tributo: "Deuda notificada",
    monto: 612.0,
    estado: "Pendiente",
    detalle: "Código impreso al dorso de la notificación SAT.",
  },
};

// ── Función de consulta ───────────────────────────────────────────────────────

export function consultarSAT(query: string): MockApiResponse {
  const trimmed = query.trim();
  const q = trimmed.toUpperCase();

  if (placas[q]) {
    return { status: "success", type: "placa", data: placas[q] };
  }
  if (documentos[trimmed]) {
    return { status: "success", type: "dni", data: documentos[trimmed] };
  }
  if (codigos[q]) {
    return { status: "success", type: "codigo", data: codigos[q] };
  }
  if (expedientes[q]) {
    return { status: "success", type: "expediente", data: expedientes[q] };
  }

  return {
    status: "error",
    message:
      "No se encontraron registros para ese dato. Prueba: ABC-123, ABC-250, 48592013, 08742193, CP-2026-018 o EXP-2024-001.",
  };
}

// ── Consulta demo (exposición) ────────────────────────────────────────────────
// La pantalla principal debe mostrar el flujo con CUALQUIER documento. Esta
// función reutiliza los datos conocidos y, si el valor no existe, sintetiza un
// resultado demo-friendly determinista (mismo dato => mismo monto) para que la
// exposición vea consulta recibida, estado, deuda y acciones.

const KIND_TO_TIPO: Record<string, MockResultData["tipo"]> = {
  placa: "placa",
  "dni-ruc": "dni",
  codigo: "codigo",
  expediente: "expediente",
};

// Hash determinista (sin Math.random, que rompería la reproducibilidad de la demo).
function demoSeed(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0;
  }
  return h;
}

function buildDemoResult(query: string, kind?: string): MockResultData {
  const tipo = (kind && KIND_TO_TIPO[kind]) || "codigo";
  const label = query.trim().toUpperCase();
  const seed = demoSeed(label);

  if (tipo === "expediente") {
    return {
      owner: "Trámite de demostración",
      tipo,
      estado: "En proceso",
      monto: 0,
      detalle: `Consulta de demostración para '${label}'. Expediente sintético para la exposición.`,
      demo: true,
    };
  }

  // Monto orgánico y reproducible (S/ 150.00 – S/ 1,849.99).
  const monto = Math.round((150 + (seed % 1700) + (seed % 100) / 100) * 100) / 100;

  if (tipo === "placa") {
    return {
      owner: "Conductor de demostración",
      tipo,
      estado: "Pendiente",
      clase: "Infracción demo",
      multa: monto,
      detalle: `Consulta de demostración para '${label}'. Papeleta sintética para la exposición.`,
      demo: true,
    };
  }

  return {
    owner: "Contribuyente de demostración",
    tipo,
    estado: "Pendiente",
    tributo: tipo === "dni" ? "Obligación tributaria demo" : "Deuda notificada demo",
    monto,
    detalle: `Consulta de demostración para '${label}'. Resultado sintético para la exposición.`,
    demo: true,
  };
}

/**
 * Consulta demo-friendly para la pantalla principal: devuelve los datos reales
 * si existen y, en caso contrario, un resultado sintético determinista. Un valor
 * vacío sigue devolviendo error (no debe llegar: el formulario lo bloquea).
 */
export function consultarDemo(query: string, kind?: string): MockApiResponse {
  const known = consultarSAT(query);
  if (known.status === "success") return known;
  if (!query.trim()) return known;
  const data = buildDemoResult(query, kind);
  return { status: "success", type: data.tipo, data };
}
