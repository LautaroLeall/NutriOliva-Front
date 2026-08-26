import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'

/**
 * Hook para gestión completa de pacientes.
 * Solo accede a los pacientes del nutricionista autenticado (RLS garantiza el aislamiento).
 */
export function usePatients() {
  const { session } = useAuth()
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPacientes = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Trae pacientes + última actividad (comida o registro)
    const { data, error: fetchError } = await supabase
      .from('pacientes')
      .select(`
        id,
        nombre,
        email,
        telefono,
        fecha_nacimiento,
        estado,
        created_at,
        registros_comida (
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      // Calcular última actividad y flag de 48hs
      const now = new Date()
      const enriched = (data || []).map(p => {
        const registros = p.registros_comida || []
        const ultimaActividad = registros.length > 0
          ? new Date(Math.max(...registros.map(r => new Date(r.created_at))))
          : null

        const horasSinActividad = ultimaActividad
          ? (now - ultimaActividad) / (1000 * 60 * 60)
          : Infinity

        return {
          ...p,
          ultimaActividad,
          sinActividad48h: horasSinActividad > 48,
          registros_comida: undefined, // limpiar el array anidado
        }
      })

      // Ordenar: primero los sin actividad reciente
      enriched.sort((a, b) => {
        if (a.sinActividad48h && !b.sinActividad48h) return -1
        if (!a.sinActividad48h && b.sinActividad48h) return 1
        return 0
      })

      setPacientes(enriched)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (session) fetchPacientes()
  }, [session, fetchPacientes])

  /**
   * Crear un nuevo paciente.
   * {{ nombre, email, telefono, fecha_nacimiento }} datos
   * {{ data, error }}
   */
  async function crearPaciente(datos) {
    const { data: nutri } = await supabase
      .from('nutricionistas')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (!nutri) return { error: 'No se encontró el perfil del nutricionista.' }

    const { data, error } = await supabase
      .from('pacientes')
      .insert({
        nutricionista_id: nutri.id,
        nombre: datos.nombre.trim(),
        email: datos.email.trim().toLowerCase(),
        telefono: datos.telefono?.trim() || null,
        fecha_nacimiento: datos.fecha_nacimiento || null,
        estado: 'activo',
      })
      .select()
      .single()

    if (!error) await fetchPacientes()
    return { data, error }
  }

  //  Actualizar datos de un paciente.
  async function actualizarPaciente(id, datos) {
    const { data, error } = await supabase
      .from('pacientes')
      .update({
        nombre: datos.nombre?.trim(),
        email: datos.email?.trim().toLowerCase(),
        telefono: datos.telefono?.trim() || null,
        fecha_nacimiento: datos.fecha_nacimiento || null,
      })
      .eq('id', id)
      .select()
      .single()

    if (!error) await fetchPacientes()
    return { data, error }
  }

  //  Desactivar un paciente (no eliminar).
  async function desactivarPaciente(id) {
    const { error } = await supabase
      .from('pacientes')
      .update({ estado: 'inactivo' })
      .eq('id', id)

    if (!error) await fetchPacientes()
    return { error }
  }

  //  Reactivar un paciente.
  async function reactivarPaciente(id) {
    const { error } = await supabase
      .from('pacientes')
      .update({ estado: 'activo' })
      .eq('id', id)

    if (!error) await fetchPacientes()
    return { error }
  }

  return {
    pacientes,
    loading,
    error,
    refetch: fetchPacientes,
    crearPaciente,
    actualizarPaciente,
    desactivarPaciente,
    reactivarPaciente,
  }
}
