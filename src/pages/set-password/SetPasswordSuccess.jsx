// SetPasswordSuccess.jsx — Pantalla de exito tras crear/restablecer la contrasena
// Muestra un check animado con spring + barra de progreso de redireccion

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function SetPasswordSuccess({ tipoFlujo }) {
  const isInvite = tipoFlujo === "invite";

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-4"
    >
      {/* Icono con animacion spring */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-5"
      >
        <CheckCircle size={32} className="text-success" />
      </motion.div>

      <h1 className="font-display font-bold text-[22px] text-olive-dark mb-2">
        {isInvite ? "Cuenta creada" : "Contrasena actualizada"}
      </h1>

      <p className="text-[13px] text-muted mb-1">
        {isInvite
          ? "Tu cuenta esta lista. Ingresando a tu plan..."
          : "Cambio guardado con exito. Redirigiendo..."}
      </p>

      {/* Barra de progreso de redireccion */}
      <div className="mt-5 h-1 bg-cream-darker rounded-full overflow-hidden max-w-[200px] mx-auto">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.2, ease: "linear" }}
          className="h-full bg-olive rounded-full"
        />
      </div>

      <p className="mt-3 text-[11px] text-muted/60">
        Seras redirigido automaticamente...
      </p>
    </motion.div>
  );
}
