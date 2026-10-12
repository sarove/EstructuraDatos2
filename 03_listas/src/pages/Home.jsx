import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section>
      <div className="hero">
        <p className="eyebrow">Estructuras de Datos y Algoritmos II · UAO</p>
        <h1>Challenge 03 · Listas enlazadas</h1>
        <p className="lead">
          Proyecto en React con dos páginas. Cada una usa una estructura de datos implementada desde
          cero en JavaScript, siguiendo el modelo visto en clase: una clase <code>Node</code> y una
          clase <code>LinkedList</code> con <code>head</code>, <code>tail</code> y{' '}
          <code>length</code>, y los métodos <code>append</code>, <code>peek</code>,{' '}
          <code>size</code>, <code>remove</code> y <code>print</code>.
        </p>
      </div>

      <div className="cards">
        <Link to="/lista-enlazada" className="card card-link">
          <div className="card-icon">🎵</div>
          <h2>Lista enlazada simple</h2>
          <p>
            Reproductor de canciones en orden. Cada nodo es una canción que apunta a la siguiente
            (<code>next</code>). Solo se puede avanzar.
          </p>
          <div className="diagram">
            <span className="d-node">A</span>→<span className="d-node">B</span>→
            <span className="d-node">C</span>→<span className="d-null">null</span>
          </div>
          <span className="card-cta">Abrir reproductor →</span>
        </Link>

        <Link to="/lista-doblemente-enlazada" className="card card-link">
          <div className="card-icon">🌐</div>
          <h2>Lista doblemente enlazada</h2>
          <p>
            Historial de un navegador. Cada nodo es una página con referencia a la anterior (
            <code>prev</code>) y a la siguiente (<code>next</code>): Atrás y Adelante.
          </p>
          <div className="diagram">
            <span className="d-null">null</span>←<span className="d-node">A</span>⇄
            <span className="d-node">B</span>⇄<span className="d-node">C</span>→
            <span className="d-null">null</span>
          </div>
          <span className="card-cta">Abrir navegador →</span>
        </Link>
      </div>

      <div className="panel">
        <h3>Enunciado</h3>
        <ol className="statement">
          <li>Implementar una lista enlazada para reproducir canciones en orden, con datos simulados.</li>
          <li>
            Implementar una lista doblemente enlazada para navegar hacia atrás y hacia adelante entre
            páginas visitadas en el navegador, con datos falsos.
          </li>
          <li>Crear un proyecto en React con 2 páginas nuevas: lista enlazada y doblemente enlazada.</li>
          <li>Usar las listas en cada página y recorrerlas con botones dentro de las páginas.</li>
        </ol>
      </div>
    </section>
  );
}
