// TabTendencia.jsx — Pestaña de tendencia semanal con gráfico y métricas 3D + CountUp

import { motion, useMotionValue, useSpring } from "framer-motion";
import CountUp from "react-countup";
import WeeklyCaloriesChart from "@/components/ui/WeeklyCaloriesChart";

function TendenciaStat({ label, value, unit, delay = 0 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 300, damping: 28 });
  const rotateY = useSpring(x, { stiffness: 300, damping: 28 });

  function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(((e.clientX - cx) / rect.width) * 12);
    y.set(-((e.clientY - cy) / rect.height) * 12);
  }
  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, delay, type: "spring", stiffness: 260, damping: 22 }}
      style={{ rotateX, rotateY, transformPerspective: 600 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="bg-cream rounded-xl p-3 text-center cursor-default"
    >
      <div className="font-display font-bold text-xl text-olive-dark">
        <CountUp end={value} duration={0.75} separator="." />
      </div>
      <div className="text-[9px] text-muted mt-0.5 font-display">{unit}</div>
      <div className="text-[9px] text-muted mt-0.5">{label}</div>
    </motion.div>
  );
}

export default function TabTendencia({
  puntosSemanales,
  loadingTendencia,
  caloriasObjetivo,
}) {
  const conDatos = puntosSemanales.filter((p) => p.registroExistente);
  const diasCumple = conDatos.filter((p) => p.estado === "cumple").length;
  const diasExceso = conDatos.filter((p) => p.estado === "exceso").length;
  const promedio =
    conDatos.length > 0
      ? Math.round(
        conDatos.reduce((s, p) => s + (p.netas || 0), 0) / conDatos.length
      )
      : 0;

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <WeeklyCaloriesChart
          puntos={puntosSemanales}
          loading={loadingTendencia}
          titulo="Mis ultimos 7 dias"
          caloriasObjetivo={caloriasObjetivo}
        />
      </motion.div>

      {/* Resumen semanal */}
      {!loadingTendencia && puntosSemanales.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.1 }}
          className="bg-white rounded-2xl border border-cream-darker p-5 shadow-card"
        >
          <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-3">
            Resumen de la semana
          </p>

          <div className="grid grid-cols-3 gap-3">
            <TendenciaStat
              label="Dias registrados"
              value={conDatos.length}
              unit={`/ ${puntosSemanales.length}`}
              delay={0.12}
            />
            <TendenciaStat
              label="Dias en objetivo"
              value={diasCumple}
              unit="dias"
              delay={0.18}
            />
            <TendenciaStat
              label="Promedio diario"
              value={promedio}
              unit="kcal"
              delay={0.24}
            />
          </div>

          {diasExceso > 0 && (
            <p className="text-[10.5px] text-muted mt-4 pt-3 border-t border-cream">
              {diasExceso === 1
                ? "Tuviste 1 dia con exceso calorico esta semana."
                : `Tuviste ${diasExceso} dias con exceso calorico esta semana.`}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
