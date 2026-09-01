import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { usePatients } from '@/hooks/usePatients'
import { useRegistrosNutri } from '@/hooks/useRegistrosNutri'
import { useWeeklyBalance } from '@/hooks/useWeeklyBalance'
import { toLocalISO } from './patientDetailUtils'

export function usePatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { actualizarPaciente, desactivarPaciente, reactivarPaciente } = usePatients()

  const [paciente, setPaciente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editando, setEditando] = useState(false)
  const [editandoClinicos, setEditandoClinicos] = useState(false)

  const [tab, setTab] = useState('ficha')
  const [fechaDiario, setFechaDiario] = useState(toLocalISO(new Date()))

  const {
    comidas: comidasNutri,
    actividades: actividadesNutri,
    totalConsumidas,
    totalGastadas,
    loading: loadingDiario,
  } = useRegistrosNutri(tab === 'diario' ? id : null, fechaDiario)

  const { puntos: puntosSemanales, loading: loadingTendencia } = useWeeklyBalance(
    id,
    paciente?.planes?.find(p => p.estado === 'activo')?.calorias_objetivo || 0
  )

  useEffect(() => { fetchPaciente() }, [id])

  async function fetchPaciente() {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('pacientes')
      .select(`
        *,
        datos_clinicos (
          id, peso, altura, edad, sexo, objetivo, observaciones, fecha_registro, created_at
        ),
        planes (
          id, calorias_objetivo, version, estado, created_at
        ),
        registros_comida (
          id, fecha, hora, descripcion, calorias_estimadas, created_at
        )
      `)
      .eq('id', id)
      .single()

    if (err) setError(err.message)
    else {
      if (data.datos_clinicos) {
        data.datos_clinicos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }
      if (data.registros_comida) {
        data.registros_comida.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }
      setPaciente(data)
    }
    setLoading(false)
  }

  async function handleGuardar(datos) {
    const result = await actualizarPaciente(id, datos)
    if (!result.error) fetchPaciente()
    return result
  }

  async function handleGuardarClinicos() {
    await fetchPaciente()
    toast.success('Datos clínicos actualizados.')
  }

  const datosClinicos = paciente?.datos_clinicos?.[0]
  const planActivo = paciente?.planes?.find(p => p.estado === 'activo')
  const caloriasObjetivo = planActivo?.calorias_objetivo || 0

  const registrosHoy = paciente?.registros_comida?.filter(
    r => r.fecha === toLocalISO(new Date())
  ) || []
  const caloriasHoy = registrosHoy.reduce((s, r) => s + (r.calorias_estimadas || 0), 0)
  const activo = paciente?.estado === 'activo'

  return {
    id, paciente, loading, error, editando, setEditando, editandoClinicos, setEditandoClinicos,
    tab, setTab, fechaDiario, setFechaDiario,
    comidasNutri, actividadesNutri, totalConsumidas, totalGastadas, loadingDiario,
    puntosSemanales, loadingTendencia,
    datosClinicos, planActivo, caloriasObjetivo, registrosHoy, caloriasHoy, activo,
    fetchPaciente, handleGuardar, handleGuardarClinicos, navigate, signOut,
    desactivarPaciente, reactivarPaciente
  }
}
