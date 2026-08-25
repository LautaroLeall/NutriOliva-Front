import { createPortal } from 'react-dom'
import { useLayoutEffect, useState } from 'react'

/**
 * Dropdown flotante que se renderiza en el body del documento.
 * Usa position:fixed basado en getBoundingClientRect del anchorRef.
 * Nunca queda cortado por overflow:hidden de los contenedores padre.
 *
 * @param {React.RefObject} anchorRef - ref del elemento que actúa como ancla (input)
 * @param {boolean}         visible   - si el dropdown debe mostrarse
 * @param {React.ReactNode} children  - contenido del dropdown
 * @param {number}          maxH      - max-height en px (default 220)
 */
export default function FloatingDropdown({ anchorRef, visible, children, maxH = 220 }) {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })

  useLayoutEffect(() => {
    if (!visible || !anchorRef?.current) return

    function calcular() {
      const rect = anchorRef.current?.getBoundingClientRect()
      if (!rect) return
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      })
    }

    calcular()

    // Recalcular si el usuario hace scroll o redimensiona
    window.addEventListener('scroll', calcular, true)
    window.addEventListener('resize', calcular)
    return () => {
      window.removeEventListener('scroll', calcular, true)
      window.removeEventListener('resize', calcular)
    }
  }, [visible, anchorRef])

  if (!visible) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        width: coords.width,
        zIndex: 9999,
        maxHeight: maxH,
      }}
      className="bg-white border border-cream-darker rounded-xl shadow-lg overflow-y-auto"
    >
      {children}
    </div>,
    document.body
  )
}
