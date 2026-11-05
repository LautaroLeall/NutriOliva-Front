// TabBar.jsx — Barra de tabs con underline animado via layoutId

import { motion } from "framer-motion";
import { BookOpen, Calendar, HeartPulse } from "lucide-react";

const TABS = [
  { id: "ficha", label: "Registros recientes", icon: BookOpen },
  { id: "diario", label: "Diario del paciente", icon: Calendar },
  { id: "clinica", label: "Datos clinicos", icon: HeartPulse },
];

export default function TabBar({ tab, setTab }) {
  return (
    <div className="flex border-b border-cream-darker bg-white">
      {TABS.map((t) => {
        const Icon = t.icon;
        const actv = tab === t.id;

        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 px-2
                        text-[11px] sm:text-xs font-display transition-colors duration-200
                        ${actv ? "text-olive-dark font-semibold" : "text-muted hover:text-olive-dark"}`}
          >
            {/* Ícono animado al activar */}
            <motion.span
              animate={{
                scale: actv ? 1.18 : 1,
                color: actv ? "#3F4A2B" : "#9B9484",
              }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <Icon size={13} />
            </motion.span>

            {t.label}

            {/* Underline animado con layoutId — desliza entre tabs */}
            {actv && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-olive"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
