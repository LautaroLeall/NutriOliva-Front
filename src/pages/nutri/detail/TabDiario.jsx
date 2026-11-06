// TabDiario.jsx — Diario del paciente con skeleton + transición por fecha

import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DayCalendar from "@/components/patient/DayCalendar";
import Timeline from "@/components/patient/Timeline";
import WeeklyCaloriesChart from "@/components/ui/WeeklyCaloriesChart";
import BalanceDia from "./BalanceDia";
import { formatFechaLegible } from "./patientDetailUtils";

// ── Skeleton shimmer mientras carga el diario ─────────────────────────────
function DiarioSkeleton() {
  return (
    <div className="space-y-3 mt-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cream-darker animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 bg-cream-darker rounded-full w-3/4 animate-pulse" />
            <div className="h-2 bg-cream-darker rounded-full w-1/2 animate-pulse" />
          </div>
          <div className="w-16 h-6 bg-cream-darker rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function TabDiario({
  fechaDiario, setFechaDiario,
  loadingDiario, comidasNutri, actividadesNutri,
  totalConsumidas, totalGastadas, caloriasObjetivo,
  puntosSemanales, loadingTendencia, nombrePaciente,
}) {
  return (
    <div className="p-4">
      <DayCalendar fechaActiva={fechaDiario} onChange={setFechaDiario} />

      {/* Fecha seleccionada — anima al cambiar */}
      <div className="flex items-center justify-between mb-3 mt-1">
        <AnimatePresence mode="wait">
          <motion.h3
            key={fechaDiario}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18 }}
            className="font-display text-sm font-semibold text-olive-dark capitalize"
          >
            {formatFechaLegible(fechaDiario)}
          </motion.h3>
        </AnimatePresence>

        <AnimatePresence>
          {loadingDiario && (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
            >
              <Loader2 size={14} className="animate-spin text-muted" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contenido del día — skeleton mientras carga, content cuando listo */}
      <AnimatePresence mode="wait">
        {loadingDiario ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <DiarioSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key={`content-${fechaDiario}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {(comidasNutri.length > 0 || actividadesNutri.length > 0) && (
              <BalanceDia
                consumidas={totalConsumidas}
                gastadas={totalGastadas}
                caloriasObjetivo={caloriasObjetivo}
                loading={loadingDiario}
              />
            )}

            <Timeline
              comidas={comidasNutri}
              actividades={actividadesNutri}
              onEliminarComida={null}
              onEliminarActividad={null}
              onEditarComida={null}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-cream-darker my-4" />

      <WeeklyCaloriesChart
        puntos={puntosSemanales}
        loading={loadingTendencia}
        titulo={`Adherencia de ${nombrePaciente} — ultimos 7 dias`}
        caloriasObjetivo={caloriasObjetivo}
      />
    </div>
  );
}
