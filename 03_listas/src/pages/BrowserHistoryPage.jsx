import { useState } from 'react';
import { DoublyLinkedList } from '../structures/DoublyLinkedList.js';
import { fakePages, bookmarkPages } from '../data/webPages.js';

/**
 * PÁGINA 2: LISTA DOBLEMENTE ENLAZADA
 * Historial de un navegador: cada nodo es una página visitada.
 *   - Atrás    -> current = current.prev
 *   - Adelante -> current = current.next
 *   - Visitar  -> se corta el historial "hacia adelante" y se hace append
 * Estudiante: Salvador Rodriguez Velasco
 */

// Generador simple de identificadores únicos para cada nodo
let nextId = 1;
const newId = () => nextId++;

// Llena la lista doblemente enlazada con datos falsos (fake)
function createHistory() {
  const list = new DoublyLinkedList();
  fakePages.forEach((page) => list.append({ ...page, id: newId() }));
  return list;
}

export default function BrowserHistoryPage() {
  const [history] = useState(createHistory);

  // El navegador inicia en la última página visitada (tail)
  const [current, setCurrent] = useState(() => history.tail);
  const [address, setAddress] = useState(() => history.tail?.value.url ?? '');
  const [console_, setConsole] = useState([]);
  const [, setVersion] = useState(0);

  const refresh = () => setVersion((v) => v + 1);
  const log = (msg) => setConsole((prev) => [msg, ...prev].slice(0, 8));

  const goTo = (node, message) => {
    if (!node) return;
    setCurrent(node);
    setAddress(node.value.url);
    if (message) log(message);
  };

  // ---------- Navegación ----------

  // Atrás: usar el puntero prev
  const handleBack = () => goTo(current?.prev, `Atrás: current = current.prev → ${current?.prev?.value.title}`);

  // Adelante: usar el puntero next
  const handleForward = () =>
    goTo(current?.next, `Adelante: current = current.next → ${current?.next?.value.title}`);

  // Ir al inicio (head) y al final (tail)
  const handleFirst = () => goTo(history.head, 'Inicio del historial: current = head');
  const handleLast = () => goTo(history.tail, 'Fin del historial: current = tail');

  // Visitar una página nueva
  const visit = (page) => {
    // Si el usuario había regresado, las páginas "adelante" se descartan
    let discarded = 0;
    if (current && current.next) {
      discarded = history.truncateAfter(current);
    }
    const node = history.append({ ...page, id: newId() });
    goTo(
      node,
      `append("${page.title}")${discarded ? ` · se descartaron ${discarded} página(s) adelante` : ''} → size = ${history.size()}`
    );
    refresh();
  };

  // Barra de direcciones: visitar una URL escrita por el usuario
  const handleSubmit = (e) => {
    e.preventDefault();
    let url = address.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

    // peek: si la URL es la página actual, no se duplica
    if (current && current.value.url === url) return;

    let host = url;
    try {
      host = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      /* URL inválida: se usa el texto tal cual */
    }
    visit({ url, title: host, icon: '🌐', color: '#475569', content: 'Página visitada desde la barra de direcciones.' });
  };

  // peek: saltar a un nodo del historial haciendo clic
  const handleJump = (id) => {
    const node = history.peek((page) => page.id === id);
    if (node) goTo(node, `peek(id) → ${node.value.title}`);
  };

  // remove: borrar una página del historial reconectando prev y next
  const handleRemove = (id) => {
    const isCurrent = current && current.value.id === id;
    const fallback = isCurrent ? current.prev ?? current.next : current;
    const removed = history.remove((page) => page.id === id);
    if (!removed) return;
    if (isCurrent) {
      if (fallback) goTo(fallback);
      else {
        setCurrent(null);
        setAddress('');
      }
    }
    log(`remove("${removed.value.title}") → size = ${history.size()}`);
    refresh();
  };

  const handlePrint = () => log(`print(): ${history.print((p) => p.title)}`);
  const handlePrintReverse = () => log(`printReverse(): ${history.printReverse((p) => p.title)}`);

  const nodes = history.toArray();
  const page = current?.value;

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Página 2 · Lista doblemente enlazada</p>
        <h1>🌐 Historial del navegador</h1>
        <p className="lead">
          Cada página visitada es un nodo con <code>prev</code> y <code>next</code>. Los botones Atrás y
          Adelante recorren la lista en ambos sentidos.
        </p>
      </div>

      {/* ---------- Navegador simulado ---------- */}
      <div className="browser">
        <div className="browser-bar">
          <div className="dots">
            <span />
            <span />
            <span />
          </div>
          <button className="nav-btn" onClick={handleFirst} disabled={!current || current === history.head} title="Ir a head">
            ⇤
          </button>
          <button className="nav-btn" onClick={handleBack} disabled={!current?.prev} title="Atrás (prev)">
            ←
          </button>
          <button className="nav-btn" onClick={handleForward} disabled={!current?.next} title="Adelante (next)">
            →
          </button>
          <button className="nav-btn" onClick={handleLast} disabled={!current || current === history.tail} title="Ir a tail">
            ⇥
          </button>
          <form className="address" onSubmit={handleSubmit}>
            <span className="lock">🔒</span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              aria-label="Barra de direcciones"
              placeholder="Escriba una URL y presione Enter"
            />
          </form>
        </div>

        <div className="browser-view" style={{ '--page-color': page?.color ?? '#94a3b8' }}>
          {page ? (
            <>
              <div className="site-icon">{page.icon}</div>
              <h2>{page.title}</h2>
              <p className="site-url">{page.url}</p>
              <p>{page.content}</p>
              <div className="site-meta">
                <span>prev: {current.prev ? current.prev.value.title : 'null'}</span>
                <span>next: {current.next ? current.next.value.title : 'null'}</span>
              </div>
            </>
          ) : (
            <p className="muted">Historial vacío. Visite una página.</p>
          )}
        </div>

        <div className="bookmarks">
          <span className="muted small">Visitar enlace:</span>
          {bookmarkPages.map((b) => (
            <button key={b.url} className="chip" onClick={() => visit(b)}>
              {b.icon} {b.title}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Visualización de nodos ---------- */}
      <div className="panel">
        <h3>
          Estructura en memoria <span className="muted">· size() = {history.size()}</span>
        </h3>
        <div className="chain">
          <span className="null-box">null</span>
          <span className="arrow">←</span>
          {nodes.map((node, i) => (
            <div key={node.value.id} className="chain-item">
              <div className={node === current ? 'node node-current' : 'node'}>
                <div className="node-ptrs">
                  <span>prev</span>
                  <span>next</span>
                </div>
                <button className="node-value as-link" onClick={() => handleJump(node.value.id)}>
                  {node.value.icon} {node.value.title}
                </button>
                <button className="node-remove" title="Eliminar (remove)" onClick={() => handleRemove(node.value.id)}>
                  ✕
                </button>
              </div>
              <span className="arrow">{i < nodes.length - 1 ? '⇄' : '→'}</span>
            </div>
          ))}
          <span className="null-box">null</span>
        </div>
        <p className="muted small">
          head = {history.head ? `"${history.head.value.title}"` : 'null'} · tail ={' '}
          {history.tail ? `"${history.tail.value.title}"` : 'null'} · length = {history.length} · Haga
          clic en un nodo para saltar a él (peek).
        </p>
        <div className="actions">
          <button className="btn" onClick={handlePrint}>
            🖨 print() head → tail
          </button>
          <button className="btn" onClick={handlePrintReverse}>
            🔁 printReverse() tail → head
          </button>
        </div>
      </div>

      <div className="panel console">
        <h3>Consola</h3>
        {console_.length === 0 ? (
          <p className="muted small">Las operaciones sobre la lista aparecerán aquí.</p>
        ) : (
          <ul>
            {console_.map((line, i) => (
              <li key={i}>&gt; {line}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
