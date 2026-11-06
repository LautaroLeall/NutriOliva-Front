// VersionSelector.jsx — Selector de versión con dropdown animado

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VersionSelector({ planes, planVisibleId, onSelect }) {
  const [open, setOpen] = useState(false);
  const actual = planes.find((p) => p.id === planVisibleId) || planes[0];

  const estadoLabel = {
    borrador: "Borrador",
    activo: "Activo",
    archivado: "Archivado",
  };
  const estadoDot = {
    borrador: "bg-amber-400",
    activo: "bg-green-500",
    archivado: "bg-gray-400",
  };

  if (planes.length <= 1) return null;

  return (
    <div className="relative mb-4">
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2.5 bg-white border border-cream-darker rounded-xl
                   px-4 py-2.5 font-display text-xs font-medium text-olive-dark
                   hover:border-olive/40 transition-colors shadow-sm"
      >
        <span
          className={`w-2 h-2 rounded-full ${estadoDot[actual?.estado] || "bg-gray-400"}`}
        />
        <span>
          Plan v{actual?.version} — {estadoLabel[actual?.estado]}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-1 text-muted"
        >
          <ChevronDown size={13} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute top-full left-0 mt-1.5 bg-white border border-cream-darker
                       rounded-xl shadow-modal z-20 min-w-[230px] overflow-hidden"
          >
            {planes.map((p) => {
              const sel = p.id === planVisibleId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelect(p);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left font-display text-[12px]
                              transition-colors hover:bg-cream
                              ${sel ? "bg-cream/80 text-olive-dark font-semibold" : "text-muted"}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${estadoDot[p.estado] || "bg-gray-400"}`}
                  />
                  <span>Plan v{p.version}</span>
                  <span className="text-[10px] text-muted ml-auto flex items-center gap-1.5">
                    {estadoLabel[p.estado]}
                    {sel && <Check size={11} className="text-olive" />}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
