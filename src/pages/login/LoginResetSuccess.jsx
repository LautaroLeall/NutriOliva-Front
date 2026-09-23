// LoginResetSuccess.jsx — Pantalla de confirmacion de reset enviado

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function LoginResetSuccess({ emailReset, onVolver }) {
  return (
    <motion.div
      key="reset-ok"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="text-center space-y-4"
    >
      {/* Icono de exito */}
      <div className="w-14 h-14 rounded-full bg-olive/10 flex items-center justify-center mx-auto mb-2">
        <span className="text-olive font-bold text-xl">✓</span>
      </div>

      <h1 className="font-display font-bold text-[22px] text-olive-dark">
        Revisa tu correo
      </h1>

      <p className="text-[13px] text-muted leading-relaxed max-w-xs mx-auto">
        Enviamos un link para restablecer tu contrasena a{" "}
        <span className="font-semibold text-olive-dark">{emailReset}</span>. Si
        no lo ves, revisa la carpeta de spam.
      </p>

      <button
        type="button"
        onClick={onVolver}
        className="mt-4 btn-ghost w-full py-3 flex items-center justify-center gap-2 text-[13px]"
      >
        <ArrowLeft size={14} />
        Volver al inicio de sesion
      </button>
    </motion.div>
  );
}
