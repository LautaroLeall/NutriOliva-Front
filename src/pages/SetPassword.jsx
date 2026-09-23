import { motion, AnimatePresence } from "framer-motion";
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
    noCoinciden,
    handleSubmit,
  } = useSetPassword();

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
        {/* Panel izquierdo: branding + contenido segun flujo */}
        <SetPasswordLeft tipoFlujo={tipoFlujo} mounted={mounted} />

        {/* Panel derecho: formulario o pantalla de exito */}
        <div className="flex-1 bg-white flex flex-col justify-center px-8 py-10 lg:px-12">
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
