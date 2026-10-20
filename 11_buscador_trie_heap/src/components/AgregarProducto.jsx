import { useState } from 'react';

// Formulario para insertar productos en el Trie: insert(name, popularity).
export default function AgregarProducto({ onAgregar }) {
  const [nombre, setNombre] = useState('');
  const [popularidad, setPopularidad] = useState('');

  const enviar = (e) => {
    e.preventDefault();
    const pop = Number(popularidad);
    if (!nombre.trim() || popularidad === '' || !Number.isFinite(pop)) return;
    onAgregar(nombre, pop);
    setNombre('');
    setPopularidad('');
  };

  return (
    <form onSubmit={enviar}>
      <h2>Insertar producto</h2>
      <div className="fila">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre (ej: air max 97)" aria-label="Nombre del producto" />
        <input className="corto" type="number" min="0" value={popularidad} onChange={(e) => setPopularidad(e.target.value)} placeholder="Popularidad" aria-label="Popularidad" />
        <button type="submit">Insertar</button>
      </div>
    </form>
  );
}
