import { ClipboardList } from 'lucide-react'
import TimelineEntry from './TimelineEntry'
import EmptyState    from '@/components/ui/EmptyState'

/**
 * Timeline del día: mezcla comidas y actividades, ordenadas por hora.
 */
export default function Timeline({ comidas, actividades, onEliminarComida, onEliminarActividad, onEditarComida }) {
  // Mezclar y ordenar por hora
  const entries = [
    ...comidas.map(r     => ({ ...r, _tipo: 'comida' })),
    ...actividades.map(r => ({ ...r, _tipo: 'actividad' })),
  ].sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Sin registros para este día"
        description="Tocá + para registrar lo que comiste o la actividad que hiciste."
      />
    )
  }

  return (
    <div className="space-y-1">
      {entries.map(entry => (
        <TimelineEntry
          key={`${entry._tipo}-${entry.id}`}
          registro={entry}
          tipo={entry._tipo}
          onEliminar={
            entry._tipo === 'comida'
              ? onEliminarComida
              : onEliminarActividad
          }
          onEditar={
            entry._tipo === 'comida'
              ? onEditarComida
              : null
          }
        />
      ))}
    </div>
  )
}
