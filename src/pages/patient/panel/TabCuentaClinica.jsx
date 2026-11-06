// TabCuentaClinica.jsx — Seccion de datos clinicos y evolucion del paciente (cargados por su nutricionista)

import { motion } from "framer-motion";
import {
  Activity,
  Scale,
  Ruler,
  HeartPulse,
  Flame,
  Target,
  Calendar,
  TrendingDown,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  OBJETIVO_OPTS,
  ACTIVIDAD_OPTS,
  SEXO_OPTS,
  calcIMC,
  imcInfo,
  cinturaRiesgo,
} from "@/components/nutri/datosClinicos/datosClinicosUtils";
import {
  formatFechaCorta,
  EmptyClinicaCard,
  ImcScaleCard,
  FichaMedicaSection,
  HistorialAntropometricoCard,
} from "./cuentaClinicaSubcomponents";

export default function TabCuentaClinica({ datosClinicos = [], planActivo }) {
  const ultimo = datosClinicos[0] || null;
  const primero =
    datosClinicos.length > 1 ? datosClinicos[datosClinicos.length - 1] : null;

  if (!ultimo) {
    return <EmptyClinicaCard />;
  }

  const imc = ultimo.imc || calcIMC(ultimo.peso, ultimo.altura);
  const imcData = imcInfo(imc);
  const cintData = cinturaRiesgo(ultimo.cintura_cm, ultimo.sexo);

  const objetivoObj = OBJETIVO_OPTS.find((o) => o.value === ultimo.objetivo);
  const actividadObj = ACTIVIDAD_OPTS.find(
    (a) => a.value === ultimo.nivel_actividad
  );
  const sexoObj = SEXO_OPTS.find((s) => s.value === ultimo.sexo);

  const deltaPeso =
    primero && ultimo.peso && primero.peso
      ? Number((Number(ultimo.peso) - Number(primero.peso)).toFixed(1))
      : null;

  const tieneComposicion =
    ultimo.porcentaje_grasa != null ||
    ultimo.masa_muscular_kg != null ||
    ultimo.cintura_cm != null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white rounded-2xl border border-cream-darker p-5 shadow-card space-y-4"
    >
      {/* Cabecera de seccion */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-olive/10 flex items-center justify-center text-olive flex-shrink-0">
            <HeartPulse size={17} />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-[14px] text-olive-dark truncate">
              Mis datos clinicos y antropometria
            </h3>
            <p className="text-[11px] text-muted truncate">
              Actualizado por tu nutricionista
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-display font-semibold text-olive bg-olive/10 px-2.5 py-1 rounded-full whitespace-nowrap">
          <Calendar size={11} />
          Control:{" "}
          {formatFechaCorta(ultimo.fecha_registro || ultimo.created_at)}
        </span>
      </div>

      {/* Grilla 2x2 de metricas principales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Peso */}
        <div className="bg-cream/60 border border-cream-darker rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-muted mb-1">
            <span className="text-[10.5px] font-display uppercase tracking-wide truncate">
              Peso actual
            </span>
            <Scale size={13} className="text-olive flex-shrink-0" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-bold text-[19px] text-olive-dark leading-none">
              {ultimo.peso ?? "—"}
            </span>
            <span className="text-[11px] text-muted font-display">kg</span>
          </div>
          {deltaPeso !== null && deltaPeso !== 0 ? (
            <div
              className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-display font-semibold ${deltaPeso < 0 ? "text-green-700" : "text-amber-700"
                }`}
            >
              {deltaPeso < 0 ? (
                <TrendingDown size={11} />
              ) : (
                <TrendingUp size={11} />
              )}
              <span>
                {deltaPeso > 0 ? `+${deltaPeso}` : deltaPeso} kg vs inicio
              </span>
            </div>
          ) : (
            <span className="mt-1.5 text-[10px] text-muted truncate">
              {sexoObj ? `${sexoObj.label}` : "Medicion base"}
              {ultimo.edad ? ` · ${ultimo.edad} anos` : ""}
            </span>
          )}
        </div>

        {/* Altura */}
        <div className="bg-cream/60 border border-cream-darker rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-muted mb-1">
            <span className="text-[10.5px] font-display uppercase tracking-wide truncate">
              Altura
            </span>
            <Ruler size={13} className="text-olive flex-shrink-0" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-bold text-[19px] text-olive-dark leading-none">
              {ultimo.altura ?? "—"}
            </span>
            <span className="text-[11px] text-muted font-display">cm</span>
          </div>
          <span className="mt-1.5 text-[10px] text-muted truncate">
            Estatura registrada
          </span>
        </div>

        {/* IMC */}
        <div className="bg-cream/60 border border-cream-darker rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-muted mb-1">
            <span className="text-[10.5px] font-display uppercase tracking-wide truncate">
              IMC
            </span>
            <Activity size={13} className="text-olive flex-shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-[19px] text-olive-dark leading-none">
              {imc ?? "—"}
            </span>
            <span className="text-[10px] text-muted font-display">kg/m²</span>
          </div>
          {imcData ? (
            <span
              className={`mt-1.5 text-[10px] font-display font-semibold truncate ${imcData.color}`}
            >
              {imcData.label}
            </span>
          ) : (
            <span className="mt-1.5 text-[10px] text-muted truncate">
              Indice corporal
            </span>
          )}
        </div>

        {/* Meta calorica del plan */}
        <div className="bg-cream/60 border border-cream-darker rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 text-muted mb-1">
            <span className="text-[10.5px] font-display uppercase tracking-wide truncate">
              Meta diaria
            </span>
            <Flame size={13} className="text-olive flex-shrink-0" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-bold text-[19px] text-olive-dark leading-none">
              {planActivo?.calorias_objetivo || 2000}
            </span>
            <span className="text-[10px] text-muted font-display">kcal</span>
          </div>
          <span className="mt-1.5 text-[10px] text-muted truncate">
            {planActivo
              ? `Plan activo v${planActivo.version || 1}`
              : "Referencia diaria"}
          </span>
        </div>
      </div>

      {/* Barra visual de IMC */}
      <ImcScaleCard imc={imc} imcData={imcData} />

      {/* Objetivo terapeutico y nivel de actividad */}
      {(objetivoObj || actividadObj) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {objetivoObj && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-cream-darker bg-cream/30">
              <div className="w-8 h-8 rounded-lg bg-olive/10 text-olive flex items-center justify-center flex-shrink-0">
                <Target size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-display uppercase tracking-wide text-muted">
                  Objetivo del tratamiento
                </p>
                <p className="font-display font-semibold text-[12.5px] text-olive-dark truncate">
                  {objetivoObj.label}
                </p>
                <p className="text-[10.5px] text-muted truncate">
                  {objetivoObj.desc}
                </p>
              </div>
            </div>
          )}

          {actividadObj && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-cream-darker bg-cream/30">
              <div className="w-8 h-8 rounded-lg bg-olive/10 text-olive flex items-center justify-center flex-shrink-0">
                <Sparkles size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-display uppercase tracking-wide text-muted">
                  Nivel de actividad fisica
                </p>
                <p className="font-display font-semibold text-[12.5px] text-olive-dark truncate">
                  {actividadObj.label}
                </p>
                <p className="text-[10.5px] text-muted truncate">
                  {actividadObj.desc} ({actividadObj.factor})
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Composicion corporal (si fue cargada por el nutricionista) */}
      {tieneComposicion && (
        <div className="pt-1">
          <p className="text-[11px] font-display font-semibold text-olive-dark uppercase tracking-wide mb-2">
            Composicion corporal
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl border border-cream-darker bg-cream/30 text-center">
              <p className="text-[10px] font-display text-muted truncate">
                Grasa corporal
              </p>
              <p className="font-display font-bold text-[15px] text-olive-dark mt-0.5">
                {ultimo.porcentaje_grasa != null
                  ? `${ultimo.porcentaje_grasa}%`
                  : "—"}
              </p>
            </div>
            <div className="p-2.5 rounded-xl border border-cream-darker bg-cream/30 text-center">
              <p className="text-[10px] font-display text-muted truncate">
                Masa muscular
              </p>
              <p className="font-display font-bold text-[15px] text-olive-dark mt-0.5">
                {ultimo.masa_muscular_kg != null
                  ? `${ultimo.masa_muscular_kg} kg`
                  : "—"}
              </p>
            </div>
            <div className="p-2.5 rounded-xl border border-cream-darker bg-cream/30 text-center">
              <p className="text-[10px] font-display text-muted truncate">
                Cintura
              </p>
              <p className="font-display font-bold text-[15px] text-olive-dark mt-0.5">
                {ultimo.cintura_cm != null ? `${ultimo.cintura_cm} cm` : "—"}
              </p>
              {cintData && (
                <p
                  className={`text-[9.5px] font-display font-medium truncate mt-0.5 ${cintData.color}`}
                >
                  {cintData.label}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ficha medica y observaciones del nutricionista */}
      <FichaMedicaSection ultimo={ultimo} />

      {/* Historial de mediciones (si hay controles) */}
      <HistorialAntropometricoCard datosClinicos={datosClinicos} />
    </motion.div>
  );
}
