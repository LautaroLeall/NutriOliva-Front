// Timeline.jsx — Timeline del dia: mezcla comidas y actividades con stagger

import { ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TimelineEntry from "./TimelineEntry";
import EmptyState from "@/components/ui/EmptyState";

export default function Timeline({
  comidas,
  actividades,
  onEliminarComida,
  onEliminarActividad,
  onEditarComida,
  pacienteId,
  comidasPlan = [],
}) {
  const entries = [
    ...comidas.map((r) => ({ ...r, _tipo: "comida" })),
    ...actividades.map((r) => ({ ...r, _tipo: "actividad" })),
  ].sort((a, b) => (a.hora || "").localeCompare(b.hora || ""));

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <EmptyState
          icon={ClipboardList}
          title="Sin registros para este dia"
          description="No se registraron comidas ni actividades en esta fecha."
        />
      </motion.div>
    );
  }

  return (
    <div className="space-y-1">
      <AnimatePresence initial={false}>
        {entries.map((entry, idx) => (
          <TimelineEntry
            key={`${entry._tipo}-${entry.id}`}
            index={idx}
            registro={entry}
            tipo={entry._tipo}
            pacienteId={pacienteId}
            comidasPlan={comidasPlan}
            onEliminar={
              entry._tipo === "comida" ? onEliminarComida : onEliminarActividad
            }
            onEditar={entry._tipo === "comida" ? onEditarComida : null}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
