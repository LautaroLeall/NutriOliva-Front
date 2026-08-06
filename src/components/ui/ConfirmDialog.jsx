import { AlertTriangle, Trash2, X } from 'lucide-react'

/**
 * Diálogo de confirmación para acciones destructivas o importantes.
 *
 * @param {boolean}  open         - Si el diálogo está visible
 * @param {function} onClose      - Cancelar
 * @param {function} onConfirm    - Confirmar (puede ser async)
 * @param {string}   title        - Título del diálogo
 * @param {string}   message      - Mensaje descriptivo
 * @param {string}   [confirmLabel] - Texto del botón de confirmación
 * @param {string}   [variant]    - 'danger' | 'warning' | 'default'
 * @param {boolean}  [loading]    - Si está procesando
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  variant = 'danger',
  loading = false,
}) {
  if (!open) return null

  const variantConfig = {
    danger: {
      icon:       <Trash2 size={18} className="text-red-500" />,
      iconBg:     'bg-red-50',
      confirmBtn: 'bg-red-500 hover:bg-red-600 text-white',
    },
    warning: {
      icon:       <AlertTriangle size={18} className="text-amber-500" />,
      iconBg:     'bg-amber-50',
      confirmBtn: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    default: {
      icon:       null,
      iconBg:     'bg-olive/10',
      confirmBtn: 'bg-olive hover:bg-olive-deep text-cream',
    },
  }

  const cfg = variantConfig[variant] || variantConfig.default

  return (
    <div
      className="fixed inset-0 bg-olive-dark/50 z-[60] flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && !loading && onClose()}
    >
      <div className="bg-white rounded-card shadow-modal w-full max-w-sm animate-fade-scale">
        <div className="p-6">
          {/* Icon */}
          {cfg.icon && (
            <div className={`w-10 h-10 rounded-full ${cfg.iconBg} flex items-center justify-center mb-4`}>
              {cfg.icon}
            </div>
          )}

          <h3 className="font-display font-semibold text-[15px] text-olive-dark mb-2">{title}</h3>
          <p className="text-[12.5px] text-muted leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-2 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg border border-cream-darker bg-white text-muted
                       font-display text-[12px] hover:bg-cream transition-colors
                       flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <X size={12} /> Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-lg font-display text-[12px] font-medium
                        transition-colors flex items-center justify-center gap-1.5
                        disabled:opacity-60 ${cfg.confirmBtn}`}
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
