import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// defineConfig de vitest/config extiende el de vite: el bloque `test` lo ignora
// `vite build` y lo usa `vitest`. No afecta el bundle de produccion.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
