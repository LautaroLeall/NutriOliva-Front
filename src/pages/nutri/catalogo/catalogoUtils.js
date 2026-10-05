// catalogoUtils.js — Funciones puras del módulo Catalogo

export function validar(form) {
  const errs = {};

  if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio.";
  else if (form.nombre.trim().length < 2) errs.nombre = "Al menos 2 caracteres.";

  if (!form.calorias_por_unidad)
    errs.calorias_por_unidad = "Las calorias son obligatorias.";
  else if (isNaN(Number(form.calorias_por_unidad)) || Number(form.calorias_por_unidad) < 0)
    errs.calorias_por_unidad = "Ingresa un numero valido.";

  for (const campo of ["proteinas_g", "carbos_g", "grasas_g"]) {
    if (form[campo] !== "" && (isNaN(Number(form[campo])) || Number(form[campo]) < 0))
      errs[campo] = "Debe ser un numero positivo.";
  }

  return errs;
}
