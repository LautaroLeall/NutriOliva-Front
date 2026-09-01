import { Send, FilePen, Trash2, Loader2 } from 'lucide-react'

export default function PlanHeader({ plan, onPublicar, onNuevaVersion, onEliminar, publicando }) {
  const estado = {
    borrador: { label: 'Borrador', dot: 'bg-amber-400' },
    activo: { label: 'Activo', dot: 'bg-green-500' },
    archivado: { label: 'Archivado', dot: 'bg-gray-400' },
  }[plan.estado] || { label: plan.estado, dot: 'bg-gray-400' }

  const puedeEliminar = plan.estado !== 'activo'

  return (
    <div className="card p-5 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-display font-semibold text-base text-olive-dark">
              Plan v{plan.version}
            </span>
            <span className="flex items-center gap-1 text-[10.5px] font-display">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${estado.dot}`} />
              {estado.label}
            </span>
          </div>
          {plan.notas && (
            <p className="text-[11px] text-olive italic mb-1">"{plan.notas}"</p>
          )}
          <p className="text-[11px] text-muted">
            {plan.calorias_objetivo} kcal/día · {plan.comidas_plan?.length || 0} items
          </p>
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          {plan.estado === 'borrador' && (
            <button
              onClick={onPublicar}
              disabled={publicando || !plan.comidas_plan?.length}
              title={!plan.comidas_plan?.length ? 'Agregá al menos 1 comida para publicar' : ''}
              className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5 disabled:opacity-50"
            >
              {publicando
                ? <><Loader2 size={12} className="animate-spin" /> Publicando...</>
                : <><Send size={12} /> Publicar</>}
            </button>
          )}
          {plan.estado === 'activo' && (
            <button onClick={onNuevaVersion}
              className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5">
              <FilePen size={12} /> Nueva versión
            </button>
          )}
          {puedeEliminar && (
            <button onClick={onEliminar}
              className="text-xs px-3 py-2 rounded-lg bg-red-50 text-red-500 font-display
                        hover:bg-red-100 transition-colors flex items-center gap-1.5">
              <Trash2 size={12} /> Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
