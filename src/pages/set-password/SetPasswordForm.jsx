// SetPasswordForm.jsx — Formulario de creacion/restablecimiento de contrasena
// Campos: nueva contrasena + confirmar, con toggle ver/ocultar en ambos
// Incluye: indicador de fortaleza, feedback en tiempo real, error animado, submit

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import LoginField from "@/pages/login/LoginField";
import PasswordStrength from "./PasswordStrength";

export default function SetPasswordForm({
  password,
  setPassword,
  confirm,
  setConfirm,
  showPass,
  setShowPass,
  showConf,
  setShowConf,
  error,
  setError,
  loading,
  sessionLista,
  tipoFlujo,
  noCoinciden,
  onSubmit,
}) {
  const isInvite = tipoFlujo === "invite";

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
    >
      {/* Encabezado */}
      <h1 className="font-display font-bold text-[26px] text-olive-dark mb-1">
        {isInvite ? "Crear contrasena" : "Nueva contrasena"}
      </h1>
      <p className="text-[13px] text-muted mb-8">
        {isInvite
          ? "Elige una contrasena para acceder a tu plan."
          : "Ingresa y confirma tu nueva contrasena."}
      </p>

      {/* Verificando sesion */}
      {!sessionLista && (
        <div
          className="flex items-center gap-2 text-muted text-[12px] mb-5
                        bg-cream/60 rounded-xl px-4 py-3"
        >
          <Loader2 size={13} className="animate-spin flex-shrink-0" />
          Verificando el link de acceso...
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Nueva contraseña */}
        <div>
          <LoginField
            id="password"
            label="Nueva contrasena"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            autoFocus
            autoComplete="new-password"
            required
            rightEl={
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="text-muted hover:text-olive-dark transition-colors p-0.5"
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
          {/* Barra de fortaleza + checklist */}
          <PasswordStrength password={password} />
        </div>

        {/* Confirmar contraseña */}
        <div>
          <LoginField
            id="confirm"
            label="Confirmar contrasena"
            type={showConf ? "text" : "password"}
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setError("");
            }}
            autoComplete="new-password"
            required
            rightEl={
              <button
                type="button"
                onClick={() => setShowConf((v) => !v)}
                className="text-muted hover:text-olive-dark transition-colors p-0.5"
                tabIndex={-1}
              >
                {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          {/* Feedback en tiempo real: coinciden? */}
          <AnimatePresence>
            {noCoinciden ? (
              <motion.p
                key="no-match"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-accent mt-1.5 ml-1"
              >
                Las contraseñas no coinciden
              </motion.p>
            ) : confirm.length > 0 ? (
              <motion.p
                key="match"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-success mt-1.5 ml-1"
              >
                Las contraseñas coinciden
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Error general */}
        <AnimatePresence>
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[12px] text-accent bg-accent-bg rounded-xl px-4 py-2.5"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading || !sessionLista}
          whileHover={!loading && sessionLista ? { scale: 1.015 } : {}}
          whileTap={!loading && sessionLista ? { scale: 0.985 } : {}}
          className="btn-primary w-full py-3.5 text-[14px] mt-2 disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Guardando...
            </span>
          ) : isInvite ? (
            "Crear mi cuenta"
          ) : (
            "Guardar nueva contrasena"
          )}
        </motion.button>
      </form>

      {/* Link a login */}
      <p className="mt-5 text-center text-[12px] text-muted">
        Ya tenes cuenta?{" "}
        <Link
          to="/login"
          className="text-olive underline underline-offset-2 hover:text-olive-dark transition-colors"
        >
          Iniciar sesion
        </Link>
      </p>
    </motion.div>
  );
}
