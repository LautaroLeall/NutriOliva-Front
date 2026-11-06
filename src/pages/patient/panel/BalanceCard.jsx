// BalanceCard.jsx — Tarjeta de balance calórico del paciente con 3D tilt, CountUp y barra animada

import { Flame, Dumbbell } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import CountUp from "react-countup";

export default function BalanceCard({ balance, caloriasObjetivo, loading }) {
  const { consumidas, gastadas, netas, restante, pct, barColor, estaEnExceso } =
    balance;

  // 3D Tilt interactivo
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 280, damping: 28 });
  const rotateY = useSpring(x, { stiffness: 280, damping: 28 });

  function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(((e.clientX - cx) / rect.width) * 8);
    y.set(-((e.clientY - cy) / rect.height) * 8);
  }
  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="bg-white rounded-2xl border border-cream-darker p-5 mb-4 shadow-card cursor-default"
    >
      {loading ? (
        <div className="space-y-3 py-1">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="h-2.5 w-24 bg-cream-darker rounded-full animate-pulse" />
              <div className="h-8 w-36 bg-cream-darker rounded-xl animate-pulse" />
            </div>
            <div className="space-y-1.5 flex flex-col items-end">
              <div className="h-3 w-24 bg-cream-darker rounded-full animate-pulse" />
              <div className="h-3 w-20 bg-cream-darker rounded-full animate-pulse" />
            </div>
          </div>
          <div className="h-2 w-full bg-cream-darker rounded-full animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-1">
                Balance del dia
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`font-display font-bold text-3xl ${estaEnExceso ? "text-accent" : "text-olive-dark"
                    }`}
                >
                  <CountUp end={netas} duration={0.75} separator="." />
                </span>
                <span className="text-muted text-sm font-display">
                  / {caloriasObjetivo} kcal
                </span>
              </div>
            </div>

            {/* Pills de desglose */}
            <div className="flex flex-col gap-1 items-end">
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-1 text-[10.5px] font-display text-olive bg-olive/8 px-2 py-0.5 rounded-lg"
              >
                <Flame size={11} /> +
                <CountUp end={consumidas} duration={0.65} separator="." />{" "}
                consumidas
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 }}
                className="flex items-center gap-1 text-[10.5px] font-display text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg"
              >
                <Dumbbell size={11} /> -
                <CountUp end={gastadas} duration={0.65} separator="." />{" "}
                gastadas
              </motion.span>
            </div>
          </div>

          {/* Barra de progreso animada */}
          <div className="w-full bg-cream rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
              transition={{ duration: 0.85, ease: "easeOut", delay: 0.1 }}
              className={`h-2 rounded-full ${barColor}`}
            />
          </div>

          <div className="flex justify-between mt-1.5">
            <span className="text-[9.5px] text-muted font-display">
              {pct}% del objetivo
            </span>
            <span
              className={`text-[9.5px] font-display font-medium ${estaEnExceso ? "text-accent" : "text-muted"
                }`}
            >
              {estaEnExceso
                ? `+${Math.abs(restante)} kcal sobre el objetivo`
                : `${restante} kcal restantes`}
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
}
