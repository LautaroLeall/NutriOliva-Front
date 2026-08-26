// Estado vacío genérico con ícono, título y descripción.
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-olive/10 flex items-center justify-center mb-4">
          <Icon size={22} className="text-olive" />
        </div>
      )}
      <h3 className="font-display text-sm font-semibold text-olive-dark mb-1.5">{title}</h3>
      {description && (
        <p className="text-xs text-muted leading-relaxed max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
