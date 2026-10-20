/**
 * Challenge 11 - Estructura de Datos y Algoritmos II (UAO)
 * Smart search engine + Top results (Trie + Heap)
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { SearchEngine } from './estructuras/SearchEngine.js';
import { productosIniciales } from './data.js';
import Buscador from './components/Buscador.jsx';
import Resultados from './components/Resultados.jsx';
import AgregarProducto from './components/AgregarProducto.jsx';
import HeapVista from './components/HeapVista.jsx';
import TrieVista from './components/TrieVista.jsx';

const crearMotor = () => {
  const engine = new SearchEngine();
  productosIniciales.forEach((p) => engine.insert(p.name, p.popularity));
  return engine;
};

export default function App() {
  // El motor (Trie) es mutable: se guarda en un ref y "version" fuerza a React a recalcular.
  const engineRef = useRef(null);
  if (engineRef.current === null) engineRef.current = crearMotor();
  const engine = engineRef.current;

  const [version, setVersion] = useState(0);
  const [prefijo, setPrefijo] = useState('air');
  const [k, setK] = useState(2);
  const [mensaje, setMensaje] = useState('');

  const { top, matches, heapArray } = useMemo(
    () => engine.searchTopKDetallado(prefijo, k),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [engine, prefijo, k, version]
  );

  // Imprime cada búsqueda en la consola del navegador (F12).
  useEffect(() => {
    console.log(`searchTopK("${prefijo}", ${k}):`, top.map((p) => `${p.name} (${p.popularity})`).join(', ') || '[]');
    console.table(top);
  }, [prefijo, k, top]);

  const agregar = (name, popularity) => {
    const existia = engine.trie.search(name.trim().toLowerCase().replace(/\s+/g, ' '));
    const producto = engine.insert(name, popularity);
    if (!producto) return;
    console.log(`insert("${producto.name}", ${producto.popularity})`);
    setMensaje(existia ? `Se actualizó "${producto.name}" a ${producto.popularity}.` : `Se insertó "${producto.name}" con popularidad ${producto.popularity}.`);
    setVersion((v) => v + 1);
  };

  const visitar = (name) => {
    engine.addPopularity(name, 1);
    setVersion((v) => v + 1);
  };

  return (
    <div className="app">
      <header>
        <h1>Buscador inteligente + Top resultados</h1>
        <p className="subtitulo">
          Challenge 11 · Tries &amp; Heaps · Estructura de Datos y Algoritmos II · Estudiante:{' '}
          <strong>Salvador Rodriguez Velasco</strong>
        </p>
      </header>

      <main className="layout">
        <section className="columna">
          <div className="tarjeta">
            <Buscador prefijo={prefijo} onPrefijo={setPrefijo} k={k} onK={setK} />
            <Resultados top={top} total={matches.length} prefijo={prefijo} k={k} onVisitar={visitar} />
          </div>
          <div className="tarjeta">
            <AgregarProducto onAgregar={agregar} />
            {mensaje && <p className="mensaje">{mensaje}</p>}
            <p className="nota">
              {engine.size()} productos en el Trie · {engine.trie.countNodes()} nodos (letras).
            </p>
          </div>
        </section>

        <section className="columna">
          <div className="tarjeta">
            <HeapVista heap={heapArray} k={k} />
          </div>
          <div className="tarjeta">
            <TrieVista trie={engine.trie} prefijo={prefijo} version={version} />
          </div>
        </section>
      </main>
    </div>
  );
}
