export default function Console({ lines }) {
  return (
    <div className="panel console">
      <h3>Consola</h3>
      {lines.length === 0 ? (
        <p className="small console-empty">Las operaciones sobre la cola aparecerán aquí.</p>
      ) : (
        <ul>
          {lines.map((line, i) => (
            <li key={i}>&gt; {line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
