// LandingHowItWorks.jsx — 3 pasos + Demo interactiva (orquestador modular)

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  GOAL,
  STEPS,
  INITIAL_REGISTROS,
  CATALOGO_SUGERENCIAS,
  getHoraActual,
} from "./howItWorks/howItWorksData";
import PhonePatientSimulator from "./howItWorks/PhonePatientSimulator";
import NutriRealtimeMirror from "./howItWorks/NutriRealtimeMirror";

export default function LandingHowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Estado del simulador
  const [activeTab, setActiveTab] = useState("hoy");
  const [activeDay, setActiveDay] = useState(5);
  const [registros, setRegistros] = useState(INITIAL_REGISTROS);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalActivo, setModalActivo] = useState(null);

  // Estado Modal Comida
  const [foodTab, setFoodTab] = useState("catalogo");
  const [busquedaCatalogo, setBusquedaCatalogo] = useState("");
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [otraDescripcion, setOtraDescripcion] = useState("");
  const [otraKcal, setOtraKcal] = useState("");

  // Estado Modal Actividad
  const [actTipo, setActTipo] = useState("");
  const [actDuracion, setActDuracion] = useState("");
  const [actIntensidad, setActIntensidad] = useState("Media");

  // Calculos en vivo
  const consumidas = registros
    .filter((r) => r.tipo === "comida")
    .reduce((acc, r) => acc + r.kcal, 0);
  const gastadas = registros
    .filter((r) => r.tipo === "actividad")
    .reduce((acc, r) => acc + r.kcal, 0);
  const balanceNeto = Math.max(0, consumidas - gastadas);
  const porcentaje = Math.min(Math.round((balanceNeto / GOAL) * 100), 100);
  const porcentajeReal = Math.round((balanceNeto / GOAL) * 100);
  const isOver = balanceNeto > GOAL;
  const restantes = Math.max(0, GOAL - balanceNeto);
  const ultimoRegistro = registros[registros.length - 1] || INITIAL_REGISTROS[0];

  function abrirModalComida(preset) {
    setMenuAbierto(false);
    setFoodTab("catalogo");
    if (preset) {
      setBusquedaCatalogo(preset.nombre);
      setPlatoSeleccionado(preset);
    } else {
      setBusquedaCatalogo("");
      setPlatoSeleccionado(null);
    }
    setOtraDescripcion("");
    setOtraKcal("");
    setModalActivo("comida");
  }

  function abrirModalActividad(preset) {
    setMenuAbierto(false);
    if (preset) {
      setActTipo(preset.nombre);
      setActDuracion(String(preset.duracion));
      setActIntensidad(preset.intensidad);
    } else {
      setActTipo("");
      setActDuracion("");
      setActIntensidad("Media");
    }
    setModalActivo("actividad");
  }

  function handleRegistrarComida(e) {
    e.preventDefault();
    let desc = "Omelette de claras y espinaca";
    let kcal = 290;
    let fuente = "catalogo";

    if (foodTab === "catalogo") {
      if (platoSeleccionado) {
        desc = platoSeleccionado.nombre;
        kcal = platoSeleccionado.kcal;
      } else if (busquedaCatalogo.trim()) {
        desc = busquedaCatalogo.trim();
        kcal = 350;
      }
      fuente = "catalogo";
    } else {
      desc = otraDescripcion.trim() || "Colacion saludable";
      kcal = Number(otraKcal) > 0 ? Number(otraKcal) : 320;
      fuente = "ia";
    }

    setRegistros((prev) => [
      ...prev,
      {
        id: "reg-" + Date.now(),
        tipo: "comida",
        descripcion: desc,
        hora: getHoraActual(),
        kcal,
        fuente,
      },
    ]);
    setActiveTab("hoy");
    setModalActivo(null);
  }

  function handleRegistrarActividad(e) {
    e.preventDefault();
    const nombre = actTipo.trim() || "Funcional";
    const min = Number(actDuracion) > 0 ? Number(actDuracion) : 45;
    const factor =
      actIntensidad === "Baja" ? 4 : actIntensidad === "Media" ? 6 : 8;
    const kcal = Math.round(min * factor);

    setRegistros((prev) => [
      ...prev,
      {
        id: "reg-" + Date.now(),
        tipo: "actividad",
        descripcion: nombre,
        duracion_min: min,
        intensidad: actIntensidad.toLowerCase(),
        hora: getHoraActual(),
        kcal,
      },
    ]);
    setActiveTab("hoy");
    setModalActivo(null);
  }

  function handleEliminarRegistro(id) {
    setRegistros((prev) => prev.filter((r) => r.id !== id));
  }

  function handleReiniciar() {
    setRegistros(INITIAL_REGISTROS);
    setModalActivo(null);
    setMenuAbierto(false);
    setActiveTab("hoy");
    setActiveDay(5);
  }

  const sugerenciasFiltradas = CATALOGO_SUGERENCIAS.filter((item) =>
    item.nombre.toLowerCase().includes(busquedaCatalogo.toLowerCase())
  );

  return (
    <section id="como-funciona" ref={ref} className="py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span
            className="inline-block bg-olive/10 text-olive font-display text-[11px] px-4 py-1.5
                        rounded-full uppercase tracking-widest mb-4"
          >
            Como funciona
          </span>
          <h2 className="font-display font-bold text-olive-dark text-[28px] leading-tight">
            Tres pasos. Sin complejidad.
          </h2>
          <p className="text-muted text-[14px] mt-3 max-w-md mx-auto">
            Desde que te registras hasta que tu primer paciente tiene su plan
            funcionando.
          </p>
        </motion.div>

        {/* Pasos 01, 02, 03 */}
        <div className="relative">
          <div className="hidden md:block absolute top-[52px] left-[calc(16.66%-1px)] right-[calc(16.66%-1px)] h-px bg-cream-darker z-0" />

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
            style={{ originX: 0 }}
            className="hidden md:block absolute top-[52px] left-[calc(16.66%-1px)] right-[calc(16.66%-1px)] h-px bg-olive z-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 32 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.18,
                    ease: "easeOut",
                  }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-6">
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center
                                  shadow-card border-2 border-white"
                      style={{ backgroundColor: step.bg }}
                    >
                      <Icon size={26} style={{ color: step.color }} />
                    </motion.div>
                    <span
                      className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-olive-dark
                                text-cream font-display font-bold text-[10px] flex items-center justify-center"
                    >
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-olive-dark text-[16px] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted text-[12.5px] leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Demo en vivo: Celular a la izquierda + Info a la derecha */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-20 pt-16 border-t border-cream-darker"
        >
          <div className="text-center mb-12">
            <span className="inline-flex items-center bg-olive/10 text-olive font-display text-[11px] px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">
              Demo interactiva en vivo
            </span>
            <h3 className="font-display font-bold text-olive-dark text-[22px] sm:text-[24px] leading-tight">
              Probalo ahora: asi usa el panel tu paciente desde el celular
            </h3>
            <p className="text-muted text-[13.5px] mt-2 max-w-lg mx-auto">
              Toca el boton <strong className="text-olive-dark">+</strong> en el
              celular o usa las opciones de la derecha para registrar una comida
              o una actividad fisica.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-6 flex justify-center w-full">
              <PhonePatientSimulator
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                registros={registros}
                setRegistros={setRegistros}
                consumidas={consumidas}
                gastadas={gastadas}
                balanceNeto={balanceNeto}
                porcentaje={porcentaje}
                porcentajeReal={porcentajeReal}
                restantes={restantes}
                menuAbierto={menuAbierto}
                setMenuAbierto={setMenuAbierto}
                modalActivo={modalActivo}
                setModalActivo={setModalActivo}
                abrirModalComida={abrirModalComida}
                abrirModalActividad={abrirModalActividad}
                handleEliminarRegistro={handleEliminarRegistro}
                modalProps={{
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
                }}
              />
            </div>

            <div className="lg:col-span-6 w-full min-w-0">
              <NutriRealtimeMirror
                tieneCambios={registros.length !== INITIAL_REGISTROS.length}
                handleReiniciar={handleReiniciar}
                abrirModalComida={abrirModalComida}
                abrirModalActividad={abrirModalActividad}
                ultimoRegistro={ultimoRegistro}
                isOver={isOver}
                porcentaje={porcentaje}
                porcentajeReal={porcentajeReal}
                balanceNeto={balanceNeto}
                consumidas={consumidas}
                gastadas={gastadas}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
