// ModalNuevoNutri.jsx — Modal para crear un nuevo nutricionista con barra de progreso y selector de plan

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  UserPlus,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import {
  DEFAULT_PLANS,
  FORM_NUEVO_VACIO,
  formatARS,
  AdminField,
} from "../adminUtils";

export function ModalNuevoNutri({
  open,
  onClose,
  crearNutricionista,
  planesConfig = DEFAULT_PLANS,
}) {
  const [form, setForm] = useState(FORM_NUEVO_VACIO);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(FORM_NUEVO_VACIO);
      setErrors({});
      setServerError("");
      setVerPassword(false);
      setCreando(false);
    }
  }, [open]);

  const nombreOk = form.nombre.trim().length >= 2;
  const emailOk =
    form.email.trim().includes("@") && form.email.trim().includes(".");
  const passOk = form.password.length >= 6;
  const completados = [nombreOk, emailOk, passOk].filter(Boolean).length;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  }

  function validar() {
    const errs = {};
    if (!nombreOk) errs.nombre = "Ingresa el nombre completo.";
    if (!emailOk) errs.email = "Ingresa un email valido.";
    if (!passOk) errs.password = "La contrasena requiere minimo 6 caracteres.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validar()) return;

    setCreando(true);
    setServerError("");

    const { data, error } = await crearNutricionista({
      nombre: form.nombre.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      plan: form.plan,
    });

    if (error) {
      setServerError(error);
      setCreando(false);
      return;
    }

    toast.success(
      `Nutricionista "${data?.nombre || form.nombre}" creado correctamente`
    );
    setCreando(false);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={() => !creando && onClose()}
      title="Nuevo nutricionista"
      size="md"
      preventOverlayClose={creando}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Barra de progreso de 3 segmentos */}
        <div className="flex items-center gap-2 pb-1">
          <div className="flex-1 flex gap-1.5">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="h-1.5 flex-1 rounded-full bg-cream-darker overflow-hidden"
              >
                <motion.div
                  initial={false}
                  animate={{
                    width: completados > idx ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.25 }}
                  className="h-full bg-olive rounded-full"
                />
              </div>
            ))}
          </div>
          <span className="font-display text-[10px] text-muted flex items-center gap-1">
            {completados === 3 ? (
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-olive flex items-center gap-1 font-semibold"
              >
                <CheckCircle size={11} /> Listo
              </motion.span>
            ) : (
              `${completados}/3`
            )}
          </span>
        </div>

        <AdminField
          label="Nombre completo *"
          name="nombre"
          icon={User}
          value={form.nombre}
          onChange={handleChange}
          error={errors.nombre}
          maxLength={80}
          autoFocus
        />

        <AdminField
          label="Email profesional *"
          name="email"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <AdminField
          label="Contrasena inicial (min. 6 caracteres) *"
          name="password"
          type={verPassword ? "text" : "password"}
          icon={Lock}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          rightSlot={
            <button
              type="button"
              onClick={() => setVerPassword((v) => !v)}
              className="text-muted hover:text-olive-dark cursor-pointer"
              tabIndex={-1}
            >
              {verPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
        />

        {/* Selector interactivo de Plan */}
        <div>
          <div className="font-display text-[10px] uppercase tracking-wide text-muted mb-1.5">
            Plan de suscripcion inicial
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(planesConfig).map((p) => {
              const active = form.plan === p.key;
              return (
                <motion.button
                  key={p.key}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setForm((f) => ({ ...f, plan: p.key }))}
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

        {/* Error del servidor */}
        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-accent bg-accent/10 border border-accent/25 rounded-xl px-3 py-2 text-[11px] overflow-hidden"
            >
              <AlertCircle size={13} className="flex-shrink-0" />
              <span>{serverError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botones de accion */}
        <div className="flex gap-2 pt-1">
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={creando}
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
            disabled={creando}
            className="flex-1 py-2.5 rounded-xl bg-olive text-cream font-display
                        text-[11.5px] cursor-pointer hover:bg-olive-deep transition-colors
                        flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {creando ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                <UserPlus size={13} />
                Crear nutricionista
              </>
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
