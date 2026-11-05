// ExcelImporter.jsx — Importador de plan alimenticio desde Excel / CSV con animaciones

import { useState, useRef } from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { parsearExcel } from "./planBuilderUtils";

export default function ExcelImporter({ onImportar, onCancel }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importando, setImportando] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const comidas = await parsearExcel(file);
      if (comidas.length === 0) {
        setError("No se encontraron comidas en el archivo. Revisa las columnas.");
        setLoading(false);
        return;
      }
      setPreview(comidas);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function handleConfirmar() {
    if (!preview?.length) return;
    setImportando(true);
    await onImportar(preview);
    setImportando(false);
    onCancel();
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22 }}
      className="border border-dashed border-olive/40 bg-white rounded-xl p-4 space-y-3 overflow-hidden"
    >
      <div className="flex items-center gap-2">
        <FileSpreadsheet size={15} className="text-olive" />
        <p className="font-display text-[12.5px] font-semibold text-olive-dark">
          Importar plan desde Excel / CSV
        </p>
      </div>

      <p className="text-[10.5px] text-muted">
        El archivo debe tener columnas: <strong>descripcion</strong>,{" "}
        <strong>tipo_comida</strong>, <strong>calorias_aprox</strong>.
        Opcionalmente: proteinas_g, carbos_g, grasas_g.
      </p>

      {!preview && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => inputRef.current?.click()}
          className="w-full py-2.5 rounded-xl bg-cream border border-cream-darker font-display
                      text-[11.5px] text-olive-dark hover:bg-cream-dark transition-colors"
        >
          {loading && <Loader2 size={13} className="inline animate-spin mr-1" />}
          Elegir archivo .xlsx / .csv
        </motion.button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFile}
      />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[10.5px] text-accent bg-accent/8 border border-accent/20 rounded-xl px-3 py-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {preview && (
        <div className="space-y-2">
          <p className="text-[10.5px] font-display text-muted">
            {preview.length} comidas detectadas. Revisa antes de importar:
          </p>
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
            {preview.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2 bg-cream/60 rounded-lg border border-cream-darker"
              >
                <div className="min-w-0">
                  <p className="text-[11.5px] text-olive-dark font-medium truncate">
                    {c.descripcion}
                  </p>
                  <p className="text-[10px] text-muted">
                    {c.tipo_comida}{" "}
                    {c.calorias_aprox ? `· ${c.calorias_aprox} kcal` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setPreview(null);
                setError(null);
              }}
              className="flex-1 py-2 rounded-xl bg-white border border-cream-darker text-muted
                          font-display text-[11px] hover:bg-cream transition-colors"
            >
              Volver a elegir
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleConfirmar}
              disabled={importando}
              className="flex-1 py-2 rounded-xl bg-olive text-cream font-display text-[11px]
                        hover:bg-olive-deep disabled:opacity-50 transition-colors"
            >
              {importando && (
                <Loader2 size={12} className="inline animate-spin mr-1" />
              )}
              Confirmar e importar
            </motion.button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onCancel}
        className="w-full py-1.5 text-[10.5px] text-muted font-display hover:text-olive-dark transition-colors"
      >
        Cancelar importacion
      </button>
    </motion.div>
  );
}
