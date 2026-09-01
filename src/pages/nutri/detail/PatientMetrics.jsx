export default function PatientMetrics({
  caloriasHoy,
  planActivo,
  datosClinicos,
}) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-5">
      <div className="card p-4">
        <div className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-2">
          Calorías hoy
        </div>
        <div className="font-display text-2xl font-semibold text-olive-dark">
          {caloriasHoy > 0 ? caloriasHoy : "—"}
        </div>
        {planActivo && (
          <div className="text-[10px] text-muted mt-1">
            de {planActivo.calorias_objetivo} kcal objetivo
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-2">
          Plan activo
        </div>
        {planActivo ? (
          <>
            <div className="font-display text-sm font-semibold text-olive-dark">
              v{planActivo.version}
            </div>
            <div className="text-[10px] text-muted mt-1">
              {planActivo.calorias_objetivo} kcal/día
            </div>
          </>
        ) : (
          <div className="text-[11px] text-muted italic">Sin plan asignado</div>
        )}
      </div>

      <div className="card p-4">
        <div className="text-[9.5px] font-display text-muted uppercase tracking-wide mb-2">
          Datos clínicos
        </div>
        {datosClinicos ? (
          <div className="space-y-0.5">
            {datosClinicos.peso && (
              <div className="text-[11px] text-olive-dark">
                <span className="text-muted">Peso:</span> {datosClinicos.peso}{" "}
                kg
              </div>
            )}
            {datosClinicos.altura && (
              <div className="text-[11px] text-olive-dark">
                <span className="text-muted">Altura:</span>{" "}
                {datosClinicos.altura} cm
              </div>
            )}
            {datosClinicos.objetivo && (
              <div className="text-[11px] text-olive-dark capitalize">
                <span className="text-muted">Objetivo:</span>{" "}
                {datosClinicos.objetivo}
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-muted italic">
            Sin datos clínicos
          </div>
        )}
      </div>
    </div>
  );
}
