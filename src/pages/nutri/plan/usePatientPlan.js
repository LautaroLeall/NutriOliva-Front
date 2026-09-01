import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { usePlans } from '@/hooks/usePlans'
import { validarCalorias } from './patientPlanUtils'

export function usePatientPlan() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const {
    planes, planActivo, loading, error,
    crearPlan, agregarComida, editarComida, eliminarComida,
    actualizarCalorias, publicarPlan, crearNuevaVersion,
    eliminarPlan, actualizarNotas,
  } = usePlans(id)

  const [planVisibleId, setPlanVisibleId] = useState(null)
  const [modalNuevo, setModalNuevo] = useState(false)
  const [caloriaInput, setCaloriaInput] = useState('2000')
  const [calError, setCalError] = useState('')
  const [publicando, setPublicando] = useState(false)

  const [editandoCal, setEditandoCal] = useState(false)
  const [nuevasCal, setNuevasCal] = useState('')
  const [calEditError, setCalEditError] = useState('')

  const [editandoNotas, setEditandoNotas] = useState(false)
  const [notasInput, setNotasInput] = useState('')

  const [confirmEliminar, setConfirmEliminar] = useState(null)
  const [confirmPublicar, setConfirmPublicar] = useState(false)
  const [confirmVersion, setConfirmVersion] = useState(false)
  const [procesando, setProcesando] = useState(false)

  const planVisible = planes.find(p => p.id === planVisibleId)
    || planActivo
    || planes[0]
    || null

  const readonly = planVisible?.estado === 'archivado'

  async function handleCrearPlan() {
    const err = validarCalorias(caloriaInput)
    if (err) { setCalError(err); return }
    setCalError('')
    const { data, error: e } = await crearPlan(Number(caloriaInput))
    if (e) toast.error('Error al crear el plan.')
    else {
      toast.success('Plan creado como borrador.')
      setPlanVisibleId(data.id)
      setModalNuevo(false)
    }
  }

  async function handlePublicar() {
    if (!planVisible) return
    setProcesando(true)
    const { error: e } = await publicarPlan(planVisible.id)
    setProcesando(false)
    setConfirmPublicar(false)
    if (e) toast.error('Error al publicar: ' + e.message)
    else toast.success('Plan publicado y activo correctamente.')
  }

  async function handleNuevaVersion() {
    if (!planActivo) return
    setProcesando(true)
    const { data, error: e } = await crearNuevaVersion(planActivo.id)
    setProcesando(false)
    setConfirmVersion(false)
    if (e) toast.error('Error al crear nueva versión.')
    else {
      toast.success('Nueva versión creada como borrador.')
      setPlanVisibleId(data.id)
    }
  }

  async function handleEliminar() {
    if (!confirmEliminar) return
    setProcesando(true)
    const { error: e } = await eliminarPlan(confirmEliminar)
    setProcesando(false)
    if (e) {
      toast.error(e)
    } else {
      toast.success('Plan eliminado.')
      setPlanVisibleId(null)
    }
    setConfirmEliminar(null)
  }

  async function handleGuardarCalorias() {
    const err = validarCalorias(nuevasCal)
    if (err) { setCalEditError(err); return }
    if (Number(nuevasCal) === planVisible.calorias_objetivo) {
      setCalEditError('El valor no cambió.')
      return
    }
    setCalEditError('')
    await actualizarCalorias(planVisible.id, nuevasCal)
    setEditandoCal(false)
    toast.success('Objetivo calórico actualizado.')
  }

  async function handleGuardarNotas() {
    if (notasInput.trim() === (planVisible.notas || '').trim()) {
      setEditandoNotas(false)
      return
    }
    await actualizarNotas(planVisible.id, notasInput)
    setEditandoNotas(false)
    toast.success('Notas actualizadas.')
  }

  return {
    id, navigate, signOut, planes, planActivo, loading, error,
    planVisible, readonly, planVisibleId, setPlanVisibleId,
    modalNuevo, setModalNuevo, caloriaInput, setCaloriaInput, calError, setCalError,
    publicando, setPublicando, editandoCal, setEditandoCal, nuevasCal, setNuevasCal,
    calEditError, setCalEditError, editandoNotas, setEditandoNotas, notasInput, setNotasInput,
    confirmEliminar, setConfirmEliminar, confirmPublicar, setConfirmPublicar,
    confirmVersion, setConfirmVersion, procesando, setProcesando,
    handleCrearPlan, handlePublicar, handleNuevaVersion, handleEliminar,
    handleGuardarCalorias, handleGuardarNotas,
    agregarComida, editarComida, eliminarComida
  }
}
