import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";

const FORM_VACIO = {
  nombre: "",
  email: "",
  telefono: "",
  fecha_nacimiento: "",
};

// ── Validaciones ──────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL_RE = /^[+\d\s\-().]{6,20}$/;

function validar(form, original) {
  const errs = {};

  const nombre = form.nombre.trim();
  if (!nombre) errs.nombre = "El nombre es obligatorio.";
  else if (nombre.length < 2)
    errs.nombre = "El nombre debe tener al menos 2 caracteres.";
  else if (/\d/.test(nombre))
    errs.nombre = "El nombre no puede contener números.";

  const email = form.email.trim();
  if (!email) errs.email = "El mail es obligatorio.";
  else if (!EMAIL_RE.test(email))
    errs.email = "El mail no tiene un formato válido.";

  if (form.telefono?.trim() && !TEL_RE.test(form.telefono.trim()))
    errs.telefono = "El teléfono no es válido.";

  if (form.fecha_nacimiento) {
    const fecha = new Date(form.fecha_nacimiento);
    const hoy = new Date();
    const minFecha = new Date("1900-01-01");
    if (isNaN(fecha.getTime()))
      errs.fecha_nacimiento = "La fecha no es válida.";
    else if (fecha > hoy)
      errs.fecha_nacimiento = "La fecha de nacimiento no puede ser futura.";
    else if (fecha < minFecha)
      errs.fecha_nacimiento = "La fecha de nacimiento no es realista.";
  }

  if (original) {
    const sin_cambios =
      nombre === (original.nombre || "").trim() &&
      email === (original.email || "").trim() &&
      (form.telefono || "") === (original.telefono || "") &&
      (form.fecha_nacimiento || "") === (original.fecha_nacimiento || "");
    if (sin_cambios) errs._nochanges = "No realizaste ningún cambio.";
  }

  return errs;
}

/**
 * Formulario de alta y edición de paciente dentro de un Modal.
 * Incluye validación completa y reset al abrir/cerrar.
 */
export default function PatientForm({
  open,
  onClose,
  paciente = null,
  onGuardar,
}) {
  const esEdicion = !!paciente;

  const [form, setForm] = useState(FORM_VACIO);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Resetear el formulario cada vez que el modal abre o cambia el paciente
  useEffect(() => {
    if (open) {
      setForm(
        paciente
          ? {
              nombre: paciente.nombre || "",
              email: paciente.email || "",
              telefono: paciente.telefono || "",
              fecha_nacimiento: paciente.fecha_nacimiento || "",
            }
          : FORM_VACIO,
      );
      setErrors({});
    }
  }, [open, paciente]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (errors._nochanges)
      setErrors((prev) => ({ ...prev, _nochanges: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validar(form, esEdicion ? paciente : null);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error: err } = await onGuardar({
      nombre: form.nombre.trim(),
      email: form.email.trim().toLowerCase(),
      telefono: form.telefono.trim() || null,
      fecha_nacimiento: form.fecha_nacimiento || null,
    });
    setLoading(false);
    if (err) {
      setErrors({ _server: err.message || "Ocurrió un error al guardar." });
    } else {
      onClose();
    }
  }

  function handleClose() {
    if (!loading) onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={esEdicion ? "Editar paciente" : "Nuevo paciente"}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Nombre */}
        <div>
          <label className="label">Nombre completo *</label>
          <input
            name="nombre"
            className={`input ${errors.nombre ? "border-red-400 focus:ring-red-300/40" : ""}`}
            placeholder="Ej: María García"
            value={form.nombre}
            onChange={handleChange}
            autoFocus
          />
          {errors.nombre && (
            <p className="text-[10.5px] text-red-500 mt-1">{errors.nombre}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="label">Mail *</label>
          <input
            name="email"
            type="email"
            className={`input ${errors.email ? "border-red-400 focus:ring-red-300/40" : ""}`}
            placeholder="paciente@mail.com"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-[10.5px] text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Teléfono + Fecha de nac */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Teléfono</label>
            <input
              name="telefono"
              className={`input ${errors.telefono ? "border-red-400 focus:ring-red-300/40" : ""}`}
              placeholder="+54 9 11 ..."
              value={form.telefono}
              onChange={handleChange}
            />
            {errors.telefono && (
              <p className="text-[10.5px] text-red-500 mt-1">
                {errors.telefono}
              </p>
            )}
          </div>
          <div>
            <label className="label">Fecha de nacimiento</label>
            <input
              name="fecha_nacimiento"
              type="date"
              className={`input ${errors.fecha_nacimiento ? "border-red-400 focus:ring-red-300/40" : ""}`}
              value={form.fecha_nacimiento}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.fecha_nacimiento && (
              <p className="text-[10.5px] text-red-500 mt-1">
                {errors.fecha_nacimiento}
              </p>
            )}
          </div>
        </div>

        {/* Info invitación */}
        {!esEdicion && (
          <p className="text-[10.5px] text-muted bg-cream rounded-lg px-3 py-2 leading-relaxed">
            El paciente recibirá un mail de invitación para crear su cuenta.
          </p>
        )}

        {/* Errores globales */}
        {errors._nochanges && (
          <p className="text-[11px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
            {errors._nochanges}
          </p>
        )}
        {errors._server && (
          <p className="text-[11px] text-red-500 bg-red-50 rounded-lg px-3 py-2">
            {errors._server}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="btn-ghost flex-1 py-2.5"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex-1 py-2.5"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={13} className="animate-spin" />
                Guardando...
              </span>
            ) : esEdicion ? (
              "Guardar cambios"
            ) : (
              "Crear paciente"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
