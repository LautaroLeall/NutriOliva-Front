// NutriCuenta.jsx — Pagina de Cuenta del Nutricionista (/panel/cuenta)

import { Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ClipboardList,
  Activity,
  BookOpen,
  User,
  Award,
  ShieldCheck,
} from "lucide-react";
import NutriNavbar from "@/components/nutri/NutriNavbar";
import { useNutriCuenta } from "./cuenta/useNutriCuenta";
import { TiltStatCard } from "./cuenta/cuentaUtils";
import CuentaHeader from "./cuenta/CuentaHeader";
import TabPerfilConsultorio from "./cuenta/TabPerfilConsultorio";
import TabSuscripcionCupo from "./cuenta/TabSuscripcionCupo";
import TabSeguridadCuenta from "./cuenta/TabSeguridadCuenta";

const TABS = [
  { id: "perfil", label: "Mi perfil y consultorio", icon: User },
  { id: "suscripcion", label: "Suscripcion y cupo", icon: Award },
  { id: "seguridad", label: "Seguridad y sesion", icon: ShieldCheck },
];

export default function NutriCuenta() {
  const {
    navigate,
    nombre,
    email,
    signOut,
    loading,
    activeTab,
    setActiveTab,
    nutriData,
    planActualKey,
    planActual,
    planesMap,
    cupoBase,
    cupoMaximo,
    esIlimitado,
    porcentajeCupo,
    stats,
    nombreForm,
    setNombreForm,
    guardandoPerfil,
    handleGuardarPerfil,
    passNueva,
    setPassNueva,
    passConfirm,
    setPassConfirm,
    guardandoPass,
    handleCambiarPassword,
    recargar,
  } = useNutriCuenta();

  const registrosSemana = stats.comidasSemana + stats.actividadesSemana;

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <Toaster position="bottom-right" richColors />

      {/* Navbar unificado del Nutricionista */}
      <NutriNavbar subtitulo="Mi cuenta" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Banner superior de Perfil y Plan */}
        <CuentaHeader
          nombre={nombre}
          email={email}
          nutriData={nutriData}
          planActual={planActual}
          planActualKey={planActualKey}
          onRefresh={recargar}
          loading={loading}
        />

        {/* 4 Tarjetas KPI con 3D Tilt y CountUp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          <TiltStatCard
            label="Pacientes activos"
            value={stats.pacientesActivos}
            suffix={esIlimitado ? "ilimitado" : `/ ${cupoMaximo}`}
            sublabel={
              esIlimitado
                ? `${stats.pacientesTotal} registrados en total`
                : `${porcentajeCupo}% del cupo utilizado`
            }
            icon={Users}
            delay={0.08}
            progress={porcentajeCupo}
            alert={!esIlimitado && porcentajeCupo >= 90}
            onClick={() => setActiveTab("suscripcion")}
          />

          <TiltStatCard
            label="Planes nutricionales"
            value={stats.planesTotal}
            suffix={`(${stats.planesActivos} activos)`}
            sublabel="Versiones creadas para pacientes"
            icon={ClipboardList}
            delay={0.14}
          />

          <TiltStatCard
            label="Actividad (7 dias)"
            value={registrosSemana}
            suffix="registros"
            sublabel={`${stats.comidasSemana} comidas · ${stats.actividadesSemana} act.`}
            icon={Activity}
            delay={0.2}
          />

          <TiltStatCard
            label="Catalogo propio"
            value={stats.alimentosPropios}
            suffix="alimentos"
            sublabel={`+${stats.alimentosGlobales} globales disponibles`}
            icon={BookOpen}
            delay={0.26}
            onClick={() => navigate("/panel/catalogo")}
          />
        </div>

        {/* Barra de pestañas con indicador deslizable layoutId */}
        <div className="flex gap-1.5 bg-white rounded-2xl p-1.5 mb-6 border border-cream-darker shadow-sm">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`relative flex-1 py-2.5 px-3 rounded-xl font-display text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${active
                    ? "text-cream font-semibold"
                    : "text-muted hover:text-olive-dark"
                  }`}
              >
                {active && (
                  <motion.div
                    layoutId="nutri-cuenta-active-tab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-olive rounded-xl shadow-sm"
                  />
                )}
                <Icon size={14} className="relative z-10 flex-shrink-0" />
                <span className="relative z-10 truncate">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido animado segun pestaña */}
        <AnimatePresence mode="wait">
          {activeTab === "perfil" && (
            <TabPerfilConsultorio
              nombreForm={nombreForm}
              setNombreForm={setNombreForm}
              email={email}
              guardandoPerfil={guardandoPerfil}
              handleGuardarPerfil={handleGuardarPerfil}
              stats={stats}
              navigate={navigate}
            />
          )}

          {activeTab === "suscripcion" && (
            <TabSuscripcionCupo
              nutriData={nutriData}
              planActualKey={planActualKey}
              planActual={planActual}
              planesMap={planesMap}
              cupoBase={cupoBase}
              cupoMaximo={cupoMaximo}
              esIlimitado={esIlimitado}
              porcentajeCupo={porcentajeCupo}
              stats={stats}
            />
          )}

          {activeTab === "seguridad" && (
            <TabSeguridadCuenta
              passNueva={passNueva}
              setPassNueva={setPassNueva}
              passConfirm={passConfirm}
              setPassConfirm={setPassConfirm}
              guardandoPass={guardandoPass}
              handleCambiarPassword={handleCambiarPassword}
              email={email}
              signOut={signOut}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
