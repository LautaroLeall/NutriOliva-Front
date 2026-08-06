/**
 * Logo SVG de NutriOliva.
 * Hoja estilizada en negativo dentro de un círculo oliva.
 */
export default function Logo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      className={className}
      aria-label="NutriOliva logo"
    >
      <circle cx="110" cy="110" r="100" fill="#6E7A4B" />
      <path
        d="M110,58 C72,70 60,112 110,162 C160,112 148,70 110,58 Z"
        fill="#F6F1E7"
      />
    </svg>
  )
}
