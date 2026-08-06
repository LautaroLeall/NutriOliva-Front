import { useMemo } from 'react'

/**
 * Calcula el balance calórico del día a partir de comidas y actividades.
 * Puro — no hace fetch, recibe los arrays como parámetros.
 *
 * @param {Array}  comidas            - Registros de comida del día
 * @param {Array}  actividades        - Registros de actividad del día
 * @param {number} caloriasObjetivo   - Objetivo calórico diario del plan activo
 */
export function useBalance(comidas, actividades, caloriasObjetivo = 2000) {
  return useMemo(() => {
    const consumidas = comidas.reduce(
      (sum, r) => sum + (r.calorias_estimadas || 0), 0
    )
    const gastadas = actividades.reduce(
      (sum, r) => sum + (r.calorias_gastadas || 0), 0
    )

    const netas    = consumidas - gastadas
    const restante = caloriasObjetivo - netas
    const pct      = caloriasObjetivo > 0
      ? Math.min(Math.round((netas / caloriasObjetivo) * 100), 100)
      : 0

    const estaEnExceso = netas > caloriasObjetivo
    const hayDatos     = consumidas > 0 || gastadas > 0

    // Color de la barra de progreso
    let barColor = 'bg-olive'
    if (pct >= 90 && pct <= 100) barColor = 'bg-green-500'
    if (estaEnExceso)            barColor = 'bg-red-400'

    return {
      consumidas,
      gastadas,
      netas,
      restante,
      pct,
      estaEnExceso,
      hayDatos,
      barColor,
    }
  }, [comidas, actividades, caloriasObjetivo])
}

/**
 * Estimación local de calorías gastadas en actividad física.
 * MET × peso (70kg default) × duración(h)
 */
export function estimarCaloriasActividad(duracion_min, intensidad) {
  const MET = { baja: 3, media: 5, alta: 8 }
  const met = MET[intensidad] || 5
  return Math.round(met * 70 * (duracion_min / 60))
}
