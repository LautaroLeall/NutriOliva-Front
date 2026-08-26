import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

/**
 * Hook para gestión de planes alimenticios y sus comidas.
 * {string} pacienteId
 */
export function usePlans(pacienteId) {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPlanes = useCallback(async () => {
    if (!pacienteId) return
    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('planes')
      .select(`
        *,
        comidas_plan (
          id, tipo_comida, descripcion, calorias_aprox,
          proteinas_g, carbos_g, grasas_g, orden
        )
      `)
      .eq('paciente_id', pacienteId)
      .order('created_at', { ascending: false })

    if (err) setError(err.message)
    else {
      // Ordenar comidas dentro de cada plan por tipo y luego por orden
      const ORDEN_TIPO = { desayuno: 1, almuerzo: 2, merienda: 3, cena: 4, snack: 5 }
      const enriched = (data || []).map(p => ({
        ...p,
        comidas_plan: (p.comidas_plan || []).sort((a, b) =>
          (ORDEN_TIPO[a.tipo_comida] - ORDEN_TIPO[b.tipo_comida]) || (a.orden - b.orden)
        )
      }))
      setPlanes(enriched)
    }
    setLoading(false)
  }, [pacienteId])

  useEffect(() => { fetchPlanes() }, [fetchPlanes])

  const planActivo = planes.find(p => p.estado === 'activo')
  const historial = planes.filter(p => p.estado === 'archivado')

  //  Crear un nuevo plan (borrador).
  async function crearPlan(caloriasObjetivo) {
    const version = planes.length > 0 ? Math.max(...planes.map(p => p.version)) + 1 : 1

    const { data, error } = await supabase
      .from('planes')
      .insert({
        paciente_id: pacienteId,
        calorias_objetivo: caloriasObjetivo,
        version,
        estado: 'borrador',
      })
      .select()
      .single()

    if (!error) await fetchPlanes()
    return { data, error }
  }

  //  Agregar una comida a un plan.
  async function agregarComida(planId, comida) {
    const { data, error } = await supabase
      .from('comidas_plan')
      .insert({
        plan_id: planId,
        tipo_comida: comida.tipo_comida,
        descripcion: comida.descripcion.trim(),
        calorias_aprox: comida.calorias_aprox ? Number(comida.calorias_aprox) : null,
        proteinas_g: comida.proteinas_g ? Number(comida.proteinas_g) : null,
        carbos_g: comida.carbos_g ? Number(comida.carbos_g) : null,
        grasas_g: comida.grasas_g ? Number(comida.grasas_g) : null,
        orden: comida.orden || 0,
      })
      .select()
      .single()

    if (!error) await fetchPlanes()
    return { data, error }
  }

  //  Editar una comida existente.
  async function editarComida(comidaId, datos) {
    const { data, error } = await supabase
      .from('comidas_plan')
      .update({
        tipo_comida: datos.tipo_comida,
        descripcion: datos.descripcion.trim(),
        calorias_aprox: datos.calorias_aprox ? Number(datos.calorias_aprox) : null,
        proteinas_g: datos.proteinas_g ? Number(datos.proteinas_g) : null,
        carbos_g: datos.carbos_g ? Number(datos.carbos_g) : null,
        grasas_g: datos.grasas_g ? Number(datos.grasas_g) : null,
      })
      .eq('id', comidaId)
      .select()
      .single()

    if (!error) await fetchPlanes()
    return { data, error }
  }

  //  Eliminar una comida del plan.
  async function eliminarComida(comidaId) {
    const { error } = await supabase
      .from('comidas_plan')
      .delete()
      .eq('id', comidaId)

    if (!error) await fetchPlanes()
    return { error }
  }

  //  Actualizar el objetivo calórico de un plan.
  async function actualizarCalorias(planId, calorias) {
    const { error } = await supabase
      .from('planes')
      .update({ calorias_objetivo: Number(calorias) })
      .eq('id', planId)

    if (!error) await fetchPlanes()
    return { error }
  }

  /**
   * Publicar un plan (borrador → activo).
   * Archiva automáticamente el plan activo anterior.
   */
  async function publicarPlan(planId) {
    // Archivar el activo actual si existe
    if (planActivo && planActivo.id !== planId) {
      await supabase
        .from('planes')
        .update({ estado: 'archivado' })
        .eq('id', planActivo.id)
    }

    const { error } = await supabase
      .from('planes')
      .update({ estado: 'activo' })
      .eq('id', planId)

    if (!error) await fetchPlanes()
    return { error }
  }

  /**
   * Editar un plan activo → crear nueva versión borrador.
   */
  async function crearNuevaVersion(planActivoId) {
    const base = planes.find(p => p.id === planActivoId)
    if (!base) return { error: 'Plan no encontrado.' }

    // Crear nueva versión
    const { data: nuevoPlan, error: errPlan } = await supabase
      .from('planes')
      .insert({
        paciente_id: pacienteId,
        calorias_objetivo: base.calorias_objetivo,
        version: base.version + 1,
        estado: 'borrador',
        notas: base.notas,
      })
      .select()
      .single()

    if (errPlan) return { error: errPlan }

    // Copiar las comidas del plan original
    if (base.comidas_plan?.length > 0) {
      const comidas = base.comidas_plan.map(c => ({
        plan_id: nuevoPlan.id,
        tipo_comida: c.tipo_comida,
        descripcion: c.descripcion,
        calorias_aprox: c.calorias_aprox,
        proteinas_g: c.proteinas_g,
        carbos_g: c.carbos_g,
        grasas_g: c.grasas_g,
        orden: c.orden,
      }))
      await supabase.from('comidas_plan').insert(comidas)
    }

    await fetchPlanes()
    return { data: nuevoPlan, error: null }
  }

  /**
   * Eliminar un plan (y todas sus comidas — CASCADE en DB).
   * No se puede eliminar el plan activo sin antes archivar o reemplazar.
   */
  async function eliminarPlan(planId) {
    const plan = planes.find(p => p.id === planId)
    if (plan?.estado === 'activo') {
      return { error: 'No podés eliminar el plan activo. Publicá una nueva versión primero.' }
    }
    const { error } = await supabase
      .from('planes')
      .delete()
      .eq('id', planId)

    if (!error) await fetchPlanes()
    return { error }
  }

  /**
   * Actualizar las notas/nombre descriptivo de un plan.
   */
  async function actualizarNotas(planId, notas) {
    const { error } = await supabase
      .from('planes')
      .update({ notas: notas.trim() || null })
      .eq('id', planId)

    if (!error) await fetchPlanes()
    return { error }
  }

  return {
    planes,
    planActivo,
    historial,
    loading,
    error,
    refetch: fetchPlanes,
    crearPlan,
    agregarComida,
    editarComida,
    eliminarComida,
    actualizarCalorias,
    publicarPlan,
    crearNuevaVersion,
    eliminarPlan,
    actualizarNotas,
  }
}
