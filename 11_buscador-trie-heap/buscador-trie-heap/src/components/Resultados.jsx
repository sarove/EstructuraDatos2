// Lista de los K productos más populares que empiezan por el prefijo.
export default function Resultados({ top, total, prefijo, k, onVisitar }) {
  return (
    <div className="resultados">
      <p className="resumen">
        <code>searchTopK("{prefijo}", {k})</code> · {total} coincidencia{total === 1 ? '' : 's'} en el Trie
      </p>
      {top.length === 0 ? (
        <p className="vacio">Ningún producto empieza por “{prefijo}”.</p>
      ) : (
        <ol>
          {top.map((p, i) => (
            <li key={p.name}>
              <span className="puesto">{i + 1}</span>
              <span className="nombre">
                <mark>{p.name.slice(0, prefijo.trim().length)}</mark>
                {p.name.slice(prefijo.trim().length)}
              </span>
              <span className="barra">
                <span style={{ width: `${Math.min(p.popularity, 100)}%` }} />
              </span>
              <span className="popularidad">{p.popularity}</span>
              <button type="button" className="secundario" title="Simula una visita: suma 1 de popularidad" onClick={() => onVisitar(p.name)}>
                +1
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
