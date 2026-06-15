// Validación y saneo de los datos de consulta del SAT (placa, DNI/RUC, código,
// expediente). Funciones puras, sin estado ni I/O: testeable y reutilizable
// desde cualquier formulario de entrada.

export type QueryKind = "placa" | "dni-ruc" | "codigo" | "expediente";

export interface QueryConstraints {
  /** Teclado sugerido en móvil. */
  inputMode: "numeric" | "text";
  /** Longitud máxima de caracteres aceptados por el campo. */
  maxLength: number;
  /** Capitalización automática del campo (placa, código, expediente). */
  autoCapitalize: "characters" | "none";
}

export interface ValidationResult {
  valid: boolean;
  /** Mensaje accionable mostrado al usuario cuando `valid` es `false`. */
  message?: string;
}

export const DNI_LENGTH = 8;
export const RUC_LENGTH = 11;

const KINDS: readonly QueryKind[] = ["placa", "dni-ruc", "codigo", "expediente"];

const isKind = (value: string): value is QueryKind =>
  (KINDS as readonly string[]).includes(value);

// Placa peruana de uso general: 3 letras + 3 dígitos (ABC-123).
const PLACA_PATTERN = /^[A-Z]{3}-\d{3}$/;

/**
 * Normaliza el valor mientras el usuario escribe: filtra caracteres no
 * permitidos y aplica un formato suave (mayúsculas, guion de placa).
 */
export function sanitizeQuery(kind: string, raw: string): string {
  if (!isKind(kind)) return raw;
  switch (kind) {
    case "dni-ruc":
      return raw.replace(/\D/g, "").slice(0, RUC_LENGTH);
    case "placa":
      return formatPlaca(raw);
    case "codigo":
      return raw.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 16);
    case "expediente":
      return raw.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 18);
  }
}

/** Valida el valor saneado en el momento de la consulta. */
export function validateQuery(kind: string, value: string): ValidationResult {
  const v = value.trim();
  if (!v) return { valid: false, message: "Ingresa un dato para consultar." };
  if (!isKind(kind)) return { valid: true };

  switch (kind) {
    case "dni-ruc": {
      const digits = v.replace(/\D/g, "");
      if (digits.length === DNI_LENGTH || digits.length === RUC_LENGTH) {
        return { valid: true };
      }
      if (digits.length < DNI_LENGTH) {
        return { valid: false, message: `El DNI debe tener ${DNI_LENGTH} dígitos.` };
      }
      if (digits.length < RUC_LENGTH) {
        return { valid: false, message: "Usa 8 dígitos (DNI) u 11 dígitos (RUC)." };
      }
      return { valid: false, message: `El RUC debe tener ${RUC_LENGTH} dígitos.` };
    }
    case "placa":
      return PLACA_PATTERN.test(v)
        ? { valid: true }
        : { valid: false, message: "Formato de placa: ABC-123." };
    case "codigo":
      return v.length >= 4
        ? { valid: true }
        : { valid: false, message: "Ingresa un código de pago válido." };
    case "expediente":
      return v.length >= 4
        ? { valid: true }
        : { valid: false, message: "Ingresa un número de expediente válido." };
  }
}

/** Restricciones de campo (teclado, longitud, capitalización) por tipo. */
export function getConstraints(kind: string): QueryConstraints {
  switch (kind) {
    case "dni-ruc":
      return { inputMode: "numeric", maxLength: RUC_LENGTH, autoCapitalize: "none" };
    case "placa":
      return { inputMode: "text", maxLength: 7, autoCapitalize: "characters" };
    case "codigo":
      return { inputMode: "text", maxLength: 16, autoCapitalize: "characters" };
    case "expediente":
      return { inputMode: "text", maxLength: 18, autoCapitalize: "characters" };
    default:
      return { inputMode: "text", maxLength: 32, autoCapitalize: "none" };
  }
}

/** Inserta el guion de placa (3 letras + 3 dígitos) sobre la marcha. */
function formatPlaca(raw: string): string {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  return clean.length > 3 ? `${clean.slice(0, 3)}-${clean.slice(3)}` : clean;
}
