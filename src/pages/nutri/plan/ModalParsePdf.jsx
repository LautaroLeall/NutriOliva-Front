// ModalParsePdf.jsx — Modal para importar un plan alimenticio via IA
// 
// COMO USAR:
//   1. El nutricionista PEGA el texto del plan (desde Word, Google Docs, email, WhatsApp)
//   2. La IA lo analiza y devuelve las comidas estructuradas
//   3. El nutricionista revisa, edita si quiere y confirma
//   4. Las comidas se agregan al plan activo
//
// NO se necesita PDF. Pegar el texto directamente es mas rapido, mas simple
// y funciona con cualquier fuente: Word, Google Docs, notas, email, etc.

import { useState } from 'react'
import { Loader2, X, CheckCircle, AlertCircle, ClipboardPaste, Sparkles } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { supabase } from '@/lib/supabaseClient'

// Etiquetas legibles por tipo de comida
const TIPO_LABELS = {
  desayuno:          'Desayuno',
  colacion:          'Colacion',
  almuerzo:          'Almuerzo',
  merienda:          'Merienda',
  cena:              'Cena',
  colacion_nocturna: 'Colacion nocturna',
  snack:             'Snack',
}
const TIPOS_VALIDOS = Object.keys(TIPO_LABELS)

// Estados del modal
const ESTADO = {
  IDLE:       'idle',       // Esperando ingreso de texto
  PROCESANDO: 'procesando', // Llamando a la IA
  REVISION:   'revision',   // Mostrando comidas para revision
  ERROR:      'error',      // Error en el proceso
}

export default function ModalParsePdf({ open, onClose, onConfirmar }) {
  const [estado,    setEstado]    = useState(ESTADO.IDLE)
  const [texto,     setTexto]     = useState('')
  const [comidas,   setComidas]   = useState([])
  const [error,     setError]     = useState('')
  const [guardando, setGuardando] = useState(false)

  // ── Resetear al cerrar ────────────────────────────────────────────────────
  function handleClose() {
    if (guardando) return
    setEstado(ESTADO.IDLE)
    setTexto('')
    setComidas([])
    setError('')
  }

  // ── Analizar texto con IA ─────────────────────────────────────────────────
  async function analizarTexto() {
    if (texto.trim().length < 10) return

    setEstado(ESTADO.PROCESANDO)
    setError('')

    try {
      const { data, error: fnError } = await supabase.functions.invoke('parse-pdf', {
        body: { texto },
      })

      if (fnError) {
        throw new Error(fnError.message || 'Error al analizar el texto.')
      }

      const comidasExtraidas = data?.comidas || []

      if (comidasExtraidas.length === 0) {
        setError(
          data?.advertencia ||
          'No se encontraron comidas. Verifica que hayas pegado el contenido de un plan alimenticio.',
        )
        setEstado(ESTADO.ERROR)
        return
      }

      setComidas(comidasExtraidas)
      setEstado(ESTADO.REVISION)
    } catch (err) {
      setError(err.message || 'Error inesperado. Intenta de nuevo.')
      setEstado(ESTADO.ERROR)
    }
  }

  // ── Editar campo de una comida ────────────────────────────────────────────
  function editarComida(index, campo, valor) {
    setComidas((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [campo]: valor } : c)),
    )
  }

  // ── Eliminar comida de la lista ───────────────────────────────────────────
  function eliminarComida(index) {
    setComidas((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Confirmar e insertar en el plan ───────────────────────────────────────
  async function handleConfirmar() {
    const comidasValidas = comidas.filter((c) => c.descripcion.trim())
    if (comidasValidas.length === 0) return

    setGuardando(true)
    await onConfirmar(comidasValidas)
    setGuardando(false)
    handleClose()
    onClose()
  }

  const textoValido = texto.trim().length >= 10
  const comidasValidas = comidas.filter((c) => c.descripcion.trim())

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Modal open={open} onClose={() => { handleClose(); onClose() }} title="Importar plan con IA">
      <div className="space-y-4">

        {/* ESTADO: IDLE — ingresar texto */}
        {estado === ESTADO.IDLE && (
          <div className="space-y-3">
            {/* Instruccion */}
            <div className="flex items-start gap-3 bg-cream rounded-xl px-4 py-3">
              <ClipboardPaste size={15} className="text-olive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-[12px] text-olive-dark font-medium">
                  Pega el texto del plan alimenticio
                </p>
                <p className="text-[10.5px] text-muted mt-0.5 leading-snug">
                  Desde Word: selecciona todo (Ctrl+A) y copia (Ctrl+C),
                  luego pega aqui. Tambien funciona con Google Docs, email o WhatsApp.
                </p>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              className="w-full min-h-[200px] rounded-xl border border-cream-darker
                         bg-white px-4 py-3 text-[11.5px] text-olive-dark
                         placeholder:text-muted resize-none focus:outline-none
                         focus:border-olive/50 transition-colors font-display leading-relaxed"
              placeholder={
                "DESAYUNO\nCafe con leche descremada\n2 tostadas integrales con queso blanco descremado\n\n" +
                "ALMUERZO\nPechuga de pollo a la plancha 150g\nEnsalada verde\nArroz integral 1/2 taza cocido\n\n" +
                "MERIENDA\nYogur descremado con fruta\n\nCENA\nFilete de merluza 150g\nVegetales al vapor..."
              }
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              autoFocus
            />

            <div className="flex items-center justify-between">
              <p className={`text-[9.5px] ${texto.length > 18000 ? 'text-red-500' : 'text-muted'}`}>
                {texto.length.toLocaleString('es')} / 20.000 caracteres
              </p>
              {!textoValido && texto.length > 0 && (
                <p className="text-[9.5px] text-amber-500">
                  Pega mas contenido del plan para analizar
                </p>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => { handleClose(); onClose() }}
                className="btn-ghost flex-1 py-2.5"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={analizarTexto}
                disabled={!textoValido}
                className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles size={13} />
                Analizar con IA
              </button>
            </div>
          </div>
        )}

        {/* ESTADO: PROCESANDO */}
        {estado === ESTADO.PROCESANDO && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 size={28} className="animate-spin text-olive" />
            <div className="text-center">
              <p className="font-display text-[13px] text-olive-dark font-medium">
                Analizando el plan...
              </p>
              <p className="text-[10.5px] text-muted mt-1">
                La IA esta identificando y estructurando las comidas.
                Esto tarda unos segundos.
              </p>
            </div>
          </div>
        )}

        {/* ESTADO: ERROR */}
        {estado === ESTADO.ERROR && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-[12px] text-red-700 font-medium">
                  No se pudo analizar el texto
                </p>
                <p className="text-[10.5px] text-red-600 mt-0.5 leading-snug">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEstado(ESTADO.IDLE)}
              className="w-full btn-ghost py-2.5 text-sm"
            >
              Volver e intentar de nuevo
            </button>
          </div>
        )}

        {/* ESTADO: REVISION */}
        {estado === ESTADO.REVISION && (
          <div className="space-y-3">
            {/* Titulo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-olive flex-shrink-0" />
                <p className="text-[11px] text-olive-dark font-display font-medium">
                  {comidas.length} comida{comidas.length !== 1 ? 's' : ''} encontrada{comidas.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEstado(ESTADO.IDLE)}
                className="text-[10px] text-muted hover:text-olive-dark font-display underline"
              >
                Volver a editar el texto
              </button>
            </div>

            <p className="text-[10px] text-muted">
              Revisa, edita si es necesario y confirma para agregarlas al plan.
            </p>

            {/* Lista de comidas */}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {comidas.map((comida, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-cream-darker px-4 py-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <select
                      value={comida.tipo_comida}
                      onChange={(e) => editarComida(index, 'tipo_comida', e.target.value)}
                      className="text-[10px] font-display font-medium text-olive bg-olive/10
                                 border-0 rounded-lg px-2 py-1 cursor-pointer"
                    >
                      {TIPOS_VALIDOS.map((t) => (
                        <option key={t} value={t}>{TIPO_LABELS[t]}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => eliminarComida(index)}
                      className="text-muted hover:text-red-500 transition-colors flex-shrink-0"
                      title="Quitar esta comida"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <input
                    className="input text-[11.5px] py-1.5"
                    value={comida.descripcion}
                    onChange={(e) => editarComida(index, 'descripcion', e.target.value)}
                    placeholder="Descripcion de la comida"
                    maxLength={300}
                  />

                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { campo: 'calorias_aprox', label: 'kcal' },
                      { campo: 'proteinas_g',    label: 'P (g)' },
                      { campo: 'carbos_g',       label: 'C (g)' },
                      { campo: 'grasas_g',       label: 'G (g)' },
                    ].map(({ campo, label }) => (
                      <div key={campo}>
                        <p className="text-[8.5px] text-muted mb-0.5">{label}</p>
                        <input
                          type="number"
                          className="input text-[11px] py-1 text-center"
                          value={comida[campo] ?? ''}
                          onChange={(e) =>
                            editarComida(
                              index,
                              campo,
                              e.target.value === '' ? null : Number(e.target.value),
                            )
                          }
                          placeholder="—"
                          min={0}
                          step={campo === 'calorias_aprox' ? 1 : 0.1}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Acciones */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => { handleClose(); onClose() }}
                className="btn-ghost flex-1 py-2.5"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmar}
                disabled={guardando || comidasValidas.length === 0}
                className="btn-primary flex-1 py-2.5 disabled:opacity-50"
              >
                {guardando
                  ? <span className="flex items-center justify-center gap-1.5">
                      <Loader2 size={13} className="animate-spin" /> Agregando...
                    </span>
                  : `Agregar ${comidasValidas.length} comida${comidasValidas.length !== 1 ? 's' : ''} al plan`
                }
              </button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  )
}
