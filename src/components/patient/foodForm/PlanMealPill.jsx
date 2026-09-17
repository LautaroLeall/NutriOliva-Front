// PlanMealPill.jsx — Pill seleccionable para comidas del plan alimenticio
export default function PlanMealPill({ comida, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(comida)}
      className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all
                  ${
                    selected
                      ? "bg-olive text-cream border-olive"
                      : "bg-white border-cream-darker hover:border-olive/50 hover:bg-cream"
                  }`}
    >
      <p
        className={`font-display text-[12px] font-medium leading-snug ${selected ? "text-cream" : "text-olive-dark"}`}
      >
        {comida.descripcion}
      </p>

      {comida.calorias_aprox > 0 && (
        <p
          className={`text-[10px] mt-0.5 ${selected ? "text-cream/70" : "text-muted"}`}
        >
          {comida.calorias_aprox} kcal
          {comida.proteinas_g ? ` · P: ${comida.proteinas_g}g` : ""}
          {comida.carbos_g ? ` · C: ${comida.carbos_g}g` : ""}
          {comida.grasas_g ? ` · G: ${comida.grasas_g}g` : ""}
        </p>
      )}
    </button>
  );
}
