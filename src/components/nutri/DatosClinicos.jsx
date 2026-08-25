import { useState, useEffect } from 'react'
import {
  Loader2, ChevronRight, ChevronLeft, Check,
  Calculator, AlertCircle, Activity, User,
  HeartPulse, ClipboardList,
} from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

// ── Constantes ────────────────────────────────────────────────────────────────

const OBJETIVO_OPTS = [
  { value: 'bajar', label: 'Bajar de peso', desc: 'Deficit calorico' },
  { value: 'bajar_fuerza', label: 'Bajar + fuerza', desc: 'Grasa y musculo' },
  { value: 'mantener', label: 'Mantener peso', desc: 'Equilibrio nutricional' },
  { value: 'subir', label: 'Aumentar peso', desc: 'Superavit calorico' },
  { value: 'subir_fuerza', label: 'Aumentar + fuerza', desc: 'Hipertrofia' },
  { value: 'rendimiento_deportivo', label: 'Rendimiento deportivo', desc: 'Nutricion periodizada' },
  { value: 'recomposicion', label: 'Recomposicion corporal', desc: 'Perder grasa, ganar musculo' },
]

const ACTIVIDAD_OPTS = [
  { value: 'sedentario', label: 'Sedentario', desc: 'Sin ejercicio', factor: '×1.2' },
  { value: 'leve', label: 'Leve', desc: '1–2 veces/semana', factor: '×1.375' },
  { value: 'moderado', label: 'Moderado', desc: '3–4 veces/semana', factor: '×1.55' },
  { value: 'activo', label: 'Activo', desc: '5–6 veces/semana', factor: '×1.725' },
  { value: 'muy_activo', label: 'Muy activo', desc: 'Atleta / doble turno', factor: '×1.9' },
]

const SEXO_OPTS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
]

const STEPS = [
  { id: 1, label: 'Datos basicos', icon: User },
  { id: 2, label: 'Composicion', icon: Activity },
  { id: 3, label: 'Objetivo', icon: HeartPulse },
  { id: 4, label: 'Clinica', icon: ClipboardList },
]

const FORM_VACIO = {
  peso: '', altura: '', edad: '', sexo: '',
  porcentaje_grasa: '', masa_muscular_kg: '', cintura_cm: '',
  objetivo: '', nivel_actividad: '',
  patologias: '', alergias: '', medicacion: '', observaciones: '',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcIMC(peso, altura) {
  const p = Number(peso), a = Number(altura)
  if (!p || !a || a <= 0) return null
  return (p / ((a / 100) ** 2)).toFixed(1)
}

function imcInfo(imc) {
  if (!imc) return null
  const v = Number(imc)
  if (v < 18.5) return { label: 'Bajo peso', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', bar: 'bg-blue-400', pct: 12 }
  if (v < 25) return { label: 'Normal', color: 'text-green-700', bg: 'bg-green-50 border-green-200', bar: 'bg-green-500', pct: 42 }
  if (v < 30) return { label: 'Sobrepeso', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', bar: 'bg-amber-400', pct: 63 }
  if (v < 35) return { label: 'Obesidad I', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', bar: 'bg-orange-500', pct: 81 }
  return { label: 'Obesidad II+', color: 'text-red-600', bg: 'bg-red-50 border-red-200', bar: 'bg-red-500', pct: 100 }
}

function cinturaRiesgo(cm, sexo) {
  const v = Number(cm)
  if (!v) return null
  const limite = sexo === 'F' ? 88 : 102
  if (v >= limite) return { label: 'Riesgo cardiovascular elevado', color: 'text-red-600', bg: 'bg-red-50 border-red-200' }
  if (v >= limite * 0.9) return { label: 'Riesgo moderado', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' }
  return { label: 'Sin riesgo detectado', color: 'text-green-700', bg: 'bg-green-50 border-green-200' }
}

// Paso 1: peso + altura OBLIGATORIOS. Resto opcional pero validado.
function validarPaso(step, form) {
  const errs = {}
  if (step === 1) {
    const p = Number(form.peso), a = Number(form.altura), e = Number(form.edad)
    if (!form.peso.trim()) errs.peso = 'Obligatorio.'
    else if (isNaN(p) || p < 20 || p > 300) errs.peso = '20–300 kg.'
    if (!form.altura.trim()) errs.altura = 'Obligatoria.'
    else if (isNaN(a) || a < 100 || a > 250) errs.altura = '100–250 cm.'
    if (form.edad !== '' && (isNaN(e) || e < 5 || e > 110)) errs.edad = '5–110 años.'
  }
  if (step === 2) {
    const g = Number(form.porcentaje_grasa), m = Number(form.masa_muscular_kg), c = Number(form.cintura_cm)
    if (form.porcentaje_grasa !== '' && (isNaN(g) || g < 3 || g > 65)) errs.porcentaje_grasa = '3–65%.'
    if (form.masa_muscular_kg !== '' && (isNaN(m) || m < 5 || m > 120)) errs.masa_muscular_kg = '5–120 kg.'
    if (form.cintura_cm !== '' && (isNaN(c) || c < 40 || c > 200)) errs.cintura_cm = '40–200 cm.'
  }
  return errs
}

// ── StepIndicator ─────────────────────────────────────────────────────────────

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-4">
      {STEPS.map((s, i) => {
        const done = s.id < currentStep, active = s.id === currentStep
        const Icon = s.icon
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-0.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all
                              ${done ? 'bg-olive border-olive text-cream'
                  : active ? 'bg-white border-olive text-olive'
                    : 'bg-white border-cream-darker text-muted'}`}>
                {done ? <Check size={11} strokeWidth={3} /> : <Icon size={11} />}
              </div>
              <span className={`text-[7.5px] font-display font-medium text-center w-[52px] leading-none
                                ${active ? 'text-olive-dark' : 'text-muted'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-0.5 mb-3.5 mx-0.5 transition-all ${done ? 'bg-olive' : 'bg-cream-darker'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Campo numérico compacto ───────────────────────────────────────────────────

function NumField({ label, name, value, onChange, onBlur, error, placeholder, unit, min, max, step = '0.1', required }) {
  return (
    <div>
      <label className="block text-[10.5px] font-display font-medium text-olive-dark mb-1">
        {label}{required && <span className="text-olive ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input type="number" name={name}
          className={`w-full rounded-xl border px-3 py-2 text-[12px] font-body text-olive-dark
                      placeholder-muted/50 focus:outline-none focus:ring-1 transition-colors
                      pr-10 ${error
              ? 'border-red-400 bg-red-50/30 focus:border-red-400 focus:ring-red-200'
              : 'border-cream-darker bg-white focus:border-olive/60 focus:ring-olive/20'}`}
          placeholder={placeholder} value={value}
          onChange={onChange} onBlur={onBlur}
          min={min} max={max} step={step} />
        {unit && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted font-display pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-[9.5px] text-red-500 mt-0.5">
          <AlertCircle size={9} /> {error}
        </p>
      )}
    </div>
  )
}

// ── Tarjeta de selección compacta ─────────────────────────────────────────────

function SelCard({ selected, onClick, label, desc, extra }) {
  return (
    <button type="button" onClick={onClick}
      className={`text-left px-2.5 py-2 rounded-xl border-2 transition-all duration-150 w-full
                  ${selected ? 'border-olive bg-olive/5' : 'border-cream-darker bg-white hover:border-olive/30'}`}>
      <div className="flex items-center justify-between gap-1">
        <div className="min-w-0 flex-1">
          <p className={`text-[10.5px] font-display font-semibold leading-tight truncate
                          ${selected ? 'text-olive-dark' : 'text-olive-dark/80'}`}>
            {label}
          </p>
          <p className="text-[8.5px] text-muted leading-tight mt-0.5 truncate">{desc}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {extra && (
            <span className={`text-[8.5px] font-display font-medium ${selected ? 'text-olive' : 'text-muted'}`}>
              {extra}
            </span>
          )}
          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all
                            ${selected ? 'border-olive bg-olive' : 'border-cream-darker bg-white'}`}>
            {selected && <Check size={8} className="text-cream" strokeWidth={3} />}
          </div>
        </div>
      </div>
    </button>
  )
}

// COMPONENTE PRINCIPAL
export default function DatosClinicos({
  open, onClose,
  pacienteId, nombrePaciente,
  datosIniciales = null,
  onGuardado,
}) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...FORM_VACIO })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const esEdicion = !!datosIniciales

  useEffect(() => {
    if (!open) return
    setStep(1); setErrors({})
    setForm(datosIniciales ? {
      peso: datosIniciales.peso?.toString() ?? '',
      altura: datosIniciales.altura?.toString() ?? '',
      edad: datosIniciales.edad?.toString() ?? '',
      sexo: datosIniciales.sexo ?? '',
      porcentaje_grasa: datosIniciales.porcentaje_grasa?.toString() ?? '',
      masa_muscular_kg: datosIniciales.masa_muscular_kg?.toString() ?? '',
      cintura_cm: datosIniciales.cintura_cm?.toString() ?? '',
      objetivo: datosIniciales.objetivo ?? '',
      nivel_actividad: datosIniciales.nivel_actividad ?? '',
      patologias: datosIniciales.patologias ?? '',
      alergias: datosIniciales.alergias ?? '',
      medicacion: datosIniciales.medicacion ?? '',
      observaciones: datosIniciales.observaciones ?? '',
    } : { ...FORM_VACIO })
  }, [open])

  const imc = calcIMC(form.peso, form.altura)
  const imcData = imcInfo(imc)
  const cintData = cinturaRiesgo(form.cintura_cm, form.sexo)

  function set(name, value) {
    setForm(f => ({ ...f, [name]: value }))
    setErrors(e => ({ ...e, [name]: undefined }))
  }

  function handleChange(e) { set(e.target.name, e.target.value) }

  function handleBlur(e) {
    const errs = validarPaso(step, { ...form, [e.target.name]: e.target.value })
    if (errs[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: errs[e.target.name] }))
  }

  function handleNext() {
    const errs = validarPaso(step, form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setStep(s => s + 1)
  }

  function handleBack() { setErrors({}); setStep(s => s - 1) }

  async function handleSubmit() {
    const errs = validarPaso(step, form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    const n = v => v !== '' ? Number(v) : null
    const { error } = await supabase.from('datos_clinicos').insert({
      paciente_id: pacienteId,
      fecha_registro: new Date().toISOString().split('T')[0],
      peso: n(form.peso), altura: n(form.altura),
      edad: n(form.edad), sexo: form.sexo || null,
      objetivo: form.objetivo || null,
      nivel_actividad: form.nivel_actividad || null,
      porcentaje_grasa: n(form.porcentaje_grasa),
      masa_muscular_kg: n(form.masa_muscular_kg),
      cintura_cm: n(form.cintura_cm),
      patologias: form.patologias.trim() || null,
      alergias: form.alergias.trim() || null,
      medicacion: form.medicacion.trim() || null,
      observaciones: form.observaciones.trim() || null,
    })
    setLoading(false)
    if (error) { toast.error('Error al guardar: ' + error.message); return }
    toast.success(esEdicion ? 'Datos clinicos actualizados.' : 'Datos clinicos guardados.')
    onGuardado?.(); onClose()
  }

  return (
    <Modal
      open={open} onClose={onClose} size="lg"
      title={esEdicion ? `Actualizar datos — ${nombrePaciente ?? ''}` : `Nuevo registro — ${nombrePaciente ?? ''}`}
      preventOverlayClose
    >
      <div className="flex flex-col gap-3">

        <StepIndicator currentStep={step} />

        {/* ── PASO 1: Datos básicos ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <NumField label="Peso" name="peso" value={form.peso}
                onChange={handleChange} onBlur={handleBlur}
                error={errors.peso} placeholder="70.5" unit="kg" min={20} max={300} required />
              <NumField label="Altura" name="altura" value={form.altura}
                onChange={handleChange} onBlur={handleBlur}
                error={errors.altura} placeholder="170" unit="cm" min={100} max={250} step="1" required />
            </div>

            {/* IMC compacto */}
            {imc && imcData && (
              <div className={`rounded-xl border px-3 py-2 ${imcData.bg} transition-all`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5">
                    <Calculator size={11} className={imcData.color} />
                    <span className={`font-display font-bold text-sm ${imcData.color}`}>IMC {imc}</span>
                  </span>
                  <span className={`text-[10px] font-display font-semibold ${imcData.color}`}>{imcData.label}</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-1.5 rounded-full transition-all ${imcData.bar}`} style={{ width: `${imcData.pct}%` }} />
                </div>
                <div className="flex justify-between mt-0.5">
                  {['18.5', '25', '30', '35+'].map(v => <span key={v} className="text-[8px] text-muted">{v}</span>)}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <NumField label="Edad" name="edad" value={form.edad}
                onChange={handleChange} onBlur={handleBlur}
                error={errors.edad} placeholder="28" unit="años" min={5} max={110} step="1" />

              {/* Sexo — botones con padding suficiente */}
              <div>
                <label className="block text-[10.5px] font-display font-medium text-olive-dark mb-1">
                  Sexo biologico
                </label>
                <div className="flex gap-2">
                  {SEXO_OPTS.map(o => (
                    <button key={o.value} type="button"
                      onClick={() => set('sexo', form.sexo === o.value ? '' : o.value)}
                      className={`flex-1 py-2 rounded-xl border-2 text-[10.5px] font-display font-medium
                                  transition-all text-center
                                  ${form.sexo === o.value
                          ? 'border-olive bg-olive text-cream'
                          : 'border-cream-darker bg-white text-muted hover:border-olive/40 hover:text-olive-dark'}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PASO 2: Composicion corporal ──────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-[10px] text-muted">Todos los campos son opcionales.</p>
            <div className="grid grid-cols-3 gap-2">
              <NumField label="% Grasa" name="porcentaje_grasa" value={form.porcentaje_grasa}
                onChange={handleChange} onBlur={handleBlur}
                error={errors.porcentaje_grasa} placeholder="22" unit="%" min={3} max={65} />
              <NumField label="Masa muscular" name="masa_muscular_kg" value={form.masa_muscular_kg}
                onChange={handleChange} onBlur={handleBlur}
                error={errors.masa_muscular_kg} placeholder="32" unit="kg" min={5} max={120} />
              <NumField label="Cintura" name="cintura_cm" value={form.cintura_cm}
                onChange={handleChange} onBlur={handleBlur}
                error={errors.cintura_cm} placeholder="85" unit="cm" min={40} max={200} />
            </div>

            {cintData && (
              <div className={`rounded-xl border px-3 py-2 flex items-center gap-2 ${cintData.bg}`}>
                <AlertCircle size={11} className={cintData.color} />
                <div>
                  <p className={`text-[10.5px] font-display font-semibold ${cintData.color}`}>{cintData.label}</p>
                  <p className="text-[8.5px] text-muted">
                    Ref: {form.sexo === 'F' ? 'Mujeres >88 cm' : form.sexo === 'M' ? 'Hombres >102 cm' : 'Completar sexo biologico para calcular'}
                  </p>
                </div>
              </div>
            )}

            {/* Referencia compacta */}
            <div className="bg-cream rounded-xl px-3 py-2.5">
              <p className="text-[8.5px] font-display text-muted uppercase tracking-wide mb-1.5">Referencia grasa saludable</p>
              <div className="grid grid-cols-2 gap-x-6 text-[10px] text-muted leading-snug">
                <span>Hombres: 10–20%</span><span>Mujeres: 18–28%</span>
                <span>Atletas H: 6–13%</span><span>Atletas M: 14–20%</span>
              </div>
            </div>
          </div>
        )}

        {/* ── PASO 3: Objetivo y actividad ─────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-3">
            <div>
              <p className="text-[10.5px] font-display font-medium text-olive-dark mb-1.5">Objetivo terapeutico</p>
              <div className="grid grid-cols-2 gap-1.5">
                {OBJETIVO_OPTS.map(o => (
                  <SelCard key={o.value}
                    selected={form.objetivo === o.value}
                    onClick={() => set('objetivo', form.objetivo === o.value ? '' : o.value)}
                    label={o.label} desc={o.desc} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10.5px] font-display font-medium text-olive-dark mb-1.5">Nivel de actividad fisica</p>
              <div className="grid grid-cols-2 gap-1.5">
                {ACTIVIDAD_OPTS.map(o => (
                  <SelCard key={o.value}
                    selected={form.nivel_actividad === o.value}
                    onClick={() => set('nivel_actividad', form.nivel_actividad === o.value ? '' : o.value)}
                    label={o.label} desc={o.desc} extra={o.factor} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PASO 4: Información clínica ───────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-2.5">
            <div className="flex gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
              <AlertCircle size={11} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-[9.5px] text-blue-700 font-display leading-snug">
                Cada guardado crea un nuevo registro historico — los datos anteriores no se eliminan.
              </p>
            </div>

            {/* 2×2 grid de textareas */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: 'patologias', label: 'Patologias', placeholder: 'Ej: Diabetes tipo 2, HTA...', hint: 'Separar por coma' },
                { name: 'alergias', label: 'Alergias e intolerancias', placeholder: 'Ej: Lactosa, celiaquía...', hint: 'Importante para el plan' },
                { name: 'medicacion', label: 'Medicacion actual', placeholder: 'Ej: Metformina 500mg...', hint: 'Afecta absorcion de nutrientes' },
                { name: 'observaciones', label: 'Observaciones', placeholder: 'Notas del nutricionista...', hint: '' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-[10px] font-display font-medium text-olive-dark mb-0.5">
                    {f.label} <span className="text-muted font-normal">(opcional)</span>
                  </label>
                  <textarea
                    name={f.name} value={form[f.name]}
                    onChange={handleChange} placeholder={f.placeholder}
                    maxLength={500}
                    style={{ height: '68px' }}
                    className="w-full rounded-xl border border-cream-darker bg-white px-3 py-2
                                text-[11px] font-body text-olive-dark placeholder-muted/50
                                focus:outline-none focus:border-olive/60 focus:ring-1 focus:ring-olive/20
                                resize-none transition-colors"
                  />
                  <div className="flex justify-between">
                    {f.hint && <p className="text-[8.5px] text-muted">{f.hint}</p>}
                    <p className="text-[8px] text-muted ml-auto">{form[f.name].length}/500</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Barra de navegación ───────────────────────────────────────── */}
        <div className="flex items-center gap-2 pt-2 border-t border-cream-darker">
          {step > 1 ? (
            <button type="button" onClick={handleBack}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl border-2 border-cream-darker
                        text-muted hover:text-olive-dark hover:border-olive/40
                          font-display text-[11.5px] transition-all">
              <ChevronLeft size={13} /> Anterior
            </button>
          ) : (
            <button type="button" onClick={onClose}
              className="px-3.5 py-2 rounded-xl border-2 border-cream-darker text-muted
                        hover:text-olive-dark font-display text-[11.5px] transition-all">
              Cancelar
            </button>
          )}

          {/* Puntos de progreso */}
          <div className="flex-1 flex items-center justify-center gap-1.5">
            {STEPS.map(s => (
              <div key={s.id}
                className={`rounded-full transition-all duration-300
                            ${s.id === step ? 'w-4 h-2 bg-olive' : s.id < step ? 'w-2 h-2 bg-olive/40' : 'w-2 h-2 bg-cream-darker'}`}
              />
            ))}
          </div>

          {step < STEPS.length ? (
            <button type="button" onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-olive text-cream
                        hover:bg-olive-deep font-display text-[11.5px] font-medium transition-all">
              Siguiente <ChevronRight size={13} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={loading}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-olive text-cream
                        hover:bg-olive-deep font-display text-[11.5px] font-medium
                          disabled:opacity-60 transition-all">
              {loading
                ? <><Loader2 size={12} className="animate-spin" /> Guardando...</>
                : <><Check size={12} strokeWidth={2.5} /> {esEdicion ? 'Actualizar' : 'Guardar'}</>}
            </button>
          )}
        </div>

      </div>
    </Modal>
  )
}
