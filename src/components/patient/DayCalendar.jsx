import { ChevronLeft, ChevronRight } from 'lucide-react'

const DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

/**
 * Formatea una fecha local como 'YYYY-MM-DD' sin conversión UTC.
 */
function toLocalISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Genera un array de 7 fechas centradas en la semana de `fechaBase`.
 */
function generarSemana(fechaBase) {
  const dias = []
  const base = new Date(fechaBase + 'T12:00:00') // evitar timezone shifts
  const dow = base.getDay() // 0=Dom
  // Queremos mostrar desde Lun (o Dom si ese es el inicio)
  const inicio = new Date(base)
  inicio.setDate(base.getDate() - dow + 1) // Lunes de esa semana

  for (let i = 0; i < 7; i++) {
    const d = new Date(inicio)
    d.setDate(inicio.getDate() + i)
    dias.push({
      fecha: toLocalISO(d),
      diaNro: d.getDate(),
      diaLabel: DIAS_CORTO[d.getDay()],
    })
  }
  return dias
}

/**
 * Calendario semanal horizontal para seleccionar el día activo.
 *
 * @param {string}   fechaActiva  - 'YYYY-MM-DD'
 * @param {function} onChange     - (fecha: string) => void
 */
export default function DayCalendar({ fechaActiva, onChange }) {
  const hoy = toLocalISO(new Date())
  const semana = generarSemana(fechaActiva)

  function semanaAnterior() {
    const base = new Date(fechaActiva + 'T12:00:00')
    base.setDate(base.getDate() - 7)
    onChange(toLocalISO(base))
  }

  function semanaProxima() {
    const base = new Date(fechaActiva + 'T12:00:00')
    const proxLun = new Date(base)
    proxLun.setDate(base.getDate() + 7)
    const hoyDate = new Date(hoy + 'T12:00:00')
    // No navegar al futuro
    if (proxLun > hoyDate) return
    onChange(toLocalISO(proxLun))
  }

  const puedeAvanzar = (() => {
    const base = new Date(fechaActiva + 'T12:00:00')
    const proxLun = new Date(base)
    proxLun.setDate(base.getDate() + 7)
    return proxLun <= new Date(hoy + 'T12:00:00')
  })()

  return (
    <div className="bg-white border border-cream-darker rounded-2xl overflow-hidden mb-4">
      <div className="flex items-center gap-1 px-3 py-3">
        {/* Anterior */}
        <button
          onClick={semanaAnterior}
          className="p-1.5 rounded-lg text-muted hover:bg-cream hover:text-olive-dark transition-colors flex-shrink-0"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Días */}
        <div className="flex-1 flex justify-between gap-1">
          {semana.map(({ fecha, diaNro, diaLabel }) => {
            const esHoy = fecha === hoy
            const esActivo = fecha === fechaActiva
            const esFuturo = fecha > hoy

            return (
              <button
                key={fecha}
                onClick={() => !esFuturo && onChange(fecha)}
                disabled={esFuturo}
                className={`flex flex-col items-center rounded-xl px-2 py-2 transition-all duration-150
                            flex-1 min-w-0 disabled:opacity-30 disabled:cursor-not-allowed
                            ${esActivo
                    ? 'bg-olive text-cream shadow-sm'
                    : 'hover:bg-cream text-muted hover:text-olive-dark'}`}
              >
                <span className={`text-[9px] font-display uppercase tracking-wide mb-1
                                  ${esActivo ? 'text-cream/80' : ''}`}>
                  {diaLabel}
                </span>
                <span className={`font-display font-semibold text-[14px] leading-none
                                  ${esActivo ? 'text-cream' : esHoy ? 'text-olive' : ''}`}>
                  {diaNro}
                </span>
                {esHoy && !esActivo && (
                  <span className="w-1 h-1 rounded-full bg-olive mt-1" />
                )}
              </button>
            )
          })}
        </div>

        {/* Siguiente */}
        <button
          onClick={semanaProxima}
          disabled={!puedeAvanzar}
          className="p-1.5 rounded-lg text-muted hover:bg-cream hover:text-olive-dark
                    transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
