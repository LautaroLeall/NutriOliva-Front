export function validarCalorias(val) {
  const n = Number(val)
  if (!val || isNaN(n)) return 'Ingresá un número válido.'
  if (n < 500) return 'El mínimo es 500 kcal.'
  if (n > 6000) return 'El máximo es 6000 kcal.'
  if (!Number.isInteger(n)) return 'Debe ser un número entero.'
  return null
}
