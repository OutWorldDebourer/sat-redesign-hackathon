/// <reference types="vite/client" />

// Variables de entorno expuestas al cliente (prefijo VITE_). La clave de
// DeepSeek nunca vive aqui: solo en el entorno del servidor/Vercel.
interface ImportMetaEnv {
  /** Origen del adapter de datos: "mock" (en memoria) o "real" (backend). */
  readonly VITE_API_MODE?: "mock" | "real";
  /** Base URL del backend serverless (Bloque 4). */
  readonly VITE_API_BASE_URL?: string;
  /** Habilita el chat IA real ("true"/"false"). */
  readonly VITE_CHAT_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
