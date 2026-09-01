import { HeartPulse } from "lucide-react";

const OBJETIVO_LABELS = {
  bajar: "Bajar de peso",
  bajar_fuerza: "Bajar + fuerza",
  mantener: "Mantener",
  subir: "Aumentar de peso",
  subir_fuerza: "Aumentar + fuerza",
  rendimiento_deportivo: "Rendimiento deportivo",
  recomposicion: "Recomposicion corporal",
};

const ACTIVIDAD_LABELS = {
  sedentario: "Sedentario",
  leve: "Leve",
  moderado: "Moderado",
  activo: "Activo",
  muy_activo: "Muy activo",
};

export default function TabClinica({
  datosClinicos,
  paciente,
  setEditandoClinicos,
}) {
  if (!datosClinicos) {
    return (
      <div className="p-5 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <HeartPulse
            size={16}
            className="text-amber-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="font-display text-sm font-semibold text-amber-800">
              Sin datos clínicos cargados
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Este paciente no tiene datos clínicos registrados. Los datos
              clínicos son necesarios para activar un plan.
            </p>
            <button
              onClick={() => setEditandoClinicos(true)}
              className="mt-3 text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg
                        hover:bg-amber-700 transition-colors font-display"
            >
              Cargar datos clínicos ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  const imc =
    datosClinicos.peso && datosClinicos.altura
      ? (datosClinicos.peso / (datosClinicos.altura / 100) ** 2).toFixed(1)
      : null;
  const imcColor = !imc
    ? "text-muted"
    : imc < 18.5
      ? "text-blue-500"
      : imc < 25
        ? "text-green-600"
        : imc < 30
          ? "text-amber-500"
          : "text-red-500";

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-[9.5px] text-muted uppercase tracking-wide">
            Ultimo registro
          </p>
          <p className="text-[11px] text-muted mt-0.5">
            {datosClinicos.fecha_registro
              ? new Date(
                  datosClinicos.fecha_registro + "T12:00:00",
                ).toLocaleDateString("es-AR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—"}
          </p>
        </div>
        <button
          onClick={() => setEditandoClinicos(true)}
          className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          <HeartPulse size={12} />
          Actualizar medicion
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Peso", value: datosClinicos.peso, unit: "kg" },
          { label: "Altura", value: datosClinicos.altura, unit: "cm" },
          { label: "IMC", value: imc, unit: "", color: imcColor },
          { label: "Edad", value: datosClinicos.edad, unit: "años" },
        ].map(({ label, value, unit, color }) => (
          <div key={label} className="bg-cream rounded-xl p-3 text-center">
            <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
              {label}
            </p>
            <p
              className={`font-display font-bold text-xl ${color || "text-olive-dark"}`}
            >
              {value ?? "—"}
            </p>
            {unit && <p className="text-[9px] text-muted">{unit}</p>}
          </div>
        ))}
      </div>

      {(datosClinicos.porcentaje_grasa ||
        datosClinicos.masa_muscular_kg ||
        datosClinicos.cintura_cm) && (
        <div>
          <p className="font-display text-[9.5px] text-muted uppercase tracking-wide mb-2">
            Composicion corporal
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "% Grasa",
                value: datosClinicos.porcentaje_grasa,
                unit: "%",
              },
              {
                label: "Masa muscular",
                value: datosClinicos.masa_muscular_kg,
                unit: "kg",
              },
              { label: "Cintura", value: datosClinicos.cintura_cm, unit: "cm" },
            ].map(
              ({ label, value, unit }) =>
                value && (
                  <div
                    key={label}
                    className="bg-cream rounded-xl p-3 text-center"
                  >
                    <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p className="font-display font-bold text-lg text-olive-dark">
                      {value}
                    </p>
                    <p className="text-[9px] text-muted">{unit}</p>
                  </div>
                ),
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {datosClinicos.objetivo && (
          <div className="bg-cream rounded-xl p-3">
            <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
              Objetivo
            </p>
            <p className="text-[12px] text-olive-dark font-medium">
              {OBJETIVO_LABELS[datosClinicos.objetivo] ||
                datosClinicos.objetivo}
            </p>
          </div>
        )}
        {datosClinicos.nivel_actividad && (
          <div className="bg-cream rounded-xl p-3">
            <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
              Nivel de actividad
            </p>
            <p className="text-[12px] text-olive-dark font-medium">
              {ACTIVIDAD_LABELS[datosClinicos.nivel_actividad] ||
                datosClinicos.nivel_actividad}
            </p>
          </div>
        )}
      </div>

      {datosClinicos.sexo && (
        <div className="bg-cream rounded-xl p-3">
          <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
            Sexo
          </p>
          <p className="text-[12px] text-olive-dark font-medium capitalize">
            {datosClinicos.sexo === "M"
              ? "Masculino"
              : datosClinicos.sexo === "F"
                ? "Femenino"
                : "Otro"}
          </p>
        </div>
      )}

      {(datosClinicos.patologias ||
        datosClinicos.alergias ||
        datosClinicos.medicacion) && (
        <div className="space-y-2">
          <p className="font-display text-[9.5px] text-muted uppercase tracking-wide">
            Informacion clinica
          </p>
          {datosClinicos.patologias && (
            <div className="bg-cream rounded-xl p-3">
              <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
                Patologias
              </p>
              <p className="text-[12px] text-olive-dark">
                {datosClinicos.patologias}
              </p>
            </div>
          )}
          {datosClinicos.alergias && (
            <div className="bg-cream rounded-xl p-3">
              <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
                Alergias e intolerancias
              </p>
              <p className="text-[12px] text-olive-dark">
                {datosClinicos.alergias}
              </p>
            </div>
          )}
          {datosClinicos.medicacion && (
            <div className="bg-cream rounded-xl p-3">
              <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
                Medicacion actual
              </p>
              <p className="text-[12px] text-olive-dark">
                {datosClinicos.medicacion}
              </p>
            </div>
          )}
        </div>
      )}

      {datosClinicos.observaciones && (
        <div className="bg-cream rounded-xl p-3">
          <p className="text-[9px] font-display text-muted uppercase tracking-wide mb-1">
            Observaciones clinicas
          </p>
          <p className="text-[12px] text-olive-dark">
            {datosClinicos.observaciones}
          </p>
        </div>
      )}

      {paciente.datos_clinicos?.length > 1 && (
        <details className="mt-2">
          <summary className="text-[11px] font-display text-muted cursor-pointer hover:text-olive-dark">
            Ver historial completo ({paciente.datos_clinicos.length} registros)
          </summary>
          <div className="mt-3 space-y-2">
            {paciente.datos_clinicos.slice(1).map((dc, i) => (
              <div
                key={dc.id || i}
                className="border border-cream-darker rounded-xl px-4 py-3"
              >
                <p className="text-[9.5px] font-display text-muted mb-1">
                  {dc.fecha_registro
                    ? new Date(
                        dc.fecha_registro + "T12:00:00",
                      ).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </p>
                <div className="flex gap-4 flex-wrap text-[11px] text-olive-dark">
                  {dc.peso && (
                    <span>
                      <span className="text-muted">Peso:</span> {dc.peso} kg
                    </span>
                  )}
                  {dc.altura && (
                    <span>
                      <span className="text-muted">Altura:</span> {dc.altura} cm
                    </span>
                  )}
                  {dc.objetivo && (
                    <span className="capitalize">
                      <span className="text-muted">Obj:</span> {dc.objetivo}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
