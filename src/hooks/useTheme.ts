import { useCallback, useEffect, useState } from "react";

// Preferencia de tema. "system" sigue prefers-color-scheme (sin atributo data-theme,
// el CSS resuelve via `color-scheme: light dark` + light-dark()). "light"/"dark" fijan
// el tema y se persisten. El flash inicial se evita con un script inline en index.html.

export type ThemePref = "light" | "dark" | "system";
export type EffectiveTheme = "light" | "dark";

const STORAGE_KEY = "sat-theme";

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : false;
}

function readStoredPref(): ThemePref {
  if (typeof window === "undefined") return "system";
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function applyPref(pref: ThemePref): void {
  const root = document.documentElement;
  if (pref === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", pref);
}

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(readStoredPref);
  const [systemDark, setSystemDark] = useState<boolean>(systemPrefersDark);

  // Refleja la preferencia en <html> y la persiste (o la borra si es "system").
  useEffect(() => {
    applyPref(pref);
    try {
      if (pref === "system") window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      /* almacenamiento no disponible: el tema sigue funcionando en memoria */
    }
  }, [pref]);

  // Sigue los cambios del sistema mientras la preferencia es "system".
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const effective: EffectiveTheme = pref === "system" ? (systemDark ? "dark" : "light") : pref;

  const toggle = useCallback(() => {
    setPref(effective === "dark" ? "light" : "dark");
  }, [effective]);

  return { pref, effective, toggle, setPref };
}
