// TabHoy.jsx — Pestaña "Mi día" con BalanceCard, DayCalendar, Skeleton y Timeline

import { motion, AnimatePresence } from "framer-motion";
import BalanceCard from "./BalanceCard";
import DayCalendar from "@/components/patient/DayCalendar";
import Timeline from "@/components/patient/Timeline";
import { formatFechaLegible } from "./patientPanelUtils";

function TimelineSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-cream-darker p-4 space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cream-darker animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-3/4 bg-cream-darker rounded-full animate-pulse" />
            <div className="h-2 w-1/3 bg-cream-darker rounded-full animate-pulse" />
          </div>
          <div className="h-5 w-14 bg-cream-darker rounded-md animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function TabHoy({
  balance,
  caloriasObjetivo,
  loadingInf,
  loadingReg,
  fecha,
  setFecha,
  comidas,
  actividades,
  comidasPlan,
  pacienteId,
  handleEliminarComida,
  handleEliminarActividad,
  handleEditarComida,
}) {
  const totalRegistros = comidas.length + actividades.length;

  return (
    <div>
      {/* Balance */}
      <BalanceCard
        balance={balance}
        caloriasObjetivo={caloriasObjetivo}
        loading={loadingInf || loadingReg}
      />

      {/* Calendario semanal */}
      <DayCalendar fechaActiva={fecha} onChange={setFecha} />

      {/* Etiqueta del día */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <AnimatePresence mode="wait">
          <motion.h3
            key={fecha}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18 }}
            className="font-display font-semibold text-[13px] text-olive-dark capitalize"
          >
            {formatFechaLegible(fecha)}
          </motion.h3>
        </AnimatePresence>

        <span className="text-[10px] text-muted font-display bg-white border border-cream-darker px-2.5 py-0.5 rounded-full">
          {totalRegistros} {totalRegistros === 1 ? "registro" : "registros"}
        </span>
      </div>

      {/* Timeline con Skeleton */}
      <AnimatePresence mode="wait">
        {loadingReg ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            <TimelineSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key={`timeline-${fecha}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-cream-darker overflow-visible p-2 shadow-card"
          >
            <Timeline
              comidas={comidas}
              actividades={actividades}
              onEliminarComida={handleEliminarComida}
              onEliminarActividad={handleEliminarActividad}
              onEditarComida={handleEditarComida}
              pacienteId={pacienteId}
              comidasPlan={comidasPlan}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
