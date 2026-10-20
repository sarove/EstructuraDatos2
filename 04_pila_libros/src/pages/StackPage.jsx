import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBookStack } from '../context/BookStackContext.jsx';
import Console from '../components/Console.jsx';

/**
 * PANTALLA: PILA DE LIBROS
 * Imprime la pila en pantalla de la CIMA (top) a la BASE y permite
 * usar pop, peek y print con botones.
 * Estudiante: Salvador Rodriguez Velasco
 */

// Colores para los lomos de los libros
const SPINE_COLORS = ['#1e3a8a', '#9d174d', '#065f46', '#92400e', '#5b21b6', '#0f766e', '#b91c1c', '#334155'];
const spineColor = (id) => SPINE_COLORS[id % SPINE_COLORS.length];

export default function StackPage() {
  const { books, top, size, isEmpty, popped, log, popBook, peekBook, printStack, resetStack } =
    useBookStack();
  const location = useLocation();
  const addedId = location.state?.addedId;
  const [peekedId, setPeekedId] = useState(null);

  const handlePeek = () => {
    const book = peekBook();
    setPeekedId(book ? book.id : null);
  };

  const handlePop = () => {
    popBook();
    setPeekedId(null);
  };

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Pantalla 1 · Pila (Stack) · LIFO</p>
        <h1>📚 Pila de libros</h1>
        <p className="lead">
          El último libro que se apila (<code>push</code>) queda en la <strong>cima</strong> y es el
          primero que sale (<code>pop</code>). La pila se imprime de la cima hacia la base.
        </p>
      </div>

      {addedId && books.some((b) => b.id === addedId) && (
        <div className="alert success">
          ✅ Libro agregado en la cima de la pila con <code>push()</code>.
        </div>
      )}

      {/* ---------- Indicadores ---------- */}
      <div className="stats">
        <div className="stat">
          <span className="stat-label">size()</span>
          <span className="stat-value">{size}</span>
        </div>
        <div className="stat">
          <span className="stat-label">isEmpty()</span>
          <span className="stat-value">{String(isEmpty)}</span>
        </div>
        <div className="stat stat-wide">
          <span className="stat-label">peek() · cima</span>
          <span className="stat-value small-value">{top ? top.name : 'null'}</span>
        </div>
      </div>

      {/* ---------- Acciones ---------- */}
      <div className="toolbar">
        <Link to="/nuevo-libro" className="btn btn-primary">
          ➕ Nuevo libro (push)
        </Link>
        <button className="btn" onClick={handlePeek} disabled={isEmpty}>
          👁 Ver cima (peek)
        </button>
        <button className="btn btn-danger" onClick={handlePop} disabled={isEmpty}>
          ⬆ Sacar libro (pop)
        </button>
        <button className="btn" onClick={printStack}>
          🖨 Imprimir (print)
        </button>
        <button className="btn btn-ghost" onClick={resetStack}>
          ↺ Reiniciar datos
        </button>
      </div>

      <div className="grid-2">
        {/* ---------- Pila visual ---------- */}
        <div className="panel">
          <h3>Pila visual</h3>
          {isEmpty ? (
            <div className="empty">
              <p>La pila está vacía.</p>
              <p className="muted small">
                <code>pop()</code> y <code>peek()</code> retornan <code>null</code>.
              </p>
            </div>
          ) : (
            <div className="stack-visual">
              {books.map((book, i) => (
                <div
                  key={book.id}
                  className={[
                    'book',
                    i === 0 ? 'book-top' : '',
                    book.id === addedId ? 'book-new' : '',
                    book.id === peekedId ? 'book-peeked' : '',
                  ].join(' ')}
                  style={{ '--spine': spineColor(book.id) }}
                >
                  {i === 0 && <span className="top-marker">TOP →</span>}
                  <span className="book-title">{book.name}</span>
                  <span className="book-author">{book.author}</span>
                </div>
              ))}
              <div className="stack-base">BASE</div>
            </div>
          )}
        </div>

        {/* ---------- Libros retirados ---------- */}
        <div className="panel">
          <h3>
            Libros retirados con pop() <span className="muted">· {popped.length}</span>
          </h3>
          {popped.length === 0 ? (
            <p className="muted small">
              Aún no se ha sacado ningún libro. Use “Sacar libro (pop)”: siempre sale el de la cima.
            </p>
          ) : (
            <ol className="popped-list">
              {popped.map((book) => (
                <li key={book.id}>
                  <strong>{book.name}</strong>
                  <span className="muted small"> · {book.author}</span>
                </li>
              ))}
            </ol>
          )}
          <div className="info-box">
            <strong>LIFO:</strong> el orden de salida es el inverso del orden de entrada. Por eso la
            lista de retirados muestra primero el último que salió.
          </div>
        </div>
      </div>

      {/* ---------- Impresión de la pila en pantalla ---------- */}
      <div className="panel">
        <h3>Impresión de la pila (cima → base)</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Nombre</th>
                <th>ISBN</th>
                <th>Autor</th>
                <th>Editorial</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">
                    (pila vacía)
                  </td>
                </tr>
              ) : (
                books.map((book, i) => (
                  <tr key={book.id} className={i === 0 ? 'row-top' : ''}>
                    <td>
                      {size - i}
                      {i === 0 && <span className="badge">cima</span>}
                      {i === books.length - 1 && <span className="badge badge-muted">base</span>}
                    </td>
                    <td>{book.name}</td>
                    <td className="mono">{book.isbn}</td>
                    <td>{book.author}</td>
                    <td>{book.editorial}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Console lines={log} />
    </section>
  );
}
