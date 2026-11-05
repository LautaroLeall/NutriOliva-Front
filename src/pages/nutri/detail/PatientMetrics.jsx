// PatientMetrics.jsx — Grid de 3 métricas con 3D tilt + CountUp
// Misma técnica que NutriPanel MetricCard

import { useMotionValue, useSpring, motion } from "framer-motion";
import CountUp from "react-countup";
import { Flame, ClipboardList, HeartPulse } from "lucide-react";

// ── MetricCard con 3D tilt ────────────────────────────────────────────────
function MetricCard({ label, icon: Icon, delay = 0, children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(x, { stiffness: 300, damping: 30 });

  function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(((e.clientX - cx) / rect.width) * 12);
    y.set(-((e.clientY - cy) / rect.height) * 12);
  }
  function onMouseLeave() { x.set(0); y.set(0); }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{ rotateX, rotateY, transformPerspective: 700 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="card p-4 cursor-default"
    >
      <div className="flex items-center gap-1.5 text-[9.5px] font-display text-muted
                      uppercase tracking-wide mb-2">
        <Icon size={10} />
        {label}
      </div>
      {children}
    </motion.div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────
export default function PatientMetrics({ caloriasHoy, planActivo, datosClinicos }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">

      {/* Calorías hoy */}
      <MetricCard label="Calorias hoy" icon={Flame} delay={0.15}>
        <div className="font-display text-2xl font-semibold text-olive-dark">
          {caloriasHoy > 0
            ? <CountUp end={caloriasHoy} duration={0.8} separator="." />
            : "—"}
        </div>
        {planActivo && (
          <div className="text-[10px] text-muted mt-1">
            de {planActivo.calorias_objetivo} kcal objetivo
          </div>
        )}
      </MetricCard>

      {/* Plan activo */}
      <MetricCard label="Plan activo" icon={ClipboardList} delay={0.2}>
        {planActivo ? (
          <>
            <div className="font-display text-sm font-semibold text-olive-dark">
              v{planActivo.version}
            </div>
            <div className="text-[10px] text-muted mt-1">
              {planActivo.calorias_objetivo} kcal/dia
            </div>
          </>
        ) : (
          <div className="text-[11px] text-muted italic">Sin plan asignado</div>
        )}
      </MetricCard>

      {/* Datos clínicos */}
      <MetricCard label="Datos clinicos" icon={HeartPulse} delay={0.25}>
        {datosClinicos ? (
          <div className="space-y-0.5">
            {datosClinicos.peso && (
              <div className="text-[11px] text-olive-dark">
                <span className="text-muted">Peso:</span> {datosClinicos.peso} kg
              </div>
            )}
            {datosClinicos.altura && (
              <div className="text-[11px] text-olive-dark">
                <span className="text-muted">Altura:</span> {datosClinicos.altura} cm
              </div>
            )}
            {datosClinicos.objetivo && (
              <div className="text-[11px] text-olive-dark capitalize">
                <span className="text-muted">Objetivo:</span> {datosClinicos.objetivo}
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-muted italic">Sin datos clinicos</div>
        )}
      </MetricCard>

    </div>
  );
}
