import { formatFecha } from "./patientDetailUtils";

export default function TabFicha({ registros_comida }) {
  if (!registros_comida || registros_comida.length === 0) {
    return (
      <div className="py-10 text-center text-[11px] text-muted italic">
        El paciente todavía no registró ninguna comida.
      </div>
    );
  }

  return (
    <div className="divide-y divide-cream">
      {registros_comida.slice(0, 10).map((r) => (
        <div key={r.id} className="flex items-center justify-between px-5 py-3">
          <div>
            <div className="text-[12px] text-olive-dark font-medium">
              {r.descripcion}
            </div>
            <div className="text-[10px] text-muted mt-0.5">
              {formatFecha(r.fecha)} · {r.hora?.slice(0, 5)}
            </div>
          </div>
          {r.calorias_estimadas && (
            <span className="font-display text-sm font-semibold text-olive-dark">
              {r.calorias_estimadas} kcal
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
