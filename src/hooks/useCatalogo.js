import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'

/**
 * Hook para gestionar el catalogo de alimentos del nutricionista autenticado.
 * RLS garantiza que cada nutricionista solo accede a sus propios alimentos.
 */
export function useCatalogo() {
  const { session } = useAuth()
  const [alimentos, setAlimentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAlimentos = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchErr } = await supabase
      .from('catalogo_alimentos')
      .select('id, nombre, calorias_por_unidad, proteinas_g, carbos_g, grasas_g, unidad')
      .order('nombre', { ascending: true })

    if (fetchErr) setError(fetchErr.message)
    else setAlimentos(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (session) fetchAlimentos()
  }, [session, fetchAlimentos])

  /**
   * Agrega un alimento nuevo al catalogo.
   * @param {{ nombre, calorias_por_unidad, proteinas, carbohidratos, grasas, unidad }} datos
   */
  async function agregarAlimento(datos) {
    const { data, error } = await supabase
      .from('catalogo_alimentos')
      .insert({
        nombre: datos.nombre.trim(),
        calorias_por_unidad: Number(datos.calorias_por_unidad),
        proteinas_g: datos.proteinas_g ? Number(datos.proteinas_g) : null,
        carbos_g: datos.carbos_g ? Number(datos.carbos_g) : null,
        grasas_g: datos.grasas_g ? Number(datos.grasas_g) : null,
        unidad: datos.unidad || 'g',
      })
      .select()
      .single()

    if (!error) await fetchAlimentos()
    return { data, error }
  }

  /**
   * Edita un alimento existente.
   * @param {string} id - UUID del alimento
   * @param {object} datos
   */
  async function editarAlimento(id, datos) {
    const { data, error } = await supabase
      .from('catalogo_alimentos')
      .update({
        nombre: datos.nombre.trim(),
        calorias_por_unidad: Number(datos.calorias_por_unidad),
        proteinas_g: datos.proteinas_g ? Number(datos.proteinas_g) : null,
        carbos_g: datos.carbos_g ? Number(datos.carbos_g) : null,
        grasas_g: datos.grasas_g ? Number(datos.grasas_g) : null,
        unidad: datos.unidad || 'g',
      })
      .eq('id', id)
      .select()
      .single()

    if (!error) await fetchAlimentos()
    return { data, error }
  }

  /**
   * Elimina un alimento del catalogo.
   * @param {string} id - UUID del alimento
   */
  async function eliminarAlimento(id) {
    const { error } = await supabase
      .from('catalogo_alimentos')
      .delete()
      .eq('id', id)

    if (!error) await fetchAlimentos()
    return { error }
  }

  return {
    alimentos,
    loading,
    error,
    refetch: fetchAlimentos,
    agregarAlimento,
    editarAlimento,
    eliminarAlimento,
  }
}
