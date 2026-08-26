import { useState } from 'react'
import {
  Users, CreditCard, BarChart2, Settings,
  Plus, LogOut, Pencil, X, Check
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Logo from '@/components/ui/Logo'

const PLANS = {
  starter: {
    label: 'Starter', price: 75000, patients: 10
  },
  pro: {
    label: 'Pro', price: 125000, patients: 25
  },
  clinic: {
    label: 'Clinic', price: 150000, patients: 50
  },
}

const STATUS_CONFIG = {
  'Activo': {
    dot: 'bg-success', text: 'Activo'
  },
  'Pago pendiente': {
    dot: 'bg-warning', text: 'Pago pendiente'
  },
  'Inactivo': {
    dot: 'bg-danger', text: 'Inactivo'
  },
}

const NAV_ITEMS = [
  { label: 'Nutricionistas', icon: Users },
  { label: 'Facturación', icon: CreditCard },
  { label: 'Métricas', icon: BarChart2 },
  { label: 'Ajustes', icon: Settings },
]

// Datos de ejemplo — se reemplaza con datos reales de Supabase en E0
const SAMPLE_NUTRIS = [
  { id: 1, name: 'Elena Medina', email: 'elena@ejemplo.com', plan: 'clinic', patients: 0, status: 'Activo' },
  { id: 2, name: 'Carlos Mendoza', email: 'carlos@ejemplo.com', plan: 'pro', patients: 0, status: 'Activo' },
]

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function formatARS(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(amount)
}

export default function AdminPanel() {
  const { signOut } = useAuth()
  const [nutris, setNutris] = useState(SAMPLE_NUTRIS)
  const [activeNav, setActiveNav] = useState('Nutricionistas')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', plan: 'starter', status: 'Activo' })

  // Métricas
  const totalNutris = nutris.length
  const totalPatients = nutris.reduce((s, n) => s + n.patients, 0)
  const activeNutris = nutris.filter(n => n.status !== 'Inactivo')
  const totalRevenue = activeNutris.reduce((s, n) => s + PLANS[n.plan].price, 0)
  const planCount = { starter: 0, pro: 0, clinic: 0 }
  activeNutris.forEach(n => planCount[n.plan]++)

  function openCreate() {
    setEditingId(null)
    setForm({ name: '', email: '', plan: 'starter', status: 'Activo' })
    setModalOpen(true)
  }

  function openEdit(n) {
    setEditingId(n.id)
    setForm({ name: n.name, email: n.email, plan: n.plan, status: n.status })
    setModalOpen(true)
  }

  function saveNutricionista() {
    if (!form.name.trim()) return
    if (editingId) {
      setNutris(prev => prev.map(n => n.id === editingId ? { ...n, ...form } : n))
    } else {
      setNutris(prev => [...prev, {
        id: Date.now(), name: form.name,
        email: form.email || 'sin-mail@nutrioliva.com',
        plan: form.plan, patients: 0, status: form.status,
      }])
    }
    setModalOpen(false)
  }

  const metrics = [
    { label: 'Nutricionistas', value: totalNutris, sub: 'activos en la plataforma' },
    { label: 'Pacientes totales', value: totalPatients, sub: 'bajo seguimiento activo' },
    {
      label: 'Ingresos est. / mes',
      value: formatARS(totalRevenue),
      sub: `${planCount.starter} Starter · ${planCount.pro} Pro · ${planCount.clinic} Clinic`,
    },
  ]

  return (
    <div className="page min-h-screen bg-[#EFEAE0]">
      <div className="max-w-[960px] mx-auto py-8 px-4">
        <div className="card overflow-hidden">
          <div className="flex min-h-[600px]">

            {/* Sidebar */}
            <aside className="w-44 flex-shrink-0 bg-olive-dark flex flex-col">
              <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[#55613A]">
                <Logo size={26} />
                <div>
                  <div className="font-display font-semibold text-cream text-[13px] leading-tight">NutriOliva</div>
                  <div className="text-[8.5px] text-[#9AA37D] uppercase tracking-wider mt-0.5">Super Admin</div>
                </div>
              </div>

              <nav className="flex-1 px-2 py-3 space-y-0.5">
                {NAV_ITEMS.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => setActiveNav(label)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left
                              font-display text-[11.5px] transition-all duration-100
                              ${activeNav === label
                        ? 'bg-olive text-cream'
                        : 'text-[#C9D3AC] hover:bg-[#4A5633]'}`}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </nav>

              <div className="px-3 pb-4 space-y-2">
                <button
                  onClick={openCreate}
                  className="w-full bg-olive text-cream font-display text-[11px] py-2.5
                            rounded-lg hover:bg-olive-deep transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus size={12} />
                  Crear nutricionista
                </button>
                <button
                  onClick={signOut}
                  className="w-full text-[#9AA37D] font-display text-[10px] py-2 rounded-lg
                            hover:text-cream transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut size={11} />
                  Salir
                </button>
              </div>
            </aside>

            {/* Content */}
            <main className="flex-1 p-6 bg-white min-w-0">
              <div className="mb-5">
                <h2 className="font-display text-lg text-olive-dark">Panel general</h2>
                <p className="font-editorial italic text-muted text-xs mt-0.5">
                  Visión global de la plataforma NutriOliva.
                </p>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {metrics.map(m => (
                  <div key={m.label} className="bg-cream border border-cream-darker rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-display text-[9.5px] uppercase tracking-wide text-muted">
                        {m.label}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-olive flex-shrink-0" />
                    </div>
                    <div className="font-display text-[22px] font-semibold text-olive-dark leading-tight">
                      {m.value}
                    </div>
                    <div className="text-[10px] text-success mt-1 font-display">{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Tabla */}
              <div className="border border-cream-darker rounded-xl overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 bg-cream border-b border-cream-darker">
                  <h3 className="font-display text-[12.5px] font-semibold text-olive-dark">
                    Directorio de nutricionistas
                  </h3>
                  <button
                    onClick={openCreate}
                    className="btn-secondary text-[11px] px-3 py-1.5 flex items-center gap-1"
                  >
                    <Plus size={11} />
                    Nuevo
                  </button>
                </div>

                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['Profesional', 'Plan', 'Pacientes', 'Estado', ''].map(h => (
                        <th
                          key={h}
                          className="bg-white text-muted font-display text-[9.5px] uppercase
                                    tracking-wide text-left px-4 py-2.5 border-b border-cream-dark"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nutris.map(n => {
                      const st = STATUS_CONFIG[n.status]
                      return (
                        <tr key={n.id} className="border-b border-cream last:border-0 hover:bg-cream/40 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <span className="avatar text-[10px]">{initials(n.name)}</span>
                              <div>
                                <div className="font-semibold text-olive-dark text-[12px]">{n.name}</div>
                                <div className="text-[10px] text-muted">{n.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`badge badge-${n.plan}`}>{PLANS[n.plan].label}</span>
                          </td>
                          <td className="px-4 py-3 text-[12px] text-olive-dark">{n.patients}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-olive-dark">
                              <span className={`status-dot ${st.dot}`} />
                              {st.text}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => openEdit(n)}
                              className="border border-cream-darker text-olive font-display text-[10px]
                                        px-3 py-1.5 rounded-full hover:bg-cream transition-colors
                                        flex items-center gap-1 ml-auto"
                            >
                              <Pencil size={10} />
                              Editar
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-olive-dark/45 z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="bg-white rounded-card p-6 w-80 shadow-modal animate-fade-scale">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-[14.5px] text-olive-dark">
                {editingId ? 'Editar nutricionista' : 'Nuevo nutricionista'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted hover:text-olive-dark transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="label">Nombre completo</label>
                <input className="input" placeholder="Ej: Elena Medina"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Mail</label>
                <input className="input" type="email" placeholder="mail@ejemplo.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="label">Plan</label>
                <select className="input" value={form.plan}
                  onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}>
                  <option value="starter">Starter — hasta 10 pac. · {formatARS(75000)}/mes</option>
                  <option value="pro">Pro — hasta 25 pac. · {formatARS(125000)}/mes</option>
                  <option value="clinic">Clinic — hasta 50 pac. · {formatARS(150000)}/mes</option>
                </select>
              </div>
              <div>
                <label className="label">Estado de pago</label>
                <select className="input" value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="Activo">Activo</option>
                  <option value="Pago pendiente">Pago pendiente</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-cream-dark text-muted font-display
                          text-[11.5px] cursor-pointer hover:bg-cream-darker transition-colors
                          flex items-center justify-center gap-1.5"
              >
                <X size={12} />
                Cancelar
              </button>
              <button
                onClick={saveNutricionista}
                className="flex-1 py-2.5 rounded-lg bg-olive text-cream font-display
                          text-[11.5px] cursor-pointer hover:bg-olive-deep transition-colors
                          flex items-center justify-center gap-1.5"
              >
                <Check size={12} />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
