// Contador de dias habiles (excluye sabados, domingos y feriados versionados).
// Funcion pura, sin estado: la usa el semaforo de papeletas y la tool
// contar_dias_habiles del chat. Trabaja en UTC para evitar saltos de zona
// horaria. Las fechas se expresan en ISO YYYY-MM-DD.

import { FISCAL_2026 } from "../data/fiscal/2026";

const DAY_MS = 86_400_000;

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Fecha de hoy (ISO) en el calendario de Lima (America/Lima, UTC-5 sin horario
 * de verano). Evita el off-by-one de tomar la fecha UTC despues de las ~19:00
 * locales. Usar como "hoy" por defecto en el cliente.
 */
export function localTodayISO(timeZone = "America/Lima"): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isBusinessDay(date: Date, holidays: ReadonlySet<string>): boolean {
  const weekday = date.getUTCDay();
  if (weekday === 0 || weekday === 6) return false; // domingo / sabado
  return !holidays.has(toISO(date));
}

/**
 * Cuenta dias habiles desde `fromISO` (exclusivo) hasta `toISO` (inclusivo).
 * Devuelve 0 si `toISO` es anterior o igual a `fromISO`.
 */
export function countBusinessDays(
  fromISO: string,
  toISODate: string,
  holidays: readonly string[] = FISCAL_2026.holidays,
): number {
  const set = new Set(holidays);
  const start = parseISO(fromISO);
  const end = parseISO(toISODate);
  if (end <= start) return 0;
  let count = 0;
  for (let t = start.getTime() + DAY_MS; t <= end.getTime(); t += DAY_MS) {
    if (isBusinessDay(new Date(t), set)) count += 1;
  }
  return count;
}

/** Dias habiles que faltan desde hoy (o `todayISO`) hasta `targetISO`. */
export function businessDaysUntil(
  targetISO: string,
  holidays: readonly string[] = FISCAL_2026.holidays,
  todayISO?: string,
): number {
  const today = todayISO ?? localTodayISO();
  return countBusinessDays(today, targetISO, holidays);
}

/** Suma `n` dias habiles a `fromISO` y devuelve la fecha ISO resultante. */
export function addBusinessDays(
  fromISO: string,
  n: number,
  holidays: readonly string[] = FISCAL_2026.holidays,
): string {
  const set = new Set(holidays);
  let t = parseISO(fromISO).getTime();
  let added = 0;
  while (added < n) {
    t += DAY_MS;
    if (isBusinessDay(new Date(t), set)) added += 1;
  }
  return toISO(new Date(t));
}
