import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAtmQueue } from '../context/AtmQueueContext.jsx';
import { formatMoney, formatDateTime, formatTime } from '../data/people.js';
import Console from '../components/Console.jsx';

/**
 * PANTALLA: COLA DEL CAJERO AUTOMÁTICO
 * Imprime la cola según la fecha de llegada (del frente al final) y
 * permite atender (dequeue), consultar (peek) e imprimir (print).
 * Estudiante: Salvador Rodriguez Velasco
 */
export default function QueuePage() {
  const {
    people,
    front,
    size,
    isEmpty,
    pendingAmount,
    served,
    servedAmount,
    log,
    serveNext,
    peekFront,
    printQueue,
    addRandomPerson,
    resetQueue,
  } = useAtmQueue();
  const location = useLocation();
  const [highlightId, setHighlightId] = useState(location.state?.addedId ?? null);
  const [peekedId, setPeekedId] = useState(null);
  const [lastServed, setLastServed] = useState(null);

  const added = people.find((p) => p.id === highlightId);

  const handleServe = () => {
    const person = serveNext();
    setLastServed(person);
    setPeekedId(null);
  };

  const handlePeek = () => {
    const person = peekFront();
    setPeekedId(person ? person.id : null);
  };

  const handleRandom = () => {
    const { person } = addRandomPerson();
    setHighlightId(person.id);
    setLastServed(null);
  };

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Pantalla 1 · Cola (Queue) · FIFO</p>
        <h1>🏧 Cola del cajero automático</h1>
        <p className="lead">
          La primera persona en llegar es la primera en ser atendida. Cada persona tiene una{' '}
          <strong>fecha de llegada aleatoria</strong> asignada por el sistema y la cola se imprime en
          ese orden: el <strong>frente</strong> es quien llegó primero.
        </p>
      </div>

      {added && (
        <div className="alert success">
          ✅ <strong>{added.name}</strong> fue encolado(a). El sistema le asignó llegada a las{' '}
          {formatTime(added.arrivalDate)} y quedó en el turno{' '}
          {people.findIndex((p) => p.id === added.id) + 1} de {size}.
        </div>
      )}
      {lastServed && (
        <div className="alert info">
          💵 Se atendió a <strong>{lastServed.name}</strong>: retiró {formatMoney(lastServed.amount)}.
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
        <div className="stat">
          <span className="stat-label">peek() · frente</span>
          <span className="stat-value small-value">{front ? front.name : 'null'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Por retirar</span>
          <span className="stat-value small-value">{formatMoney(pendingAmount)}</span>
        </div>
      </div>

      {/* ---------- Acciones ---------- */}
      <div className="toolbar">
        <Link to="/nueva-persona" className="btn btn-primary">
          ➕ Nueva persona (enqueue)
        </Link>
        <button className="btn btn-success" onClick={handleServe} disabled={isEmpty}>
          💵 Atender siguiente (dequeue)
        </button>
        <button className="btn" onClick={handlePeek} disabled={isEmpty}>
          👁 Ver quién sigue (peek)
        </button>
        <button className="btn" onClick={printQueue}>
          🖨 Imprimir (print)
        </button>
        <button className="btn" onClick={handleRandom}>
          🎲 Persona aleatoria
        </button>
        <button className="btn btn-ghost" onClick={resetQueue}>
          ↺ Reiniciar datos
        </button>
      </div>

      {/* ---------- Cola visual ---------- */}
      <div className="panel">
        <h3>Fila frente al cajero</h3>
        <div className="queue-visual">
          <div className="atm">
            <div className="atm-screen">ATM</div>
            <div className="atm-slot" />
            <span className="atm-label">Cajero</span>
          </div>
          <div className="queue-line">
            {isEmpty ? (
              <p className="muted">No hay personas en la cola.</p>
            ) : (
              people.map((p, i) => (
                <div
                  key={p.id}
                  className={[
                    'person',
                    i === 0 ? 'person-front' : '',
                    i === people.length - 1 ? 'person-back' : '',
                    p.id === highlightId ? 'person-new' : '',
                    p.id === peekedId ? 'person-peeked' : '',
                  ].join(' ')}
                >
                  <span className="person-tag">
                    {i === 0 ? 'FRONT' : i === people.length - 1 ? 'BACK' : `#${i + 1}`}
                  </span>
                  <span className="person-avatar">🧍</span>
                  <span className="person-name">{p.name}</span>
                  <span className="person-time">🕒 {formatTime(p.arrivalDate)}</span>
                  <span className="person-amount">{formatMoney(p.amount)}</span>
                </div>
              ))
            )}
          </div>
        </div>
        <p className="muted small">
          ← dequeue() sale por el frente · enqueue() ubica a cada persona según su hora de llegada →
        </p>
      </div>

      {/* ---------- Impresión de la cola en pantalla ---------- */}
      <div className="panel">
        <h3>Impresión de la cola según la fecha de llegada</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Turno</th>
                <th>Nombre</th>
                <th>Monto a retirar</th>
                <th>Fecha de llegada (asignada)</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {people.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">
                    (cola vacía)
                  </td>
                </tr>
              ) : (
                people.map((p, i) => (
                  <tr key={p.id} className={p.id === highlightId ? 'row-new' : i === 0 ? 'row-front' : ''}>
                    <td>
                      {i + 1}
                      {i === 0 && <span className="badge">frente</span>}
                      {i === people.length - 1 && people.length > 1 && (
                        <span className="badge badge-muted">final</span>
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td className="mono">{formatMoney(p.amount)}</td>
                    <td className="mono">{formatDateTime(p.arrivalDate)}</td>
                    <td className="mono muted">{p.ticket}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="muted small">
          “Registro” es el orden en que cada persona se ingresó al sistema. No siempre coincide con el
          turno, porque la cola se ordena por la fecha de llegada.
        </p>
      </div>

      {/* ---------- Atendidos ---------- */}
      <div className="panel">
        <h3>
          Personas atendidas <span className="muted">· {served.length} · {formatMoney(servedAmount)}</span>
        </h3>
        {served.length === 0 ? (
          <p className="muted small">Aún no se ha atendido a nadie. Use “Atender siguiente (dequeue)”.</p>
        ) : (
          <ol className="served-list">
            {served
              .slice()
              .reverse()
              .map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong> — {formatMoney(p.amount)}{' '}
                  <span className="muted small">
                    (llegó {formatTime(p.arrivalDate)}, atendido {formatTime(p.servedAt)})
                  </span>
                </li>
              ))}
          </ol>
        )}
      </div>

      <Console lines={log} />
    </section>
  );
}
