// NutriRealtimeMirror.jsx — Columna derecha: controles rapidos + Espejo en tiempo real del Nutricionista

import { motion } from "framer-motion";
import { Flame, Dumbbell, RotateCcw, CheckCircle2 } from "lucide-react";
import {
  GOAL,
  CATALOGO_SUGERENCIAS,
  ACTIVIDADES_SUGERENCIAS,
} from "./howItWorksData";

export default function NutriRealtimeMirror({
  tieneCambios,
  handleReiniciar,
  abrirModalComida,
  abrirModalActividad,
  ultimoRegistro,
  isOver,
  porcentaje,
  porcentajeReal,
  balanceNeto,
  consumidas,
  gastadas,
}) {
  return (
    <div className="space-y-5 w-full min-w-0">
      {/* Tarjeta 1: Abrir modales o elegir opcion rapida */}
      <div className="bg-[#FAF8F3] border border-cream-darker rounded-2xl p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-display text-[12.5px] font-semibold text-olive-dark truncate">
            1. Registra una comida o actividad fisica en el celular
          </span>
          {tieneCambios && (
            <button
              type="button"
              onClick={handleReiniciar}
              className="inline-flex items-center gap-1 text-[11px] font-display text-olive hover:text-olive-dark cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <RotateCcw size={12} /> Reiniciar demo
            </button>
          )}
        </div>

        {/* Botones principales que abren el modal exacto en el celular */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <button
            type="button"
            onClick={() => abrirModalComida()}
            className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-olive text-cream hover:bg-olive-deep font-display text-[12px] font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Flame size={14} className="flex-shrink-0" />
            Abrir Registrar comida
          </button>
          <button
            type="button"
            onClick={() => abrirModalActividad()}
            className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-white border border-cream-darker hover:border-blue-300 text-olive-dark font-display text-[12px] font-semibold shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Dumbbell size={14} className="text-blue-500 flex-shrink-0" />
            Abrir Registrar actividad
          </button>
        </div>

        <p className="text-[11.5px] text-muted mb-2.5">
          O haz clic en un ejemplo para autocompletarlo en el celular:
        </p>

        <div className="flex flex-wrap gap-2">
          {CATALOGO_SUGERENCIAS.slice(1).map((item) => (
            <button
              key={item.nombre}
              type="button"
              onClick={() => abrirModalComida(item)}
              className="px-3 py-1.5 rounded-full bg-white border border-cream-darker hover:bg-cream text-olive-dark font-display text-[11px] transition-colors cursor-pointer whitespace-nowrap"
            >
              + {item.nombre} ({item.kcal} kcal)
            </button>
          ))}
          {ACTIVIDADES_SUGERENCIAS.slice(0, 2).map((act) => (
            <button
              key={act.nombre}
              type="button"
              onClick={() => abrirModalActividad(act)}
              className="px-3 py-1.5 rounded-full bg-blue-50/70 border border-blue-200 hover:bg-blue-50 text-blue-700 font-display text-[11px] transition-colors cursor-pointer whitespace-nowrap"
            >
              + {act.nombre} {act.duracion} min (-{act.kcal} kcal)
            </button>
          ))}
        </div>
      </div>

      {/* Tarjeta 2: Espejo en tiempo real del Panel del Nutricionista */}
      <div className="bg-white border border-cream-darker rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-cream">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse flex-shrink-0" />
            <span className="font-display text-[12px] font-semibold text-olive-dark truncate">
              2. Lo que ve el nutricionista al mismo instante
            </span>
          </div>
          <span className="text-[10px] font-display text-olive bg-olive/10 px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
            Supabase Realtime
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-cream/70 border border-cream-darker space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="w-8 h-8 rounded-full bg-olive text-cream font-display text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                BT
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[13px] font-semibold text-olive-dark truncate">
                  Bernarda Test
                </div>
                <div className="text-[11px] text-muted truncate">
                  Ultimo registro: {ultimoRegistro.hora} hs —{" "}
                  {ultimoRegistro.descripcion}
                </div>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full font-display text-[10.5px] font-semibold whitespace-nowrap flex-shrink-0 ${isOver
                ? "bg-accent/15 text-accent"
                : "bg-green-50 text-green-700 border border-green-200"
                }`}
            >
              {porcentajeReal}% del objetivo
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 text-[11px] font-display mb-1">
              <span className="text-muted flex items-center gap-1 whitespace-nowrap">
                <Flame size={12} className="text-olive flex-shrink-0" /> Balance
                diario neto
              </span>
              <span className="font-semibold text-olive-dark whitespace-nowrap">
                {balanceNeto} / {GOAL} kcal (+{consumidas} / -{gastadas})
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-cream-darker overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${porcentaje}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`h-full rounded-full ${isOver ? "bg-accent" : "bg-[#6E9B5C]"
                  }`}
              />
            </div>
          </div>
        </div>

        <div className="mt-3.5 flex items-start gap-2 text-[11.5px] text-muted bg-[#FAF8F3] border border-cream-darker rounded-xl p-3">
          <CheckCircle2
            size={15}
            className="text-olive flex-shrink-0 mt-0.5"
          />
          <span>
            Cuando tu paciente registra una comida o una actividad fisica desde
            su celular, el balance calorico se actualiza en vivo en tu panel
            mediante{" "}
            <strong className="text-olive-dark">Supabase Realtime</strong>.
          </span>
        </div>
      </div>
    </div>
  );
}
