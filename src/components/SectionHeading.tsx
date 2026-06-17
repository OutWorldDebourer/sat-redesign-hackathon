// Encabezado de seccion reutilizable (eyebrow + titulo + copy) para bloques del
// home y paginas. Sin estado.

export function SectionHeading({
  label,
  title,
  copy,
}: {
  label: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{label}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}
