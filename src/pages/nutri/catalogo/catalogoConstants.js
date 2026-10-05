// catalogoConstants.js — Constantes del módulo Catalogo

export const UNIDADES = ["g", "ml", "unidad", "porcion", "taza", "cda", "cdita"];

export const FORM_VACIO = {
  nombre: "",
  calorias_por_unidad: "",
  proteinas_g: "",
  carbos_g: "",
  grasas_g: "",
  unidad: "g",
};

export const POR_PAGINA = 12;

export const FILTROS_KCAL = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "< 50 kcal", min: 0, max: 49 },
  { label: "50–150", min: 50, max: 150 },
  { label: "150–300", min: 151, max: 300 },
  { label: "> 300", min: 301, max: Infinity },
];
