import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import Logo from "@/components/ui/Logo";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { useCatalogo } from "@/hooks/useCatalogo";

const UNIDADES = ["g", "ml", "unidad", "porcion", "taza", "cda", "cdita"];

const FORM_VACIO = {
  nombre: "",
  calorias_por_unidad: "",
  proteinas_g: "",
  carbos_g: "",
  grasas_g: "",
  unidad: "g",
};

function validar(form) {
  const errs = {};
  if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio.";
  else if (form.nombre.trim().length < 2)
    errs.nombre = "El nombre debe tener al menos 2 caracteres.";

  if (!form.calorias_por_unidad)
    errs.calorias_por_unidad = "Las calorias son obligatorias.";
  else if (
    isNaN(Number(form.calorias_por_unidad)) ||
    Number(form.calorias_por_unidad) < 0
  )
    errs.calorias_por_unidad = "Ingresa un numero valido.";

  for (const campo of ["proteinas_g", "carbos_g", "grasas_g"]) {
    if (
      form[campo] !== "" &&
      (isNaN(Number(form[campo])) || Number(form[campo]) < 0)
    )
      errs[campo] = "Debe ser un numero positivo.";
  }
  return errs;
}

export default function Catalogo() {
  const navigate = useNavigate();
  const {
    alimentos,
    loading,
    error,
    agregarAlimento,
    editarAlimento,
    eliminarAlimento,
  } = useCatalogo();

  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [errors, setErrors] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const filtrados = alimentos.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  function abrirNuevo() {
    setEditando(null);
    setForm(FORM_VACIO);
    setErrors({});
    setModalAbierto(true);
  }

  function abrirEdicion(alimento) {
    setEditando(alimento);
    setForm({
      nombre: alimento.nombre || "",
      calorias_por_unidad: alimento.calorias_por_unidad?.toString() || "",
      proteinas_g: alimento.proteinas_g?.toString() || "",
      carbos_g: alimento.carbos_g?.toString() || "",
      grasas_g: alimento.grasas_g?.toString() || "",
      unidad: alimento.unidad || "g",
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
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setGuardando(true);

    const res = editando
      ? await editarAlimento(editando.id, form)
      : await agregarAlimento(form);

    setGuardando(false);
    if (res.error) {
      setErrors({ _server: res.error.message || "Error al guardar." });
    } else {
      toast.success(
        editando ? "Alimento actualizado." : "Alimento agregado al catalogo.",
      );
      setModalAbierto(false);
    }
  }

  async function handleEliminar() {
    if (!confirmEliminar) return;
    setEliminando(true);
    const { error: e } = await eliminarAlimento(confirmEliminar.id);
    setEliminando(false);
    if (e) toast.error("Error al eliminar el alimento.");
    else toast.success(`"${confirmEliminar.nombre}" eliminado del catalogo.`);
    setConfirmEliminar(null);
  }

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <Toaster position="bottom-right" richColors />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-3.5 bg-white border-b border-cream-darker">
        <div className="flex items-center gap-2 font-display font-bold text-base text-olive-dark">
          <Logo size={22} />
          NutriOliva
        </div>
        <button
          onClick={() => navigate("/panel")}
          className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          <ArrowLeft size={12} />
          Volver a pacientes
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-display text-xl text-olive-dark">
              Catalogo de alimentos
            </h2>
            <p className="text-xs text-muted mt-0.5">
              {alimentos.length > 0
                ? `${alimentos.length} alimento${alimentos.length !== 1 ? "s" : ""} en tu catalogo`
                : "Gestioná los alimentos disponibles para tus pacientes"}
            </p>
          </div>
          <button
            onClick={abrirNuevo}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Plus size={14} />
            Agregar alimento
          </button>
        </div>

        <div className="card overflow-hidden">
          {/* Buscador */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-cream-darker bg-cream">
            <Search size={14} className="text-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="flex-1 bg-transparent text-sm font-body text-olive-dark placeholder-muted/60 focus:outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Estados */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-14 text-muted">
              <Loader2 size={16} className="animate-spin" />
              <span className="font-display text-sm">Cargando catalogo...</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-2 px-5 py-4 text-red-500 text-sm">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {!loading && !error && alimentos.length === 0 && (
            <EmptyState
              icon={Plus}
              title="Tu catalogo esta vacio"
              description="Agrega alimentos para que tus pacientes puedan buscarlos al registrar comidas."
              action={
                <button
                  onClick={abrirNuevo}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <Plus size={14} />
                  Agregar primer alimento
                </button>
              }
            />
          )}

          {!loading &&
            !error &&
            alimentos.length > 0 &&
            filtrados.length === 0 && (
              <EmptyState
                icon={Search}
                title="Sin resultados"
                description={`No encontramos alimentos con "${busqueda}".`}
              />
            )}

          {!loading && !error && filtrados.length > 0 && (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {[
                    "Alimento",
                    "Kcal",
                    "Prot.",
                    "Carbos",
                    "Grasas",
                    "Unidad",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="bg-white text-muted font-display text-[9.5px] uppercase tracking-wide text-left px-5 py-2.5 border-b border-cream-dark"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-cream last:border-0 hover:bg-cream/40 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="font-medium text-olive-dark text-sm">
                        {a.nombre}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-olive-dark font-semibold">
                      {a.calorias_por_unidad}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">
                      {a.proteinas_g != null ? `${a.proteinas_g}g` : "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">
                      {a.carbos_g != null ? `${a.carbos_g}g` : "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">
                      {a.grasas_g != null ? `${a.grasas_g}g` : "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">{a.unidad}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => abrirEdicion(a)}
                          className="p-1.5 rounded-lg hover:bg-cream text-muted hover:text-olive-dark transition-colors"
                          title="Editar"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setConfirmEliminar(a)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal alta/edicion */}
      <Modal
        open={modalAbierto}
        onClose={() => !guardando && setModalAbierto(false)}
        title={editando ? "Editar alimento" : "Agregar alimento"}
      >
        <form onSubmit={handleGuardar} className="space-y-4" noValidate>
          {/* Nombre */}
          <div>
            <label className="label">Nombre *</label>
            <input
              name="nombre"
              className={`input ${errors.nombre ? "border-red-400 focus:ring-red-300/40" : ""}`}
              placeholder="Ej: Pechuga de pollo"
              value={form.nombre}
              onChange={handleChange}
              autoFocus
            />
            {errors.nombre && (
              <p className="text-[10.5px] text-red-500 mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* Calorias + Unidad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Calorias (kcal) *</label>
              <input
                name="calorias_por_unidad"
                type="number"
                min="0"
                step="0.1"
                className={`input ${errors.calorias_por_unidad ? "border-red-400 focus:ring-red-300/40" : ""}`}
                placeholder="Ej: 165"
                value={form.calorias_por_unidad}
                onChange={handleChange}
              />
              {errors.calorias_por_unidad && (
                <p className="text-[10.5px] text-red-500 mt-1">
                  {errors.calorias_por_unidad}
                </p>
              )}
            </div>
            <div>
              <label className="label">Unidad</label>
              <select
                name="unidad"
                className="input"
                value={form.unidad}
                onChange={handleChange}
              >
                {UNIDADES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Macros (opcionales) */}
          <p className="text-[9.5px] font-display text-muted uppercase tracking-wide">
            Macros — opcionales
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "proteinas_g", label: "Proteinas (g)" },
              { name: "carbos_g", label: "Carbos (g)" },
              { name: "grasas_g", label: "Grasas (g)" },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="label">{label}</label>
                <input
                  name={name}
                  type="number"
                  min="0"
                  step="0.1"
                  className={`input ${errors[name] ? "border-red-400 focus:ring-red-300/40" : ""}`}
                  placeholder="0"
                  value={form[name]}
                  onChange={handleChange}
                />
                {errors[name] && (
                  <p className="text-[10.5px] text-red-500 mt-1">
                    {errors[name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {errors._server && (
            <p className="text-[11px] text-red-500 bg-red-50 rounded-lg px-3 py-2">
              {errors._server}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setModalAbierto(false)}
              disabled={guardando}
              className="btn-ghost flex-1 py-2.5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 py-2.5"
              disabled={guardando}
            >
              {guardando ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={13} className="animate-spin" />
                  Guardando...
                </span>
              ) : editando ? (
                "Guardar cambios"
              ) : (
                "Agregar al catalogo"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ConfirmDialog eliminar */}
      <ConfirmDialog
        open={!!confirmEliminar}
        onClose={() => setConfirmEliminar(null)}
        onConfirm={handleEliminar}
        title="Eliminar alimento"
        message={`Eliminas "${confirmEliminar?.nombre}" del catalogo. Los registros de comida existentes no se veran afectados.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={eliminando}
      />
    </div>
  );
}
