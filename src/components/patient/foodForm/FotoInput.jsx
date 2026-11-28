// FotoInput.jsx — Selector de foto opcional con compresion automatica en cliente

import { useRef, useState, useEffect } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { comprimirImagenCliente } from "@/lib/storage";

const MAX_RAW_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB entrada directa de camara
const MAX_FINAL_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB post-compresion

export default function FotoInput({ foto, onFoto, onQuitarFoto }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [comprimiendo, setComprimiendo] = useState(false);

  useEffect(() => {
    if (!foto) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(foto);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [foto]);

  async function procesarArchivoSeleccionado(file) {
    if (!file) return;
    if (file.size > MAX_RAW_SIZE_BYTES) {
      toast.error("La imagen original supera el limite maximo de 15 MB.");
      return;
    }

    setComprimiendo(true);
    try {
      const optimizada = await comprimirImagenCliente(file);
      if (optimizada.size > MAX_FINAL_SIZE_BYTES) {
        toast.error("La foto sigue superando los 5 MB luego de optimizarla.");
        return;
      }
      onFoto(optimizada);
    } finally {
      setComprimiendo(false);
    }
  }

  return (
    <div>
      <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-1.5">
        Foto opcional
      </p>

      <AnimatePresence mode="wait">
        {foto && previewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="relative w-full h-24 rounded-xl overflow-hidden border border-cream-darker"
          >
            <img
              src={previewUrl}
              alt="Vista previa"
              className="w-full h-full object-cover"
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              onClick={onQuitarFoto}
              aria-label="Quitar foto"
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/55 flex items-center
                          justify-center text-white hover:bg-black/75 transition-colors"
            >
              <X size={12} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            key="btn"
            type="button"
            disabled={comprimiendo}
            whileHover={!comprimiendo ? { scale: 1.01 } : {}}
            whileTap={!comprimiendo ? { scale: 0.98 } : {}}
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed
                      border-cream-darker bg-[#F5F2EA]/60 text-muted hover:border-olive/50 hover:text-olive
                        transition-colors font-display text-[11.5px] disabled:opacity-60"
          >
            {comprimiendo ? (
              <>
                <Loader2 size={14} className="animate-spin text-olive" />
                <span>Optimizando foto...</span>
              </>
            ) : (
              <>
                <Camera size={14} />
                <span>Agregar foto</span>
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          procesarArchivoSeleccionado(file);
        }}
      />
    </div>
  );
}
