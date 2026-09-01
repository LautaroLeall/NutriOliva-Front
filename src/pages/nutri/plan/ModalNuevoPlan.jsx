import Modal from "@/components/ui/Modal";

export default function ModalNuevoPlan({
  open,
  onClose,
  caloriaInput,
  setCaloriaInput,
  calError,
  setCalError,
  onCrear,
}) {
  return (
    <Modal open={open} onClose={onClose} title="Nuevo plan" size="sm">
      <div className="space-y-4">
        <div>
          <label className="label">Objetivo calórico diario (kcal) *</label>
          <input
            type="number"
            className={`input ${calError ? "border-red-400" : ""}`}
            value={caloriaInput}
            onChange={(e) => {
              setCaloriaInput(e.target.value);
              setCalError("");
            }}
            placeholder="Ej: 2000"
            min="500"
            max="6000"
          />
          {calError && (
            <p className="text-[10.5px] text-red-500 mt-1">{calError}</p>
          )}
          <p className="text-[10px] text-muted mt-1">
            Entre 500 y 6000 kcal. Podés modificarlo después.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="btn-ghost flex-1 py-2.5">
            Cancelar
          </button>
          <button onClick={onCrear} className="btn-primary flex-1 py-2.5">
            Crear plan
          </button>
        </div>
      </div>
    </Modal>
  );
}
