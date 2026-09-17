// TabFicha.jsx — Historial de comidas del paciente con paginacion "Ver mas"
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatFecha } from "./patientDetailUtils";

const PAGINA = 10; // registros por pagina

export default function TabFicha({ registros_comida }) {
  const [visible, setVisible] = useState(PAGINA);

  if (!registros_comida || registros_comida.length === 0) {
    return (
      <div className="py-10 text-center text-[11px] text-muted italic">
        El paciente todavia no registro ninguna comida.
      </div>
    );
  }

  const registrosMostrados = registros_comida.slice(0, visible);
  const hayMas = visible < registros_comida.length;

  return (
    <div>
      <div className="divide-y divide-cream">
        {registrosMostrados.map((r) => (
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

      {/* Boton Ver mas */}
      {hayMas && (
        <div className="px-5 py-3 border-t border-cream">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGINA)}
            className="w-full flex items-center justify-center gap-1.5
                       text-[11px] text-muted hover:text-olive-dark font-display
                       transition-colors py-1"
          >
            <ChevronDown size={13} />
            Ver mas ({registros_comida.length - visible} restantes)
          </button>
        </div>
      )}

      {/* Contador total */}
      <div className="px-5 py-2 text-[9.5px] text-muted text-center border-t border-cream">
        Mostrando {registrosMostrados.length} de {registros_comida.length} registros
      </div>
    </div>
  );
}
