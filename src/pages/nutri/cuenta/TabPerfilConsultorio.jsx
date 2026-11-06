// TabPerfilConsultorio.jsx — Pestaña 1: Edicion de perfil profesional y estadisticas del consultorio

import { motion } from "framer-motion";
import {
  User,
  Mail,
  Check,
  Loader2,
  Activity,
  Flame,
  Dumbbell,
  BookOpen,
  ClipboardCheck,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";
import { CuentaField } from "./cuentaUtils";

export default function TabPerfilConsultorio({
  nombreForm,
  setNombreForm,
  email,
  guardandoPerfil,
  handleGuardarPerfil,
  stats,
  navigate,
}) {
  const totalSemana = stats.comidasSemana + stats.actividadesSemana;
  const pctComidas =
    totalSemana > 0
      ? Math.round((stats.comidasSemana / totalSemana) * 100)
      : 70;

  return (
    <motion.div
      key="tab-perfil"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-5"
    >
      {/* Columna izquierda: Datos del profesional */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-cream-darker p-5 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-cream">
            <div>
              <h3 className="font-display font-bold text-olive-dark text-[15px]">
                Datos del profesional
              </h3>
              <p className="text-[11.5px] text-muted mt-0.5">
                Este nombre se muestra en tu panel y a los pacientes que
                atendes.
              </p>
            </div>
            <span className="w-8 h-8 rounded-xl bg-olive/10 text-olive flex items-center justify-center flex-shrink-0">
              <User size={15} />
            </span>
          </div>

          <form
            onSubmit={handleGuardarPerfil}
            className="space-y-3.5"
            noValidate
          >
            <CuentaField
              label="Nombre y apellido profesional *"
              name="nombre"
              icon={User}
              value={nombreForm}
              onChange={(e) => setNombreForm(e.target.value)}
              maxLength={80}
            />

            <CuentaField
              label="Correo electronico de acceso"
              name="email"
              icon={Mail}
              value={email}
              disabled
            />

            <div className="pt-1">
              <motion.button
                type="submit"
                disabled={guardandoPerfil}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 rounded-xl bg-olive text-cream hover:bg-olive-deep font-display text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
              >
                {guardandoPerfil ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Guardando cambios...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Guardar cambios
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>

        {/* Accesos rapidos de gestion */}
        <div className="mt-5 pt-4 border-t border-cream grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => navigate("/panel")}
            className="p-3 rounded-xl bg-[#FAF8F3] border border-cream-darker hover:border-olive/40 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-olive-dark font-display text-[11.5px] font-semibold">
              <span>Mis pacientes</span>
              <ArrowRight
                size={13}
                className="text-olive group-hover:translate-x-0.5 transition-transform"
              />
            </div>
            <p className="text-[10.5px] text-muted mt-0.5">
              {stats.pacientesActivos} activos actualmente
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/panel/catalogo")}
            className="p-3 rounded-xl bg-[#FAF8F3] border border-cream-darker hover:border-olive/40 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-olive-dark font-display text-[11.5px] font-semibold">
              <span>Mi catalogo</span>
              <ArrowRight
                size={13}
                className="text-olive group-hover:translate-x-0.5 transition-transform"
              />
            </div>
            <p className="text-[10.5px] text-muted mt-0.5">
              {stats.alimentosPropios} alimentos propios
            </p>
          </button>
        </div>
      </div>

      {/* Columna derecha: Actividad reciente del consultorio */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-cream-darker p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cream">
          <div>
            <h3 className="font-display font-bold text-olive-dark text-[15px]">
              Actividad del consultorio
            </h3>
            <p className="text-[11.5px] text-muted mt-0.5">
              Resumen de seguimiento de tus pacientes y planes activos.
            </p>
          </div>
          <span className="w-8 h-8 rounded-xl bg-olive/10 text-olive flex items-center justify-center flex-shrink-0">
            <Activity size={15} />
          </span>
        </div>

        {/* Barra de distribucion Comidas vs Actividad fisica (7 dias) */}
        <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-cream-darker space-y-2">
          <div className="flex items-center justify-between text-[11.5px] font-display">
            <span className="font-semibold text-olive-dark">
              Registros recibidos (ultimos 7 dias)
            </span>
            <span className="text-olive font-bold">{totalSemana} registros</span>
          </div>

          <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctComidas}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-olive"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-display text-muted pt-0.5">
            <span className="flex items-center gap-1">
              <Flame size={11} className="text-olive" />
              {stats.comidasSemana} comidas
            </span>
            <span className="flex items-center gap-1">
              <Dumbbell size={11} className="text-blue-500" />
              {stats.actividadesSemana} actividades fisicas
            </span>
          </div>
        </div>

        {/* Indicadores clinicos y de planes */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-cream/50 border border-cream-darker">
            <div className="flex items-center gap-1.5 text-[11px] font-display text-muted mb-1">
              <ClipboardCheck size={13} className="text-olive" />
              Controles clinicos
            </div>
            <div className="font-display text-xl font-bold text-olive-dark">
              {stats.evaluacionesClinicas}
            </div>
            <p className="text-[10.5px] text-muted mt-0.5">
              Mediciones antropometricas
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-cream/50 border border-cream-darker">
            <div className="flex items-center gap-1.5 text-[11px] font-display text-muted mb-1">
              <FileSpreadsheet size={13} className="text-olive" />
              Planes nutricionales
            </div>
            <div className="font-display text-xl font-bold text-olive-dark">
              {stats.planesActivos}{" "}
              <span className="text-xs font-normal text-muted">
                / {stats.planesTotal} creados
              </span>
            </div>
            <p className="text-[10.5px] text-muted mt-0.5">
              Planes vigentes asignados
            </p>
          </div>
        </div>

        {/* Resumen del catalogo */}
        <div className="p-3.5 rounded-xl bg-olive/8 border border-olive/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-olive text-cream flex items-center justify-center flex-shrink-0">
              <BookOpen size={15} />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[12px] font-semibold text-olive-dark truncate">
                Catalogo de alimentos
              </p>
              <p className="text-[11px] text-muted truncate">
                {stats.alimentosGlobales} base SARA + {stats.alimentosPropios}{" "}
                propios
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white text-olive-dark font-display font-bold text-[11px] border border-cream-darker whitespace-nowrap flex-shrink-0">
            {stats.alimentosGlobales + stats.alimentosPropios} items
          </span>
        </div>
      </div>
    </motion.div>
  );
}
