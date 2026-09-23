// Login.jsx — Orquestador del login split-screen
// Toda la logica de auth esta en useLogin
// Todos los elementos visuales estan en pages/login/

import { motion, AnimatePresence } from "framer-motion";
import { useLogin }          from "@/hooks/useLogin";
import LoginLeftPanel        from "./login/LoginLeftPanel";
import LoginForm             from "./login/LoginForm";
import LoginResetForm        from "./login/LoginResetForm";
import LoginResetSuccess     from "./login/LoginResetSuccess";

export default function Login() {
  const {
    // Estado login
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    error, setError,
    loading,
    mounted,
    // Estado reset
    modoReset, setModoReset,
    emailReset, setEmailReset,
    resetEnviado,
    // Handlers
    handleLogin,
    handleReset,
    volverAlLogin,
  } = useLogin();

  return (
    <div className="min-h-screen bg-[#E8E3D8] flex items-center justify-center p-4">
      {/* Contenedor split-screen */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={mounted ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="w-full max-w-[860px] flex flex-col lg:flex-row rounded-[28px] overflow-hidden
                   shadow-[0_32px_80px_rgba(63,74,43,0.22)]"
      >
        {/* Panel izquierdo: branding + slides */}
        <LoginLeftPanel mounted={mounted} />

        {/* Panel derecho: formulario */}
        <div className="flex-1 bg-white flex flex-col justify-center px-8 py-10 lg:px-12">
          <AnimatePresence mode="wait">
            {modoReset && resetEnviado ? (
              <LoginResetSuccess
                key="reset-ok"
                emailReset={emailReset}
                onVolver={volverAlLogin}
              />
            ) : modoReset ? (
              <LoginResetForm
                key="reset-form"
                emailReset={emailReset}
                setEmailReset={setEmailReset}
                error={error}
                setError={setError}
                loading={loading}
                onSubmit={handleReset}
                onVolver={volverAlLogin}
              />
            ) : (
              <LoginForm
                key="login-form"
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                error={error}
                loading={loading}
                onSubmit={handleLogin}
                onForgotPassword={() => { setModoReset(true); setError(""); }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
