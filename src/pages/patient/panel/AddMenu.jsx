import { Dumbbell, Flame } from "lucide-react";

export default function AddMenu({ onComida, onActividad, onClose }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-end pb-24 px-5"
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-2 items-end"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            onActividad();
            onClose();
          }}
          className="flex items-center gap-3 bg-white border border-cream-darker rounded-2xl
                    px-5 py-3 shadow-modal font-display text-[13px] text-olive-dark
                  hover:bg-cream transition-colors animate-fade-scale"
        >
          Actividad física
          <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <Dumbbell size={14} className="text-blue-400" />
          </span>
        </button>
        <button
          onClick={() => {
            onComida();
            onClose();
          }}
          className="flex items-center gap-3 bg-white border border-cream-darker rounded-2xl
                    px-5 py-3 shadow-modal font-display text-[13px] text-olive-dark
                  hover:bg-cream transition-colors animate-fade-scale"
        >
          Lo que comí
          <span className="w-8 h-8 rounded-full bg-olive/10 flex items-center justify-center">
            <Flame size={14} className="text-olive" />
          </span>
        </button>
      </div>
    </div>
  );
}
