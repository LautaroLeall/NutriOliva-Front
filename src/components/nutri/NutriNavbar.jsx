// NutriNavbar.jsx — Barra de navegacion superior unificada y 100% responsiva para el Nutricionista
// Incluye:
// - Navegacion segmentada con layoutId (Pacientes | Catalogo | Mi cuenta)
// - Buscador rapido de pacientes (Quick Switcher + atajo Ctrl+K) para saltar a cualquier ficha o plan
// - Capsula de perfil profesional y boton de salida

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BookOpen,
  User,
  Search,
  LogOut,
  ArrowLeft,
  ClipboardList,
  ChevronRight,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/ui/Logo";

const NAV_LINKS = [
  { key: "pacientes", label: "Pacientes", path: "/panel", icon: Users },
  {
    key: "catalogo",
    label: "Catalogo",
    path: "/panel/catalogo",
    icon: BookOpen,
  },
  { key: "cuenta", label: "Mi cuenta", path: "/panel/cuenta", icon: User },
];

function obtenerIniciales(nombre = "") {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "NO";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

// Cache ligero en memoria para evitar parpadeos al navegar entre paginas del nutricionista
let cachedQuickData = {
  userId: null,
  pacientes: [],
  ts: 0,
};

export default function NutriNavbar({
  backTo = null,
  backLabel = "Volver",
  subtitulo = null,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, nombre, signOut } = useAuth();
  const userId = session?.user?.id;

  const [quickData, setQuickData] = useState(() =>
    cachedQuickData.userId === userId
      ? cachedQuickData
      : {
        userId: null,
        pacientes: [],
        ts: 0,
      }
  );
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [queryPac, setQueryPac] = useState("");
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Determinar pestaña activa segun la ruta actual
  const pathname = location.pathname;
  const activeKey = pathname.startsWith("/panel/catalogo")
    ? "catalogo"
    : pathname.startsWith("/panel/cuenta")
      ? "cuenta"
      : "pacientes";

  // Cargar lista rapida de pacientes para el buscador
  useEffect(() => {
    if (!userId) return;
    let cancelado = false;

    async function fetchQuickSummary() {
      const { data } = await supabase
        .from("pacientes")
        .select("id, nombre, email, estado")
        .eq("nutricionista_id", userId)
        .order("nombre", { ascending: true });

      if (cancelado) return;

      const nuevoEstado = {
        userId,
        pacientes: data || [],
        ts: Date.now(),
      };
      cachedQuickData = nuevoEstado;
      setQuickData(nuevoEstado);
    }

    fetchQuickSummary();
    return () => {
      cancelado = true;
    };
  }, [userId, pathname]);

  // Atajo de teclado Ctrl+K / Cmd+K y cierre con Escape o clic afuera
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setBuscadorAbierto((prev) => !prev);
      } else if (e.key === "Escape") {
        setBuscadorAbierto(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (buscadorAbierto) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    } else {
      setQueryPac("");
    }
  }, [buscadorAbierto]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setBuscadorAbierto(false);
      }
    }
    if (buscadorAbierto) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [buscadorAbierto]);

  const pacientesActivosCount = quickData.pacientes.filter(
    (p) => p.estado === "activo"
  ).length;

  const pacientesFiltrados = quickData.pacientes
    .filter((p) => {
      const q = queryPac.trim().toLowerCase();
      if (!q) return true;
      return (
        (p.nombre || "").toLowerCase().includes(q) ||
        (p.email || "").toLowerCase().includes(q)
      );
    })
    .slice(0, 8);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-cream-darker shadow-sm">
      {/* Fila principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Izquierda: Boton volver (opcional) + Logo + Subtitulo contextual */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {backTo && (
            <motion.button
              type="button"
              onClick={() => navigate(backTo)}
              whileHover={{ scale: 1.06, x: -2 }}
              whileTap={{ scale: 0.94 }}
              title={backLabel}
              className="w-8 h-8 rounded-xl bg-cream hover:bg-cream-darker text-olive-dark flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 border border-cream-darker"
            >
              <ArrowLeft size={15} />
            </motion.button>
          )}

          <button
            type="button"
            onClick={() => navigate("/panel")}
            className="flex items-center gap-2 font-display font-bold text-[15px] sm:text-base text-olive-dark cursor-pointer flex-shrink-0"
          >
            <Logo size={22} />
            <span>NutriOliva</span>
          </button>

          {subtitulo && (
            <div className="hidden lg:flex items-center gap-2 min-w-0">
              <span className="text-cream-darker">/</span>
              <span className="text-xs font-display font-medium text-muted truncate max-w-[160px]">
                {subtitulo}
              </span>
            </div>
          )}
        </div>

        {/* Centro (Desktop/Tablet md+): Selector animado con layoutId */}
        <nav
          aria-label="Navegacion principal del nutricionista"
          className="hidden md:flex items-center gap-1 bg-cream rounded-xl p-1 border border-cream-darker"
        >
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const active = activeKey === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                className={`relative px-3.5 py-1.5 rounded-lg font-display text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${active
                    ? "text-olive-dark font-semibold"
                    : "text-muted hover:text-olive-dark"
                  }`}
              >
                {active && (
                  <motion.div
                    layoutId="nutri-navbar-desktop-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-cream-darker/50"
                  />
                )}
                <Icon
                  size={13}
                  className={`relative z-10 flex-shrink-0 ${active ? "text-olive" : "text-muted"
                    }`}
                />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Derecha: Buscador rapido de pacientes + Insignia de Cupo + Perfil + Salir */}
        <div
          ref={searchContainerRef}
          className="relative flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
        >
          {/* Boton Buscador rapido de pacientes */}
          <button
            type="button"
            onClick={() => setBuscadorAbierto((o) => !o)}
            title="Buscar e ir a un paciente (Ctrl+K)"
            className={`h-9 px-2.5 sm:px-3 rounded-xl border text-xs font-display flex items-center gap-2 transition-colors cursor-pointer ${buscadorAbierto
                ? "bg-olive text-cream border-olive"
                : "bg-[#FAF8F3] hover:bg-cream text-muted hover:text-olive-dark border-cream-darker"
              }`}
          >
            <Search size={13} className="flex-shrink-0" />
            <span className="hidden xl:inline text-[11.5px]">
              Ir a paciente...
            </span>
            <kbd
              className={`hidden sm:inline-block text-[9.5px] px-1.5 py-0.5 rounded font-mono ${buscadorAbierto
                  ? "bg-white/20 text-cream"
                  : "bg-cream-darker/60 text-muted"
                }`}
            >
              Ctrl+K
            </kbd>
          </button>

          {/* Capsula de perfil del nutricionista */}
          <button
            type="button"
            onClick={() => navigate("/panel/cuenta")}
            title="Ir a Mi cuenta"
            className={`h-9 pl-1.5 pr-2 sm:pr-2.5 rounded-xl border flex items-center gap-2 transition-colors cursor-pointer ${activeKey === "cuenta"
                ? "bg-olive/12 border-olive/35 text-olive-dark"
                : "bg-white hover:bg-cream border-cream-darker text-olive-dark"
              }`}
          >
            <span className="w-6 h-6 rounded-lg bg-olive text-cream font-display font-bold text-[10px] flex items-center justify-center flex-shrink-0">
              {obtenerIniciales(nombre)}
            </span>
            <span className="hidden lg:inline font-display text-xs font-medium max-w-[120px] truncate">
              {nombre || "Profesional"}
            </span>
          </button>

          {/* Boton Cerrar sesion */}
          <motion.button
            type="button"
            onClick={signOut}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            title="Cerrar sesion"
            aria-label="Cerrar sesion"
            className="h-9 px-2.5 rounded-xl border border-cream-darker bg-white hover:bg-accent/10 hover:border-accent/30 text-muted hover:text-accent font-display text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline text-[11.5px]">Salir</span>
          </motion.button>

          {/* Desplegable de Busqueda Rapida de Pacientes */}
          <AnimatePresence>
            {buscadorAbierto && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-12 sm:w-80 md:w-96 bg-white rounded-2xl border border-cream-darker shadow-modal overflow-hidden z-50"
              >
                <div className="p-2.5 border-b border-cream flex items-center gap-2 bg-[#FAF8F3]">
                  <Search size={14} className="text-olive ml-1.5 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={queryPac}
                    onChange={(e) => setQueryPac(e.target.value)}
                    placeholder="Buscar paciente por nombre o email..."
                    className="w-full text-xs font-body text-olive-dark placeholder:text-muted/70 bg-transparent focus:outline-none"
                  />
                  {queryPac ? (
                    <button
                      type="button"
                      onClick={() => setQueryPac("")}
                      className="text-muted hover:text-olive-dark p-1 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  ) : null}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-cream">
                  {pacientesFiltrados.length === 0 ? (
                    <div className="py-6 px-4 text-center text-xs font-display text-muted">
                      {quickData.pacientes.length === 0
                        ? "Aun no tenes pacientes registrados."
                        : "No se encontraron pacientes con ese nombre."}
                    </div>
                  ) : (
                    pacientesFiltrados.map((p) => {
                      const esActivo = p.estado === "activo";
                      return (
                        <div
                          key={p.id}
                          className="px-3 py-2.5 hover:bg-cream/50 flex items-center justify-between gap-2 transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setBuscadorAbierto(false);
                              navigate(`/panel/pacientes/${p.id}`);
                            }}
                            className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer group"
                          >
                            <span className="w-7 h-7 rounded-full bg-olive/15 text-olive-dark font-display font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                              {obtenerIniciales(p.nombre)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="font-display font-semibold text-xs text-olive-dark group-hover:text-olive truncate flex items-center gap-1.5">
                                <span className="truncate">{p.nombre}</span>
                                {!esActivo && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cream-darker text-muted font-normal">
                                    Inactivo
                                  </span>
                                )}
                              </div>
                              <div className="text-[10.5px] text-muted truncate">
                                {p.email}
                              </div>
                            </div>
                          </button>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setBuscadorAbierto(false);
                                navigate(`/panel/pacientes/${p.id}/plan`);
                              }}
                              title="Ir directo al plan alimenticio"
                              className="px-2 py-1 rounded-lg bg-cream hover:bg-olive hover:text-cream text-olive-dark font-display text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <ClipboardList size={11} />
                              <span>Plan</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setBuscadorAbierto(false);
                                navigate(`/panel/pacientes/${p.id}`);
                              }}
                              title="Abrir ficha del paciente"
                              className="p-1 rounded-lg text-muted hover:text-olive-dark hover:bg-cream transition-colors cursor-pointer"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="px-3 py-2 bg-[#FAF8F3] border-t border-cream flex items-center justify-between text-[10px] font-display text-muted">
                  <span>
                    {pacientesActivosCount} pacientes activos en seguimiento
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setBuscadorAbierto(false);
                      navigate("/panel");
                    }}
                    className="text-olive font-semibold hover:underline cursor-pointer"
                  >
                    Ver todos
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Segunda fila exclusiva para pantallas moviles (< md): navegacion tactil completa sin romper renglones */}
      <div className="flex md:hidden items-center justify-between gap-1 px-3 py-1.5 bg-[#FAF8F3] border-t border-cream">
        <div className="flex flex-1 items-center gap-1 bg-cream rounded-xl p-1 border border-cream-darker">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const active = activeKey === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                className={`relative flex-1 py-1.5 px-2 rounded-lg font-display text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-0 ${active
                    ? "text-olive-dark font-semibold"
                    : "text-muted hover:text-olive-dark"
                  }`}
              >
                {active && (
                  <motion.div
                    layoutId="nutri-navbar-mobile-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  />
                )}
                <Icon
                  size={12}
                  className={`relative z-10 flex-shrink-0 ${active ? "text-olive" : "text-muted"
                    }`}
                />
                <span className="relative z-10 truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
