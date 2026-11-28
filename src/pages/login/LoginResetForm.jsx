// LoginResetForm.jsx — Formulario de recuperacion de contrasena adaptable sin scroll

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import LoginField from "./LoginField";

export default function LoginResetForm({
  emailReset,
  setEmailReset,
  error,
  setError,
  loading,
  onSubmit,
  onVolver,
}) {
  return (
    <motion.div
      key="reset-form"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="font-display font-bold text-[21px] sm:text-[24px] text-olive-dark leading-tight mb-1">
        Restablecer contrasena
      </h1>
      <p className="text-[12.5px] sm:text-[13px] text-muted mb-5 sm:mb-7">
        Ingresa tu mail y te enviamos un link para crear una nueva.
      </p>

      <form onSubmit={onSubmit} className="space-y-3.5 sm:space-y-4">
        <LoginField
          id="emailReset"
          label="Tu mail"
          type="email"
          inputMode="email"
          value={emailReset}
          onChange={(e) => {
            setEmailReset(e.target.value);
            setError("");
          }}
          autoComplete="email"
          required
        />

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              key="error-reset"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[12px] text-accent bg-accent-bg rounded-xl px-4 py-2.5"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 sm:py-3.5 text-[13.5px] mt-1.5 disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Enviando...
            </span>
          ) : (
            "Enviar link de recuperacion"
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={onVolver}
        className="mt-4 sm:mt-5 py-1 w-full text-center text-[12px] text-muted hover:text-olive-dark
                    transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft size={12} />
        Volver al inicio de sesion
      </button>
    </motion.div>
  );
}
