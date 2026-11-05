// FotoInput.jsx — Selector de foto opcional con animaciones

import { useRef, useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function FotoInput({ foto, onFoto, onQuitarFoto }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!foto) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(foto);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [foto]);

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
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed
                      border-cream-darker bg-[#F5F2EA]/60 text-muted hover:border-olive/50 hover:text-olive
                        transition-colors font-display text-[11.5px]"
          >
            <Camera size={14} /> Agregar foto
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
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) {
            toast.error("La foto no debe superar los 5 MB.");
            return;
          }
          onFoto(file);
        }}
      />
    </div>
  );
}
