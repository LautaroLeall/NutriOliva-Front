// LoginForm.jsx — Formulario principal de inicio de sesion adaptable sin scroll
// Recibe handlers y estado del hook useLogin via props

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import LoginField from "./LoginField";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
  loading,
  onSubmit,
  onForgotPassword,
}) {
  return (
    <motion.div
      key="login-form"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="font-display font-bold text-[22px] sm:text-[26px] text-olive-dark leading-tight mb-1">
        Iniciar sesion
      </h1>
      <p className="text-[12.5px] sm:text-[13px] text-muted mb-5 sm:mb-7">
        Bienvenido de vuelta a NutriOliva.{" "}
        <Link
          to="/"
          className="text-olive underline underline-offset-2 hover:text-olive-dark transition-colors"
        >
          Ver sitio
        </Link>
      </p>

      <form onSubmit={onSubmit} className="space-y-3.5 sm:space-y-4">
        {/* Email */}
        <LoginField
          id="email"
          label="Mail"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        {/* Contrasena con toggle */}
        <LoginField
          id="password"
          label="Contrasena"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          rightEl={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
              }
              className="text-muted hover:text-olive-dark transition-colors p-1 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {/* Error */}
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
          disabled={loading}
          whileHover={!loading ? { scale: 1.015 } : {}}
          whileTap={!loading ? { scale: 0.985 } : {}}
          className="btn-primary w-full py-3 sm:py-3.5 text-[14px] mt-1.5 disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Ingresando...
            </span>
          ) : (
            "Iniciar sesion"
          )}
        </motion.button>
      </form>

      {/* Footer del formulario */}
      <div className="mt-4 sm:mt-5 flex items-center justify-between gap-2 flex-wrap">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-[12px] py-1 text-muted hover:text-olive-dark transition-colors cursor-pointer"
        >
          Olvidaste tu contrasena?
        </button>
        <span className="text-[12px] text-muted/40 hidden sm:inline">|</span>
        <Link
          to="/"
          className="text-[12px] py-1 text-muted hover:text-olive-dark transition-colors"
        >
          Volver al sitio
        </Link>
      </div>
    </motion.div>
  );
}
