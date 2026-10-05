// useCatalogoPage.js — Toda la lógica del panel Catalogo
// Estado: busqueda, filtroKcal, pagina, modal, form, errors, confirm
// Handlers: onBusqueda, onFiltroKcal, abrirNuevo, abrirEdicion, handleChange, handleGuardar, handleEliminar

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCatalogo } from "@/hooks/useCatalogo";
import { FORM_VACIO, FILTROS_KCAL, POR_PAGINA } from "./catalogoConstants";
import { validar } from "./catalogoUtils";

export function useCatalogoPage() {
  const navigate = useNavigate();
  const { alimentos, loading, error, agregarAlimento, editarAlimento, eliminarAlimento } = useCatalogo();

  // ── Filtros y paginación ─────────────────────────────────────────────────
  const [busqueda, setBusqueda] = useState("");
  const [filtroKcal, setFiltroKcal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);

  const rango = FILTROS_KCAL[filtroKcal];
  const filtrados = useMemo(() =>
    alimentos.filter((a) => {
      const matchBusqueda = a.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchKcal = a.calorias_por_unidad >= rango.min && a.calorias_por_unidad <= rango.max;
      return matchBusqueda && matchKcal;
    }),
    [alimentos, busqueda, filtroKcal]
  );

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);
  const hayFiltros = !!(busqueda || filtroKcal !== 0);

  function onBusqueda(v) { setBusqueda(v); setPagina(1); }
  function onFiltroKcal(i) { setFiltroKcal(i); setPagina(1); }

  // ── Modal alta/edición ───────────────────────────────────────────────────
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [errors, setErrors] = useState({});
  const [guardando, setGuardando] = useState(false);

  function abrirNuevo() {
    setEditando(null);
    setForm(FORM_VACIO);
    setErrors({});
    setModalAbierto(true);
  }

  function abrirEdicion(a) {
    setEditando(a);
    setForm({
      nombre: a.nombre || "",
      calorias_por_unidad: a.calorias_por_unidad?.toString() || "",
      proteinas_g: a.proteinas_g?.toString() || "",
      carbos_g: a.carbos_g?.toString() || "",
      grasas_g: a.grasas_g?.toString() || "",
      unidad: a.unidad || "g",
    });
    setErrors({});
    setModalAbierto(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleGuardar(e) {
    e.preventDefault();
    const errs = validar(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setGuardando(true);
    const res = editando
      ? await editarAlimento(editando.id, form)
      : await agregarAlimento(form);
    setGuardando(false);
    if (res.error) {
      setErrors({ _server: res.error.message || "Error al guardar." });
    } else {
      toast.success(editando ? "Alimento actualizado." : "Alimento agregado al catalogo.");
      setModalAbierto(false);
    }
  }

  // ── Confirm eliminar ─────────────────────────────────────────────────────
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  async function handleEliminar() {
    if (!confirmEliminar) return;
    setEliminando(true);
    const { error: e } = await eliminarAlimento(confirmEliminar.id);
    setEliminando(false);
    if (e) toast.error("Error al eliminar el alimento.");
    else toast.success(`"${confirmEliminar.nombre}" eliminado del catalogo.`);
    setConfirmEliminar(null);
  }

  return {
    // datos
    alimentos, loading, error,
    // filtros + paginacion
    busqueda, filtroKcal, pagina, setPagina,
    filtrados, visibles, totalPaginas, paginaActual,
    hayFiltros, searchFocused, setSearchFocused,
    onBusqueda, onFiltroKcal,
    // modal
    modalAbierto, setModalAbierto,
    editando, form, errors, guardando,
    abrirNuevo, abrirEdicion, handleChange, handleGuardar,
    // confirm eliminar
    confirmEliminar, setConfirmEliminar,
    eliminando, handleEliminar,
    // navegacion
    navigate,
  };
}
