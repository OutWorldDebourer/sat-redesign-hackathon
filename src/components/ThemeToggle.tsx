import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

// Toggle binario claro/oscuro. Muestra el icono del modo al que cambiaria
// (Luna si esta en claro, Sol si esta en oscuro) y persiste la eleccion.
export function ThemeToggle() {
  const { effective, toggle } = useTheme();
  const goingDark = effective !== "dark";

  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      onClick={toggle}
      aria-label={goingDark ? "Activar modo oscuro" : "Activar modo claro"}
      title={goingDark ? "Modo oscuro" : "Modo claro"}
    >
      {effective === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export default ThemeToggle;
