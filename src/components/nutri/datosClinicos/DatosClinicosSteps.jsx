// DatosClinicosSteps.jsx — Los 4 pasos del formulario multi-paso de Datos Clinicos

import {
  Calculator,
  AlertCircle,
  Scale,
  Ruler,
  Calendar,
  Percent,
  Dumbbell,
  CircleDot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  OBJETIVO_OPTS,
  ACTIVIDAD_OPTS,
  SEXO_OPTS,
  CLINICA_FIELDS,
} from "./datosClinicosUtils";
import { NumField, SelCard } from "./DatosClinicosUI";

export function StepDatosBasicos({
  form,
  errors,
  imc,
  imcData,
  handleChange,
  handleBlur,
  setField,
}) {
  return (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -14 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <NumField
          label="Peso"
          name="peso"
          value={form.peso}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.peso}
          unit="kg"
          min={20}
          max={300}
          icon={Scale}
          required
        />
        <NumField
          label="Altura"
          name="altura"
          value={form.altura}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.altura}
          unit="cm"
          min={100}
          max={250}
          step="1"
          icon={Ruler}
          required
        />
      </div>

      <AnimatePresence>
        {imc && imcData && (
          <motion.div
            key="imc-card"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-xl border px-3 py-2 ${imcData.bg} overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5">
                <Calculator size={11} className={imcData.color} />
                <span className={`font-display font-bold text-sm ${imcData.color}`}>
                  IMC {imc}
                </span>
              </span>
              <span className={`text-[10px] font-display font-semibold ${imcData.color}`}>
                {imcData.label}
              </span>
            </div>
            <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${imcData.pct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-1.5 rounded-full ${imcData.bar}`}
              />
            </div>
            <div className="flex justify-between mt-0.5">
              {["18.5", "25", "30", "35+"].map((v) => (
                <span key={v} className="text-[8px] text-muted">
                  {v}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3 items-start">
        <NumField
          label="Edad"
          name="edad"
          value={form.edad}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.edad}
          unit="anos"
          min={5}
          max={110}
          step="1"
          icon={Calendar}
        />

        <div>
          <label className="block text-[9.5px] font-display text-muted mb-1 ml-0.5">
            Sexo biologico
          </label>
          <div className="flex gap-1.5">
            {SEXO_OPTS.map((o) => {
              const sel = form.sexo === o.value;
              return (
                <motion.button
                  key={o.value}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setField("sexo", sel ? "" : o.value)}
                  className={`flex-1 py-2 rounded-xl border text-[10.5px] font-display font-medium transition-colors text-center ${sel
                    ? "border-olive bg-olive text-cream shadow-sm"
                    : "border-cream-darker bg-[#F5F2EA] text-muted hover:border-olive/40 hover:text-olive-dark"
                    }`}
                >
                  {o.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function StepComposicion({
  form,
  errors,
  cintData,
  handleChange,
  handleBlur,
}) {
  return (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -14 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      <p className="text-[10px] text-muted font-display">
        Todos los campos de composicion son opcionales.
      </p>
      <div className="grid grid-cols-3 gap-2.5">
        <NumField
          label="% Grasa"
          name="porcentaje_grasa"
          value={form.porcentaje_grasa}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.porcentaje_grasa}
          unit="%"
          min={3}
          max={65}
          icon={Percent}
        />
        <NumField
          label="Masa musc."
          name="masa_muscular_kg"
          value={form.masa_muscular_kg}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.masa_muscular_kg}
          unit="kg"
          min={5}
          max={120}
          icon={Dumbbell}
        />
        <NumField
          label="Cintura"
          name="cintura_cm"
          value={form.cintura_cm}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.cintura_cm}
          unit="cm"
          min={40}
          max={200}
          icon={CircleDot}
        />
      </div>

      <AnimatePresence>
        {cintData && (
          <motion.div
            key="cintura-alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl border px-3 py-2 flex items-center gap-2 ${cintData.bg}`}
          >
            <AlertCircle size={12} className={cintData.color} />
            <div>
              <p className={`text-[10.5px] font-display font-semibold ${cintData.color}`}>
                {cintData.label}
              </p>
              <p className="text-[8.5px] text-muted">
                Ref:{" "}
                {form.sexo === "F"
                  ? "Mujeres >88 cm"
                  : form.sexo === "M"
                    ? "Hombres >102 cm"
                    : "Completar sexo biologico para calcular"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-cream rounded-xl px-3.5 py-2.5 border border-cream-darker/60">
        <p className="text-[8.5px] font-display text-muted uppercase tracking-wide mb-1.5">
          Referencia grasa saludable
        </p>
        <div className="grid grid-cols-2 gap-x-6 text-[10px] text-muted leading-snug">
          <span>Hombres: 10–20%</span>
          <span>Mujeres: 18–28%</span>
          <span>Atletas H: 6–13%</span>
          <span>Atletas M: 14–20%</span>
        </div>
      </div>
    </motion.div>
  );
}

export function StepObjetivoActividad({ form, setField }) {
  return (
    <motion.div
      key="step-3"
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -14 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      <div>
        <p className="text-[10.5px] font-display font-medium text-olive-dark mb-1.5">
          Objetivo terapeutico
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {OBJETIVO_OPTS.map((o) => (
            <SelCard
              key={o.value}
              selected={form.objetivo === o.value}
              onClick={() =>
                setField("objetivo", form.objetivo === o.value ? "" : o.value)
              }
              label={o.label}
              desc={o.desc}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10.5px] font-display font-medium text-olive-dark mb-1.5">
          Nivel de actividad fisica
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {ACTIVIDAD_OPTS.map((o) => (
            <SelCard
              key={o.value}
              selected={form.nivel_actividad === o.value}
              onClick={() =>
                setField(
                  "nivel_actividad",
                  form.nivel_actividad === o.value ? "" : o.value
                )
              }
              label={o.label}
              desc={o.desc}
              extra={o.factor}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function StepInformacionClinica({ form, handleChange }) {
  return (
    <motion.div
      key="step-4"
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -14 }}
      transition={{ duration: 0.2 }}
      className="space-y-2.5"
    >
      <div className="flex gap-2 bg-olive/8 border border-olive/15 rounded-xl px-3 py-2">
        <AlertCircle size={11} className="text-olive flex-shrink-0 mt-0.5" />
        <p className="text-[9.5px] text-olive-dark font-display leading-snug">
          Cada guardado crea un nuevo registro historico — los datos anteriores
          no se eliminan.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {CLINICA_FIELDS.map((f) => (
          <div key={f.name}>
            <label className="block text-[10px] font-display font-medium text-olive-dark mb-0.5">
              {f.label} <span className="text-muted font-normal">(opcional)</span>
            </label>
            <textarea
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              maxLength={500}
              style={{ height: "64px" }}
              className="w-full rounded-xl border border-cream-darker bg-[#F5F2EA] px-3 py-2
                          text-[11px] font-body text-olive-dark placeholder-muted/50
                          focus:outline-none focus:border-olive/60 focus:ring-2 focus:ring-olive/25
                          resize-none transition-all"
            />
            <div className="flex justify-between">
              {f.hint && <p className="text-[8.5px] text-muted">{f.hint}</p>}
              <p className="text-[8px] text-muted ml-auto">
                {form[f.name].length}/500
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
