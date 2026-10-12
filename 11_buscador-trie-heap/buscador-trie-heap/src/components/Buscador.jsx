// Caja de búsqueda por prefijo (typeahead) y selector de K.
export default function Buscador({ prefijo, onPrefijo, k, onK }) {
  return (
    <div className="buscador">
      <label htmlFor="prefijo">Buscar producto por prefijo</label>
      <input
        id="prefijo"
        className="caja-busqueda"
        value={prefijo}
        onChange={(e) => onPrefijo(e.target.value)}
        placeholder="Ej: air, adidas, n…"
        autoComplete="off"
        autoFocus
      />
      <div className="fila">
        <label htmlFor="k">Top K</label>
        <input id="k" type="range" min="1" max="10" value={k} onChange={(e) => onK(Number(e.target.value))} />
        <strong className="valor-k">{k}</strong>
      </div>
    </div>
  );
}
