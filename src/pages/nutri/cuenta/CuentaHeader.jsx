// CuentaHeader.jsx — Cabecera de perfil del nutricionista

import { motion } from "framer-motion";
import { Mail, Calendar, Award, RefreshCw } from "lucide-react";
import { getInitials, formatFechaLarga } from "./cuentaUtils";

export default function CuentaHeader({
  nombre,
  email,
  nutriData,
  planActual,
  planActualKey,
  onRefresh,
  loading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl bg-olive-dark text-cream p-6 mb-6 shadow-card border border-olive-deep"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4 min-w-0">
          {/* Avatar con iniciales */}
          <div className="w-14 h-14 rounded-2xl bg-cream text-olive-dark font-display font-bold text-lg flex items-center justify-center shadow-sm flex-shrink-0">
            {getInitials(nombre)}
          </div>

          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-cream truncate">
              {nombre || "Nutricionista"}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[12px] text-cream/80 font-display">
              <span className="flex items-center gap-1.5 truncate">
                <Mail size={13} className="text-[#C5D48A] flex-shrink-0" />
                {email}
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Calendar size={13} className="text-[#C5D48A] flex-shrink-0" />
                Miembro desde {formatFechaLarga(nutriData.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Plan actual + boton sincronizar */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0 border-t sm:border-t-0 border-white/15 pt-3 sm:pt-0">
          <div className="bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 text-left sm:text-right">
            <div className="flex items-center sm:justify-end gap-1.5 text-[10px] font-display uppercase tracking-wider text-[#DCE3C8]">
              <Award size={12} className="text-[#C5D48A]" />
              Suscripcion actual
            </div>
            <div className="font-display text-sm font-bold text-cream mt-0.5">
              Plan {planActual?.nombre || planActualKey.toUpperCase()}
            </div>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 text-[11px] font-display text-cream/80 hover:text-cream bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            Actualizar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
