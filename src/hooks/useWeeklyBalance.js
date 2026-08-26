import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

/**
 * Calcula los últimos N días de balance calórico para un paciente dado.
 * Devuelve un array de puntos listos para graficar.
 *
 * @param {string} pacienteId       - UUID del paciente
 * @param {number} caloriasObjetivo - Meta calórica diaria del plan activo
 * @param {number} dias             - Cuántos días hacia atrás (default 7)
 */
export function useWeeklyBalance(pacienteId, caloriasObjetivo = 0, dias = 7) {
  const [puntos, setPuntos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSemana = useCallback(async () => {
    if (!pacienteId) return
    setLoading(true)
    setError(null)

    // Generar array de fechas (últimos N días, inclusive hoy)
    const fechas = []
    for (let i = dias - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      fechas.push(toLocalISO(d))
    }

    const fechaDesde = fechas[0]
    const fechaHasta = fechas[fechas.length - 1]

    const [resComidas, resActs] = await Promise.all([
      supabase
        .from('registros_comida')
        .select('fecha, calorias_estimadas')
        .eq('paciente_id', pacienteId)
        .gte('fecha', fechaDesde)
        .lte('fecha', fechaHasta),
      supabase
        .from('registros_actividad')
        .select('fecha, calorias_gastadas')
        .eq('paciente_id', pacienteId)
        .gte('fecha', fechaDesde)
        .lte('fecha', fechaHasta),
    ])

    if (resComidas.error) { setError(resComidas.error.message); setLoading(false); return }
    if (resActs.error) { setError(resActs.error.message); setLoading(false); return }

    // Agrupar por fecha
    const comidasPorFecha = {}
    for (const r of resComidas.data || []) {
      comidasPorFecha[r.fecha] = (comidasPorFecha[r.fecha] || 0) + (r.calorias_estimadas || 0)
    }
    const actsPorFecha = {}
    for (const r of resActs.data || []) {
      actsPorFecha[r.fecha] = (actsPorFecha[r.fecha] || 0) + (r.calorias_gastadas || 0)
    }

    // Armar puntos para recharts
    const resultado = fechas.map(fecha => {
      const consumidas = comidasPorFecha[fecha] || 0
      const gastadas = actsPorFecha[fecha] || 0
      const netas = consumidas - gastadas
      const registroExistente = consumidas > 0 || gastadas > 0

      // Estado del día para colorear
      let estado = 'sinDatos'
      if (registroExistente) {
        if (caloriasObjetivo > 0 && netas > caloriasObjetivo) estado = 'exceso'
        else if (caloriasObjetivo > 0 && netas >= caloriasObjetivo * 0.85) estado = 'cumple'
        else estado = 'bajo'
      }

      return {
        fecha,
        label: labelCorto(fecha),
        consumidas,
        gastadas,
        netas: registroExistente ? netas : null, // null → sin datos (barra gris)
        objetivo: caloriasObjetivo || null,
        estado,
        registroExistente,
      }
    })

    setPuntos(resultado)
    setLoading(false)
  }, [pacienteId, caloriasObjetivo, dias])

  useEffect(() => { fetchSemana() }, [fetchSemana])

  return { puntos, loading, error, refetch: fetchSemana }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toLocalISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const DIAS_LABEL = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function labelCorto(iso) {
  const d = new Date(iso + 'T12:00:00')
  const hoy = toLocalISO(new Date())
  if (iso === hoy) return 'Hoy'
  return DIAS_LABEL[d.getDay()]
}
