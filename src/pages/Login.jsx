// Login.jsx — Orquestador del login split-screen fijo sin scroll de pagina
// Toda la logica de auth esta en useLogin

import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { useLogin } from "@/hooks/useLogin";
import LoginLeftPanel from "./login/LoginLeftPanel";
import LoginForm from "./login/LoginForm";
import LoginResetForm from "./login/LoginResetForm";
import LoginResetSuccess from "./login/LoginResetSuccess";

export default function Login() {
  const {
    // Estado login
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    setError,
    loading,
    mounted,
    // Estado reset
    modoReset,
    setModoReset,
    emailReset,
    setEmailReset,
    resetEnviado,
    // Handlers
    handleLogin,
    handleReset,
    volverAlLogin,
  } = useLogin();

  return (
    <div className="fixed inset-0 h-dvh-fixed w-full bg-[#E8E3D8] flex items-center justify-center p-3 sm:p-4 pt-safe pb-safe">
      <Toaster position="bottom-right" richColors />
      {/* Contenedor split-screen adaptable sin scroll externo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={mounted ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-[440px] lg:max-w-[860px] max-h-full flex flex-col lg:flex-row rounded-[24px] sm:rounded-[28px] overflow-hidden
                    shadow-[0_24px_68px_rgba(63,74,43,0.22)]"
      >
        {/* Panel izquierdo: cabecera compacta en movil + showcase en escritorio */}
        <LoginLeftPanel mounted={mounted} />

        {/* Panel derecho: formulario centrado */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-none no-scrollbar bg-white flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 lg:px-11 lg:py-9">
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
                onForgotPassword={() => {
                  setModoReset(true);
                  setError("");
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
