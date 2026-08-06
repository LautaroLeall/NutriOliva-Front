import { Link } from 'react-router-dom'
import { Calendar, FileText, TrendingUp } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const features = [
  {
    icon: FileText,
    title: 'Planes personalizados',
    desc: 'Armá el plan a mano o subí un PDF y dejá que el sistema lo estructure por vos.',
  },
  {
    icon: Calendar,
    title: 'Registro diario',
    desc: 'Tu paciente carga cada comida con descripción, sin fricción.',
  },
  {
    icon: TrendingUp,
    title: 'Balance en tiempo real',
    desc: 'Calorías consumidas, restantes o excedidas — actualizado al instante.',
  },
]

export default function Landing() {
  return (
    <div className="page min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-cream-darker bg-white">
        <div className="flex items-center gap-2 font-display font-bold text-base text-olive-dark">
          <Logo size={24} />
          NutriOliva
        </div>
        <Link to="/login">
          <button className="btn-primary text-sm px-5 py-2">
            Iniciar sesión
          </button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="bg-olive px-6 py-20 text-center">
        <h1 className="font-display font-bold text-cream text-4xl leading-tight mb-4 max-w-lg mx-auto">
          Acompañá a tus pacientes todos los días
        </h1>
        <p className="text-[#DCE3C8] text-base mb-8 max-w-md mx-auto">
          Plan alimenticio, seguimiento diario y balance calórico en tiempo real, en un solo lugar.
        </p>
        <Link to="/login">
          <button
            className="font-display font-semibold text-olive-dark bg-cream px-7 py-3 rounded-pill
                       text-sm transition-all hover:bg-cream-dark hover:-translate-y-0.5"
          >
            Empezar ahora
          </button>
        </Link>

        {/* Pills */}
        <div className="flex gap-3 justify-center mt-10 flex-wrap">
          {['Seguimiento diario', 'Balance en tiempo real', '100% personalizado'].map(p => (
            <span
              key={p}
              className="bg-olive-deep text-[#E4E9D3] font-display text-xs px-4 py-2.5 rounded-xl"
            >
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="flex gap-4 px-6 py-10 flex-wrap max-w-4xl mx-auto">
        {features.map(f => {
          const Icon = f.icon
          return (
            <div key={f.title} className="flex-1 min-w-[220px] card-cream p-5">
              <div className="w-9 h-9 rounded-xl bg-olive mb-3 flex items-center justify-center">
                <Icon size={16} className="text-cream" />
              </div>
              <h3 className="font-display text-sm font-semibold text-olive-dark mb-1.5">{f.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
            </div>
          )
        })}
      </section>

      {/* CTA Quote */}
      <section className="px-6 py-10 text-center">
        <p className="font-editorial italic text-olive-deep text-base max-w-lg mx-auto leading-relaxed">
          "El problema no es que el paciente no quiera seguir el plan — es que entre una consulta
          y la siguiente, nadie lo acompaña."
        </p>
        <div className="mt-8">
          <Link to="/login">
            <button className="btn-primary px-7 py-3 text-sm">
              Probalo gratis
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
