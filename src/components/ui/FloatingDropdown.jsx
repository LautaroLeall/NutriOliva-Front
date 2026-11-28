import { createPortal } from "react-dom";
import { useLayoutEffect, useState } from "react";

/**
 * Dropdown flotante renderizado en document.body.
 * Escucha window.visualViewport para adaptarse en vivo cuando se abre el teclado
 * virtual en iOS o Android sin quedar oculto detras del teclado.
 */
export default function FloatingDropdown({
  anchorRef,
  visible,
  children,
  maxH = 220,
}) {
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    dynamicMaxH: maxH,
  });

  useLayoutEffect(() => {
    if (!visible || !anchorRef?.current) return;

    function calcular() {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;

      const vv = window.visualViewport;
      const viewportW = vv ? vv.width : window.innerWidth;
      const viewportH = vv ? vv.height : window.innerHeight;
      const offsetTop = vv ? vv.offsetTop : 0;

      const availableBelow = viewportH + offsetTop - rect.bottom - 12;
      const dynamicMaxH = Math.max(120, Math.min(maxH, availableBelow));
      const safeWidth = Math.min(rect.width, viewportW - 16);
      const safeLeft = Math.max(8, Math.min(rect.left, viewportW - safeWidth - 8));

      setCoords({
        top: rect.bottom + 4,
        left: safeLeft,
        width: safeWidth,
        dynamicMaxH,
      });
    }

    calcular();

    const vv = window.visualViewport;
    window.addEventListener("scroll", calcular, true);
    window.addEventListener("resize", calcular);
    vv?.addEventListener("resize", calcular);
    vv?.addEventListener("scroll", calcular);

    return () => {
      window.removeEventListener("scroll", calcular, true);
      window.removeEventListener("resize", calcular);
      vv?.removeEventListener("resize", calcular);
      vv?.removeEventListener("scroll", calcular);
    };
  }, [visible, anchorRef, maxH]);

  if (!visible) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        width: coords.width,
        zIndex: 9999,
        maxHeight: coords.dynamicMaxH,
      }}
      className="bg-white border border-cream-darker rounded-xl shadow-lg overflow-y-auto overscroll-contain"
    >
      {children}
    </div>,
    document.body
  );
}
