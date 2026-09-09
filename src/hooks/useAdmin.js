// useAdmin.js
// Hook para el panel de superadmin.
// Consulta admin_nutricionistas_view y permite cambiar plan y estado.
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

  return { nutricionistas, loading, error, cambiarPlan, cambiarEstado, refetch: fetchNutricionistas }
}
