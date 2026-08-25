import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts'
import { Loader2 } from 'lucide-react'

// ── Paleta de colores por estado del día ──────────────────────────────────────
const COLOR = {
  cumple: '#6E7A4B',  // olive — dentro del objetivo
  exceso: '#D85A30',  // acento — exceso calórico
  bajo: '#A8B47E',  // olive claro — bajo el objetivo
  sinDatos: '#D6CFC0',  // crema oscuro — sin registros
}

// ── Tooltip personalizado ─────────────────────────────────────────────────────
function TooltipPersonalizado({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload

  return (
    <div className="bg-white border border-cream-darker rounded-xl shadow-lg px-4 py-3 text-left min-w-[160px]">
      <p className="font-display font-semibold text-olive-dark text-[12px] mb-2">{label}</p>

      {d?.registroExistente ? (
        <div className="space-y-1">
          <div className="flex justify-between items-center gap-4">
            <span className="text-[10.5px] text-muted">Consumidas</span>
            <span className="font-display text-[11px] font-semibold text-olive-dark">
              {d.consumidas} kcal
            </span>
          </div>
          {d.gastadas > 0 && (
            <div className="flex justify-between items-center gap-4">
              <span className="text-[10.5px] text-muted">Gastadas</span>
              <span className="font-display text-[11px] font-semibold text-blue-500">
                -{d.gastadas} kcal
              </span>
            </div>
          )}
          <div className="border-t border-cream-darker mt-1.5 pt-1.5 flex justify-between items-center">
            <span className="text-[10.5px] text-muted">Netas</span>
            <span className={`font-display text-[12px] font-bold
                              ${d.estado === 'exceso' ? 'text-red-500' : 'text-olive-dark'}`}>
              {d.netas} kcal
            </span>
          </div>
          {d.objetivo > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-[10.5px] text-muted">Objetivo</span>
              <span className="font-display text-[10.5px] text-muted">{d.objetivo} kcal</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[10.5px] text-muted italic">Sin registros este día</p>
      )}
    </div>
  )
}

// ── Eje Y con label limpio ────────────────────────────────────────────────────
function TickY({ x, y, payload }) {
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fill="#9C9688" fontSize={9.5} fontFamily="Poppins, sans-serif">
      {payload.value >= 1000 ? `${(payload.value / 1000).toFixed(1)}k` : payload.value}
    </text>
  )
}

// ── Eje X ─────────────────────────────────────────────────────────────────────
function TickX({ x, y, payload }) {
  const esHoy = payload.value === 'Hoy'
  return (
    <text
      x={x} y={y} dy={12} textAnchor="middle"
      fill={esHoy ? '#3F4A2B' : '#9C9688'}
      fontSize={9.5}
      fontWeight={esHoy ? 700 : 400}
      fontFamily="Poppins, sans-serif"
    >
      {payload.value}
    </text>
  )
}

// ── Leyenda compacta ──────────────────────────────────────────────────────────
function Leyenda({ mostrarObjetivo }) {
  return (
    <div className="flex flex-wrap items-center gap-4 mt-3">
      {[
        { color: COLOR.cumple, label: 'Dentro del objetivo' },
        { color: COLOR.exceso, label: 'Exceso calórico' },
        { color: COLOR.bajo, label: 'Por debajo del objetivo' },
        { color: COLOR.sinDatos, label: 'Sin registros' },
      ].map(({ color, label }) => (
        <span key={label} className="flex items-center gap-1.5 text-[9.5px] text-muted font-display">
          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
          {label}
        </span>
      ))}
      {mostrarObjetivo && (
        <span className="flex items-center gap-1.5 text-[9.5px] text-muted font-display">
          <span className="w-4 h-0 border-t-2 border-dashed border-olive-dark opacity-40 flex-shrink-0" />
          Objetivo diario
        </span>
      )}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

/**
 * Gráfico de barras semanal de balance calórico.
 *
 * @param {Array}  puntos           - Datos del hook useWeeklyBalance
 * @param {boolean} loading         - Estado de carga
 * @param {string}  titulo          - Título de la tarjeta (opcional)
 * @param {number}  caloriasObjetivo
 */
export default function WeeklyCaloriesChart({ puntos = [], loading, titulo, caloriasObjetivo }) {
  const maxVal = Math.max(
    ...puntos.map(p => Math.max(p.consumidas || 0, p.objetivo || 0)),
    500
  )
  const yMax = Math.ceil((maxVal * 1.2) / 200) * 200

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-[13px] text-olive-dark">
            {titulo || 'Balance calórico — últimos 7 días'}
          </h3>
          {caloriasObjetivo > 0 && (
            <p className="text-[10.5px] text-muted mt-0.5">
              Objetivo diario: {caloriasObjetivo} kcal
            </p>
          )}
        </div>
      </div>

      {/* Gráfico */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={20} className="animate-spin text-muted" />
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={puntos}
              margin={{ top: 8, right: 4, left: -8, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid
                vertical={false}
                stroke="#E8E2D5"
                strokeWidth={1}
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={<TickX />}
                height={28}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={<TickY />}
                domain={[0, yMax]}
                width={36}
              />

              <Tooltip
                content={<TooltipPersonalizado />}
                cursor={{ fill: '#F6F1E7', radius: 6 }}
              />

              {/* Línea de objetivo calórico */}
              {caloriasObjetivo > 0 && (
                <ReferenceLine
                  y={caloriasObjetivo}
                  stroke="#3F4A2B"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  strokeOpacity={0.35}
                />
              )}

              {/* Barras de calorías netas */}
              <Bar
                dataKey={p => p.registroExistente ? (p.netas ?? 0) : 0}
                name="Calorías netas"
                radius={[5, 5, 0, 0]}
                maxBarSize={40}
                isAnimationActive
                animationDuration={700}
                animationEasing="ease-out"
              >
                {puntos.map((p, i) => (
                  <Cell
                    key={i}
                    fill={COLOR[p.estado] || COLOR.sinDatos}
                    fillOpacity={p.registroExistente ? 1 : 0.6}
                  />
                ))}
              </Bar>

              {/* Barra semitransparente de consumidas (detrás) cuando hay actividad */}
              {puntos.some(p => p.gastadas > 0) && (
                <Bar
                  dataKey={p => p.registroExistente ? (p.consumidas ?? 0) : 0}
                  name="Consumidas"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={40}
                  isAnimationActive
                  animationDuration={700}
                  animationEasing="ease-out"
                  fillOpacity={0.2}
                  fill="#6E7A4B"
                />
              )}
            </BarChart>
          </ResponsiveContainer>

          {/* Leyenda */}
          <Leyenda mostrarObjetivo={caloriasObjetivo > 0} />
        </>
      )}
    </div>
  )
}
