// src/lib/foodFormUtils.js
// Constantes y utilidades puras del formulario de comida.
// Usa cache ligero en memoria + busqueda difusa (fuzzySearch) para encontrar alimentos
// en < 1ms tolerando acentos ("brocoli" -> "Brócoli") y errores de tipeo ("milaneza" -> "Milanesa").

import { supabase } from "@/lib/supabaseClient";
import { filtrarYOrdenarBusqueda } from "@/lib/fuzzySearch";

// ── Tabs del formulario ───────────────────────────────────────────────────────
export const MODOS = [
  { key: "plan", label: "Mi plan" },
  { key: "catalogo", label: "Catalogo" },
  { key: "otra", label: "Otra" },
];

// Cache ligero en memoria (TTL 90 segundos) para busquedas instantaneas
let catalogoCache = {
  items: null,
  ts: 0,
};

export function invalidarCacheCatalogo() {
  catalogoCache = { items: null, ts: 0 };
}

export async function obtenerCatalogoMemoria() {
  const now = Date.now();
  if (catalogoCache.items && now - catalogoCache.ts < 90000) {
    return catalogoCache.items;
  }

  const { data } = await supabase
    .from("catalogo_alimentos")
    .select(
      "id, nombre, calorias_por_unidad, unidad, proteinas_g, carbos_g, grasas_g, " +
      "tipo_comida, descripcion_completa, objetivo_ideal, perfil_paciente, es_comida_completa"
    )
    .order("es_comida_completa", { ascending: false })
    .limit(500);

  const lista = data || [];
  catalogoCache = { items: lista, ts: now };
  return lista;
}

// ── Detecta el tipo de comida segun la hora actual ───────────────────────────
export function tipoComidaActual() {
  const h = new Date().getHours();
  if (h < 10) return "desayuno";
  if (h < 12) return "colacion";
  if (h < 15) return "almuerzo";
  if (h < 17) return "colacion";
  if (h < 20) return "merienda";
  return "cena";
}

// ── Etiqueta legible para cada tipo de comida ────────────────────────────────
export function tipoLabel(t) {
  return (
    {
      desayuno: "Desayuno",
      colacion: "Colacion",
      almuerzo: "Almuerzo",
      merienda: "Merienda",
      cena: "Cena",
      colacion_nocturna: "Colacion nocturna",
      snack: "Snack",
    }[t] || t
  );
}

// ── Busqueda ultrarrapida en catalogo_alimentos tolerante a errores de tipeo y acentos ──
export async function buscarEnCatalogo(query) {
  const q = String(query ?? "").trim();
  if (q.length < 2) return [];

  const todos = await obtenerCatalogoMemoria();
  return filtrarYOrdenarBusqueda(todos, q, (item) => [
    item.nombre,
    item.descripcion_completa,
    item.tipo_comida,
    item.objetivo_ideal,
    item.perfil_paciente,
  ]).slice(0, 10);
}

// ── Validacion del modo "Otra comida" ────────────────────────────────────────
export function validarOtra(form) {
  const errs = {};
  const desc = form.descripcion.trim();

  if (!desc) errs.descripcion = "La descripcion es obligatoria.";
  else if (desc.length < 3)
    errs.descripcion = "Describi un poco mas lo que comiste.";
  else if (desc.length > 200) errs.descripcion = "Maximo 200 caracteres.";

  if (form.calorias_estimadas !== "") {
    const n = Number(form.calorias_estimadas);
    if (isNaN(n)) errs.calorias = "Debe ser un numero.";
    else if (n < 1) errs.calorias = "Las calorias deben ser mayor a 0.";
    else if (n > 3000) errs.calorias = "El maximo es 3000 kcal por comida.";
    else if (!Number.isInteger(n))
      errs.calorias = "Debe ser un numero entero (sin decimales).";
  }

  return errs;
}
