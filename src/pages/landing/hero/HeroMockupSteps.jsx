// HeroMockupSteps.jsx — Las 4 pantallas paso a paso del Panel del Nutricionista en el Hero

import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  ChevronRight,
  Scale,
  Flame,
  ClipboardList,
  CheckCircle2,
  Sparkles,
  Utensils,
  Dumbbell,
  FileSpreadsheet,
} from "lucide-react";

export function StepPacientes() {
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total pacientes", val: "24", alert: false },
          { label: "Activos hoy", val: "18", alert: false },
          { label: "Sin reg. +48h", val: "2", alert: true },
        ].map((k, idx) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className={`rounded-xl px-2.5 py-2 bg-[#F6F1E7] border ${k.alert ? "border-accent/35" : "border-cream-darker"
              }`}
          >
            <div
              className={`font-display text-[15px] font-bold leading-none ${k.alert ? "text-accent" : "text-olive-dark"
                }`}
            >
              {k.val}
            </div>
            <div className="font-display text-[8px] text-muted mt-1">
              {k.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-cream-darker overflow-hidden">
        <div className="px-3 py-2 bg-cream/60 border-b border-cream-darker flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users size={11} className="text-olive" />
            <span className="font-display text-[9.5px] font-semibold text-olive-dark">
              Mis pacientes
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-white border border-cream-darker rounded-md px-2 py-0.5 text-[8px] text-muted">
              <Search size={8} />
              <span>Buscar...</span>
            </div>
            <span className="bg-olive text-cream font-display text-[8px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Plus size={8} /> Nuevo
            </span>
          </div>
        </div>

        <div className="divide-y divide-cream">
          {[
            {
              initials: "ML",
              name: "Maria Lopez",
              email: "maria.lopez@mail.com",
              status: "Activa",
              dot: "bg-success",
              last: "Hoy 13:15",
              selected: true,
            },
            {
              initials: "CR",
              name: "Carlos Ruiz",
              email: "carlos.ruiz@mail.com",
              status: "Activo",
              dot: "bg-success",
              last: "Hoy 09:40",
              selected: false,
            },
            {
              initials: "AG",
              name: "Ana Gimenez",
              email: "ana.gimenez@mail.com",
              status: "Sin reg. +48h",
              dot: "bg-accent",
              last: "Hace 3 dias",
              selected: false,
            },
          ].map((p, idx) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.07 }}
              className={`px-3 py-2 flex items-center justify-between ${p.selected ? "bg-olive/[0.08]" : ""
                }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-olive text-cream font-display text-[8px] font-bold flex items-center justify-center flex-shrink-0">
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-[9.5px] font-semibold text-olive-dark truncate">
                    {p.name}
                  </div>
                  <div className="text-[7.5px] text-muted truncate">
                    {p.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className="inline-flex items-center gap-1 text-[8px] font-display text-olive-dark">
                  <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                  {p.status}
                </span>
                <span className="text-[8px] text-muted font-display hidden sm:inline">
                  {p.last}
                </span>
                <ChevronRight size={11} className="text-olive" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StepFichaClinica() {
  return (
    <div className="space-y-2.5">
      <div className="bg-white rounded-xl p-2.5 border border-cream-darker flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-olive text-cream font-display text-[9px] font-bold flex items-center justify-center">
            ML
          </div>
          <div>
            <div className="font-display text-[10px] font-semibold text-olive-dark flex items-center gap-1.5">
              Maria Lopez
              <span className="px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-[7.5px]">
                Activa
              </span>
            </div>
            <div className="text-[8px] text-muted">
              Objetivo: Bajar de peso · Plan v2 activo
            </div>
          </div>
        </div>
        <span className="px-2 py-1 rounded-lg bg-olive text-cream font-display text-[8px]">
          + Datos clinicos
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: "Peso actual", val: "64.2 kg", sub: "-1.8 kg" },
          { label: "Altura", val: "169 cm", sub: "Femenino" },
          { label: "IMC", val: "22.4", sub: "Normal" },
          { label: "Meta diaria", val: "1,800", sub: "kcal / dia" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#F6F1E7] border border-cream-darker rounded-xl p-2"
          >
            <div className="font-display text-[7.5px] uppercase text-muted">
              {m.label}
            </div>
            <div className="font-display text-[11px] font-bold text-olive-dark mt-0.5">
              {m.val}
            </div>
            <div className="text-[7.5px] text-olive font-display">{m.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-2.5 border border-cream-darker space-y-2">
        <div className="flex justify-between items-center text-[8.5px] font-display">
          <span className="text-olive-dark font-semibold flex items-center gap-1">
            <Scale size={10} className="text-olive" /> Indice de Masa Corporal y
            Perimetros
          </span>
          <span className="text-success font-semibold">Rango saludable</span>
        </div>
        <div className="h-2 rounded-full bg-gradient-to-r from-sky-300 via-emerald-400 to-amber-400 relative overflow-hidden">
          <motion.div
            initial={{ left: "10%" }}
            animate={{ left: "44%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-0 bottom-0 w-2 bg-olive-dark rounded-full border border-white"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-0.5 text-[8px] text-muted font-display">
          <div>
            Cintura: <strong className="text-olive-dark">71 cm</strong>
          </div>
          <div>
            Cadera: <strong className="text-olive-dark">96 cm</strong>
          </div>
          <div>
            Grasa est.: <strong className="text-olive-dark">23.8%</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepPlanAlimenticio() {
  return (
    <div className="space-y-2">
      <div className="bg-white rounded-xl p-2.5 border border-cream-darker flex items-center justify-between">
        <div>
          <div className="font-display text-[10px] font-semibold text-olive-dark flex items-center gap-1.5">
            <ClipboardList size={11} className="text-olive" />
            Plan de Maria Lopez · Version 2
          </div>
          <div className="text-[8px] text-muted">
            Objetivo: 1,800 kcal · P: 112g · C: 185g · G: 58g
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-2 py-1 rounded-lg bg-cream border border-cream-darker text-olive-dark font-display text-[7.5px] flex items-center gap-1">
            <FileSpreadsheet size={9} className="text-olive" /> Excel / PDF
          </span>
          <span className="px-2 py-1 rounded-lg bg-olive text-cream font-display text-[7.5px] flex items-center gap-1">
            <CheckCircle2 size={9} /> Activo
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        {[
          {
            meal: "Desayuno",
            kcal: "380 kcal",
            desc: "Avena cocida con leche descremada, 1/2 banana y canela",
            macros: "P: 16g · C: 58g · G: 8g",
          },
          {
            meal: "Almuerzo",
            kcal: "520 kcal",
            desc: "Pechuga grillada (180g) con quinoa y vegetales asados",
            macros: "P: 42g · C: 48g · G: 14g",
          },
          {
            meal: "Merienda",
            kcal: "260 kcal",
            desc: "Yogur natural sin azucar + 15g de almendras tostadas",
            macros: "P: 14g · C: 18g · G: 12g",
          },
        ].map((item, i) => (
          <motion.div
            key={item.meal}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-xl border border-cream-darker overflow-hidden"
          >
            <div className="px-2.5 py-1 bg-olive text-cream font-display text-[8.5px] flex justify-between items-center">
              <span className="font-semibold">{item.meal}</span>
              <span>{item.kcal}</span>
            </div>
            <div className="px-2.5 py-1.5 flex justify-between items-center gap-2">
              <span className="text-[8.5px] text-olive-dark truncate">
                {item.desc}
              </span>
              <span className="text-[7.5px] font-display text-muted whitespace-nowrap">
                {item.macros}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function StepDiarioVivo() {
  return (
    <div className="space-y-2.5">
      <div className="bg-white rounded-xl p-2.5 border border-cream-darker">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-display text-[9px] font-semibold text-olive-dark flex items-center gap-1">
            <Flame size={11} className="text-olive" /> Balance del dia (Maria
            Lopez)
          </span>
          <span className="font-display text-[9px] font-bold text-olive">
            1,640 / 1,800 kcal (91%)
          </span>
        </div>
        <div className="h-2 bg-cream-darker rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "91%" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="h-full rounded-full bg-[#6E9B5C]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-2.5 border border-cream-darker space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="font-display text-[8.5px] uppercase tracking-wide text-muted">
            Timeline de hoy en tiempo real
          </span>
          <span className="text-[7.5px] font-display text-olive bg-olive/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles size={8} /> IA Activa
          </span>
        </div>

        {[
          {
            time: "08:30",
            icon: Utensils,
            label: "Avena con banana y canela",
            tag: "Plan",
            kcal: "+380 kcal",
            color: "text-olive-dark",
          },
          {
            time: "13:15",
            icon: Utensils,
            label: "Pollo grillado con ensalada y arroz",
            tag: "Estimado con IA",
            kcal: "+520 kcal",
            color: "text-olive-dark",
          },
          {
            time: "18:00",
            icon: Dumbbell,
            label: "Entrenamiento funcional (45 min)",
            tag: "Actividad",
            kcal: "-310 kcal",
            color: "text-success",
          },
        ].map((r, i) => {
          const Icon = r.icon;
          return (
            <motion.div
              key={r.time}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#F6F1E7] border border-cream-darker"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-display text-[8px] text-muted">
                  {r.time}
                </span>
                <Icon size={10} className="text-olive flex-shrink-0" />
                <span className="text-[8.5px] text-olive-dark font-medium truncate">
                  {r.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[7px] font-display px-1.5 py-0.5 rounded bg-white text-muted border border-cream-darker">
                  {r.tag}
                </span>
                <span
                  className={`font-display text-[8.5px] font-semibold ${r.color}`}
                >
                  {r.kcal}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
