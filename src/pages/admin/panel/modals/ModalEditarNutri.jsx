// ModalEditarNutri.jsx — Modal para editar datos, cupo extra, plan y estado de un nutricionista

import { useState, useEffect } from "react";
import { User, Users, Check, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import {
  DEFAULT_PLANS,
  STATUS_CONFIG,
  normalizarEstado,
  valorEstadoDB,
  formatARS,
  AdminField,
} from "../adminUtils";

export function ModalEditarNutri({
  nutricionista,
  onClose,
  actualizarNutricionista,
  planesConfig = DEFAULT_PLANS,
}) {
  const [nombre, setNombre] = useState("");
  const [planKey, setPlanKey] = useState("starter");
  const [estadoKey, setEstadoKey] = useState("activo");
  const [cupoExtra, setCupoExtra] = useState("0");
  const [errNombre, setErrNombre] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (nutricionista) {
      setNombre(nutricionista.nombre || "");
      setPlanKey((nutricionista.plan_suscripcion || "starter").toLowerCase());
      setEstadoKey(normalizarEstado(nutricionista.estado));
      setCupoExtra(String(nutricionista.cupo_extra || 0));
      setErrNombre("");
      setGuardando(false);
    }
  }, [nutricionista]);

  async function handleGuardar(e) {
    e.preventDefault();
    if (!nutricionista) return;
    if (!nombre.trim()) {
      setErrNombre("El nombre del profesional es obligatorio.");
      return;
    }

    setGuardando(true);
    const estadoParaDB = valorEstadoDB(estadoKey, nutricionista.estado);

    const { error } = await actualizarNutricionista(nutricionista.id, {
      nombre: nombre.trim(),
      plan_suscripcion: planKey,
      estado: estadoParaDB,
      cupo_extra: Math.max(0, Number(cupoExtra) || 0),
    });

    setGuardando(false);
    if (error) {
      toast.error("Error al actualizar nutricionista: " + error);
      return;
    }

    toast.success("Datos del nutricionista actualizados en Supabase");
    onClose();
  }

  return (
    <Modal
      open={Boolean(nutricionista)}
      onClose={() => !guardando && onClose()}
      title="Editar nutricionista"
      size="md"
      preventOverlayClose={guardando}
    >
      {nutricionista && (
        <form onSubmit={handleGuardar} className="space-y-3.5" noValidate>
          <div className="px-3 py-2 rounded-xl bg-cream border border-cream-darker flex items-center justify-between">
            <span className="text-[11px] font-display text-muted">
              Email registrado
            </span>
            <span className="text-[11.5px] font-semibold text-olive-dark">
              {nutricionista.email}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2">
              <AdminField
                label="Nombre del profesional *"
                name="nombre"
                icon={User}
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (errNombre) setErrNombre("");
                }}
                error={errNombre}
                maxLength={80}
              />
            </div>
            <div>
              <AdminField
                label="Cupo extra pac."
                name="cupoExtra"
                type="number"
                icon={Users}
                value={cupoExtra}
                onChange={(e) => setCupoExtra(e.target.value)}
              />
            </div>
          </div>

          {/* Selector de Plan */}
          <div>
            <div className="font-display text-[10px] uppercase tracking-wide text-muted mb-1.5">
              Plan de suscripcion
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(planesConfig).map((p) => {
                const active = planKey === p.key;
                return (
                  <motion.button
                    key={p.key}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPlanKey(p.key)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${active
                      ? "border-olive bg-olive/10 shadow-sm"
                      : "border-cream-darker bg-[#F5F2EA] hover:bg-cream"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`badge badge-${p.key}`}>{p.label}</span>
                      {active && <Check size={11} className="text-olive" />}
                    </div>
                    <div className="font-display text-[12px] font-semibold text-olive-dark">
                      {formatARS(p.price)}
                    </div>
                    <div className="text-[9.5px] text-muted leading-tight mt-0.5">
                      {p.patients >= 9999
                        ? "Ilimitado"
                        : `Hasta ${p.patients} pac.`}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Selector de Estado */}
          <div>
            <div className="font-display text-[10px] uppercase tracking-wide text-muted mb-1.5">
              Estado de cuenta y facturacion
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(STATUS_CONFIG).map((st) => {
                const active = estadoKey === st.key;
                return (
                  <motion.button
                    key={st.key}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setEstadoKey(st.key)}
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${active
                      ? "border-olive bg-olive/10 shadow-sm"
                      : "border-cream-darker bg-[#F5F2EA] hover:bg-cream"
                      }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`status-dot ${st.dot}`} />
                      <span className="font-display text-[11px] font-medium text-olive-dark">
                        {st.text}
                      </span>
                    </div>
                    {active && <Check size={11} className="text-olive" />}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-2 pt-1">
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={guardando}
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-cream-dark text-muted font-display
                          text-[11.5px] cursor-pointer hover:bg-cream-darker transition-colors
                          flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <X size={13} /> Cancelar
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={guardando}
              className="flex-1 py-2.5 rounded-xl bg-olive text-cream font-display
                          text-[11.5px] cursor-pointer hover:bg-olive-deep transition-colors
                          flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {guardando ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check size={13} />
                  Guardar cambios
                </>
              )}
            </motion.button>
          </div>
        </form>
      )}
    </Modal>
  );
}
