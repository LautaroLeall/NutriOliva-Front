import { X } from "lucide-react";
import { useEffect } from "react";

/**
 * Modal reutilizable con overlay, bloqueo de scroll de fondo, altura maxima dinamica (dvh)
 * y cuerpo desplazable interno para iOS, Android y PC/Windows.
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  preventOverlayClose = false,
}) {
  // Cerrar con Escape y bloquear scroll del body mientras esta abierto
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handler = (e) => {
      if (!preventOverlayClose && e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose, preventOverlayClose]);

  if (!open) return null;

  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

  return (
    <div
      className="fixed inset-0 bg-olive-dark/45 z-50 flex items-center justify-center p-3 sm:p-4 pt-safe pb-safe overflow-hidden"
      onClick={(e) =>
        !preventOverlayClose && e.target === e.currentTarget && onClose()
      }
    >
      <div
        className={`bg-white rounded-card shadow-modal w-full ${widths[size]} max-h-[calc(100dvh-1.5rem)] sm:max-h-[90dvh] flex flex-col overflow-hidden animate-fade-scale`}
      >
        {/* Header fijo */}
        <div className="flex-shrink-0 flex justify-between items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-cream-darker">
          <h3 className="font-display font-semibold text-[14px] sm:text-[14.5px] text-olive-dark truncate min-w-0">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-olive-dark transition-colors p-1.5 -mr-1 rounded-lg hover:bg-cream flex-shrink-0 cursor-pointer"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body con scroll interno suave si la pantalla o el teclado reducen el alto */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
