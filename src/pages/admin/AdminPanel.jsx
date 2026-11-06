// AdminPanel.jsx — Orquestador principal del Super Admin en pantalla completa (Sidebar fijo + Panel derecho desplazable)

import { useState } from "react";
import { LogOut, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import Logo from "@/components/ui/Logo";
import { NAV_ITEMS, initials } from "./panel/adminUtils";
import AdminNutricionistas from "./panel/AdminNutricionistas";
import AdminFacturacion from "./panel/AdminFacturacion";
import AdminMetricas from "./panel/AdminMetricas";
import AdminAjustes from "./panel/AdminAjustes";
import {
  ModalNuevoNutri,
  ModalEditarNutri,
  ModalPacientesNutri,
  ModalEditarPlanes,
} from "./panel/AdminModals";

const SECTION_HEADERS = {
  Nutricionistas: {
    title: "Directorio y gestion de profesionales",
    subtitle:
      "Administra cuentas, planes de suscripcion, cartera de pacientes y capacidad operativa.",
  },
  Facturacion: {
    title: "Facturacion y suscripciones",
    subtitle:
      "Monitoreo de ingresos recurrentes (MRR/ARR), precios de planes, estados de cobro y reportes.",
  },
  Metricas: {
    title: "Analitica, rendimiento y consumo de IA",
    subtitle:
      "Indicadores clave de adopcion, retencion, consumo de inteligencia artificial y base de usuarios.",
  },
  Ajustes: {
    title: "Ajustes de administracion y sistema",
    subtitle:
      "Configuracion de cuenta Super Admin, diagnostico de conexion en vivo y esquema tarifario.",
  },
};

export default function AdminPanel() {
  const { session, perfil, signOut, refetchPerfil } = useAuth();
  const {
    nutricionistas,
    planesConfig,
    pacientesAll,
    registrosComida,
    perfiles,
    catalogoCount,
    pingMs,
    lastSync,
    loading,
    error,
    cambiarEstado,
    actualizarNutricionista,
    actualizarCupoExtra,
    cambiarEstadoPacienteAdmin,
    actualizarPlanesSuscripcion,
    crearNutricionista,
    actualizarPerfilAdmin,
    cambiarPasswordAdmin,
    medirLatencia,
    refetch,
  } = useAdmin();

  const [activeNav, setActiveNav] = useState("Nutricionistas");
  const [modalNuevoOpen, setModalNuevoOpen] = useState(false);
  const [editingNutri, setEditingNutri] = useState(null);
  const [pacientesNutriId, setPacientesNutriId] = useState(null);
  const [modalPlanesOpen, setModalPlanesOpen] = useState(false);

  const headerInfo =
    SECTION_HEADERS[activeNav] || SECTION_HEADERS.Nutricionistas;

  // Nutricionista seleccionado para gestionar pacientes/cupo (siempre sincronizado con la lista viva)
  const nutriParaPacientes = pacientesNutriId
    ? nutricionistas.find((n) => n.id === pacientesNutriId) || null
    : null;

  async function handleRefresh() {
    await refetch();
    toast.success("Datos sincronizados con Supabase");
  }

  const adminNombre = perfil?.nombre || "Administrador";
  const adminEmail = session?.user?.email || "";

  return (
    <div className="min-h-screen md:h-screen w-full bg-[#F4F0E6] flex flex-col md:flex-row md:overflow-hidden">
      <Toaster position="bottom-right" richColors />

      {/* Sidebar fijo a la izquierda en desktop y barra superior compacta en mobile */}
      <aside className="w-full md:w-60 lg:w-64 md:h-screen flex-shrink-0 bg-olive-dark flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#55613A]/60 z-30 select-none">
        <div>
          {/* Cabecera del Sidebar */}
          <div className="flex items-center justify-between gap-2.5 px-4 sm:px-5 py-4 md:py-5 border-b border-[#55613A]/70">
            <div className="flex items-center gap-2.5 min-w-0">
              <Logo size={26} />
              <div className="min-w-0">
                <div className="font-display font-semibold text-cream text-[14px] leading-tight truncate">
                  NutriOliva
                </div>
                <div className="text-[9px] text-[#9AA37D] uppercase tracking-wider mt-0.5">
                  Super Admin
                </div>
              </div>
            </div>

            {/* Boton salir visible en mobile dentro de la barra superior */}
            <button
              type="button"
              onClick={signOut}
              className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[#C9D3AC] hover:bg-[#4A5633] hover:text-cream font-display text-[11px] transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              <span>Salir</span>
            </button>
          </div>

          {/* Navegacion principal */}
          <nav className="px-2.5 sm:px-3.5 py-2.5 md:py-4 flex md:flex-col gap-1.5 overflow-x-auto">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = activeNav === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveNav(id)}
                  className={`relative flex-1 md:flex-initial md:w-full flex items-center justify-center md:justify-start gap-2.5 px-3.5 py-2.5 rounded-xl text-left
                              font-display text-[12px] transition-colors cursor-pointer whitespace-nowrap
                              ${isActive
                      ? "text-cream font-semibold"
                      : "text-[#C9D3AC] hover:bg-[#4A5633]/60"
                    }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="admin-sidebar-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-xl bg-olive shadow-sm"
                    />
                  )}
                  <Icon size={14} className="relative z-10 flex-shrink-0" />
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pie del Sidebar fijo en desktop */}
        <div className="hidden md:block px-4 py-4 border-t border-[#55613A]/60">
          <div className="flex items-center gap-2.5 px-1 pb-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-olive text-cream font-display font-bold text-[11px] flex items-center justify-center flex-shrink-0">
              {initials(adminNombre)}
            </div>
            <div className="min-w-0">
              <div className="text-[11.5px] font-display font-semibold text-cream truncate">
                {adminNombre}
              </div>
              <div className="text-[10px] text-[#9AA37D] truncate">
                {adminEmail}
              </div>
            </div>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={signOut}
            className="w-full text-[#C9D3AC] font-display text-[11.5px] py-2 rounded-xl
                      bg-[#364024] hover:bg-[#4A5633] hover:text-cream transition-colors
                        flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut size={13} />
            Cerrar sesion
          </motion.button>
        </div>
      </aside>

      {/* Panel derecho: ocupa el 100% restante y hace scroll independiente segun su contenido */}
      <main className="flex-1 min-w-0 md:h-screen md:overflow-y-auto flex flex-col">
        {/* Cabecera superior fija dentro del area derecha */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-cream-darker px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="min-w-0">
            <h1 className="font-display text-lg sm:text-xl font-bold text-olive-dark truncate">
              {headerInfo.title}
            </h1>
            <p className="font-editorial italic text-muted text-xs sm:text-[13px] mt-0.5 truncate">
              {headerInfo.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {pingMs !== null && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream border border-cream-darker text-[10.5px] font-display text-muted">
                <span className="status-dot bg-success" />
                {pingMs} ms
              </span>
            )}

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleRefresh}
              disabled={loading}
              title="Sincronizar con Supabase"
              className="px-3.5 py-1.5 rounded-xl border border-cream-darker bg-cream/70
                        text-olive-dark font-display text-[11px] font-medium flex items-center gap-1.5
                        hover:bg-cream transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={loading ? "animate-spin text-olive" : "text-olive"}
              />
              Actualizar
            </motion.button>
          </div>
        </header>

        {/* Contenedor fluido de las vistas */}
        <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
          {/* Alerta de error de carga */}
          {error && (
            <div className="flex items-center gap-2 text-accent bg-accent/10 border border-accent/25 rounded-xl px-4 py-3 mb-5 text-xs font-display">
              <AlertCircle size={14} className="flex-shrink-0" />
              Error al consultar Supabase: {error}
            </div>
          )}

          {/* Vista activa animada */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeNav === "Nutricionistas" && (
                <AdminNutricionistas
                  nutricionistas={nutricionistas}
                  planesConfig={planesConfig}
                  loading={loading}
                  onAbrirNuevo={() => setModalNuevoOpen(true)}
                  onAbrirEdicion={(n) => setEditingNutri(n)}
                  onAbrirPacientes={(n) => setPacientesNutriId(n.id)}
                  onAbrirPreciosPlanes={() => setModalPlanesOpen(true)}
                  cambiarEstado={cambiarEstado}
                />
              )}

              {activeNav === "Facturacion" && (
                <AdminFacturacion
                  nutricionistas={nutricionistas}
                  planesConfig={planesConfig}
                  loading={loading}
                  cambiarEstado={cambiarEstado}
                  onAbrirEdicion={(n) => setEditingNutri(n)}
                  onAbrirPreciosPlanes={() => setModalPlanesOpen(true)}
                />
              )}

              {activeNav === "Metricas" && (
                <AdminMetricas
                  nutricionistas={nutricionistas}
                  planesConfig={planesConfig}
                  pacientesAll={pacientesAll}
                  registrosComida={registrosComida}
                  perfiles={perfiles}
                  catalogoCount={catalogoCount}
                  loading={loading}
                />
              )}

              {activeNav === "Ajustes" && (
                <AdminAjustes
                  session={session}
                  perfil={perfil}
                  nutricionistas={nutricionistas}
                  planesConfig={planesConfig}
                  pingMs={pingMs}
                  lastSync={lastSync}
                  medirLatencia={medirLatencia}
                  actualizarPerfilAdmin={actualizarPerfilAdmin}
                  refetchPerfil={refetchPerfil}
                  cambiarPasswordAdmin={cambiarPasswordAdmin}
                  onAbrirPreciosPlanes={() => setModalPlanesOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modales sin scroll con labels flotantes */}
      <ModalNuevoNutri
        open={modalNuevoOpen}
        onClose={() => setModalNuevoOpen(false)}
        crearNutricionista={crearNutricionista}
        planesConfig={planesConfig}
      />

      <ModalEditarNutri
        nutricionista={editingNutri}
        onClose={() => setEditingNutri(null)}
        actualizarNutricionista={actualizarNutricionista}
        planesConfig={planesConfig}
      />

      <ModalPacientesNutri
        nutricionista={nutriParaPacientes}
        pacientesAll={pacientesAll}
        registrosComida={registrosComida}
        planesConfig={planesConfig}
        onClose={() => setPacientesNutriId(null)}
        actualizarCupoExtra={actualizarCupoExtra}
        cambiarEstadoPacienteAdmin={cambiarEstadoPacienteAdmin}
      />

      <ModalEditarPlanes
        open={modalPlanesOpen}
        onClose={() => setModalPlanesOpen(false)}
        planesConfig={planesConfig}
        actualizarPlanesSuscripcion={actualizarPlanesSuscripcion}
      />
    </div>
  );
}
