// LoginField.jsx — Input reutilizable con label flotante
// El label sube automáticamente al hacer focus o cuando hay valor (CSS peer)

export default function LoginField({
  id,
  label,
  type = "text",
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
        value={value}
        onChange={onChange}
        placeholder=" "
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        required={required}
        className="peer w-full bg-[#F0EDE4] border border-cream-darker rounded-xl
                    px-4 pt-5 pb-2 text-[13.5px] text-olive-dark font-body
                    placeholder-transparent focus:outline-none focus:ring-2
                  focus:ring-olive/40 focus:border-olive transition-all duration-150
                    pr-10"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-2 text-[10.5px] text-muted font-display
                    transition-all duration-150
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px]
                  peer-placeholder-shown:text-muted/60
                    peer-focus:top-2 peer-focus:text-[10.5px] peer-focus:text-olive"
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
