// PlanHeader.jsx — Cabecera del plan con estado animado y botones spring

import { Send, FilePen, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function PlanHeader({
  plan,
  onPublicar,
  onNuevaVersion,
  onEliminar,
  publicando,
}) {
  const estado =
    {
      borrador: {
        label: "Borrador",
        dot: "bg-amber-400",
        pill: "bg-amber-50 text-amber-700 border-amber-200",
      },
      activo: {
        label: "Activo",
        dot: "bg-green-500",
        pill: "bg-green-50 text-green-700 border-green-200",
      },
      archivado: {
        label: "Archivado",
        dot: "bg-gray-400",
        pill: "bg-cream text-muted border-cream-darker",
      },
    }[plan.estado] || {
      label: plan.estado,
      dot: "bg-gray-400",
      pill: "bg-cream text-muted border-cream-darker",
    };

  const puedeEliminar = plan.estado !== "activo";
  const cantItems = plan.comidas_plan?.length || 0;

  return (
    <motion.div
      key={plan.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-5 mb-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
            <span className="font-display font-semibold text-base text-olive-dark">
              Plan v{plan.version}
            </span>
            <span
              className={`flex items-center gap-1.5 text-[10px] font-display font-medium
                          px-2.5 py-0.5 rounded-full border ${estado.pill}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${estado.dot}
                            ${plan.estado === "activo" ? "animate-pulse" : ""}`}
              />
              {estado.label}
            </span>
          </div>

          {plan.notas && (
            <p className="text-[11px] text-olive italic mb-1">"{plan.notas}"</p>
          )}

          <p className="text-[11px] text-muted">
            <CountUp end={plan.calorias_objetivo || 0} duration={0.6} separator="." /> kcal/dia ·{" "}
            {cantItems} {cantItems === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          {plan.estado === "borrador" && (
            <motion.button
              type="button"
              onClick={onPublicar}
              disabled={publicando || !cantItems}
              title={!cantItems ? "Agrega al menos 1 comida para publicar" : ""}
              whileHover={!publicando && cantItems ? { scale: 1.04, boxShadow: "0 6px 20px rgba(110,122,75,0.3)" } : {}}
              whileTap={!publicando && cantItems ? { scale: 0.94 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5 disabled:opacity-50"
            >
              {publicando ? (
                <>
                  <Loader2 size={12} className="animate-spin" /> Publicando...
                </>
              ) : (
                <>
                  <Send size={12} /> Publicar
                </>
              )}
            </motion.button>
          )}

          {plan.estado === "activo" && (
            <motion.button
              type="button"
              onClick={onNuevaVersion}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <FilePen size={12} /> Nueva version
            </motion.button>
          )}

          {puedeEliminar && (
            <motion.button
              type="button"
              onClick={onEliminar}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="text-xs px-3 py-2 rounded-xl bg-accent/10 text-accent font-display
                        hover:bg-accent/15 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={12} /> Eliminar
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
