// PasswordStrength.jsx — Indicador visual de fortaleza de contrasena
// Muestra barra de 3 niveles + checklist de reglas

export const RULES = [
  { id: "len", label: "Al menos 8 caracteres", test: (p) => p.length >= 8 },
  {
    id: "upper",
    label: "Al menos una mayuscula",
    test: (p) => /[A-Z]/.test(p),
  },
  { id: "number", label: "Al menos un numero", test: (p) => /[0-9]/.test(p) },
];

export default function PasswordStrength({ password }) {
  if (!password) return null;

  const passed = RULES.filter((r) => r.test(password)).length;

  // Color de la barra segun cuantas reglas pasan
  const barColor =
    passed === 1
      ? "bg-accent" // debil — rojo
      : passed === 2
        ? "bg-warning" // medio — amarillo
        : "bg-success"; // fuerte — verde

  return (
    <div className="mt-2 space-y-2">
      {/* Barra de fuerza — 3 segmentos */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < passed ? barColor : "bg-cream-darker"
            }`}
          />
        ))}
      </div>

      {/* Checklist de reglas */}
      <div className="space-y-1">
        {RULES.map((r) => {
          const ok = r.test(password);
          return (
            <div key={r.id} className="flex items-center gap-2">
              <span
                className={`w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center
                            transition-colors duration-200
                            ${ok ? "bg-success/20" : "bg-cream-darker"}`}
              >
                {ok && (
                  <span className="text-success text-[8px] font-bold">✓</span>
                )}
              </span>
              <span
                className={`text-[11px] transition-colors duration-200
                            ${ok ? "text-olive-dark" : "text-muted"}`}
              >
                {r.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
