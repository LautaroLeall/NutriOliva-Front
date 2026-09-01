import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function VersionSelector({ planes, planVisibleId, onSelect }) {
  const [open, setOpen] = useState(false);
  const actual = planes.find((p) => p.id === planVisibleId) || planes[0];

  const estadoLabel = {
    borrador: "Borrador",
    activo: "Activo",
    archivado: "Archivado",
  };
  const estadoDot = {
    borrador: "bg-amber-400",
    activo: "bg-green-500",
    archivado: "bg-gray-400",
  };

  if (planes.length <= 1) return null;

  return (
    <div className="relative mb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-white border border-cream-darker rounded-xl
                  px-4 py-2.5 font-display text-sm text-olive-dark hover:bg-cream transition-colors"
      >
        <span
          className={`w-2 h-2 rounded-full ${estadoDot[actual?.estado] || "bg-gray-400"}`}
        />
        Plan v{actual?.version} — {estadoLabel[actual?.estado]}
        <ChevronDown
          size={13}
          className={`ml-1 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 bg-white border border-cream-darker
                        rounded-xl shadow-modal z-10 min-w-[220px] overflow-hidden"
        >
          {planes.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onSelect(p);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left font-display text-[12px]
                          transition-colors hover:bg-cream
                          ${p.id === planVisibleId ? "bg-cream text-olive-dark font-semibold" : "text-muted"}`}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${estadoDot[p.estado] || "bg-gray-400"}`}
              />
              <span>Plan v{p.version}</span>
              <span className="text-[10px] text-muted ml-auto">
                {estadoLabel[p.estado]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
