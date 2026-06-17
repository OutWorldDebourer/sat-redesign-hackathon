// Marco estandar de pagina interior: encabezado (eyebrow + titulo + copy) sobre
// el contenido de la ruta. Mantiene el ritmo visual entre paginas.

import type { ReactNode } from "react";

export function PageFrame({
  label,
  title,
  copy,
  children,
}: {
  label: string;
  title: string;
  copy: string;
  children: ReactNode;
}) {
  return (
    <section className="page-frame">
      <div className="page-heading">
        <span className="eyebrow">{label}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {children}
    </section>
  );
}
