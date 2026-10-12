// Muestra en pantalla los mismos recorridos que se imprimen por consola.
export default function Recorridos({ arbol }) {
  const filas = [
    ['InOrder', 'L-N-R', arbol.inOrder()],
    ['PostOrder', 'L-R-N', arbol.postOrder()],
    ['PreOrder', 'N-L-R', arbol.preOrder()],
  ];

  return (
    <div className="recorridos">
      <h2>Recorridos</h2>
      {filas.map(([nombre, regla, valores]) => (
        <div key={nombre} className="recorrido">
          <span className="nombre">
            {nombre} <small>({regla})</small>
          </span>
          <code>{valores.length ? valores.join(' ') : '—'}</code>
        </div>
      ))}
      <p className="nota">Abre la consola del navegador (F12) para ver la impresión de los recorridos.</p>
    </div>
  );
}
