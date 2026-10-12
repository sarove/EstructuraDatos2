import { useState } from 'react';

// Convierte un texto como "8, 3 10 1" en [8, 3, 10, 1].
const leerNumeros = (texto) =>
  texto
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));

export default function ControlesArbol({ onInsertar, onBuscar, onNuevo, onEjemplo, onImprimir }) {
  const [serie, setSerie] = useState('');
  const [valorBuscado, setValorBuscado] = useState('');

  const insertar = (e) => {
    e.preventDefault();
    const numeros = leerNumeros(serie);
    if (numeros.length) {
      onInsertar(numeros);
      setSerie('');
    }
  };

  const buscar = (e) => {
    e.preventDefault();
    const [numero] = leerNumeros(valorBuscado);
    if (numero !== undefined) onBuscar(numero);
  };

  return (
    <div className="controles">
      <form onSubmit={insertar}>
        <label htmlFor="serie">Insertar serie de números</label>
        <div className="fila">
          <input id="serie" value={serie} onChange={(e) => setSerie(e.target.value)} placeholder="Ej: 8, 3, 10, 1, 6" />
          <button type="submit">Insertar</button>
        </div>
      </form>

      <form onSubmit={buscar}>
        <label htmlFor="buscar">¿El valor está en el árbol?</label>
        <div className="fila">
          <input id="buscar" type="number" value={valorBuscado} onChange={(e) => setValorBuscado(e.target.value)} placeholder="Ej: 44" />
          <button type="submit">Buscar</button>
        </div>
      </form>

      <div className="fila botones">
        <button type="button" onClick={onImprimir}>Imprimir en consola</button>
        <button type="button" className="secundario" onClick={onEjemplo}>Serie de ejemplo</button>
        <button type="button" className="secundario" onClick={onNuevo}>Nuevo árbol</button>
      </div>
    </div>
  );
}
