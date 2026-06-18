// Validación y saneo de los datos de consulta del SAT (placa, DNI/RUC, código,
// expediente). Funciones puras, sin estado ni I/O: testeable y reutilizable
// desde cualquier formulario de entrada.
//
// Modo demo (`opts.demo`): para la exposición, la pantalla principal acepta
// CUALQUIER documento/código/texto no vacío sin imponer el formato por pestaña.
// Sin `opts.demo` el comportamiento es el estricto de siempre (lógica real).

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

/** Opciones de validación. `demo: true` afloja el formato para la exposición. */
export interface ValidationOptions {
  demo?: boolean;
}

export const DNI_LENGTH = 8;
export const RUC_LENGTH = 11;

/** Longitud máxima en modo demo (acepta cualquier identificador razonable). */
const DEMO_MAX_LENGTH = 32;

const KINDS: readonly QueryKind[] = ["placa", "dni-ruc", "codigo", "expediente"];

const isKind = (value: string): value is QueryKind =>
  (KINDS as readonly string[]).includes(value);

// Placa peruana de uso general: 3 letras + 3 dígitos (ABC-123).
const PLACA_PATTERN = /^[A-Z]{3}-\d{3}$/;

/**
 * Normaliza el valor mientras el usuario escribe: filtra caracteres no
 * permitidos y aplica un formato suave (mayúsculas, guion de placa). En modo
 * demo conserva letras, números, espacios y guiones sin forzar el formato de la
 * pestaña, para no mutilar documentos inventados durante la exposición.
 */
export function sanitizeQuery(kind: string, raw: string, opts?: ValidationOptions): string {
  if (opts?.demo) {
    return raw.replace(/[^\p{L}\p{N} -]/gu, "").slice(0, DEMO_MAX_LENGTH);
  }
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

/**
 * Valida el valor saneado en el momento de la consulta. En modo demo solo exige
 * que no esté vacío (cualquier documento/código/texto sirve para ver el flujo).
 */
export function validateQuery(kind: string, value: string, opts?: ValidationOptions): ValidationResult {
  const v = value.trim();
  if (!v) return { valid: false, message: "Ingresa un dato para consultar." };
  if (opts?.demo) return { valid: true };
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

/**
 * Restricciones de campo (teclado, longitud, capitalización) por tipo. En modo
 * demo usa un campo de texto libre amplio para que cualquier documento se pueda
 * escribir desde cualquier pestaña, incluido móvil.
 */
export function getConstraints(kind: string, opts?: ValidationOptions): QueryConstraints {
  if (opts?.demo) {
    return { inputMode: "text", maxLength: DEMO_MAX_LENGTH, autoCapitalize: "none" };
  }
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
