// Funciones de fecha centralizadas — importadas desde el modulo compartido
export { toLocalISO, parseLocalDate, formatFecha, calcularEdad, formatFechaLegible } from '@/lib/dateUtils'

/**
 * Genera las iniciales de un nombre (maximo 2 palabras).
 * Especifica de este modulo — no es una utilidad de fecha.
 */
export function initials(nombre) {
  return nombre?.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?'
}
