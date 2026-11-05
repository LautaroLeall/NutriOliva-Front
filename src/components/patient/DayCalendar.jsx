// DayCalendar.jsx — Calendario semanal horizontal con indicador deslizable (layoutId)

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { toLocalISO, generarSemana } from "@/lib/dateUtils";

export default function DayCalendar({ fechaActiva, onChange }) {
  const hoy = toLocalISO(new Date());
  const semana = generarSemana(fechaActiva);

  function semanaAnterior() {
    const base = new Date(fechaActiva + "T12:00:00");
    base.setDate(base.getDate() - 7);
    onChange(toLocalISO(base));
  }

  function semanaProxima() {
    const base = new Date(fechaActiva + "T12:00:00");
    const proxLun = new Date(base);
    proxLun.setDate(base.getDate() + 7);
    const hoyDate = new Date(hoy + "T12:00:00");
    if (proxLun > hoyDate) return;
    onChange(toLocalISO(proxLun));
  }

  const puedeAvanzar = (() => {
    const base = new Date(fechaActiva + "T12:00:00");
    const proxLun = new Date(base);
    proxLun.setDate(base.getDate() + 7);
    return proxLun <= new Date(hoy + "T12:00:00");
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="bg-white border border-cream-darker rounded-2xl overflow-hidden mb-4"
    >
      <div className="flex items-center gap-1 px-3 py-3">
        {/* Semana anterior */}
        <motion.button
          type="button"
          onClick={semanaAnterior}
          whileHover={{ scale: 1.08, x: -1 }}
          whileTap={{ scale: 0.92 }}
          className="p-1.5 rounded-lg text-muted hover:bg-cream hover:text-olive-dark transition-colors flex-shrink-0"
        >
          <ChevronLeft size={15} />
        </motion.button>

        {/* Dias de la semana */}
        <div className="flex-1 flex justify-between gap-1">
          {semana.map(({ fecha, diaNro, diaLabel }) => {
            const esHoy = fecha === hoy;
            const esActivo = fecha === fechaActiva;
            const esFuturo = fecha > hoy;

            return (
              <motion.button
                key={fecha}
                type="button"
                onClick={() => !esFuturo && onChange(fecha)}
                disabled={esFuturo}
                whileHover={!esFuturo && !esActivo ? { y: -2 } : {}}
                whileTap={!esFuturo ? { scale: 0.94 } : {}}
                className={`relative flex flex-col items-center rounded-xl px-2 py-2 transition-colors duration-150
                            flex-1 min-w-0 disabled:opacity-30 disabled:cursor-not-allowed
                            ${esActivo
                    ? "text-cream"
                    : "hover:bg-cream text-muted hover:text-olive-dark"}`}
              >
                {esActivo && (
                  <motion.div
                    layoutId="day-calendar-active"
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    className="absolute inset-0 bg-olive rounded-xl shadow-sm"
                  />
                )}

                <span
                  className={`relative z-10 text-[9px] font-display uppercase tracking-wide mb-1
                              ${esActivo ? "text-cream/80" : ""}`}
                >
                  {diaLabel}
                </span>
                <span
                  className={`relative z-10 font-display font-semibold text-[14px] leading-none
                              ${esActivo ? "text-cream" : esHoy ? "text-olive" : ""}`}
                >
                  {diaNro}
                </span>
                {esHoy && !esActivo && (
                  <span className="relative z-10 w-1 h-1 rounded-full bg-olive mt-1" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Semana siguiente */}
        <motion.button
          type="button"
          onClick={semanaProxima}
          disabled={!puedeAvanzar}
          whileHover={puedeAvanzar ? { scale: 1.08, x: 1 } : {}}
          whileTap={puedeAvanzar ? { scale: 0.92 } : {}}
          className="p-1.5 rounded-lg text-muted hover:bg-cream hover:text-olive-dark
                      transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={15} />
        </motion.button>
      </div>
    </motion.div>
  );
}
