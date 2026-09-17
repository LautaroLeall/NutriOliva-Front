// src/hooks/useFoodForm.js
// Hook con toda la logica de estado del formulario de comida.
// Separa completamente la logica del render.

import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'
import { subirFoto } from '@/lib/storage'
import {
  tipoComidaActual,
  buscarEnCatalogo,
  validarOtra,
} from '@/lib/foodFormUtils'

export function useFoodForm({ open, comidasPlan, pacienteId, modoEdicion, datosIniciales, onGuardar, onClose }) {
  // ── Estado del modo activo ────────────────────────────────────────────────
  const [modo, setModo] = useState('plan')

  // ── Estado del modo catalogo ──────────────────────────────────────────────
  const [query, setQuery] = useState('')
  const [itemSeleccionado, setItemSel] = useState(null)
  const [sugs, setSugs] = useState([])
  const [buscando, setBuscando] = useState(false)

  // ── Estado del modo otra comida ───────────────────────────────────────────
  const [formOtra, setFormOtra] = useState({ descripcion: '', calorias_estimadas: '' })

  // ── Estado del modo plan ──────────────────────────────────────────────────
  const [planSeleccionada, setPlanSel] = useState(null)

  // ── Estado compartido ─────────────────────────────────────────────────────
  const [foto, setFoto] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [estimandoCal, setEstimandoCal] = useState(false)

  // Ref para el input de busqueda del catalogo (foco automatico)
  const inputRef = useRef(null)

  // ── Datos derivados ───────────────────────────────────────────────────────
  const tipoActual = tipoComidaActual()
  const comidasDelMomento = comidasPlan.filter((c) => c.tipo_comida === tipoActual)
  const otrasComidasPlan = comidasPlan.filter((c) => c.tipo_comida !== tipoActual)

  // ── Reset al abrir el modal ───────────────────────────────────────────────
  useEffect(() => {
    if (!open) return

    if (modoEdicion && datosIniciales) {
      // Modo edicion: siempre modo "otra" con datos pre-cargados
      setModo('otra')
      setFormOtra({
        descripcion: datosIniciales.descripcion || '',
        calorias_estimadas: datosIniciales.calorias_estimadas != null
          ? String(datosIniciales.calorias_estimadas)
          : '',
      })
    } else {
      setModo(comidasPlan.length > 0 ? 'plan' : 'catalogo')
      setFormOtra({ descripcion: '', calorias_estimadas: '' })
    }

    setQuery('')
    setItemSel(null)
    setSugs([])
    setPlanSel(null)
    setFoto(null)
    setErrors({})
  }, [open])

  // ── Busqueda en tiempo real con debounce 300ms ────────────────────────────
  useEffect(() => {
    if (modo !== 'catalogo' || itemSeleccionado) {
      setSugs([])
      return
    }
    if (query.trim().length < 2) {
      setSugs([])
      return
    }

    const t = setTimeout(async () => {
      setBuscando(true)
      const results = await buscarEnCatalogo(query)
      setSugs(results)
      setBuscando(false)
    }, 300)

    return () => clearTimeout(t)
  }, [query, modo, itemSeleccionado])

  // ── Acciones del catalogo ─────────────────────────────────────────────────
  const seleccionarItem = useCallback((item) => {
    setItemSel(item)
    setSugs([])
    setQuery('')
    setErrors((e) => ({ ...e, catalogo: undefined, _server: undefined }))
  }, [])

  const limpiarSeleccion = useCallback(() => {
    setItemSel(null)
    setQuery('')
    setSugs([])
    setErrors((e) => ({ ...e, catalogo: undefined }))
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  // ── Cambio de modo — resetea todo el estado secundario ───────────────────
  const cambiarModo = useCallback((m) => {
    setModo(m)
    setQuery('')
    setItemSel(null)
    setSugs([])
    setFormOtra({ descripcion: '', calorias_estimadas: '' })
    setPlanSel(null)
    setErrors({})
  }, [])

  // ── Estimacion de calorias via IA ─────────────────────────────────────────
  const estimarCalorias = useCallback(async () => {
    const desc = formOtra.descripcion.trim()
    if (desc.length < 3) return

    setEstimandoCal(true)
    try {
      const { data, error } = await supabase.functions.invoke('estimate-calories', {
        body: { descripcion: desc, paciente_id: pacienteId },
      })

      if (error) {
        toast.error('Error al estimar calorías. Podés ingresarlas manualmente.')
        return
      }

      if (data?.calorias != null) {
        setFormOtra((f) => ({ ...f, calorias_estimadas: String(data.calorias) }))
        setErrors((er) => ({ ...er, calorias: undefined }))
        toast.success(`Se estimaron ${data.calorias} kcal`)
      } else {
        toast.info('No se pudo estimar con precisión. Por favor ingresá las calorías.')
      }
    } catch (_) {
      toast.error('Ocurrió un error. Podés ingresar las calorías manualmente.')
    } finally {
      setEstimandoCal(false)
    }
  }, [formOtra.descripcion, pacienteId])

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    let descripcion, calorias_estimadas, fuente_estimacion

    if (modo === 'plan') {
      if (!planSeleccionada) {
        setErrors({ _plan: 'Elegí una comida del plan.' })
        return
      }
      descripcion = planSeleccionada.descripcion
      calorias_estimadas = planSeleccionada.calorias_aprox || null
      fuente_estimacion = 'plan'

    } else if (modo === 'catalogo') {
      if (!itemSeleccionado) {
        setErrors({ catalogo: 'Buscá y seleccioná una comida del catálogo.' })
        return
      }
      descripcion = itemSeleccionado.nombre
      calorias_estimadas = itemSeleccionado.calorias_por_unidad
        ? Math.round(itemSeleccionado.calorias_por_unidad)
        : null
      fuente_estimacion = 'catalogo'

    } else {
      // Modo otra
      const errs = validarOtra(formOtra)
      if (Object.keys(errs).length > 0) {
        setErrors(errs)
        return
      }
      descripcion = formOtra.descripcion.trim()
      calorias_estimadas = formOtra.calorias_estimadas !== ''
        ? Number(formOtra.calorias_estimadas)
        : null
      fuente_estimacion = 'manual'
    }

    setErrors({})
    setLoading(true)

    // Subir foto si existe
    let foto_path = null
    if (foto && pacienteId) {
      const { path, error: fotoErr } = await subirFoto(foto, 'fotos-comidas', pacienteId)
      if (fotoErr) {
        setErrors({ _server: 'Error al subir la foto: ' + fotoErr })
        setLoading(false)
        return
      }
      foto_path = path
    }

    const { error } = await onGuardar({ descripcion, calorias_estimadas, fuente_estimacion, foto_path })
    setLoading(false)

    if (error) {
      setErrors({ _server: error })
      return
    }
    onClose()
  }, [modo, planSeleccionada, itemSeleccionado, formOtra, foto, pacienteId, onGuardar, onClose])

  return {
    // Estado
    modo, query, itemSeleccionado, sugs, buscando,
    formOtra, planSeleccionada, foto, errors, loading, estimandoCal,
    // Datos derivados
    tipoActual, comidasDelMomento, otrasComidasPlan,
    // Ref
    inputRef,
    // Setters directos
    setQuery, setFormOtra, setErrors, setPlanSel, setFoto,
    // Acciones
    seleccionarItem, limpiarSeleccion, cambiarModo,
    estimarCalorias, handleSubmit,
  }
}
