// LoginField.jsx — Input reutilizable con label flotante sin auto-zoom en moviles
// El label sube automaticamente al hacer focus o cuando hay valor (CSS peer)

export default function LoginField({
  id,
  label,
  type = "text",
  inputMode,
  value,
  onChange,
  autoFocus,
  autoComplete,
  required,
  rightEl,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        placeholder=" "
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        required={required}
        className="peer w-full bg-[#F0EDE4] border border-cream-darker rounded-xl
                    px-4 pt-[21px] pb-[7px] text-base md:text-[13.5px] leading-tight text-olive-dark font-body
                    placeholder-transparent focus:outline-none focus:ring-2
                  focus:ring-olive/40 focus:border-olive transition-all duration-150
                    pr-10"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-1.5 text-[10px] text-muted font-display leading-none
                    pointer-events-none transition-all duration-150
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                    peer-placeholder-shown:text-[13px] peer-placeholder-shown:text-muted/70
                    peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-olive"
      >
        {label}
      </label>

      {/* Elemento derecho: icono ojo, etc */}
      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightEl}
        </div>
      )}
    </div>
  );
}
