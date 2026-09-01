export function toLocalISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatFechaLegible(iso) {
  const hoy = toLocalISO(new Date());
  const ayer = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return toLocalISO(d);
  })();
  if (iso === hoy) return "Hoy";
  if (iso === ayer) return "Ayer";
  return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
