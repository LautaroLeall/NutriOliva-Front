// TabFicha.jsx — Historial de comidas con filas staggered + "Ver más" animado

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatFecha } from "./patientDetailUtils";

const PAGINA = 10;

export default function TabFicha({ registros_comida }) {
  const [visible, setVisible] = useState(PAGINA);

  if (!registros_comida || registros_comida.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-10 text-center text-[11px] text-muted italic"
      >
        El paciente todavia no registro ninguna comida.
      </motion.div>
    );
  }

  const registrosMostrados = registros_comida.slice(0, visible);
  const hayMas = visible < registros_comida.length;

  return (
    <div>
      <div className="divide-y divide-cream">
        <AnimatePresence initial={false}>
          {registrosMostrados.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2, delay: Math.min(i, 6) * 0.035 }}
              className="flex items-center justify-between px-5 py-3 group
                        hover:bg-cream/40 transition-colors duration-150"
            >
              <div>
                <div className="text-[12px] text-olive-dark font-medium
                                group-hover:text-olive transition-colors">
                  {r.descripcion}
                </div>
                <div className="text-[10px] text-muted mt-0.5">
                  {formatFecha(r.fecha)} · {r.hora?.slice(0, 5)}
                </div>
              </div>

              {r.calorias_estimadas && (
                <span className="font-display text-sm font-semibold text-olive-dark
                                bg-cream px-2.5 py-1 rounded-lg ml-3 shrink-0">
                  {r.calorias_estimadas} kcal
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Boton Ver más */}
      {hayMas && (
        <div className="px-5 py-3 border-t border-cream">
          <motion.button
            type="button"
            onClick={() => setVisible((v) => v + PAGINA)}
            whileHover={{ scale: 1.02, color: "#3F4A2B" }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-1.5
                        text-[11px] text-muted font-display transition-colors py-1"
          >
            <motion.span
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={13} />
            </motion.span>
            Ver mas ({registros_comida.length - visible} restantes)
          </motion.button>
        </div>
      )}

      {/* Contador */}
      <div className="px-5 py-2 text-[9.5px] text-muted text-center border-t border-cream">
        Mostrando {registrosMostrados.length} de {registros_comida.length} registros
      </div>
    </div>
  );
}
