// ModalParsePdf.jsx — Modal para importar un plan alimenticio via IA con animaciones

import { useState } from "react";
import {
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  ClipboardPaste,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";
import { supabase } from "@/lib/supabaseClient";

const TIPO_LABELS = {
  desayuno: "Desayuno",
  colacion: "Colacion",
  almuerzo: "Almuerzo",
  merienda: "Merienda",
  cena: "Cena",
  colacion_nocturna: "Colacion nocturna",
  snack: "Snack",
};
const TIPOS_VALIDOS = Object.keys(TIPO_LABELS);

const ESTADO = {
  IDLE: "idle",
  PROCESANDO: "procesando",
  REVISION: "revision",
  ERROR: "error",
};

export default function ModalParsePdf({ open, onClose, onConfirmar }) {
  const [estado, setEstado] = useState(ESTADO.IDLE);
  const [texto, setTexto] = useState("");
  const [comidas, setComidas] = useState([]);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function handleClose() {
    if (guardando) return;
    setEstado(ESTADO.IDLE);
    setTexto("");
    setComidas([]);
    setError("");
  }

  async function analizarTexto() {
    if (texto.trim().length < 10) return;

    setEstado(ESTADO.PROCESANDO);
    setError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "parse-pdf",
        { body: { texto } }
      );

      if (fnError) {
        throw new Error(fnError.message || "Error al analizar el texto.");
      }

      const comidasExtraidas = data?.comidas || [];

      if (comidasExtraidas.length === 0) {
        setError(
          data?.advertencia ||
          "No se encontraron comidas. Verifica que hayas pegado el contenido de un plan alimenticio."
        );
        setEstado(ESTADO.ERROR);
        return;
      }

      setComidas(comidasExtraidas);
      setEstado(ESTADO.REVISION);
    } catch (err) {
      setError(err.message || "Error inesperado. Intenta de nuevo.");
      setEstado(ESTADO.ERROR);
    }
  }

  function editarComida(index, campo, valor) {
    setComidas((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [campo]: valor } : c))
    );
  }

  function eliminarComida(index) {
    setComidas((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleConfirmar() {
    const comidasValidas = comidas.filter((c) => c.descripcion.trim());
    if (comidasValidas.length === 0) return;

    setGuardando(true);
    await onConfirmar(comidasValidas);
    setGuardando(false);
    handleClose();
    onClose();
  }

  const textoValido = texto.trim().length >= 10;
  const comidasValidas = comidas.filter((c) => c.descripcion.trim());

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        onClose();
      }}
      title="Importar plan con IA"
    >
      <AnimatePresence mode="wait">
        {/* ESTADO: IDLE */}
        {estado === ESTADO.IDLE && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-3"
          >
            <div className="flex items-start gap-3 bg-cream rounded-xl px-4 py-3 border border-cream-darker/50">
              <ClipboardPaste size={15} className="text-olive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-[12px] text-olive-dark font-medium">
                  Pega el texto del plan alimenticio
                </p>
                <p className="text-[10.5px] text-muted mt-0.5 leading-snug">
                  Desde Word: selecciona todo (Ctrl+A) y copia (Ctrl+C), luego pega aqui.
                  Tambien funciona con Google Docs, email o WhatsApp.
                </p>
              </div>
            </div>

            <textarea
              className="w-full min-h-[160px] rounded-xl border border-cream-darker
                         bg-[#F5F2EA] px-4 py-3 text-[11.5px] text-olive-dark
                         placeholder:text-muted/60 resize-none focus:outline-none
                         focus:border-olive/60 focus:ring-2 focus:ring-olive/25
                         transition-all font-body leading-relaxed"
              placeholder={
                "DESAYUNO\nCafe con leche descremada\n2 tostadas integrales con queso blanco\n\n" +
                "ALMUERZO\nPechuga de pollo a la plancha 150g + ensalada verde\n\n" +
                "MERIENDA\nYogur descremado con fruta\n\nCENA\nFilete de merluza 150g + vegetales al vapor..."
              }
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              autoFocus
            />

            <div className="flex items-center justify-between">
              <p className={`text-[9.5px] font-display ${texto.length > 18000 ? "text-accent" : "text-muted"}`}>
                {texto.length.toLocaleString("es")} / 20.000 caracteres
              </p>
              {!textoValido && texto.length > 0 && (
                <p className="text-[9.5px] text-amber-600 font-display">
                  Pega mas contenido del plan para analizar
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  handleClose();
                  onClose();
                }}
                className="btn-ghost flex-1 py-2.5"
              >
                Cancelar
              </motion.button>
              <motion.button
                type="button"
                onClick={analizarTexto}
                disabled={!textoValido}
                whileHover={textoValido ? { scale: 1.02, boxShadow: "0 6px 20px rgba(110,122,75,0.3)" } : {}}
                whileTap={textoValido ? { scale: 0.96 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles size={13} />
                Analizar con IA
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ESTADO: PROCESANDO */}
        {estado === ESTADO.PROCESANDO && (
          <motion.div
            key="procesando"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-12 gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 size={28} className="text-olive" />
            </motion.div>
            <div className="text-center">
              <p className="font-display text-[13px] text-olive-dark font-medium">
                Analizando el plan...
              </p>
              <p className="text-[10.5px] text-muted mt-1">
                La IA esta identificando y estructurando las comidas.
              </p>
            </div>
          </motion.div>
        )}

        {/* ESTADO: ERROR */}
        {estado === ESTADO.ERROR && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3 bg-accent/8 border border-accent/20 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-[12px] text-accent font-medium">
                  No se pudo analizar el texto
                </p>
                <p className="text-[10.5px] text-olive-dark mt-0.5 leading-snug">{error}</p>
              </div>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setEstado(ESTADO.IDLE)}
              className="w-full btn-ghost py-2.5 text-sm"
            >
              Volver e intentar de nuevo
            </motion.button>
          </motion.div>
        )}

        {/* ESTADO: REVISION */}
        {estado === ESTADO.REVISION && (
          <motion.div
            key="revision"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-olive flex-shrink-0" />
                <p className="text-[11px] text-olive-dark font-display font-medium">
                  {comidas.length} comida{comidas.length !== 1 ? "s" : ""} encontrada{comidas.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEstado(ESTADO.IDLE)}
                className="text-[10px] text-muted hover:text-olive-dark font-display underline"
              >
                Volver a editar el texto
              </button>
            </div>

            <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {comidas.map((comida, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.16, delay: Math.min(index, 5) * 0.03 }}
                    className="bg-white rounded-xl border border-cream-darker px-3.5 py-2.5 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={comida.tipo_comida}
                        onChange={(e) => editarComida(index, "tipo_comida", e.target.value)}
                        className="text-[10px] font-display font-medium text-olive bg-olive/10
                                    border-0 rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                      >
                        {TIPOS_VALIDOS.map((t) => (
                          <option key={t} value={t}>
                            {TIPO_LABELS[t]}
                          </option>
                        ))}
                      </select>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => eliminarComida(index)}
                        className="text-muted hover:text-accent transition-colors flex-shrink-0"
                        title="Quitar esta comida"
                      >
                        <X size={13} />
                      </motion.button>
                    </div>

                    <input
                      className="w-full px-3 py-1.5 rounded-lg border border-cream-darker text-[11.5px]
                                  font-body text-olive-dark bg-[#F5F2EA] focus:outline-none focus:border-olive/60"
                      value={comida.descripcion}
                      onChange={(e) => editarComida(index, "descripcion", e.target.value)}
                      placeholder="Descripcion de la comida"
                      maxLength={300}
                    />

                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { campo: "calorias_aprox", label: "kcal" },
                        { campo: "proteinas_g", label: "P (g)" },
                        { campo: "carbos_g", label: "C (g)" },
                        { campo: "grasas_g", label: "G (g)" },
                      ].map(({ campo, label }) => (
                        <div key={campo}>
                          <p className="text-[8.5px] text-muted font-display mb-0.5 text-center">
                            {label}
                          </p>
                          <input
                            type="number"
                            className="w-full px-2 py-1 rounded-lg border border-cream-darker text-[11px]
                                        font-body text-olive-dark bg-[#F5F2EA] text-center focus:outline-none
                                      focus:border-olive/60 [appearance:textfield]
                                        [&::-webkit-outer-spin-button]:appearance-none
                                        [&::-webkit-inner-spin-button]:appearance-none"
                            value={comida[campo] ?? ""}
                            onChange={(e) =>
                              editarComida(
                                index,
                                campo,
                                e.target.value === "" ? null : Number(e.target.value)
                              )
                            }
                            placeholder="—"
                            min={0}
                            step={campo === "calorias_aprox" ? 1 : 0.1}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex gap-2 pt-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  handleClose();
                  onClose();
                }}
                className="btn-ghost flex-1 py-2.5"
              >
                Cancelar
              </motion.button>
              <motion.button
                type="button"
                onClick={handleConfirmar}
                disabled={guardando || comidasValidas.length === 0}
                whileHover={!guardando && comidasValidas.length > 0 ? { scale: 1.02 } : {}}
                whileTap={!guardando && comidasValidas.length > 0 ? { scale: 0.96 } : {}}
                className="btn-primary flex-1 py-2.5 disabled:opacity-50"
              >
                {guardando ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Loader2 size={13} className="animate-spin" /> Agregando...
                  </span>
                ) : (
                  `Agregar ${comidasValidas.length} comida${comidasValidas.length !== 1 ? "s" : ""} al plan`
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
