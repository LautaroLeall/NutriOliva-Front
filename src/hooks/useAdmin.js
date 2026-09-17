// useAdmin.js
// Hook para el panel de superadmin.
// Consulta admin_nutricionistas_view y permite cambiar plan, estado y crear nuevos nutricionistas.
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useAdmin() {
  const [nutricionistas, setNutricionistas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchNutricionistas = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('admin_nutricionistas_view')
      .select('id, nombre, email, plan_suscripcion, estado, total_pacientes, fecha_alta, precio_mensual_ars')
      .order('fecha_alta', { ascending: false })
    if (err) {
      setError(err.message)
    } else {
      setNutricionistas(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchNutricionistas() }, [fetchNutricionistas])

  async function cambiarPlan(id, nuevoPlan) {
    const { error: err } = await supabase
      .from('nutricionistas')
      .update({ plan_suscripcion: nuevoPlan })
      .eq('id', id)
    if (err) return { error: err.message }
    await fetchNutricionistas()
    return { error: null }
  }

  async function cambiarEstado(id, nuevoEstado) {
    const { error: err } = await supabase
      .from('nutricionistas')
      .update({ estado: nuevoEstado })
      .eq('id', id)
    if (err) return { error: err.message }
    await fetchNutricionistas()
    return { error: null }
  }

  // ── Crear nuevo nutricionista via Edge Function ───────────────────────────
  async function crearNutricionista({ nombre, email, password, plan }) {
    const { data, error: err } = await supabase.functions.invoke('create-nutricionista', {
      body: { nombre, email, password, plan },
    })
    if (err) {
      // Intentar extraer el mensaje de error del body de la respuesta
      const msg = err?.context?.json?.error ?? err.message ?? 'Error al crear el nutricionista.'
      return { data: null, error: msg }
    }
    await fetchNutricionistas()
    return { data, error: null }
  }

  return {
    nutricionistas,
    loading,
    error,
    cambiarPlan,
    cambiarEstado,
    crearNutricionista,
    refetch: fetchNutricionistas,
  }
}

