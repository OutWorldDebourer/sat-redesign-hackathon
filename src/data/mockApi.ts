// Mock API — reemplaza el script PHP para la demo de la hackathon.
// En producción, aquí se haría fetch() a la API real del SAT.

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
};

export type MockApiResponse =
  | { status: "success"; type: "placa" | "dni" | "expediente" | "codigo"; data: MockResultData }
  | { status: "error"; message: string };

// ── Base de datos en memoria ──────────────────────────────────────────────────

const placas: Record<string, MockResultData> = {
  "ABC-982": {
    owner: "Pedro Alva",
    tipo: "placa",
    multa: 320.50,
    estado: "Pendiente",
    clase: "G-57",
    detalle: "Infracción Grave detectada por sistema de cámaras.",
  },
  "FGT-415": {
    owner: "Luis Torres",
    tipo: "placa",
    multa: 115.00,
    estado: "Pendiente",
    clase: "L-01",
    detalle: "Infracción Leve — Estacionamiento indebido.",
  },
  "ABC-123": {
    owner: "Pedro Alva",
    tipo: "placa",
    multa: 450.50,
    estado: "Pendiente",
    clase: "Grave",
    detalle: "Infracción M.13 — Conducir sin SOAT vigente.",
  },
};

const dni: Record<string, MockResultData> = {
  "48592013": {
    owner: "Pedro Alva",
    tipo: "dni",
    tributo: "Impuesto Vehicular",
    monto: 450.00,
    estado: "Pendiente",
    detalle: "Cuota única del año 2024.",
  },
  "12345678": {
    owner: "Pedro Alva",
    tipo: "dni",
    tributo: "Impuesto Vehicular",
    monto: 1200.00,
    estado: "Pendiente",
    detalle: "Año gravable 2024. Vence el 30 de junio.",
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

// ── Función de consulta ───────────────────────────────────────────────────────

export function consultarSAT(query: string): MockApiResponse {
  const q = query.trim().toUpperCase();

  if (placas[q]) {
    return { status: "success", type: "placa", data: placas[q] };
  }
  if (dni[query.trim()]) {
    return { status: "success", type: "dni", data: dni[query.trim()] };
  }
  if (expedientes[q]) {
    return { status: "success", type: "expediente", data: expedientes[q] };
  }

  return { status: "error", message: "No se encontraron registros para ese dato. Prueba: ABC-123, 12345678 o EXP-2024-001." };
}
