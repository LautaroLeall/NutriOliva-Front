// CatalogoFiltros.jsx — Barra de búsqueda + chips de filtro por kcal

import { Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FILTROS_KCAL } from "./catalogoConstants";

export default function CatalogoFiltros({
  busqueda, filtroKcal, filtrados, hayFiltros,
  searchFocused, setSearchFocused,
  onBusqueda, onFiltroKcal,
}) {
  return (
    <div className="px-5 py-3.5 border-b border-cream-darker space-y-3">
      {/* ── Búsqueda ─────────────────────────────────────────────────── */}
      <motion.div
        animate={{ backgroundColor: searchFocused ? "#F6F1E7" : "#F0EDE4" }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 border border-cream-darker"
      >
        <motion.div
          animate={{ scale: searchFocused ? 1.12 : 1, color: searchFocused ? "#6E7A4B" : "#9B9484" }}
          transition={{ duration: 0.18 }}
        >
          <Search size={14} />
        </motion.div>

        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="flex-1 bg-transparent text-[13px] font-body text-olive-dark
                    placeholder-muted/50 focus:outline-none"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />

        <AnimatePresence>
          {busqueda && (
            <motion.button
              key="clear"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => onBusqueda("")}
              className="text-muted hover:text-olive-dark transition-colors"
            >
              <X size={13} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Chips de filtro kcal ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-muted">
          <Filter size={11} />
          <span className="text-[10px] font-display">Calorias:</span>
        </div>

        {FILTROS_KCAL.map((f, i) => (
          <motion.button
            key={f.label}
            onClick={() => onFiltroKcal(i)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
            animate={{
              backgroundColor: filtroKcal === i ? "#6E7A4B" : "#EDE8DF",
              color: filtroKcal === i ? "#F6F1E7" : "#69644D",
            }}
            transition={{ duration: 0.18 }}
            className="px-3 py-1 rounded-full text-[10.5px] font-display focus:outline-none"
          >
            {f.label}
          </motion.button>
        ))}

        {/* Badge de resultados */}
        <AnimatePresence>
          {hayFiltros && (
            <motion.span
              key="badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="ml-auto text-[10px] font-display text-muted"
            >
              {filtrados.length} resultado{filtrados.length !== 1 ? "s" : ""}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
