// FotoInput.jsx — Selector de foto opcional para la comida
import { useRef } from "react";
import { Camera, X } from "lucide-react";

export default function FotoInput({ foto, onFoto, onQuitarFoto }) {
  const inputRef = useRef(null);

  return (
    <div>
      <p className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-2">
        Foto opcional
      </p>

      {foto ? (
        <div className="relative w-full h-28 rounded-xl overflow-hidden border border-cream-darker">
          <img
            src={URL.createObjectURL(foto)}
            alt="Vista previa"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onQuitarFoto}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center
                        justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-dashed
                    border-cream-darker text-muted hover:border-olive/50 hover:text-olive
                      transition-colors font-display text-[11.5px]"
        >
          <Camera size={14} /> Agregar foto
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) {
            alert("La foto no debe superar los 5 MB.");
            return;
          }
          onFoto(file);
        }}
      />
    </div>
  );
}
