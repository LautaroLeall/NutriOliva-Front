// AdminAjustes.jsx — Configuracion real del Super Admin (perfil en Supabase, cambio de password, estado del servidor y edicion de planes)

import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Check,
  Loader2,
  Activity,
  RefreshCw,
  Download,
  Shield,
  CreditCard,
  Pencil,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  DEFAULT_PLANS,
  formatARS,
  exportarExcelNutricionistas,
  AdminField,
} from "./adminUtils";

export default function AdminAjustes({
  session,
  perfil,
  nutricionistas,
  planesConfig = DEFAULT_PLANS,
  pingMs,
  lastSync,
  medirLatencia,
  actualizarPerfilAdmin,
  refetchPerfil,
  cambiarPasswordAdmin,
  onAbrirPreciosPlanes,
}) {
  const [nombreAdmin, setNombreAdmin] = useState(perfil?.nombre || "");
  const [errNombre, setErrNombre] = useState("");
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [errPass, setErrPass] = useState("");
  const [guardandoPass, setGuardandoPass] = useState(false);

  const [probandoPing, setProbandoPing] = useState(false);

  useEffect(() => {
    if (perfil?.nombre) setNombreAdmin(perfil.nombre);
  }, [perfil?.nombre]);

  async function handleGuardarNombre(e) {
    e.preventDefault();
    if (!nombreAdmin.trim()) {
      setErrNombre("El nombre no puede estar vacio.");
      return;
    }
    setErrNombre("");
    setGuardandoPerfil(true);
    const { error } = await actualizarPerfilAdmin(
      session?.user?.id,
      nombreAdmin
    );
    if (!error) {
      await refetchPerfil?.();
    }
    setGuardandoPerfil(false);
    if (error) {
      toast.error("Error al guardar perfil: " + error);
    } else {
      toast.success("Nombre de administrador actualizado en Supabase");
    }
  }

  async function handleCambiarPass(e) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrPass("La nueva contrasena debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrPass("Las contrasenas no coinciden.");
      return;
    }
    setErrPass("");
    setGuardandoPass(true);
    const { error } = await cambiarPasswordAdmin(newPassword);
    setGuardandoPass(false);
    if (error) {
      toast.error("No se pudo actualizar la contrasena: " + error);
    } else {
      toast.success("Contrasena actualizada en Supabase Auth");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  async function handlePing() {
    setProbandoPing(true);
    const { ms, error } = await medirLatencia();
    setProbandoPing(false);
    if (error) {
      toast.error("Fallo al verificar conexion: " + error);
    } else {
      toast.success(`Conexion activa con Supabase (${ms} ms)`);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cuenta y Perfil del Super Admin */}
        <div className="border border-cream-darker rounded-xl p-4 bg-white space-y-4">
          <div className="flex items-center gap-2 border-b border-cream pb-3">
            <span className="w-7 h-7 rounded-lg bg-olive/12 flex items-center justify-center">
              <Shield size={14} className="text-olive" />
            </span>
            <div>
              <h3 className="font-display text-[13px] font-semibold text-olive-dark">
                Cuenta de Super Administrador
              </h3>
              <p className="text-[10.5px] text-muted">
                Sesion activa: {session?.user?.email || "admin@nutrioliva.com"}
              </p>
            </div>
          </div>

          <form onSubmit={handleGuardarNombre} className="space-y-3">
            <AdminField
              label="Nombre visible del administrador"
              name="nombreAdmin"
              icon={User}
              value={nombreAdmin}
              onChange={(e) => {
                setNombreAdmin(e.target.value);
                if (errNombre) setErrNombre("");
              }}
              error={errNombre}
              maxLength={80}
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={guardandoPerfil}
              className="w-full py-2.5 rounded-xl bg-olive text-cream font-display text-[11.5px]
                          flex items-center justify-center gap-1.5 hover:bg-olive-deep transition-colors
                          cursor-pointer disabled:opacity-60"
            >
              {guardandoPerfil ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Guardando cambios...
                </>
              ) : (
                <>
                  <Check size={13} />
                  Guardar nombre en perfil
                </>
              )}
            </motion.button>
          </form>

          {/* Cambio de contrasena */}
          <form
            onSubmit={handleCambiarPass}
            className="pt-3 border-t border-cream space-y-3"
          >
            <div className="text-[11px] font-display font-semibold text-olive-dark">
              Actualizar contrasena de acceso
            </div>

            <AdminField
              label="Nueva contrasena (min. 6 caracteres)"
              name="newPassword"
              type={verPass ? "text" : "password"}
              icon={Lock}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errPass) setErrPass("");
              }}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setVerPass((v) => !v)}
                  className="text-muted hover:text-olive-dark cursor-pointer"
                  tabIndex={-1}
                >
                  {verPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />

            <AdminField
              label="Confirmar nueva contrasena"
              name="confirmPassword"
              type={verPass ? "text" : "password"}
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errPass) setErrPass("");
              }}
              error={errPass}
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={guardandoPass}
              className="w-full py-2.5 rounded-xl bg-olive-dark text-cream font-display text-[11.5px]
                          flex items-center justify-center gap-1.5 hover:bg-olive transition-colors
                          cursor-pointer disabled:opacity-60"
            >
              {guardandoPass ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Lock size={12} />
                  Cambiar contrasena
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Estado del Sistema y Respaldo */}
        <div className="border border-cream-darker rounded-xl p-4 bg-[#FAF8F3] flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-cream-darker pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-olive/12 flex items-center justify-center">
                  <Activity size={14} className="text-olive" />
                </span>
                <div>
                  <h3 className="font-display text-[13px] font-semibold text-olive-dark">
                    Estado de Conexion y Base de Datos
                  </h3>
                  <p className="text-[10.5px] text-muted">
                    Monitoreo directo sobre Supabase PostgreSQL y Edge Functions
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-display">
                <span className="status-dot bg-success" />
                Online
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-cream-darker rounded-xl p-3">
                <div className="text-[9.5px] font-display uppercase tracking-wide text-muted">
                  Latencia Supabase
                </div>
                <div className="font-display text-[19px] font-semibold text-olive-dark mt-0.5">
                  {pingMs !== null ? `${pingMs} ms` : "—"}
                </div>
                <div className="text-[10px] text-success font-display">
                  Respuesta optima
                </div>
              </div>

              <div className="bg-white border border-cream-darker rounded-xl p-3">
                <div className="text-[9.5px] font-display uppercase tracking-wide text-muted">
                  Ultima sincronizacion
                </div>
                <div className="font-display text-[15px] font-semibold text-olive-dark mt-1">
                  {lastSync
                    ? lastSync.toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                    : "—"}
                </div>
                <div className="text-[10px] text-muted font-display mt-0.5">
                  Vista admin_nutricionistas_view
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={probandoPing}
              onClick={handlePing}
              className="w-full py-2.5 rounded-xl border border-cream-darker bg-white text-olive-dark
                          font-display text-[11.5px] flex items-center justify-center gap-1.5
                        hover:bg-cream transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={
                  probandoPing ? "animate-spin text-olive" : "text-olive"
                }
              />
              Probar conexion en vivo
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!nutricionistas?.length) {
                  toast.error("No hay datos para exportar.");
                  return;
                }
                exportarExcelNutricionistas(
                  nutricionistas,
                  "nutrioliva_padron_completo.xlsx",
                  planesConfig
                );
                toast.success("Padron completo exportado (.xlsx)");
              }}
              className="w-full py-2.5 rounded-xl bg-olive text-cream font-display text-[11.5px]
                          flex items-center justify-center gap-1.5 hover:bg-olive-deep transition-colors cursor-pointer"
            >
              <Download size={13} />
              Exportar padron completo (.xlsx)
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tarifario vigente configurado en la base de datos (Editable) */}
      <div className="border border-cream-darker rounded-xl p-4 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-olive" />
            <div>
              <h3 className="font-display text-[12.5px] font-semibold text-olive-dark">
                Esquema de planes, precios y limites vigentes
              </h3>
              <p className="text-[10.5px] text-muted">
                Valores sincronizados con la tabla planes_suscripcion en
                Supabase
              </p>
            </div>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAbrirPreciosPlanes}
            className="px-3 py-1.5 rounded-lg bg-olive text-cream font-display text-[10.5px]
                        flex items-center gap-1.5 hover:bg-olive-deep transition-colors cursor-pointer"
          >
            <Pencil size={11} />
            Modificar precios y cupos
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.values(planesConfig).map((p) => (
            <div
              key={p.key}
              onClick={onAbrirPreciosPlanes}
              className="border border-cream-darker rounded-xl p-3.5 bg-cream/50 hover:bg-cream transition-colors flex flex-col justify-between cursor-pointer group"
              title="Haz clic para modificar precio y cupo"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`badge badge-${p.key}`}>{p.label}</span>
                  <span className="font-display text-[10px] text-muted uppercase flex items-center gap-1 group-hover:text-olive">
                    Mensual <Pencil size={10} />
                  </span>
                </div>
                <div className="font-display text-[20px] font-semibold text-olive-dark">
                  {formatARS(p.price)}
                </div>
              </div>
              <div className="text-[11px] text-muted font-body mt-2 pt-2 border-t border-cream-darker">
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
