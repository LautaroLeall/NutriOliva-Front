// cuentaClinicaSubcomponents.jsx — Subcomponentes y utilidades para TabCuentaClinica

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  HeartPulse,
  ClipboardList,
  AlertCircle,
  Pill,
  FileText,
  ChevronDown,
} from "lucide-react";
import { calcIMC } from "@/components/nutri/datosClinicos/datosClinicosUtils";

export function formatFechaCorta(fechaStr) {
  if (!fechaStr) return "—";
  const clean = fechaStr.includes("T") ? fechaStr.split("T")[0] : fechaStr;
  const parts = clean.split("-");
  if (parts.length !== 3) return fechaStr;
  const meses = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];
  const m = parseInt(parts[1], 10) - 1;
  return `${parseInt(parts[2], 10)} ${meses[m] || parts[1]} ${parts[0]}`;
}

export function EmptyClinicaCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white rounded-2xl border border-cream-darker p-5 shadow-card"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-xl bg-olive/10 flex items-center justify-center text-olive flex-shrink-0">
          <HeartPulse size={16} />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-[14px] text-olive-dark truncate">
            Mis datos clinicos
          </h3>
          <p className="text-[11px] text-muted truncate">
            Ficha antropometrica y medica cargada por tu nutricionista
          </p>
        </div>
      </div>

      <div className="bg-cream/60 border border-cream-darker rounded-xl p-4 text-center">
        <Activity size={22} className="text-olive/60 mx-auto mb-2" />
        <p className="font-display font-semibold text-[12.5px] text-olive-dark mb-1">
          Aun no hay mediciones registradas
        </p>
        <p className="text-[11.5px] text-muted leading-relaxed max-w-sm mx-auto">
          En tu consulta, tu nutricionista cargara tu peso, altura,
          composicion corporal y objetivos para que puedas consultarlos desde
          aqui.
        </p>
      </div>
    </motion.div>
  );
}

export function ImcScaleCard({ imc, imcData }) {
  if (!imc || !imcData) return null;

  return (
    <div className="bg-cream/40 border border-cream-darker rounded-xl p-3">
      <div className="flex items-center justify-between text-[11px] mb-1.5">
        <span className="font-display font-semibold text-olive-dark">
          Clasificacion IMC:{" "}
          <span className={imcData.color}>{imcData.label}</span>
        </span>
        <span className="font-display text-muted text-[10.5px]">
          Saludable: 18.5 – 24.9
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-cream-darker overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${imcData.pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${imcData.bar}`}
        />
      </div>
    </div>
  );
}

export function FichaMedicaSection({ ultimo }) {
  const tieneNotasClinicas =
    Boolean(ultimo.alergias?.trim()) ||
    Boolean(ultimo.patologias?.trim()) ||
    Boolean(ultimo.medicacion?.trim()) ||
    Boolean(ultimo.observaciones?.trim());

  if (!tieneNotasClinicas) return null;

  return (
    <div className="pt-1 space-y-2">
      <p className="text-[11px] font-display font-semibold text-olive-dark uppercase tracking-wide">
        Ficha medica y observaciones
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {ultimo.alergias?.trim() && (
          <div className="p-3 rounded-xl border border-amber-200/80 bg-amber-50/50 flex items-start gap-2.5">
            <AlertCircle
              size={15}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <div className="min-w-0">
              <p className="text-[10.5px] font-display font-semibold text-amber-800">
                Alergias e intolerancias
              </p>
              <p className="text-[12px] text-olive-dark mt-0.5 leading-snug break-words">
                {ultimo.alergias}
              </p>
            </div>
          </div>
        )}

        {ultimo.patologias?.trim() && (
          <div className="p-3 rounded-xl border border-cream-darker bg-cream/40 flex items-start gap-2.5">
            <ClipboardList
              size={15}
              className="text-olive flex-shrink-0 mt-0.5"
            />
            <div className="min-w-0">
              <p className="text-[10.5px] font-display font-semibold text-olive-dark">
                Patologias / Condiciones
              </p>
              <p className="text-[12px] text-muted mt-0.5 leading-snug break-words">
                {ultimo.patologias}
              </p>
            </div>
          </div>
        )}

        {ultimo.medicacion?.trim() && (
          <div className="p-3 rounded-xl border border-cream-darker bg-cream/40 flex items-start gap-2.5">
            <Pill size={15} className="text-olive flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10.5px] font-display font-semibold text-olive-dark">
                Medicacion registrada
              </p>
              <p className="text-[12px] text-muted mt-0.5 leading-snug break-words">
                {ultimo.medicacion}
              </p>
            </div>
          </div>
        )}

        {ultimo.observaciones?.trim() && (
          <div className="p-3 rounded-xl border border-olive/20 bg-olive/5 flex items-start gap-2.5 sm:col-span-2">
            <FileText size={15} className="text-olive flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10.5px] font-display font-semibold text-olive-dark">
                Observaciones de tu nutricionista
              </p>
              <p className="text-[12px] text-olive-dark/90 mt-0.5 leading-relaxed break-words">
                {ultimo.observaciones}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function HistorialAntropometricoCard({ datosClinicos }) {
  const [historialAbierto, setHistorialAbierto] = useState(false);

  if (!datosClinicos || datosClinicos.length <= 1) return null;

  return (
    <div className="pt-1 border-t border-cream-darker">
      <button
        type="button"
        onClick={() => setHistorialAbierto((o) => !o)}
        className="w-full flex items-center justify-between py-2 text-left text-[12px] font-display font-semibold text-olive hover:text-olive-dark transition-colors"
      >
        <span>
          Ver historial de controles ({datosClinicos.length} mediciones)
        </span>
        <motion.span
          animate={{ rotate: historialAbierto ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {historialAbierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-1.5">
              {datosClinicos.map((reg, idx) => {
                const regImc = reg.imc || calcIMC(reg.peso, reg.altura);
                return (
                  <div
                    key={reg.id || idx}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-cream/50 border border-cream-darker text-[11.5px]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-olive flex-shrink-0" />
                      <span className="font-display font-medium text-olive-dark truncate">
                        {formatFechaCorta(reg.fecha_registro || reg.created_at)}
                      </span>
                      {idx === 0 && (
                        <span className="text-[9.5px] font-display font-semibold bg-olive/15 text-olive px-1.5 py-0.5 rounded-md">
                          Actual
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 font-display text-muted">
                      <span className="font-semibold text-olive-dark">
                        {reg.peso} kg
                      </span>
                      {regImc && <span>IMC {regImc}</span>}
                      {reg.porcentaje_grasa != null && (
                        <span className="hidden sm:inline">
                          {reg.porcentaje_grasa}% grasa
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
