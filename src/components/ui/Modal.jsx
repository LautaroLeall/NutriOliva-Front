import { X } from 'lucide-react'
import { useEffect } from 'react'

/**
 * Modal reutilizable con overlay y tecla Escape para cerrar.
 * {boolean}   open                - Si el modal está visible
 * {function}  onClose             - Callback al cerrar
 * {string}    title               - Título del modal
 * {ReactNode} children            - Contenido
 * {string}    [size]              - 'sm' | 'md' | 'lg'
 * {boolean}   [preventOverlayClose] - Si true, click en overlay NO cierra el modal
 */
export default function Modal({ open, onClose, title, children, size = 'md', preventOverlayClose = false }) {
  // Cerrar con Escape (solo si no está prevenido)
  useEffect(() => {
    if (!open || preventOverlayClose) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose, preventOverlayClose])

  if (!open) return null

  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

  return (
    <div
      className="fixed inset-0 bg-olive-dark/45 z-50 flex items-center justify-center p-4"
      onClick={e => !preventOverlayClose && e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white rounded-card shadow-modal w-full ${widths[size]} animate-fade-scale`}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-cream-darker">
          <h3 className="font-display font-semibold text-[14.5px] text-olive-dark">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-olive-dark transition-colors p-0.5 rounded"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
