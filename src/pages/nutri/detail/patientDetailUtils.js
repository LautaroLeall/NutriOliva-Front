export function toLocalISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseLocalDate(dateStr) {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatFecha(fecha) {
  if (!fecha) return '—'
  const date = fecha.length === 10 ? parseLocalDate(fecha) : new Date(fecha)
  return date.toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null
  const hoy = new Date()
  const nac = parseLocalDate(fechaNacimiento)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}

export function initials(nombre) {
  return nombre?.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?'
}

export function formatFechaLegible(iso) {
  const hoy = toLocalISO(new Date())
  const ayer = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return toLocalISO(d) })()
  if (iso === hoy) return 'Hoy'
  if (iso === ayer) return 'Ayer'
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}
