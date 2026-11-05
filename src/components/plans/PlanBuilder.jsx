// PlanBuilder.jsx — Orquestador del constructor visual de plan alimenticio

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { TIPOS } from "./builder/planBuilderUtils";
import ExcelImporter from "./builder/ExcelImporter";
import MealGroup from "./builder/MealGroup";

export default function PlanBuilder({
  plan,
  onAgregar,
  onAgregarLote,
  onEditar,
  onEliminar,
  readonly = false,
}) {
  const { session } = useAuth();
  const authUserId = session?.user?.id || null;
  const [mostrarExcel, setMostrarExcel] = useState(false);
  const comidas = plan?.comidas_plan || [];

  async function handleImportarExcel(comidasImportadas) {
    if (!comidasImportadas?.length) return;
    if (onAgregarLote) {
      const { error } = await onAgregarLote(comidasImportadas);
      if (error) {
        toast.error("Error al importar las comidas desde Excel.");
        return;
      }
    } else {
      for (const c of comidasImportadas) {
        await onAgregar(c);
      }
    }
    toast.success(`${comidasImportadas.length} comidas importadas correctamente.`);
  }

  return (
    <div className="space-y-3">
      {/* Boton de importacion Excel */}
      {!readonly && (
        <div className="flex justify-end">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setMostrarExcel((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cream-darker
                      bg-white text-muted font-display text-[11.5px] hover:text-olive-dark
                      hover:bg-cream transition-colors shadow-sm"
          >
            <FileSpreadsheet size={13} />
            {mostrarExcel ? "Cerrar importacion" : "Importar desde Excel"}
          </motion.button>
        </div>
      )}

      {/* Panel de importacion Excel */}
      <AnimatePresence>
        {!readonly && mostrarExcel && (
          <ExcelImporter
            key="excel-importer"
            onImportar={handleImportarExcel}
            onCancel={() => setMostrarExcel(false)}
          />
        )}
      </AnimatePresence>

      {/* Grupos por tipo de comida */}
      {TIPOS.map((tipo, idx) => (
        <MealGroup
          key={tipo.value}
          index={idx}
          tipo={tipo}
          comidas={comidas.filter((c) => c.tipo_comida === tipo.value)}
          onAgregar={onAgregar}
          onEditar={onEditar}
          onEliminar={onEliminar}
          readonly={readonly}
          nutricionistaId={authUserId}
        />
      ))}
    </div>
  );
}
