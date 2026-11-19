// planBuilderUtils.js — Constantes, busqueda difusa ultrarrapida en catalogo y parser Excel para PlanBuilder

import * as XLSX from "xlsx";
import { obtenerCatalogoMemoria } from "@/lib/foodFormUtils";
import { filtrarYOrdenarBusqueda } from "@/lib/fuzzySearch";

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

// ── Busqueda multi-palabra en catalogo tolerante a acentos y errores de tipeo ──
export async function buscarEnCatalogoMultiword(
  query,
  tipoComida = null,
  mostrarTodo = false
) {
  const q = String(query ?? "").trim();
  if (q.length < 2) return [];

  const todos = await obtenerCatalogoMemoria();
  const base =
    !mostrarTodo && tipoComida && TIPOS_COMPATIBLES[tipoComida]
      ? todos.filter(
        (item) =>
          !item.tipo_comida ||
          TIPOS_COMPATIBLES[tipoComida].includes(item.tipo_comida)
      )
      : todos;

  return filtrarYOrdenarBusqueda(base, q, (item) => [
    item.nombre,
    item.descripcion_completa,
    item.tipo_comida,
    item.objetivo_ideal,
    item.perfil_paciente,
  ]).slice(0, 10);
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
            const tipo_raw = norm(
              col(r, "tipo_comida", "tipo", "momento", "toma")
            );
            const tipo =
              TIPO_MAP[tipo_raw] ||
              (TIPO_VALIDOS.has(tipo_raw) ? tipo_raw : "snack");
            const calorias =
              Number(col(r, "calorias_aprox", "calorias", "kcal", "cal")) ||
              null;
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
