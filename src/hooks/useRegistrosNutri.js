import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

/**
 * Hook de SOLO LECTURA para que el nutricionista inspeccione el diario
 * de cualquier paciente por su paciente_id y una fecha dada.
 *
 * No expone funciones de mutación: el nutricionista observa, no modifica.
 *
 * @param {string} pacienteId  - UUID del paciente
 * @param {string} fecha       - 'YYYY-MM-DD'
 */
export function useRegistrosNutri(pacienteId, fecha) {
  const [comidas, setComidas] = useState([])
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRegistros = useCallback(async () => {
    if (!pacienteId || !fecha) return
    setLoading(true)
    setError(null)

    // Timeout de 10 segundos
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Sin conexion. Verifica tu internet.')), 10000)
    )

    try {
      const [resComidas, resActs] = await Promise.race([
        Promise.all([
          supabase
            .from('registros_comida')
            .select('*')
            .eq('paciente_id', pacienteId)
            .eq('fecha', fecha)
            .order('hora', { ascending: true }),
          supabase
            .from('registros_actividad')
            .select('*')
            .eq('paciente_id', pacienteId)
            .eq('fecha', fecha)
            .order('hora', { ascending: true }),
        ]),
        timeoutPromise,
      ])

      if (resComidas.error) setError(resComidas.error.message)
      if (resActs.error) setError(resActs.error.message)

      setComidas(resComidas.data || [])
      setActividades(resActs.data || [])
    } catch (err) {
      setError(err.message || 'Error de conexion al cargar el diario.')
    }
    setLoading(false)
  }, [pacienteId, fecha])

  useEffect(() => { fetchRegistros() }, [fetchRegistros])

  // Totales del día calculados en el hook
  const totalConsumidas = comidas.reduce((s, r) => s + (r.calorias_estimadas || 0), 0)
  const totalGastadas = actividades.reduce((s, r) => s + (r.calorias_gastadas || 0), 0)

  return {
    comidas,
    actividades,
    totalConsumidas,
    totalGastadas,
    loading,
    error,
    refetch: fetchRegistros,
  }
}
