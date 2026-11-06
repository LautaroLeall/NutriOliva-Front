// AdminConsumoIA.jsx — Estimacion de uso y gasto de IA (Total, por Nutricionista y por Paciente)

import { useState, useMemo } from "react";
import { Sparkles, DollarSign, Users, User } from "lucide-react";
import { initials, formatARS } from "./adminUtils";

const COSTO_USD_POR_LLAMADA = 0.0015; // Claude Haiku promedio por estimacion calorica

export default function AdminConsumoIA({
  nutricionistas = [],
  pacientesAll = [],
  registrosComida = [],
}) {
  const [vista, setVista] = useState("nutricionistas"); // 'nutricionistas' | 'pacientes'
  const [costoPorConsultaArs, setCostoPorConsultaArs] = useState(() => {
    const saved = localStorage.getItem("nutrioliva_costo_ia_ars");
    return saved !== null ? Number(saved) : 2;
  });

  function handleChangeCosto(val) {
    const num = Math.max(0, Number(val) || 0);
    setCostoPorConsultaArs(num);
    localStorage.setItem("nutrioliva_costo_ia_ars", String(num));
  }

  const datosIA = useMemo(() => {
    const totalComidas = registrosComida.length;
    let totalIA = 0;

    // Mapa paciente_id -> { totalComidas, iaCount }
    const porPacienteMap = {};
    registrosComida.forEach((r) => {
      if (!r.paciente_id) return;
      if (!porPacienteMap[r.paciente_id]) {
        porPacienteMap[r.paciente_id] = { totalComidas: 0, iaCount: 0 };
      }
      porPacienteMap[r.paciente_id].totalComidas += 1;
      if (r.fuente_estimacion === "ia") {
        porPacienteMap[r.paciente_id].iaCount += 1;
        totalIA += 1;
      }
    });

    const pctGlobalIA =
      totalComidas > 0 ? Math.round((totalIA / totalComidas) * 100) : 0;

    // Mapa nutricionista_id -> nombre
    const nutriNombreMap = {};
    nutricionistas.forEach((n) => {
      nutriNombreMap[n.id] = n.nombre || "Profesional";
    });

    // Lista detallada por Paciente
    const listaPacientes = pacientesAll
      .map((p) => {
        const reg = porPacienteMap[p.id] || { totalComidas: 0, iaCount: 0 };
        const pct =
          reg.totalComidas > 0
            ? Math.round((reg.iaCount / reg.totalComidas) * 100)
            : 0;
        const gastoArs = reg.iaCount * costoPorConsultaArs;
        const gastoUsd = reg.iaCount * COSTO_USD_POR_LLAMADA;
        return {
          id: p.id,
          nombre: p.nombre || "Paciente",
          email: p.email || "",
          estado: p.estado || "activo",
          nutricionistaId: p.nutricionista_id,
          nutricionistaNombre:
            nutriNombreMap[p.nutricionista_id] || "Sin asignar",
          totalComidas: reg.totalComidas,
          iaCount: reg.iaCount,
          pctIA: pct,
          gastoArs,
          gastoUsd,
        };
      })
      .sort((a, b) => b.iaCount - a.iaCount || b.totalComidas - a.totalComidas);

    // Lista detallada por Nutricionista
    const listaNutricionistas = nutricionistas
      .map((n) => {
        const pacsDelNutri = listaPacientes.filter(
          (p) => p.nutricionistaId === n.id
        );
        const comidasNutri = pacsDelNutri.reduce(
          (acc, p) => acc + p.totalComidas,
          0
        );
        const iaNutri = pacsDelNutri.reduce((acc, p) => acc + p.iaCount, 0);
        const pct =
          comidasNutri > 0 ? Math.round((iaNutri / comidasNutri) * 100) : 0;
        const gastoArs = iaNutri * costoPorConsultaArs;
        const gastoUsd = iaNutri * COSTO_USD_POR_LLAMADA;
        return {
          id: n.id,
          nombre: n.nombre || "Profesional",
          email: n.email || "",
          pacientesCount: pacsDelNutri.length,
          totalComidas: comidasNutri,
          iaCount: iaNutri,
          pctIA: pct,
          gastoArs,
          gastoUsd,
        };
      })
      .sort((a, b) => b.iaCount - a.iaCount || b.totalComidas - a.totalComidas);

    return {
      totalComidas,
      totalIA,
      pctGlobalIA,
      gastoTotalArs: totalIA * costoPorConsultaArs,
      gastoTotalUsd: totalIA * COSTO_USD_POR_LLAMADA,
      listaNutricionistas,
      listaPacientes,
    };
  }, [nutricionistas, pacientesAll, registrosComida, costoPorConsultaArs]);

  return (
    <div className="border border-cream-darker rounded-xl overflow-hidden bg-white">
      {/* Cabecera */}
      <div className="px-4 py-3.5 bg-cream border-b border-cream-darker flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-[13px] font-semibold text-olive-dark flex items-center gap-1.5">
            <Sparkles size={14} className="text-olive" />
            Consumo y gasto estimado de IA (Claude Haiku)
          </h3>
          <p className="text-[10.5px] text-muted">
            Seguimiento de comidas analizadas automaticamente por nutricionista
            y por paciente
          </p>
        </div>

        {/* Configuracion rapida de tarifa por consulta en ARS */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-cream-darker">
          <span className="text-[10.5px] font-display text-muted whitespace-nowrap">
            Costo est. / consulta IA (ARS):
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-display text-olive-dark font-semibold">
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={costoPorConsultaArs}
              onChange={(e) => handleChangeCosto(e.target.value)}
              className="w-16 text-[11.5px] font-display font-bold text-olive-dark bg-cream/60 border border-cream-darker rounded px-1.5 py-0.5 focus:outline-none focus:border-olive"
            />
          </div>
        </div>
      </div>

      {/* Resumen superior (3 indicadores clave) */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF8F3] border-b border-cream-darker">
        <div className="p-3.5 rounded-xl bg-white border border-cream-darker">
          <div className="flex items-center gap-1.5 text-[10.5px] font-display text-muted mb-1">
            <Sparkles size={13} className="text-olive" />
            Estimaciones con IA (Total)
          </div>
          <div className="font-display text-xl font-bold text-olive-dark">
            {datosIA.totalIA}{" "}
            <span className="text-xs font-normal text-muted">
              ({datosIA.pctGlobalIA}%)
            </span>
          </div>
          <p className="text-[10px] text-muted mt-0.5">
            Comidas analizadas automaticamente (de {datosIA.totalComidas}{" "}
            totales)
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-cream-darker">
          <div className="flex items-center gap-1.5 text-[10.5px] font-display text-muted mb-1">
            <DollarSign size={13} className="text-olive" />
            Gasto total estimado en IA
          </div>
          <div className="font-display text-xl font-bold text-olive-dark">
            {formatARS(datosIA.gastoTotalArs)}{" "}
            <span className="text-xs font-normal text-muted">
              (USD ${datosIA.gastoTotalUsd.toFixed(3)})
            </span>
          </div>
          <p className="text-[10px] text-muted mt-0.5">
            Acumulado de todos los nutricionistas y pacientes
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-cream-darker flex flex-col justify-between">
          <span className="text-[10.5px] font-display text-muted">
            Desglose detallado
          </span>
          <div className="flex gap-1.5 mt-1.5">
            <button
              type="button"
              onClick={() => setVista("nutricionistas")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg font-display text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${vista === "nutricionistas"
                  ? "bg-olive text-cream font-semibold"
                  : "bg-cream text-muted hover:text-olive-dark"
                }`}
            >
              <Users size={12} />
              Por nutricionista ({datosIA.listaNutricionistas.length})
            </button>
            <button
              type="button"
              onClick={() => setVista("pacientes")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg font-display text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${vista === "pacientes"
                  ? "bg-olive text-cream font-semibold"
                  : "bg-cream text-muted hover:text-olive-dark"
                }`}
            >
              <User size={12} />
              Por paciente ({datosIA.listaPacientes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tabla segun vista activa */}
      <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
        {vista === "nutricionistas" ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white border-b border-cream-darker text-left">
                <th className="px-4 py-2.5 font-display text-[9.5px] uppercase tracking-wide text-muted">
                  Nutricionista
                </th>
                <th className="px-4 py-2.5 font-display text-[9.5px] uppercase tracking-wide text-muted">
                  Pacientes
                </th>
                <th className="px-4 py-2.5 font-display text-[9.5px] uppercase tracking-wide text-muted">
                  Comidas registradas
                </th>
                <th className="px-4 py-2.5 font-display text-[9.5px] uppercase tracking-wide text-muted">
                  Estimaciones con IA
                </th>
                <th className="px-4 py-2.5 font-display text-[9.5px] uppercase tracking-wide text-muted text-right">
                  Gasto estimado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream text-[12px]">
              {datosIA.listaNutricionistas.map((n) => (
                <tr key={n.id} className="hover:bg-cream/40 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="avatar text-[10px] flex-shrink-0">
                        {initials(n.nombre)}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-olive-dark truncate">
                          {n.nombre}
                        </div>
                        <div className="text-[10px] text-muted truncate">
                          {n.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-display text-muted">
                    {n.pacientesCount} pac.
                  </td>
                  <td className="px-4 py-2.5 font-display text-muted">
                    {n.totalComidas}
                  </td>
                  <td className="px-4 py-2.5 font-display">
                    <span className="font-semibold text-olive-dark">
                      {n.iaCount}
                    </span>{" "}
                    <span className="text-[10.5px] text-muted">
                      ({n.pctIA}%)
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-display text-right whitespace-nowrap">
                    <span className="font-semibold text-olive-dark">
                      {formatARS(n.gastoArs)}
                    </span>{" "}
                    <span className="text-[10px] text-muted">
                      (USD ${n.gastoUsd.toFixed(3)})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white border-b border-cream-darker text-left">
                <th className="px-4 py-2.5 font-display text-[9.5px] uppercase tracking-wide text-muted">
                  Paciente
                </th>
                <th className="px-4 py-2.5 font-display text-[9.5px] uppercase tracking-wide text-muted">
                  Nutricionista a cargo
                </th>
                <th className="px-4 py-2.5 font-display text-[9.5px] uppercase tracking-wide text-muted">
                  Comidas totales
                </th>
                <th className="px-4 py-2.5 font-display text-[9.5px] uppercase tracking-wide text-muted">
                  Estimaciones con IA
                </th>
                <th className="px-4 py-2.5 font-display text-[9.5px] uppercase tracking-wide text-muted text-right">
                  Gasto estimado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream text-[12px]">
              {datosIA.listaPacientes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-muted font-display text-xs"
                  >
                    Aun no hay pacientes registrados.
                  </td>
                </tr>
              ) : (
                datosIA.listaPacientes.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-cream/40 transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="avatar text-[10px] flex-shrink-0">
                          {initials(p.nombre)}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-olive-dark truncate">
                            {p.nombre}
                          </div>
                          <div className="text-[10px] text-muted truncate">
                            {p.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-display text-[11.5px] text-olive-dark">
                      {p.nutricionistaNombre}
                    </td>
                    <td className="px-4 py-2.5 font-display text-muted">
                      {p.totalComidas}
                    </td>
                    <td className="px-4 py-2.5 font-display">
                      <span className="font-semibold text-olive-dark">
                        {p.iaCount}
                      </span>{" "}
                      <span className="text-[10.5px] text-muted">
                        ({p.pctIA}%)
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-display text-right whitespace-nowrap">
                      <span className="font-semibold text-olive-dark">
                        {formatARS(p.gastoArs)}
                      </span>{" "}
                      <span className="text-[10px] text-muted">
                        (USD ${p.gastoUsd.toFixed(3)})
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
