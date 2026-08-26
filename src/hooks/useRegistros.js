import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

/**
 * Hook para registros diarios del paciente (comidas + actividad).
 * {string} pacienteId
 * {string} fecha - formato 'YYYY-MM-DD'
 */
export function useRegistros(pacienteId, fecha) {
  const [comidas, setComidas] = useState([])
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRegistros = useCallback(async () => {
    if (!pacienteId || !fecha) return
    setLoading(true)
    setError(null)

    const [resComidas, resActividades] = await Promise.all([
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
    ])

    if (resComidas.error) setError(resComidas.error.message)
    if (resActividades.error) setError(resActividades.error.message)

    setComidas(resComidas.data || [])
    setActividades(resActividades.data || [])
    setLoading(false)
  }, [pacienteId, fecha])

  useEffect(() => { fetchRegistros() }, [fetchRegistros])

  // ── Comidas ────────────────────────────────────────────────────────────────
  async function agregarComida({ descripcion, calorias_estimadas, fuente_estimacion }) {
    if (!descripcion?.trim()) return { error: 'La descripción es obligatoria.' }

    const ahora = new Date()
    const hora = ahora.toTimeString().slice(0, 8)

    const { data, error: e } = await supabase
      .from('registros_comida')
      .insert({
        paciente_id: pacienteId,
        fecha,
        hora,
        descripcion: descripcion.trim(),
        calorias_estimadas: calorias_estimadas ? Number(calorias_estimadas) : null,
        fuente_estimacion: fuente_estimacion || 'manual',
      })
      .select()
      .single()

    if (!e) await fetchRegistros()
    return { data, error: e?.message || null }
  }

  async function editarComida(id, { descripcion, calorias_estimadas }) {
    if (!descripcion?.trim()) return { error: 'La descripción es obligatoria.' }

    const { error: e } = await supabase
      .from('registros_comida')
      .update({
        descripcion: descripcion.trim(),
        calorias_estimadas: calorias_estimadas ? Number(calorias_estimadas) : null,
      })
      .eq('id', id)

    if (!e) await fetchRegistros()
    return { error: e?.message || null }
  }

  async function eliminarComida(id) {
    const { error: e } = await supabase
      .from('registros_comida')
      .delete()
      .eq('id', id)

    if (!e) await fetchRegistros()
    return { error: e?.message || null }
  }

  // ── Actividad física ───────────────────────────────────────────────────────
  async function agregarActividad({ tipo, duracion_min, intensidad, calorias_gastadas }) {
    if (!tipo?.trim()) return { error: 'El tipo de actividad es obligatorio.' }
    if (!duracion_min || duracion_min < 1) return { error: 'La duración debe ser al menos 1 minuto.' }

    const ahora = new Date()
    const hora = ahora.toTimeString().slice(0, 8)

    const { data, error: e } = await supabase
      .from('registros_actividad')
      .insert({
        paciente_id: pacienteId,
        fecha,
        hora,
        tipo: tipo.trim(),
        duracion_min: Number(duracion_min),
        intensidad: intensidad || 'media',
        calorias_gastadas: calorias_gastadas ? Number(calorias_gastadas) : null,
      })
      .select()
      .single()

    if (!e) await fetchRegistros()
    return { data, error: e?.message || null }
  }

  async function eliminarActividad(id) {
    const { error: e } = await supabase
      .from('registros_actividad')
      .delete()
      .eq('id', id)

    if (!e) await fetchRegistros()
    return { error: e?.message || null }
  }

  return {
    comidas,
    actividades,
    loading,
    error,
    refetch: fetchRegistros,
    agregarComida,
    editarComida,
    eliminarComida,
    agregarActividad,
    eliminarActividad,
  }
}
