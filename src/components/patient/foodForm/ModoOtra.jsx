// ModoOtra.jsx — Panel del modo "Otra comida" en el formulario de comida
import { Loader2, Sparkles } from "lucide-react";

export default function ModoOtra({
  formOtra,
  setFormOtra,
  setErrors,
  errors,
  estimandoCal,
  estimarCalorias,
}) {
  return (
    <div className="space-y-3">
      {/* Aviso informativo */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
        <p className="text-[10.5px] text-amber-700 font-display leading-snug">
          Esta comida no se guardara en el catálogo. Pedile a tu nutricionista
          agregarla si la consumís con frecuencia.
        </p>
      </div>

      {/* Campo descripcion */}
      <div>
        <label className="label">¿Qué comiste? *</label>
        <input
          className={`input ${errors.descripcion ? "border-red-400" : ""}`}
          placeholder="Ej: Medialunas con café con leche..."
          value={formOtra.descripcion}
          onChange={(e) => {
            setFormOtra((f) => ({ ...f, descripcion: e.target.value }));
            setErrors((er) => ({ ...er, descripcion: undefined }));
          }}
          autoFocus
          autoComplete="off"
          maxLength={200}
        />
        <div className="flex justify-between mt-0.5">
          {errors.descripcion ? (
            <p className="text-[10px] text-red-500">{errors.descripcion}</p>
          ) : (
            <span />
          )}
          <p
            className={`text-[9.5px] ${formOtra.descripcion.length > 180 ? "text-amber-500" : "text-muted"}`}
          >
            {formOtra.descripcion.length}/200
          </p>
        </div>
      </div>

      {/* Campo calorias con boton IA */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="label mb-0">
            Calorias estimadas{" "}
            <span className="text-muted font-normal">(opcional)</span>
          </label>

          <button
            type="button"
            onClick={estimarCalorias}
            disabled={estimandoCal || formOtra.descripcion.trim().length < 3}
            className="flex items-center gap-1 text-[10px] text-olive hover:text-olive-dark
                        font-display transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {estimandoCal ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <Sparkles size={10} />
            )}
            {estimandoCal ? "Estimando..." : "Estimar con IA"}
          </button>
        </div>

        <div className="relative">
          <input
            type="number"
            className={`input pr-12 ${errors.calorias ? "border-red-400" : ""}`}
            placeholder="Ej: 250"
            value={formOtra.calorias_estimadas}
            onChange={(e) => {
              setFormOtra((f) => ({
                ...f,
                calorias_estimadas: e.target.value,
              }));
              setErrors((er) => ({ ...er, calorias: undefined }));
            }}
            min={1}
            max={3000}
            step={1}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-[11px]">
            kcal
          </span>
        </div>

        {errors.calorias ? (
          <p className="text-[10px] text-red-500 mt-1">{errors.calorias}</p>
        ) : (
          <p className="text-[9.5px] text-muted mt-1">
            Si no sabes las calorias exactas, usa "Estimar con IA" o deja vacio.
          </p>
        )}
      </div>
    </div>
  );
}
