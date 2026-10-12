/**
 * Challenge 08 - Estructura de Datos y Algoritmos II (UAO)
 * Estudiante: Salvador Rodriguez Velasco
 */
import { useEffect, useMemo, useState } from 'react';
import { ArbolBinario } from './estructuras/ArbolBinario.js';
import { serieInicial } from './data.js';
import ControlesArbol from './components/ControlesArbol.jsx';
import Recorridos from './components/Recorridos.jsx';
import ArbolD3 from './components/ArbolD3.jsx';

export default function App() {
  // Guardamos en el estado la serie de valores insertados; el árbol se
  // reconstruye a partir de ella cada vez que cambia.
  const [valores, setValores] = useState(serieInicial);
  const [busqueda, setBusqueda] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const arbol = useMemo(() => new ArbolBinario().insertarSerie(valores), [valores]);

  // Punto 1 del reto: imprimir los recorridos por consola cada vez que cambia el árbol.
  useEffect(() => {
    console.log('%cÁrbol con: ' + valores.join(', '), 'font-weight:bold');
    arbol.imprimirRecorridos();
  }, [arbol, valores]);

  const insertarSerie = (nuevos) => {
    const prueba = new ArbolBinario().insertarSerie(valores);
    const agregados = [];
    const repetidos = [];
    nuevos.forEach((v) => (prueba.insertar(v) ? agregados : repetidos).push(v));
    setValores([...valores, ...agregados]);
    setBusqueda(null);
    setMensaje(
      repetidos.length
        ? `Insertados: ${agregados.join(', ') || 'ninguno'}. Ignorados por repetidos: ${repetidos.join(', ')}.`
        : `Insertados: ${agregados.join(', ')}.`
    );
  };

  // Punto 2 del reto: verificar si un valor está en el árbol.
  const buscarValor = (valor) => {
    const resultado = arbol.buscar(valor);
    console.log(`¿Está ${valor} en el árbol?`, resultado.encontrado, '| camino:', resultado.camino.join(' -> '));
    setBusqueda({ valor, ...resultado });
    setMensaje('');
  };

  const nuevoArbol = (serie) => {
    setValores(serie);
    setBusqueda(null);
    setMensaje(serie.length ? 'Se cargó la serie de ejemplo.' : 'Árbol vacío. Inserta una serie de números.');
  };

  return (
    <div className="app">
      <header>
        <h1>Árbol Binario de Búsqueda</h1>
        <p className="subtitulo">
          Challenge 08 · Estructura de Datos y Algoritmos II · Estudiante: <strong>Salvador Rodriguez Velasco</strong>
        </p>
      </header>

      <main className="layout">
        <aside className="panel">
          <ControlesArbol
            onInsertar={insertarSerie}
            onBuscar={buscarValor}
            onNuevo={() => nuevoArbol([])}
            onEjemplo={() => nuevoArbol(serieInicial)}
            onImprimir={() => arbol.imprimirRecorridos()}
          />
          {mensaje && <p className="mensaje">{mensaje}</p>}
          {busqueda && (
            <p className={busqueda.encontrado ? 'mensaje ok' : 'mensaje error'}>
              El valor <strong>{busqueda.valor}</strong> {busqueda.encontrado ? 'SÍ' : 'NO'} está en el árbol.
              {busqueda.camino.length > 0 && <> Camino recorrido: {busqueda.camino.join(' → ')}</>}
            </p>
          )}
          <Recorridos arbol={arbol} />
        </aside>

        <section className="lienzo">
          <ArbolD3 datos={arbol.toD3()} busqueda={busqueda} />
        </section>
      </main>
    </div>
  );
}
