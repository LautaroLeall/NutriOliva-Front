import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'

/**
 * Hook para gestion completa de pacientes.
 * Solo accede a los pacientes del nutricionista autenticado (RLS garantiza el aislamiento).
 * Verifica ademas el cupo maximo de pacientes activos segun plan_suscripcion + cupo_extra.
 */
export function usePatients() {
  const { session } = useAuth()
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPacientes = useCallback(async () => {
    setLoading(true)
    setError(null)

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Sin conexion. Verifica tu internet o que Supabase este activo.')), 10000)
    )

    try {
      const fetchPromise = supabase
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

      const { data, error: fetchError } = await Promise.race([fetchPromise, timeoutPromise])

      if (fetchError) {
        setError(fetchError.message)
      } else {
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
            registros_comida: undefined,
          }
        })

        enriched.sort((a, b) => {
          if (a.sinActividad48h && !b.sinActividad48h) return -1
          if (!a.sinActividad48h && b.sinActividad48h) return 1
          return 0
        })

        setPacientes(enriched)
      }
    } catch (err) {
      setError(err.message || 'Error de conexion al cargar pacientes.')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (session) fetchPacientes()
  }, [session, fetchPacientes])

  async function verificarCupoDisponible() {
    const { data: nutri } = await supabase
      .from('nutricionistas')
      .select('id, plan_suscripcion, cupo_extra')
      .eq('id', session.user.id)
      .single()

    if (!nutri) return { ok: false, error: 'No se encontro el perfil del nutricionista.' }

    const planId = (nutri.plan_suscripcion || 'starter').toLowerCase()
    const { data: planRow } = await supabase
      .from('planes_suscripcion')
      .select('cupo_pacientes, nombre')
      .eq('id', planId)
      .maybeSingle()

    const cupoBase = planRow?.cupo_pacientes ?? (planId === 'clinic' ? 9999 : planId === 'pro' ? 50 : 15)
    const cupoTotal = cupoBase >= 9999 ? 9999 : cupoBase + (nutri.cupo_extra || 0)

    if (cupoTotal < 9999) {
      const activosActuales = pacientes.filter(p => p.estado === 'activo').length
      if (activosActuales >= cupoTotal) {
        return {
          ok: false,
          nutri,
          error: `Alcanzaste el limite de ${cupoTotal} pacientes activos de tu plan (${planRow?.nombre || planId}). Solicita ampliar tu cupo o cambiar de plan.`,
        }
      }
    }

    return { ok: true, nutri, error: null }
  }

  async function crearPaciente(datos) {
    const validacionCupo = await verificarCupoDisponible()
    if (!validacionCupo.ok) {
      return { data: null, error: { message: validacionCupo.error }, inviteError: null }
    }
    const nutri = validacionCupo.nutri

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

    if (error) return { data: null, error, inviteError: null }

    let inviteError = null
    try {
      const { error: invErr } = await supabase.functions.invoke('invite-patient', {
        body: {
          paciente_id: data.id,
          nombre: datos.nombre.trim(),
          email: datos.email.trim().toLowerCase(),
        },
      })
      if (invErr) {
        console.warn('[invite-patient] Error al enviar invitacion:', invErr)
        inviteError = invErr.message || 'Error al enviar el mail de invitacion.'
      }
    } catch (e) {
      console.warn('[invite-patient] Excepcion al invocar Edge Function:', e)
      inviteError = 'No se pudo contactar el servidor de invitaciones.'
    }

    await fetchPacientes()
    return { data, error: null, inviteError }
  }

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

  async function desactivarPaciente(id) {
    const { error } = await supabase
      .from('pacientes')
      .update({ estado: 'inactivo' })
      .eq('id', id)

    if (!error) await fetchPacientes()
    return { error }
  }

  async function reactivarPaciente(id) {
    const validacionCupo = await verificarCupoDisponible()
    if (!validacionCupo.ok) {
      return { error: { message: validacionCupo.error } }
    }

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
