import { useEffect, useState } from 'react';
import { LinkedList } from '../structures/LinkedList.js';
import { mockSongs, extraSongs, formatTime } from '../data/songs.js';

/**
 * PÁGINA 1: LISTA ENLAZADA SIMPLE
 * Reproductor que toca las canciones EN ORDEN recorriendo la lista
 * nodo por nodo mediante el puntero "next".
 * Estudiante: Salvador Rodriguez Velasco
 */

// Velocidad de la reproducción simulada: 1 segundo de canción cada 100 ms
const TICK_MS = 100;

// Llena la lista enlazada con los datos simulados (mock)
function createPlaylist() {
  const list = new LinkedList();
  mockSongs.forEach((song) => list.append(song));
  return list;
}

export default function PlaylistPage() {
  // La lista se crea una sola vez y se conserva entre renderizados
  const [playlist] = useState(createPlaylist);

  // Nodo que se está reproduciendo (puntero de recorrido)
  const [current, setCurrent] = useState(() => playlist.head);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [extraIndex, setExtraIndex] = useState(0);
  const [console_, setConsole] = useState([]);
  const [, setVersion] = useState(0); // fuerza re-render tras mutar la lista

  const refresh = () => setVersion((v) => v + 1);
  const log = (msg) => setConsole((prev) => [msg, ...prev].slice(0, 8));

  // ---------- Recorrido de la lista ----------

  // Siguiente: avanzar al nodo "next". Si es null, la lista terminó.
  const handleNext = () => {
    if (!current) return;
    if (current.next) {
      setCurrent(current.next);
      setElapsed(0);
      setFinished(false);
    } else {
      setIsPlaying(false);
      setFinished(true);
      setElapsed(current.value.duration);
      log('Fin de la lista: current.next === null');
    }
  };

  // Reiniciar: volver a la cabeza (head). Es la única forma de "regresar"
  // en una lista enlazada simple, porque los nodos no tienen "prev".
  const handleRestart = () => {
    setCurrent(playlist.head);
    setElapsed(0);
    setFinished(false);
    log('Reinicio: current = head');
  };

  const handlePlayPause = () => {
    if (!current) return;
    if (finished) {
      handleRestart();
      setIsPlaying(true);
      return;
    }
    setIsPlaying((p) => !p);
  };

  // Simulación del tiempo de reproducción
  useEffect(() => {
    if (!isPlaying) return undefined;
    const id = setInterval(() => setElapsed((e) => e + 1), TICK_MS);
    return () => clearInterval(id);
  }, [isPlaying]);

  // Cuando la canción termina, pasa automáticamente al siguiente nodo
  useEffect(() => {
    if (isPlaying && current && elapsed >= current.value.duration) {
      handleNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed]);

  // ---------- Operaciones de la lista ----------

  // append: agrega una canción al final
  const handleAppend = () => {
    const base = extraSongs[extraIndex % extraSongs.length];
    const song = { ...base, id: Date.now() };
    playlist.append(song);
    setExtraIndex((i) => i + 1);
    if (!current) {
      setCurrent(playlist.head);
      setFinished(false);
      setElapsed(0);
    }
    log(`append("${song.title}") → size = ${playlist.size()}`);
    refresh();
  };

  // peek: busca un nodo por id y lo reproduce
  const handlePlayFromNode = (id) => {
    const node = playlist.peek((song) => song.id === id);
    if (node) {
      setCurrent(node);
      setElapsed(0);
      setFinished(false);
      setIsPlaying(true);
      log(`peek(id=${id}) → "${node.value.title}"`);
    }
  };

  // remove: elimina un nodo y une el anterior con el siguiente
  const handleRemove = (id) => {
    const isCurrent = current && current.value.id === id;
    const nextNode = isCurrent ? current.next : current;
    const removed = playlist.remove((song) => song.id === id);
    if (!removed) return;

    if (isCurrent) {
      setCurrent(nextNode ?? playlist.head);
      setElapsed(0);
      if (!nextNode) setIsPlaying(false);
    }
    if (playlist.size() === 0) {
      setCurrent(null);
      setIsPlaying(false);
    }
    log(`remove("${removed.value.title}") → size = ${playlist.size()}`);
    refresh();
  };

  // print: muestra el contenido de la lista
  const handlePrint = () => {
    const text = playlist.print((song) => song.title);
    log(`print(): ${text}`);
  };

  const nodes = playlist.toArray();
  const position = current ? nodes.indexOf(current) + 1 : 0;
  const song = current?.value;
  const progress = song ? Math.min(100, (elapsed / song.duration) * 100) : 0;

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Página 1 · Lista enlazada simple</p>
        <h1>🎵 Reproductor de canciones</h1>
        <p className="lead">
          Las canciones se reproducen en orden recorriendo la lista desde <code>head</code> hasta{' '}
          <code>tail</code> con el puntero <code>next</code>.
        </p>
      </div>

      <div className="grid-2">
        {/* ---------- Reproductor ---------- */}
        <div className="player">
          <div className="player-cover">{song ? '🎧' : '—'}</div>
          <div className="player-info">
            <span className="tag">
              {song ? `Nodo ${position} de ${playlist.size()}` : 'Lista vacía'}
            </span>
            <h2>{song ? song.title : 'Sin canciones'}</h2>
            <p>{song ? `${song.artist} · ${song.genre}` : 'Agregue canciones con append()'}</p>
          </div>

          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="times">
            <span>{formatTime(song ? Math.min(elapsed, song.duration) : 0)}</span>
            <span>{formatTime(song ? song.duration : 0)}</span>
          </div>

          <div className="controls">
            <button
              className="btn btn-ghost"
              onClick={handleRestart}
              disabled={!playlist.head}
              title="Volver a head"
            >
              ⏮ Reiniciar
            </button>
            <button className="btn btn-primary btn-round" onClick={handlePlayPause} disabled={!current}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="btn btn-ghost" onClick={handleNext} disabled={!current || finished}>
              Siguiente ⏭
            </button>
          </div>

          <p className="hint">
            {finished
              ? '⏹ Se llegó al final: el último nodo (tail) apunta a null.'
              : current?.next
                ? `Siguiente (next): ${current.next.value.title}`
                : current
                  ? 'Esta es la última canción: next = null'
                  : ''}
          </p>
          <p className="hint muted">
            En una lista simple no existe “Anterior”: los nodos no guardan referencia al nodo previo.
          </p>

          <div className="actions">
            <button className="btn" onClick={handleAppend}>
              ➕ Agregar canción (append)
            </button>
            <button className="btn" onClick={handlePrint}>
              🖨 Imprimir (print)
            </button>
          </div>
        </div>

        {/* ---------- Lista de reproducción ---------- */}
        <div className="panel">
          <h3>
            Lista de reproducción <span className="muted">· size() = {playlist.size()}</span>
          </h3>
          <ol className="song-list">
            {nodes.map((node, i) => (
              <li key={node.value.id} className={node === current ? 'song active' : 'song'}>
                <button className="song-main" onClick={() => handlePlayFromNode(node.value.id)}>
                  <span className="song-index">{node === current && isPlaying ? '♪' : i + 1}</span>
                  <span className="song-text">
                    <strong>{node.value.title}</strong>
                    <small>{node.value.artist}</small>
                  </span>
                  <span className="song-time">{formatTime(node.value.duration)}</span>
                </button>
                <button
                  className="icon-btn"
                  title="Eliminar (remove)"
                  onClick={() => handleRemove(node.value.id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ---------- Visualización de nodos ---------- */}
      <div className="panel">
        <h3>Estructura en memoria</h3>
        <div className="chain">
          <span className="ptr-label">head</span>
          {nodes.map((node) => (
            <div key={node.value.id} className="chain-item">
              <div className={node === current ? 'node node-current' : 'node'}>
                <div className="node-value">{node.value.title}</div>
                <div className="node-ptr">next</div>
              </div>
              <span className="arrow">→</span>
            </div>
          ))}
          <span className="null-box">null</span>
        </div>
        <p className="muted small">
          head = {playlist.head ? `"${playlist.head.value.title}"` : 'null'} · tail ={' '}
          {playlist.tail ? `"${playlist.tail.value.title}"` : 'null'} · length = {playlist.length}
        </p>
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
