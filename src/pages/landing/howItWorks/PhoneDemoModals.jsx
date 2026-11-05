// PhoneDemoModals.jsx — Menu emergente FAB (+) y Modales reales de Comida y Actividad dentro del celular

import { motion, AnimatePresence } from "framer-motion";
import { Flame, Dumbbell, X, Search, Clock, Camera } from "lucide-react";

export function PhoneAddMenu({
  menuAbierto,
  setMenuAbierto,
  abrirModalActividad,
  abrirModalComida,
}) {
  return (
    <AnimatePresence>
      {menuAbierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 z-40 bg-olive-dark/15 backdrop-blur-[1px] flex items-end justify-end pb-20 px-4"
          onClick={() => setMenuAbierto(false)}
        >
          <div
            className="flex flex-col gap-2 items-end"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 16, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.88 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 24,
                delay: 0.04,
              }}
              onClick={() => abrirModalActividad()}
              className="flex items-center gap-2.5 bg-white border border-cream-darker rounded-2xl px-3.5 py-2 shadow-modal font-display font-medium text-[12px] text-olive-dark hover:bg-cream transition-colors cursor-pointer whitespace-nowrap"
            >
              Actividad fisica
              <span className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Dumbbell size={13} className="text-blue-500" />
              </span>
            </motion.button>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 16, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.88 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 24,
              }}
              onClick={() => abrirModalComida()}
              className="flex items-center gap-2.5 bg-white border border-cream-darker rounded-2xl px-3.5 py-2 shadow-modal font-display font-medium text-[12px] text-olive-dark hover:bg-cream transition-colors cursor-pointer whitespace-nowrap"
            >
              Lo que comi
              <span className="w-7 h-7 rounded-full bg-olive/12 flex items-center justify-center flex-shrink-0">
                <Flame size={13} className="text-olive" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PhoneActionModal({
  modalActivo,
  setModalActivo,
  foodTab,
  setFoodTab,
  busquedaCatalogo,
  setBusquedaCatalogo,
  platoSeleccionado,
  setPlatoSeleccionado,
  sugerenciasFiltradas,
  otraDescripcion,
  setOtraDescripcion,
  otraKcal,
  setOtraKcal,
  handleRegistrarComida,
  actTipo,
  setActTipo,
  actDuracion,
  setActDuracion,
  actIntensidad,
  setActIntensidad,
  handleRegistrarActividad,
}) {
  return (
    <AnimatePresence>
      {modalActivo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 bg-olive-dark/45 z-50 flex items-center justify-center p-3"
          onClick={() => setModalActivo(null)}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-modal w-full overflow-hidden"
          >
            {modalActivo === "comida" ? (
              <>
                <div className="flex justify-between items-center px-4 py-3.5 border-b border-cream-darker">
                  <h3 className="font-display font-semibold text-[13.5px] text-olive-dark">
                    Registrar comida
                  </h3>
                  <button
                    type="button"
                    onClick={() => setModalActivo(null)}
                    className="text-muted hover:text-olive-dark transition-colors p-0.5 rounded cursor-pointer"
                    aria-label="Cerrar"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="px-4 py-4">
                  <form
                    onSubmit={handleRegistrarComida}
                    className="space-y-3"
                    noValidate
                  >
                    <div className="flex gap-1 bg-cream rounded-xl p-1 border border-cream-darker">
                      {[
                        { id: "catalogo", label: "Catálogo" },
                        { id: "otra", label: "Otra" },
                      ].map((t) => {
                        const active = foodTab === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setFoodTab(t.id)}
                            className={`relative flex-1 py-1.5 rounded-lg font-display text-[11px] font-medium transition-colors cursor-pointer ${active
                              ? "text-olive-dark font-semibold"
                              : "text-muted hover:text-olive-dark"
                              }`}
                          >
                            {active && (
                              <div className="absolute inset-0 bg-white rounded-lg shadow-xs" />
                            )}
                            <span className="relative z-10">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {foodTab === "catalogo" ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <div
                            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                            style={{ color: "rgb(155, 148, 132)" }}
                          >
                            <Search size={13} />
                          </div>
                          <input
                            type="text"
                            value={busquedaCatalogo}
                            onChange={(e) => {
                              setBusquedaCatalogo(e.target.value);
                              setPlatoSeleccionado(null);
                            }}
                            placeholder="Buscar en el catalogo (ej: pollo, avena...)"
                            className="w-full pl-8 pr-3 py-2.5 rounded-xl border text-[11.5px] font-body text-olive-dark placeholder:text-muted focus:outline-none focus:ring-2 transition-all duration-150 border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
                          />
                        </div>

                        <div className="space-y-1 max-h-28 overflow-y-auto">
                          {sugerenciasFiltradas.map((item) => {
                            const selected =
                              platoSeleccionado?.nombre === item.nombre;
                            return (
                              <button
                                key={item.nombre}
                                type="button"
                                onClick={() => {
                                  setPlatoSeleccionado(item);
                                  setBusquedaCatalogo(item.nombre);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-[11px] transition-colors cursor-pointer border ${selected
                                  ? "bg-olive/10 border-olive text-olive-dark font-medium"
                                  : "bg-[#F5F2EA]/60 border-cream-darker text-olive-dark hover:bg-cream"
                                  }`}
                              >
                                <span className="truncate pr-2">
                                  {item.nombre}
                                </span>
                                <span className="font-display text-[10px] font-semibold text-olive whitespace-nowrap flex-shrink-0">
                                  +{item.kcal} kcal
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={otraDescripcion}
                          onChange={(e) => setOtraDescripcion(e.target.value)}
                          placeholder="Descripcion (ej: milanesa con pure)"
                          className="w-full px-3 py-2.5 rounded-xl border text-[11.5px] font-body text-olive-dark placeholder:text-muted focus:outline-none focus:ring-2 transition-all duration-150 border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
                        />
                        <input
                          type="number"
                          value={otraKcal}
                          onChange={(e) => setOtraKcal(e.target.value)}
                          placeholder="Calorias estimadas (ej: 450)"
                          className="w-full px-3 py-2 rounded-xl border text-[11.5px] font-body text-olive-dark placeholder:text-muted focus:outline-none focus:ring-2 transition-all duration-150 border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
                        />
                      </div>
                    )}

                    <div>
                      <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
                        Foto opcional
                      </p>
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-cream-darker bg-[#F5F2EA]/60 text-muted hover:border-olive/50 hover:text-olive transition-colors font-display text-[11px] cursor-pointer"
                      >
                        <Camera size={13} /> Agregar foto
                      </button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setModalActivo(null)}
                        className="btn-ghost flex-1 py-2 text-[11.5px] cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn-primary flex-1 py-2 text-[11.5px] cursor-pointer"
                      >
                        Registrar
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center px-4 py-3.5 border-b border-cream-darker">
                  <h3 className="font-display font-semibold text-[13.5px] text-olive-dark">
                    Registrar actividad
                  </h3>
                  <button
                    type="button"
                    onClick={() => setModalActivo(null)}
                    className="text-muted hover:text-olive-dark transition-colors p-0.5 rounded cursor-pointer"
                    aria-label="Cerrar"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="px-4 py-4">
                  <form
                    onSubmit={handleRegistrarActividad}
                    className="space-y-3"
                    noValidate
                  >
                    <div className="relative">
                      <div
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                        style={{ color: "rgb(155, 148, 132)" }}
                      >
                        <Dumbbell size={13} />
                      </div>
                      <input
                        name="tipo"
                        type="text"
                        value={actTipo}
                        onChange={(e) => setActTipo(e.target.value)}
                        placeholder="Actividad (ej: correr, funcional...) *"
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border text-[11.5px] font-body text-olive-dark placeholder:text-muted focus:outline-none focus:ring-2 transition-all duration-150 border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
                      />
                    </div>

                    <div>
                      <div className="relative">
                        <div
                          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                          style={{ color: "rgb(155, 148, 132)" }}
                        >
                          <Clock size={13} />
                        </div>
                        <input
                          name="duracion_min"
                          type="number"
                          min="1"
                          max="480"
                          value={actDuracion}
                          onChange={(e) => setActDuracion(e.target.value)}
                          placeholder="Duracion *"
                          className="w-full pl-8 pr-10 py-2.5 rounded-xl border text-[11.5px] font-body text-olive-dark placeholder:text-muted focus:outline-none focus:ring-2 transition-all duration-150 border-cream-darker focus:ring-olive/30 focus:border-olive/60 bg-[#F5F2EA]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-[10px] font-display pointer-events-none">
                          min
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-1.5">
                        {[20, 30, 45, 60, 90].map((min) => (
                          <button
                            key={min}
                            type="button"
                            onClick={() => setActDuracion(String(min))}
                            className={`flex-1 py-1 rounded-lg text-[9.5px] font-display transition-colors cursor-pointer whitespace-nowrap ${Number(actDuracion) === min
                              ? "bg-olive text-cream font-semibold"
                              : "bg-cream text-muted hover:text-olive-dark"
                              }`}
                          >
                            {min} min
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
                        Intensidad *
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: "Baja", desc: "Caminata, yoga" },
                          { id: "Media", desc: "Bici, trote" },
                          { id: "Alta", desc: "HIIT, pesas" },
                        ].map((item) => {
                          const active = actIntensidad === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setActIntensidad(item.id)}
                              className={`rounded-xl px-2.5 py-1.5 text-left transition-colors border-2 cursor-pointer ${active
                                ? "bg-olive text-cream border-olive shadow-xs"
                                : "bg-[#F5F2EA] border-cream-darker text-muted hover:border-olive/45"
                                }`}
                            >
                              <p
                                className={`font-display text-[11px] font-semibold ${active ? "text-cream" : "text-olive-dark"
                                  }`}
                              >
                                {item.id}
                              </p>
                              <p
                                className={`text-[8.5px] mt-0.5 leading-tight truncate ${active ? "text-cream/75" : "text-muted"
                                  }`}
                              >
                                {item.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
                        Foto opcional
                      </p>
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-cream-darker bg-[#F5F2EA]/60 text-muted hover:border-olive/50 hover:text-olive transition-colors font-display text-[11px] cursor-pointer"
                      >
                        <Camera size={13} /> Agregar foto
                      </button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setModalActivo(null)}
                        className="btn-ghost flex-1 py-2 text-[11.5px] cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn-primary flex-1 py-2 text-[11.5px] cursor-pointer"
                      >
                        Registrar
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
