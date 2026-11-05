// PlanMealPill.jsx — Pill seleccionable para comidas del plan alimenticio con animaciones

import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function PlanMealPill({ comida, selected, onSelect, index = 0 }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index, 5) * 0.035 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(comida)}
      className={`w-full text-left px-3.5 py-2.5 rounded-xl border-2 transition-colors flex items-center justify-between gap-2
                  ${selected
          ? "bg-olive text-cream border-olive shadow-xs"
          : "bg-[#F5F2EA] border-cream-darker hover:border-olive/45 hover:bg-cream"}`}
    >
      <div className="min-w-0 flex-1">
        <p
          className={`font-display text-[12px] font-medium leading-snug truncate ${selected ? "text-cream" : "text-olive-dark"
            }`}
        >
          {comida.descripcion}
        </p>

        {comida.calorias_aprox > 0 && (
          <p
            className={`text-[10px] mt-0.5 ${selected ? "text-cream/75" : "text-muted"
              }`}
          >
            {comida.calorias_aprox} kcal
            {comida.proteinas_g ? ` · P: ${comida.proteinas_g}g` : ""}
            {comida.carbos_g ? ` · C: ${comida.carbos_g}g` : ""}
            {comida.grasas_g ? ` · G: ${comida.grasas_g}g` : ""}
          </p>
        )}
      </div>

      <motion.div
        animate={{
          scale: selected ? 1.08 : 1,
          backgroundColor: selected ? "#F6F1E7" : "#FFFFFF",
          borderColor: selected ? "#F6F1E7" : "#E5E0D8",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
      >
        {selected && <Check size={9} className="text-olive" strokeWidth={3} />}
      </motion.div>
    </motion.button>
  );
}
