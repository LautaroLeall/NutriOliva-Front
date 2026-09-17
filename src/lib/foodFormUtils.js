// src/lib/foodFormUtils.js
// Constantes y utilidades puras del formulario de comida.
// Sin efectos secundarios — solo datos y funciones de calculo.

import { supabase } from '@/lib/supabaseClient'

// ── Tabs del formulario ───────────────────────────────────────────────────────
export const MODOS = [
  { key: 'plan', label: 'Mi plan' },
  { key: 'catalogo', label: 'Catálogo' },
  { key: 'otra', label: 'Otra' },
]

// ── Detecta el tipo de comida segun la hora actual ───────────────────────────
export function tipoComidaActual() {
  const h = new Date().getHours()
  if (h < 10) return 'desayuno'
  if (h < 12) return 'colacion'
  if (h < 15) return 'almuerzo'
  if (h < 17) return 'colacion'
  if (h < 20) return 'merienda'
  return 'cena'
}

// ── Etiqueta legible para cada tipo de comida ────────────────────────────────
export function tipoLabel(t) {
  return (
    {
      desayuno: 'Desayuno',
      colacion: 'Colacion',
      almuerzo: 'Almuerzo',
      merienda: 'Merienda',
      cena: 'Cena',
      colacion_nocturna: 'Colacion nocturna',
      snack: 'Snack',
    }[t] || t
  )
}

// ── Busqueda multi-palabra en catalogo_alimentos ──────────────────────────────
// "pollo arroz" → busca filas donde CADA palabra aparece en nombre O descripcion_completa
export async function buscarEnCatalogo(query) {
  const words = query.trim().split(/\s+/).filter((w) => w.length >= 2)
  if (!words.length) return []

  let q = supabase
    .from('catalogo_alimentos')
    .select(
      'nombre, calorias_por_unidad, proteinas_g, carbos_g, grasas_g, ' +
      'tipo_comida, descripcion_completa, objetivo_ideal',
    )
    .order('es_comida_completa', { ascending: false })
    .limit(10)

  // AND de ORs: cada palabra debe aparecer en nombre O en descripcion_completa
  for (const word of words) {
    q = q.or(`nombre.ilike.%${word}%,descripcion_completa.ilike.%${word}%`)
  }

  const { data } = await q
  return data || []
}

// ── Validacion del modo "Otra comida" ────────────────────────────────────────
export function validarOtra(form) {
  const errs = {}
  const desc = form.descripcion.trim()

  if (!desc)
    errs.descripcion = 'La descripción es obligatoria.'
  else if (desc.length < 3)
    errs.descripcion = 'Describí un poco más lo que comiste.'
  else if (desc.length > 200)
    errs.descripcion = 'Máximo 200 caracteres.'

  if (form.calorias_estimadas !== '') {
    const n = Number(form.calorias_estimadas)
    if (isNaN(n)) errs.calorias = 'Debe ser un número.'
    else if (n < 1) errs.calorias = 'Las calorías deben ser mayor a 0.'
    else if (n > 3000) errs.calorias = 'El máximo es 3000 kcal por comida.'
    else if (!Number.isInteger(n)) errs.calorias = 'Debe ser un número entero (sin decimales).'
  }

  return errs
}
