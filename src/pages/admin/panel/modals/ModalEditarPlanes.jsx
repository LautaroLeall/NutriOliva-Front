// ModalEditarPlanes.jsx — Modal para configurar precios y cupos de los planes Starter, Pro y Clinic

import { useState, useEffect } from "react";
import { Users, DollarSign, Check, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import { DEFAULT_PLANS, AdminField } from "../adminUtils";

export function ModalEditarPlanes({
  open,
  onClose,
  planesConfig = DEFAULT_PLANS,
  actualizarPlanesSuscripcion,
}) {
  const [form, setForm] = useState({
    starterPrice: "75000",
    starterCupo: "15",
    proPrice: "125000",
    proCupo: "50",
    clinicPrice: "150000",
  });
  const [errors, setErrors] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (open && planesConfig) {
      setForm({
        starterPrice: String(planesConfig.starter?.price ?? 75000),
        starterCupo: String(planesConfig.starter?.patients ?? 15),
        proPrice: String(planesConfig.pro?.price ?? 125000),
        proCupo: String(planesConfig.pro?.patients ?? 50),
        clinicPrice: String(planesConfig.clinic?.price ?? 150000),
      });
      setErrors({});
      setGuardando(false);
    }
  }, [open, planesConfig]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validar() {
    const errs = {};
    if (!form.starterPrice || Number(form.starterPrice) <= 0)
      errs.starterPrice = "Ingresa un precio valido.";
    if (!form.starterCupo || Number(form.starterCupo) <= 0)
      errs.starterCupo = "Cupo invalido.";
    if (!form.proPrice || Number(form.proPrice) <= 0)
      errs.proPrice = "Ingresa un precio valido.";
    if (!form.proCupo || Number(form.proCupo) <= 0)
      errs.proCupo = "Cupo invalido.";
    if (!form.clinicPrice || Number(form.clinicPrice) <= 0)
      errs.clinicPrice = "Ingresa un precio valido.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validar()) return;

    setGuardando(true);
    const { error } = await actualizarPlanesSuscripcion({
      starter: {
        price: Number(form.starterPrice),
        patients: Number(form.starterCupo),
      },
      pro: {
        price: Number(form.proPrice),
        patients: Number(form.proCupo),
      },
      clinic: {
        price: Number(form.clinicPrice),
        patients: 9999,
      },
    });
    setGuardando(false);

    if (error) {
      toast.error("No se pudieron actualizar los planes: " + error);
      return;
    }

    toast.success("Precios y cupos de planes actualizados en Supabase");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={() => !guardando && onClose()}
      title="Configurar precios y cupos de planes"
      size="md"
      preventOverlayClose={guardando}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        <p className="text-[11px] text-muted font-body">
          Modifica el valor mensual en ARS y el limite de pacientes de cada
          plan. Los cambios impactan de inmediato en Facturacion y Metricas.
        </p>

        {/* Plan Starter */}
        <div className="p-3 rounded-xl bg-cream/60 border border-cream-darker space-y-2">
          <div className="flex items-center justify-between">
            <span className="badge badge-starter">Starter</span>
            <span className="text-[10px] font-display text-muted">
              Nivel inicial
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <AdminField
              label="Precio mensual (ARS) *"
              name="starterPrice"
              type="number"
              icon={DollarSign}
              value={form.starterPrice}
              onChange={handleChange}
              error={errors.starterPrice}
            />
            <AdminField
              label="Cupo max. pacientes *"
              name="starterCupo"
              type="number"
              icon={Users}
              value={form.starterCupo}
              onChange={handleChange}
              error={errors.starterCupo}
            />
          </div>
        </div>

        {/* Plan Pro */}
        <div className="p-3 rounded-xl bg-cream/60 border border-cream-darker space-y-2">
          <div className="flex items-center justify-between">
            <span className="badge badge-pro">Pro</span>
            <span className="text-[10px] font-display text-muted">
              Nivel profesional
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <AdminField
              label="Precio mensual (ARS) *"
              name="proPrice"
              type="number"
              icon={DollarSign}
              value={form.proPrice}
              onChange={handleChange}
              error={errors.proPrice}
            />
            <AdminField
              label="Cupo max. pacientes *"
              name="proCupo"
              type="number"
              icon={Users}
              value={form.proCupo}
              onChange={handleChange}
              error={errors.proCupo}
            />
          </div>
        </div>

        {/* Plan Clinic */}
        <div className="p-3 rounded-xl bg-cream/60 border border-cream-darker space-y-2">
          <div className="flex items-center justify-between">
            <span className="badge badge-clinic">Clinic</span>
            <span className="text-[10px] font-display text-muted">
              Pacientes ilimitados
            </span>
          </div>
          <AdminField
            label="Precio mensual Clinic (ARS) *"
            name="clinicPrice"
            type="number"
            icon={DollarSign}
            value={form.clinicPrice}
            onChange={handleChange}
            error={errors.clinicPrice}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={guardando}
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-cream-dark text-muted font-display
                        text-[11.5px] cursor-pointer hover:bg-cream-darker transition-colors
                        flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <X size={13} /> Cancelar
          </motion.button>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={guardando}
            className="flex-1 py-2.5 rounded-xl bg-olive text-cream font-display
                        text-[11.5px] cursor-pointer hover:bg-olive-deep transition-colors
                        flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {guardando ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Check size={13} />
                Guardar precios
              </>
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
