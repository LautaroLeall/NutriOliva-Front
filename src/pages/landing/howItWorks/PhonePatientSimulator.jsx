// PhonePatientSimulator.jsx — Celular interactivo con la vista real de /mi-panel

import { motion } from "framer-motion";
import {
  ClipboardList,
  CalendarDays,
  TrendingUp,
  Flame,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
  LogOut,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import {
  GOAL,
  CATALOGO_SUGERENCIAS,
  DAYS_DEMO,
  getHoraActual,
} from "./howItWorksData";
import { PhoneAddMenu, PhoneActionModal } from "./PhoneDemoModals";

export default function PhonePatientSimulator({
  activeTab,
  setActiveTab,
  activeDay,
  setActiveDay,
  registros,
  setRegistros,
  consumidas,
  gastadas,
  balanceNeto,
  porcentaje,
  porcentajeReal,
  restantes,
  menuAbierto,
  setMenuAbierto,
  modalActivo,
  setModalActivo,
  abrirModalComida,
  abrirModalActividad,
  handleEliminarRegistro,
  modalProps,
}) {
  return (
    <div className="w-full max-w-[380px] border-[9px] border-olive-dark rounded-[40px] overflow-hidden shadow-[0_22px_60px_rgba(63,74,43,0.22)] bg-[#EFEAE0] relative">
      {/* Notch superior */}
      <div className="bg-olive-dark h-[22px] flex items-center justify-center">
        <span className="w-[60px] h-[5px] bg-olive-deep rounded-full" />
      </div>

      {/* Pantalla del celular */}
      <div className="relative bg-[#EFEAE0] h-[590px] flex flex-col overflow-hidden">
        {/* Navbar identico a PatientPanel.jsx */}
        <nav className="flex justify-between items-center px-4 py-3 bg-white border-b border-cream-darker shadow-xs flex-shrink-0">
          <div className="flex items-center gap-2 font-display font-bold text-[15px] text-olive-dark whitespace-nowrap">
            <Logo size={19} />
            NutriOliva
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-[11px] text-muted font-display whitespace-nowrap">
              Bernarda Test
            </span>
            <button
              type="button"
              aria-label="Cerrar sesion"
              title="Cerrar sesion"
              className="text-muted hover:text-olive-dark transition-colors p-1 rounded-lg hover:bg-cream cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </nav>

        {/* Cuerpo interno */}
        <div className="flex-1 overflow-y-auto px-3.5 pt-4 pb-24">
          {/* Tabs: Mi dia | Mi plan | Tendencia */}
          <div className="flex gap-1 bg-cream rounded-xl p-1 mb-4 border border-cream-darker">
            {[
              { id: "hoy", label: "Mi dia", icon: CalendarDays },
              { id: "plan", label: "Mi plan", icon: ClipboardList },
              { id: "tendencia", label: "Tendencia", icon: TrendingUp },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 py-2 rounded-lg font-display text-[11.5px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${isActive
                    ? "text-olive-dark font-semibold"
                    : "text-muted hover:text-olive-dark"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="patient-phone-tab-pill"
                      className="absolute inset-0 bg-white rounded-lg shadow-xs"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className="relative z-10 flex-shrink-0"
                    style={{
                      color: isActive
                        ? "rgb(110, 122, 75)"
                        : "rgb(155, 148, 132)",
                    }}
                  >
                    <TabIcon size={13} />
                  </span>
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === "hoy" && (
            <div>
              {/* Balance del dia (Blanco, identico a BalanceCard.jsx) */}
              <div className="bg-white rounded-2xl border border-cream-darker p-4 mb-3.5 shadow-card">
                <div className="flex items-end justify-between mb-3 gap-2">
                  <div className="min-w-0">
                    <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-1 whitespace-nowrap">
                      Balance del dia
                    </p>
                    <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                      <span className="font-display font-bold text-[26px] leading-none text-olive-dark">
                        {balanceNeto}
                      </span>
                      <span className="text-muted text-[12.5px] font-display">
                        / {GOAL} kcal
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 items-end flex-shrink-0">
                    <span className="flex items-center gap-1 text-[10px] font-display text-olive bg-olive/8 px-2 py-0.5 rounded-lg whitespace-nowrap">
                      <Flame size={11} className="flex-shrink-0" /> +{consumidas}{" "}
                      consumidas
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-display text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg whitespace-nowrap">
                      <Dumbbell size={11} className="flex-shrink-0" /> -{gastadas}{" "}
                      gastadas
                    </span>
                  </div>
                </div>

                <div className="w-full bg-cream rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: `${porcentaje}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="h-2 rounded-full bg-olive"
                  />
                </div>

                <div className="flex justify-between mt-1.5 gap-2">
                  <span className="text-[9.5px] text-muted font-display whitespace-nowrap">
                    {porcentajeReal}% del objetivo
                  </span>
                  <span className="text-[9.5px] font-display font-medium text-muted whitespace-nowrap">
                    {restantes} kcal restantes
                  </span>
                </div>
              </div>

              {/* Calendario semanal identico a DayCalendar.jsx */}
              <div className="bg-white border border-cream-darker rounded-2xl overflow-hidden mb-3.5">
                <div className="flex items-center gap-0.5 px-2 py-2.5">
                  <button
                    type="button"
                    className="p-1 rounded-lg text-muted hover:bg-cream hover:text-olive-dark transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <div className="flex-1 flex justify-between gap-0.5">
                    {DAYS_DEMO.map((d) => {
                      const isSelected = activeDay === d.num;
                      return (
                        <button
                          key={d.label}
                          type="button"
                          disabled={d.disabled}
                          onClick={() => !d.disabled && setActiveDay(d.num)}
                          className={`relative flex flex-col items-center rounded-xl px-1.5 py-1.5 transition-colors duration-150 flex-1 min-w-0 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${isSelected
                            ? "text-cream"
                            : "hover:bg-cream text-muted hover:text-olive-dark"
                            }`}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="patient-phone-day-pill"
                              className="absolute inset-0 bg-olive rounded-xl shadow-sm"
                            />
                          )}
                          <span
                            className={`relative z-10 text-[8.5px] font-display uppercase tracking-wide mb-0.5 whitespace-nowrap ${isSelected ? "text-cream/80" : ""
                              }`}
                          >
                            {d.label}
                          </span>
                          <span
                            className={`relative z-10 font-display font-semibold text-[13px] leading-none whitespace-nowrap ${isSelected ? "text-cream" : ""
                              }`}
                          >
                            {d.num}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled
                    className="p-1 rounded-lg text-muted hover:bg-cream hover:text-olive-dark transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Encabezado Hoy + cantidad de registros */}
              <div className="flex items-center justify-between mb-2.5 px-0.5">
                <h3 className="font-display font-semibold text-[12.5px] text-olive-dark capitalize whitespace-nowrap">
                  Hoy
                </h3>
                <span className="text-[10px] text-muted font-display bg-white border border-cream-darker px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  {registros.length}{" "}
                  {registros.length === 1 ? "registro" : "registros"}
                </span>
              </div>

              {/* Lista de registros identica a Timeline.jsx / TimelineEntry.jsx */}
              <div className="bg-white rounded-2xl border border-cream-darker overflow-visible p-1.5 shadow-card">
                <div className="space-y-1">
                  {registros.map((reg) => {
                    const esComida = reg.tipo === "comida";
                    return (
                      <div
                        key={reg.id}
                        className="flex gap-2.5 px-3 py-2.5 rounded-xl transition-colors hover:bg-cream/60 group"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${esComida ? "bg-olive/10" : "bg-blue-50"
                            }`}
                        >
                          {esComida ? (
                            <Flame size={14} className="text-olive" />
                          ) : (
                            <Dumbbell size={14} className="text-blue-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-olive-dark font-medium leading-snug group-hover:text-olive transition-colors truncate">
                            {reg.descripcion}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-[10px] text-muted whitespace-nowrap">
                              {reg.hora}
                            </span>
                            {!esComida && reg.duracion_min && (
                              <span className="text-[10px] text-muted whitespace-nowrap">
                                · {reg.duracion_min} min · {reg.intensidad}
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-display font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap ${esComida
                                ? "bg-olive/10 text-olive-dark"
                                : "bg-blue-50 text-blue-600"
                                }`}
                            >
                              {esComida ? "+" : "-"}
                              {reg.kcal} kcal
                            </span>
                            {esComida && reg.fuente && (
                              <span className="text-[9px] text-muted/70 italic capitalize whitespace-nowrap">
                                {reg.fuente}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
                          {esComida && (
                            <button
                              type="button"
                              onClick={() => abrirModalComida()}
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-olive-dark cursor-pointer"
                              title="Editar"
                            >
                              <Pencil size={11} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleEliminarRegistro(reg.id)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-accent cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "plan" && (
            <div className="bg-white rounded-2xl border border-cream-darker p-4 shadow-card space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12.5px] font-display font-semibold text-olive-dark truncate">
                    Plan nutricional activo
                  </p>
                  <p className="text-[10.5px] text-muted whitespace-nowrap">
                    Objetivo diario: {GOAL} kcal
                  </p>
                </div>
                <span className="text-[9.5px] font-display text-olive bg-olive/10 px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                  4 comidas
                </span>
              </div>
              {CATALOGO_SUGERENCIAS.map((item) => (
                <div
                  key={item.nombre}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-cream/50 border border-cream-darker"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] font-medium text-olive-dark truncate">
                      {item.nombre}
                    </p>
                    <p className="text-[10px] text-muted whitespace-nowrap">
                      +{item.kcal} kcal
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRegistros((prev) => [
                        ...prev,
                        {
                          id: "reg-" + Date.now(),
                          tipo: "comida",
                          descripcion: item.nombre,
                          hora: getHoraActual(),
                          kcal: item.kcal,
                          fuente: "del plan",
                        },
                      ]);
                      setActiveTab("hoy");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-olive text-cream font-display text-[10.5px] hover:bg-olive-deep transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    Registrar
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "tendencia" && (
            <div className="bg-white rounded-2xl border border-cream-darker p-4 shadow-card">
              <p className="text-[12.5px] font-display font-semibold text-olive-dark mb-0.5">
                Evolucion semanal
              </p>
              <p className="text-[10.5px] text-muted mb-4">
                Balance promedio: {balanceNeto} kcal / {GOAL} kcal
              </p>
              <div className="flex items-end justify-between gap-2 h-32 pt-4 px-1">
                {[
                  65,
                  80,
                  72,
                  Math.min(100, Math.max(25, porcentaje)),
                  78,
                  85,
                  70,
                ].map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                  >
                    <div
                      style={{ height: `${val}%` }}
                      className={`w-full rounded-t-lg transition-all duration-300 ${idx === 3 ? "bg-olive" : "bg-olive/30"
                        }`}
                    />
                    <span className="text-[9.5px] font-display text-muted">
                      {DAYS_DEMO[idx].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Menu emergente del FAB (+) */}
        <PhoneAddMenu
          menuAbierto={menuAbierto}
          setMenuAbierto={setMenuAbierto}
          abrirModalActividad={abrirModalActividad}
          abrirModalComida={abrirModalComida}
        />

        {/* Boton flotante (+) */}
        <button
          type="button"
          aria-label="Agregar registro"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((o) => !o)}
          className="absolute bottom-4 right-4 z-40 w-12 h-12 rounded-full shadow-modal flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          style={{ backgroundColor: "rgb(110, 122, 75)" }}
        >
          <motion.span
            animate={{ rotate: menuAbierto ? 45 : 0 }}
            style={{ color: "rgb(246, 241, 231)" }}
          >
            <Plus size={20} />
          </motion.span>
        </button>

        {/* Modal real dentro del celular */}
        <PhoneActionModal
          modalActivo={modalActivo}
          setModalActivo={setModalActivo}
          {...modalProps}
        />
      </div>
    </div>
  );
}
