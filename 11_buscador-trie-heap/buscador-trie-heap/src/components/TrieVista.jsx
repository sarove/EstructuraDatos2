// Dibuja el subárbol del Trie que cuelga del prefijo buscado.
// Para que sea legible, las cadenas de nodos con un solo hijo se muestran juntas
// (por ejemplo "m·a·x"), pero cada letra sigue siendo un nodo del Trie.
const MAX_FILAS = 60;

function comprimir(node) {
  const letras = [node.value];
  let actual = node;
  while (!actual.isEndOfWord && Object.keys(actual.children).length === 1) {
    actual = Object.values(actual.children)[0];
    letras.push(actual.value);
  }
  return { letras, final: actual };
}

function filas(node, nivel, salida) {
  for (const hijo of Object.values(node.children)) {
    if (salida.length >= MAX_FILAS) return;
    const { letras, final } = comprimir(hijo);
    salida.push({ nivel, letras, fin: final.isEndOfWord, producto: final.product });
    filas(final, nivel + 1, salida);
  }
}

export default function TrieVista({ trie, prefijo }) {
  const clave = prefijo.trim().toLowerCase().replace(/\s+/g, ' ');
  const nodo = trie.findNode(clave);
  const salida = [];
  if (nodo) filas(nodo, 1, salida);

  const mostrar = (c) => (c === ' ' ? '␣' : c);

  return (
    <div className="trie">
      <h2>Trie desde el prefijo</h2>
      <p className="camino">
        <span className="letra raiz">raíz</span>
        {[...clave].map((c, i) => (
          <span key={i} className={nodo ? 'letra' : 'letra error'}>{mostrar(c)}</span>
        ))}
        {!nodo && clave && <span className="nota"> no existe ese camino</span>}
      </p>
      {nodo && (
        <ul className="ramas">
          {nodo.isEndOfWord && <li className="fin">● “{clave}” es un producto completo</li>}
          {salida.map((f, i) => (
            <li key={i} style={{ paddingLeft: f.nivel * 16 }}>
              <span className="conector">└</span>
              <span className="letras">{f.letras.map(mostrar).join('·')}</span>
              {f.fin && <span className="fin"> ● {f.producto.name} ({f.producto.popularity})</span>}
            </li>
          ))}
          {salida.length >= MAX_FILAS && <li className="nota">… (se muestran las primeras {MAX_FILAS} ramas)</li>}
        </ul>
      )}
      <p className="nota">● = isEndOfWord. ␣ = espacio. Las letras unidas con · son nodos encadenados con un solo hijo.</p>
    </div>
  );
}
