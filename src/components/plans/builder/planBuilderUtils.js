// planBuilderUtils.js — Constantes, búsqueda en catálogo y parser Excel para PlanBuilder

import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabaseClient";

export const TIPOS = [
  { value: "desayuno", label: "Desayuno" },
  { value: "colacion", label: "Colacion" },
  { value: "almuerzo", label: "Almuerzo" },
  { value: "merienda", label: "Merienda" },
  { value: "cena", label: "Cena" },
  { value: "colacion_nocturna", label: "Colacion Nocturna" },
  { value: "snack", label: "Snack" },
];

export const TIPOS_COMPATIBLES = {
  desayuno: ["desayuno", "merienda", "colacion", "snack"],
  colacion: ["colacion", "snack", "desayuno", "merienda"],
  almuerzo: ["almuerzo", "cena"],
  merienda: ["merienda", "desayuno", "colacion", "snack"],
  cena: ["cena", "almuerzo"],
  colacion_nocturna: ["colacion_nocturna", "colacion", "snack"],
  snack: ["snack", "colacion", "desayuno", "merienda"],
};

export const FORM_VACIO = {
  tipo_comida: "desayuno",
  descripcion: "",
  calorias_aprox: "",
  proteinas_g: "",
  carbos_g: "",
  grasas_g: "",
};

// ── Búsqueda multi-palabra en catálogo ───────────────────────────────────────
export async function buscarEnCatalogoMultiword(
  query,
  tipoComida = null,
  mostrarTodo = false
) {
  const words = query
    .trim()
    .split(/\s+/)
    .filter((w) => w.length >= 2);
  if (!words.length) return [];

  let q = supabase
    .from("catalogo_alimentos")
    .select(
      "nombre, calorias_por_unidad, proteinas_g, carbos_g, grasas_g, tipo_comida"
    )
    .order("es_comida_completa", { ascending: false })
    .limit(10);

  if (!mostrarTodo && tipoComida && TIPOS_COMPATIBLES[tipoComida]) {
    q = q.in("tipo_comida", TIPOS_COMPATIBLES[tipoComida]);
  }

  for (const word of words) {
    q = q.or(`nombre.ilike.%${word}%,descripcion_completa.ilike.%${word}%`);
  }

  const { data } = await q;
  return data || [];
}

// ── Parser de archivos Excel / CSV ───────────────────────────────────────────
export function parsearExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "binary" });
        const hoja = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(hoja, { defval: "" });

        const TIPO_VALIDOS = new Set(TIPOS.map((t) => t.value));
        const TIPO_MAP = {
          desayuno: "desayuno",
          breakfast: "desayuno",
          colacion: "colacion",
          snack: "snack",
          almuerzo: "almuerzo",
          lunch: "almuerzo",
          merienda: "merienda",
          cena: "cena",
          dinner: "cena",
          cena_noche: "cena",
          colacion_nocturna: "colacion_nocturna",
        };

        function norm(key) {
          return key?.toString().toLowerCase().trim().replace(/\s+/g, "_");
        }
        function col(row, ...keys) {
          for (const k of keys) {
            const found = Object.keys(row).find((r) => norm(r) === k);
            if (found && row[found] !== "") return row[found];
          }
          return "";
        }

        const comidas = rows
          .filter((r) => col(r, "descripcion", "nombre", "comida", "alimento"))
          .map((r) => {
            const tipo_raw = norm(col(r, "tipo_comida", "tipo", "momento", "toma"));
            const tipo =
              TIPO_MAP[tipo_raw] ||
              (TIPO_VALIDOS.has(tipo_raw) ? tipo_raw : "snack");
            const calorias =
              Number(col(r, "calorias_aprox", "calorias", "kcal", "cal")) || null;
            return {
              tipo_comida: tipo,
              descripcion: String(
                col(r, "descripcion", "nombre", "comida", "alimento")
              ).trim(),
              calorias_aprox: calorias,
              proteinas_g:
                Number(col(r, "proteinas_g", "proteinas", "proteína")) || null,
              carbos_g:
                Number(
                  col(r, "carbos_g", "carbos", "carbohidratos", "hidratos")
                ) || null,
              grasas_g: Number(col(r, "grasas_g", "grasas")) || null,
            };
          })
          .filter((c) => c.descripcion.length > 1);

        resolve(comidas);
      } catch {
        reject(
          new Error(
            "No se pudo leer el archivo. Verifica que sea un Excel o CSV valido."
          )
        );
      }
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo."));
    reader.readAsBinaryString(file);
  });
}
