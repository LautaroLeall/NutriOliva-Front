// TabClinica.jsx — Datos clínicos con tarjetas animadas + stagger

import { HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

const OBJETIVO_LABELS = {
  bajar: "Bajar de peso",
  bajar_fuerza: "Bajar + fuerza",
  mantener: "Mantener",
  subir: "Aumentar de peso",
  subir_fuerza: "Aumentar + fuerza",
  rendimiento_deportivo: "Rendimiento deportivo",
  recomposicion: "Recomposicion corporal",
};

const ACTIVIDAD_LABELS = {
  sedentario: "Sedentario",
  leve: "Leve",
  moderado: "Moderado",
  activo: "Activo",
  muy_activo: "Muy activo",
};

// ── Tarjeta de estadística (Peso, Altura, IMC, Edad) ──────────────────────
function StatCard({ label, value, unit, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, delay, type: "spring", stiffness: 260, damping: 22 }}
      className="bg-cream rounded-xl p-3 text-center"
    >
      <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`font-display font-bold text-xl ${color || "text-olive-dark"}`}>
        {value ?? "—"}
      </p>
      {unit && <p className="text-[9px] text-muted">{unit}</p>}
    </motion.div>
  );
}

// ── Tarjeta de info (Objetivo, Actividad, Sexo, etc.) ─────────────────────
function InfoCard({ label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay }}
      className="bg-cream rounded-xl p-3"
    >
      <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-[12px] text-olive-dark font-medium">{value}</p>
    </motion.div>
  );
}

// ── Tarjeta de texto libre (Patologías, Alergias, Medicación, Obs.) ────────
function TextCard({ label, value, delay = 0 }) {
  if (!value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay }}
      className="bg-cream rounded-xl p-3"
    >
      <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">{label}</p>
      <p className="text-[12px] text-olive-dark">{value}</p>
    </motion.div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────
export default function TabClinica({ datosClinicos, paciente, setEditandoClinicos }) {

  // ── Sin datos clínicos ──────────────────────────────────────────────────
  if (!datosClinicos) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-5 space-y-4"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <HeartPulse size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-display text-sm font-semibold text-amber-800">
              Sin datos clinicos cargados
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Este paciente no tiene datos clinicos registrados.
              Los datos clinicos son necesarios para activar un plan.
            </p>
            <motion.button
              onClick={() => setEditandoClinicos(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="mt-3 text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg
                        hover:bg-amber-700 transition-colors font-display"
            >
              Cargar datos clinicos ahora
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Cálculos ────────────────────────────────────────────────────────────
  const imc = datosClinicos.peso && datosClinicos.altura
    ? (datosClinicos.peso / (datosClinicos.altura / 100) ** 2).toFixed(1)
    : null;

  const imcColor = !imc
    ? "text-muted"
    : imc < 18.5 ? "text-blue-500"
      : imc < 25 ? "text-green-600"
        : imc < 30 ? "text-amber-500"
          : "text-red-500";

  const hayComposicion = datosClinicos.porcentaje_grasa ||
    datosClinicos.masa_muscular_kg ||
    datosClinicos.cintura_cm;

  const hayClinica = datosClinicos.patologias ||
    datosClinicos.alergias ||
    datosClinicos.medicacion;

  const fechaFormateada = datosClinicos.fecha_registro
    ? new Date(datosClinicos.fecha_registro + "T12:00:00")
      .toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  return (
    <div className="p-5 space-y-4">

      {/* ── Header: fecha + botón actualizar ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="font-display text-[9.5px] text-muted uppercase tracking-wide">
            Ultimo registro
          </p>
          <p className="text-[11px] text-muted mt-0.5">{fechaFormateada}</p>
        </div>
        <motion.button
          onClick={() => setEditandoClinicos(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          <HeartPulse size={12} />
          Actualizar medicion
        </motion.button>
      </motion.div>

      {/* ── Métricas principales ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Peso" value={datosClinicos.peso} unit="kg" delay={0.05} />
        <StatCard label="Altura" value={datosClinicos.altura} unit="cm" delay={0.10} />
        <StatCard label="IMC" value={imc} unit="" color={imcColor} delay={0.15} />
        <StatCard label="Edad" value={datosClinicos.edad} unit="anos" delay={0.20} />
      </div>

      {/* ── Composición corporal ─────────────────────────────────────── */}
      {hayComposicion && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.25 }}
        >
          <p className="font-display text-[9.5px] text-muted uppercase tracking-wide mb-2">
            Composicion corporal
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "% Grasa", value: datosClinicos.porcentaje_grasa, unit: "%", delay: 0.27 },
              { label: "Masa muscular", value: datosClinicos.masa_muscular_kg, unit: "kg", delay: 0.30 },
              { label: "Cintura", value: datosClinicos.cintura_cm, unit: "cm", delay: 0.33 },
            ].filter(c => c.value).map(({ label, value, unit, delay }) => (
              <StatCard key={label} label={label} value={value} unit={unit} delay={delay} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Objetivo + Nivel de actividad ────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {datosClinicos.objetivo && (
          <InfoCard
            label="Objetivo"
            value={OBJETIVO_LABELS[datosClinicos.objetivo] || datosClinicos.objetivo}
            delay={0.30}
          />
        )}
        {datosClinicos.nivel_actividad && (
          <InfoCard
            label="Nivel de actividad"
            value={ACTIVIDAD_LABELS[datosClinicos.nivel_actividad] || datosClinicos.nivel_actividad}
            delay={0.34}
          />
        )}
      </div>

      {/* ── Sexo ─────────────────────────────────────────────────────── */}
      {datosClinicos.sexo && (
        <InfoCard
          label="Sexo"
          value={
            datosClinicos.sexo === "M" ? "Masculino"
              : datosClinicos.sexo === "F" ? "Femenino"
                : "Otro"
          }
          delay={0.37}
        />
      )}

      {/* ── Info clínica ─────────────────────────────────────────────── */}
      {hayClinica && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.40 }}
          className="space-y-2"
        >
          <p className="font-display text-[9.5px] text-muted uppercase tracking-wide">
            Informacion clinica
          </p>
          <TextCard label="Patologias" value={datosClinicos.patologias} delay={0.42} />
          <TextCard label="Alergias e intolerancias" value={datosClinicos.alergias} delay={0.44} />
          <TextCard label="Medicacion actual" value={datosClinicos.medicacion} delay={0.46} />
        </motion.div>
      )}

      {/* ── Observaciones ────────────────────────────────────────────── */}
      <TextCard
        label="Observaciones clinicas"
        value={datosClinicos.observaciones}
        delay={0.48}
      />

      {/* ── Historial ────────────────────────────────────────────────── */}
      {paciente.datos_clinicos?.length > 1 && (
        <motion.details
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.50 }}
          className="mt-2"
        >
          <summary className="text-[11px] font-display text-muted cursor-pointer
                              hover:text-olive-dark transition-colors select-none">
            Ver historial completo ({paciente.datos_clinicos.length} registros)
          </summary>
          <div className="mt-3 space-y-2">
            {paciente.datos_clinicos.slice(1).map((dc, i) => (
              <motion.div
                key={dc.id || i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border border-cream-darker rounded-xl px-4 py-3"
              >
                <p className="text-[9.5px] font-display text-muted mb-1">
                  {dc.fecha_registro
                    ? new Date(dc.fecha_registro + "T12:00:00")
                      .toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
                    : "—"}
                </p>
                <div className="flex gap-4 flex-wrap text-[11px] text-olive-dark">
                  {dc.peso && <span><span className="text-muted">Peso:</span> {dc.peso} kg</span>}
                  {dc.altura && <span><span className="text-muted">Altura:</span> {dc.altura} cm</span>}
                  {dc.objetivo && <span className="capitalize"><span className="text-muted">Obj:</span> {dc.objetivo}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.details>
      )}
    </div>
  );
}
