import { BookOpen, Calendar, HeartPulse } from "lucide-react";

export default function TabBar({ tab, setTab }) {
  return (
    <div className="flex border-b border-cream-darker bg-white">
      {[
        { id: "ficha", label: "Registros recientes", icon: BookOpen },
        { id: "diario", label: "Diario del paciente", icon: Calendar },
        { id: "clinica", label: "Datos clínicos", icon: HeartPulse },
      ].map((t) => {
        const Icon = t.icon;
        const actv = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-display
                        transition-colors border-b-2
                        ${
                          actv
                            ? "border-olive text-olive-dark font-semibold"
                            : "border-transparent text-muted hover:text-olive-dark"
                        }`}
          >
            <Icon size={13} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
