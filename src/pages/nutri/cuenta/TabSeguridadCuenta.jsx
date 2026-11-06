// TabSeguridadCuenta.jsx — Pestaña 3: Cambio de contrasena en Supabase Auth y estado de seguridad

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  Loader2,
  ShieldCheck,
  KeyRound,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { CuentaField, evaluarFortalezaPassword } from "./cuentaUtils";

export default function TabSeguridadCuenta({
  passNueva,
  setPassNueva,
  passConfirm,
  setPassConfirm,
  guardandoPass,
  handleCambiarPassword,
  email,
  signOut,
}) {
  const [verNueva, setVerNueva] = useState(false);
  const [verConfirm, setVerConfirm] = useState(false);

  const fortaleza = evaluarFortalezaPassword(passNueva);
  const coinciden =
    passConfirm.length > 0 && passNueva.length >= 6 && passNueva === passConfirm;
  const noCoinciden =
    passConfirm.length > 0 && passNueva !== passConfirm;

  return (
    <motion.div
      key="tab-seguridad"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-5"
    >
      {/* Columna izquierda: Actualizar contrasena */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-cream-darker p-5 shadow-card">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-cream">
          <div>
            <h3 className="font-display font-bold text-olive-dark text-[15px]">
              Actualizar contrasena
            </h3>
            <p className="text-[11px] text-muted mt-0.5">
              Define una nueva clave de acceso para tu cuenta profesional.
            </p>
          </div>
          <span className="w-8 h-8 rounded-xl bg-olive/10 text-olive flex items-center justify-center flex-shrink-0">
            <KeyRound size={15} />
          </span>
        </div>

        <form onSubmit={handleCambiarPassword} className="space-y-3.5" noValidate>
          <CuentaField
            label="Nueva contrasena (min. 6 caracteres) *"
            name="passNueva"
            type={verNueva ? "text" : "password"}
            icon={Lock}
            value={passNueva}
            onChange={(e) => setPassNueva(e.target.value)}
            rightSlot={
              <button
                type="button"
                onClick={() => setVerNueva((v) => !v)}
                className="text-muted hover:text-olive-dark cursor-pointer"
                tabIndex={-1}
              >
                {verNueva ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
          />

          {/* Medidor visual de fortaleza */}
          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((nivel) => (
                <div
                  key={nivel}
                  className="h-1.5 flex-1 rounded-full bg-cream-darker overflow-hidden"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      width: fortaleza.score >= nivel ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.2 }}
                    className={`h-full rounded-full ${fortaleza.color}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-display text-muted">
              <span>Seguridad de la clave</span>
              <span className="font-semibold text-olive-dark">
                {fortaleza.label}
              </span>
            </div>
          </div>

          <CuentaField
            label="Confirmar nueva contrasena *"
            name="passConfirm"
            type={verConfirm ? "text" : "password"}
            icon={Lock}
            value={passConfirm}
            onChange={(e) => setPassConfirm(e.target.value)}
            error={noCoinciden ? "Las contrasenas no coinciden." : ""}
            rightSlot={
              <button
                type="button"
                onClick={() => setVerConfirm((v) => !v)}
                className="text-muted hover:text-olive-dark cursor-pointer"
                tabIndex={-1}
              >
                {verConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
          />

          {coinciden && (
            <div className="flex items-center gap-1.5 text-[11px] font-display text-olive">
              <CheckCircle2 size={13} />
              Las contrasenas coinciden y cumplen los requisitos.
            </div>
          )}

          <div className="pt-1">
            <motion.button
              type="submit"
              disabled={guardandoPass}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-xl bg-olive text-cream hover:bg-olive-deep font-display text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            >
              {guardandoPass ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Actualizando clave...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Guardar nueva contrasena
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      {/* Columna derecha: Proteccion de datos y sesion activa */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-cream-darker p-5 shadow-card flex flex-col justify-between space-y-4">
        <div className="space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-cream">
            <div>
              <h3 className="font-display font-bold text-olive-dark text-[15px]">
                Privacidad y sesion activa
              </h3>
              <p className="text-[11px] text-muted mt-0.5">
                Estado de proteccion de tu consultorio y datos clinicos.
              </p>
            </div>
            <span className="w-8 h-8 rounded-xl bg-olive/10 text-olive flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={15} />
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                title: "Aislamiento por Row Level Security (RLS)",
                desc: "Solo vos y cada paciente pueden acceder a sus planes, mediciones clinicas y registros diarios.",
              },
              {
                title: "Sesion autenticada con JWT",
                desc: `Conectado actualmente como ${email}.`,
              },
              {
                title: "Respaldo automatico en la nube",
                desc: "Todos los planes, alimentos del catalogo y evoluciones quedan resguardados en tiempo real.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-3 rounded-xl bg-[#FAF8F3] border border-cream-darker flex items-start gap-2.5"
              >
                <CheckCircle2
                  size={14}
                  className="text-olive flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-display text-[11.5px] font-semibold text-olive-dark">
                    {item.title}
                  </p>
                  <p className="text-[10.5px] text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-cream flex items-center justify-between gap-3">
          <span className="text-[11px] font-display text-muted">
            Queres cerrar tu sesion en este navegador?
          </span>
          <motion.button
            type="button"
            onClick={signOut}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="px-4 py-2 rounded-xl border border-accent/30 bg-accent/10 text-accent hover:bg-accent hover:text-white font-display text-[11.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
          >
            <LogOut size={13} />
            Cerrar sesion
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
