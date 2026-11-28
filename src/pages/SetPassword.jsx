import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { useSetPassword } from "@/hooks/useSetPassword";
import SetPasswordLeft from "./set-password/SetPasswordLeft";
import SetPasswordForm from "./set-password/SetPasswordForm";
import SetPasswordSuccess from "./set-password/SetPasswordSuccess";

export default function SetPassword() {
  const {
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
    listo,
    mounted,
    tipoFlujo,
    sessionLista,
    linkInvalido,
    noCoinciden,
    handleSubmit,
  } = useSetPassword();

  return (
    <div className="fixed inset-0 h-dvh-fixed w-full bg-[#E8E3D8] flex items-center justify-center p-3 sm:p-4 pt-safe pb-safe">
      <Toaster position="bottom-right" richColors />
      {/* Contenedor split-screen fijo sin scroll de pagina */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={mounted ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-[440px] lg:max-w-[860px] max-h-full flex flex-col lg:flex-row rounded-[24px] sm:rounded-[28px] overflow-hidden
                    shadow-[0_24px_68px_rgba(63,74,43,0.22)]"
      >
        {/* Panel izquierdo: cabecera compacta en movil + branding en escritorio */}
        <SetPasswordLeft tipoFlujo={tipoFlujo} mounted={mounted} />

        {/* Panel derecho: formulario o pantalla de exito */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-none no-scrollbar bg-white flex flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 lg:px-11 lg:py-9">
          <AnimatePresence mode="wait">
            {listo ? (
              <SetPasswordSuccess key="success" tipoFlujo={tipoFlujo} />
            ) : (
              <SetPasswordForm
                key="form"
                password={password}
                setPassword={setPassword}
                confirm={confirm}
                setConfirm={setConfirm}
                showPass={showPass}
                setShowPass={setShowPass}
                showConf={showConf}
                setShowConf={setShowConf}
                error={error}
                setError={setError}
                loading={loading}
                sessionLista={sessionLista}
                linkInvalido={linkInvalido}
                tipoFlujo={tipoFlujo}
                noCoinciden={noCoinciden}
                onSubmit={handleSubmit}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
