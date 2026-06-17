// Adapter de datos del SAT. Desacopla las paginas de la fuente concreta:
// en modo "mock" responde la base en memoria; el modo "real" se habilita con
// el backend serverless (Bloque 4). Las paginas consumen `satApi`, nunca
// `mockApi` directamente, para que el switch mock/real sea transparente.

import { consultarSAT, type MockApiResponse, type MockResultData } from "../data/mockApi";

export type { MockApiResponse, MockResultData };

const API_MODE: "mock" | "real" = import.meta.env.VITE_API_MODE ?? "mock";

export const satApi = {
  /** Modo activo del adapter, util para depurar y para banners de demo. */
  mode: API_MODE,

  /**
   * Consulta deuda/papeleta/expediente por dato unico (placa, DNI/RUC,
   * codigo o expediente). En modo "mock" usa la base en memoria. El modo
   * "real" reutiliza el mock hasta que exista el backend del Bloque 4.
   */
  consultar(query: string): MockApiResponse {
    return consultarSAT(query);
  },
};
