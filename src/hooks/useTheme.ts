import { useCallback, useEffect, useState } from "react";

// Preferencia de tema. Default SIEMPRE claro: una visita nueva (sin valor en
// localStorage) inicia en claro aunque el SO prefiera oscuro. El modo oscuro solo
// se aplica si el usuario lo elige con el toggle (se persiste en localStorage); al
// limpiar el storage se vuelve al claro. prefers-color-scheme ya NO decide el tema.
// El flash inicial se evita con un script inline en index.html que refleja la misma
// regla (resolveTheme) sobre <html data-theme> antes de pintar.

export type EffectiveTheme = "light" | "dark";

const STORAGE_KEY = "sat-theme";

// Regla unica de resolucion: solo el valor explicito "dark" da oscuro; cualquier
// otro valor (null, "light", legacy "system", invalido) cae a claro.
export function resolveTheme(stored: string | null): EffectiveTheme {
  return stored === "dark" ? "dark" : "light";
}

function readStoredTheme(): EffectiveTheme {
  if (typeof window === "undefined") return "light";
  try {
    return resolveTheme(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return "light";
  }
}

function applyTheme(theme: EffectiveTheme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

export function useTheme() {
  const [effective, setEffective] = useState<EffectiveTheme>(readStoredTheme);

  // Refleja el tema en <html data-theme>. No persiste aqui: el storage solo se
  // escribe en una eleccion explicita del usuario (setTheme), para que una visita
  // nueva quede en claro con el storage vacio y limpiar el storage vuelva a claro.
  useEffect(() => {
    applyTheme(effective);
  }, [effective]);

  const setTheme = useCallback((next: EffectiveTheme) => {
    setEffective(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* almacenamiento no disponible: el tema sigue funcionando en memoria */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(effective === "dark" ? "light" : "dark");
  }, [effective, setTheme]);

  return { effective, toggle, setTheme };
}
