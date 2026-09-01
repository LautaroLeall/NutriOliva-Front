/**
 * dateUtils.js - Utilidades de fecha centralizadas para toda la app.
 * Evita duplicar estas funciones en cada modulo que las necesite.
 */

/**
 * Convierte un objeto Date a string 'YYYY-MM-DD' en hora local
 * (sin offset UTC que desplazaria el dia).
 */
export function toLocalISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Convierte un string 'YYYY-MM-DD' a un objeto Date en hora local,
 * sin el desfase de UTC que causa new Date('YYYY-MM-DD').
 */
export function parseLocalDate(dateStr) {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Formatea una fecha (string ISO o Date) en formato largo en espanol argentino.
 * Ej: "15 de marzo de 2024"
 */
export function formatFecha(fecha) {
  if (!fecha) return '—'
  const date = typeof fecha === 'string' && fecha.length === 10
    ? parseLocalDate(fecha)
    : new Date(fecha)
  return date.toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

/**
 * Calcula la edad en anos a partir de una fecha de nacimiento en formato 'YYYY-MM-DD'.
 */
export function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null
  const hoy = new Date()
  const nac = parseLocalDate(fechaNacimiento)
  if (!nac) return null
  let edad = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}

/**
 * Convierte un string 'YYYY-MM-DD' a una etiqueta legible:
 * 'Hoy', 'Ayer', o la fecha en formato largo con dia de semana.
 * Ej: "lunes 15 de marzo"
 */
export function formatFechaLegible(iso) {
  const hoy = toLocalISO(new Date())
  const ayer = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return toLocalISO(d)
  })()
  if (iso === hoy) return 'Hoy'
  if (iso === ayer) return 'Ayer'
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}
