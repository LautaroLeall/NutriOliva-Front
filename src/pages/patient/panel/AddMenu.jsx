// AddMenu.jsx — Menú emergente del botón flotante (FAB) con animaciones spring

import { Dumbbell, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function AddMenu({ onComida, onActividad, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-40 bg-olive-dark/15 backdrop-blur-[1px] flex items-end justify-end pb-24 px-6"
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-2.5 items-end"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.88 }}
          transition={{ type: "spring", stiffness: 420, damping: 24, delay: 0.04 }}
          whileHover={{ scale: 1.04, x: -3 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            onActividad();
            onClose();
          }}
          className="flex items-center gap-3 bg-white border border-cream-darker rounded-2xl
                      px-4 py-2.5 shadow-modal font-display font-medium text-[12.5px] text-olive-dark
                    hover:bg-cream transition-colors"
        >
          Actividad fisica
          <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <Dumbbell size={14} className="text-blue-500" />
          </span>
        </motion.button>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.88 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
          whileHover={{ scale: 1.04, x: -3 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            onComida();
            onClose();
          }}
          className="flex items-center gap-3 bg-white border border-cream-darker rounded-2xl
                      px-4 py-2.5 shadow-modal font-display font-medium text-[12.5px] text-olive-dark
                    hover:bg-cream transition-colors"
        >
          Lo que comi
          <span className="w-8 h-8 rounded-full bg-olive/12 flex items-center justify-center">
            <Flame size={14} className="text-olive" />
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
