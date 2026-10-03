/**
 * Encabezado común de las páginas: muestra los datos del nodo del
 * árbol que la originó (title, link, component, nivel e hijos).
 */
export default function PageHeader({ nodo, nivel, children }) {
  const { title, link, icon, component } = nodo.valor;
  const nombreComponente = component.displayName || component.name;

  return (
    <div className="page-header">
      <h1>
        <span className="page-icon">{icon}</span>
        {title}
      </h1>
      {children && <p className="lead">{children}</p>}
      <div className="node-meta">
        <span>
          <b>link</b> {link}
        </span>
        <span>
          <b>component</b> &lt;{nombreComponente} /&gt;
        </span>
        <span>
          <b>nivel</b> {nivel}
        </span>
        <span>
          <b>hijos</b> {nodo.hijos.length}
        </span>
        <span>
          <b>tipo</b> {nodo.esHoja() ? 'hoja' : nivel === 0 ? 'raíz' : 'rama'}
        </span>
      </div>
    </div>
  );
}
