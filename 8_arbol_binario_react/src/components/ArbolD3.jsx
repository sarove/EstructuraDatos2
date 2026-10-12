import { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';

/**
 * Punto 3 del reto: dibuja el árbol con react-d3-tree.
 * La librería recibe en "data" un objeto { name, attributes, children }
 * que generamos con ArbolBinario.toD3().
 */
export default function ArbolD3({ datos, busqueda }) {
  const contenedor = useRef(null);
  const [traslado, setTraslado] = useState({ x: 300, y: 50 });

  // Centrar la raíz horizontalmente según el ancho del contenedor.
  useEffect(() => {
    const centrar = () => {
      if (contenedor.current) setTraslado({ x: contenedor.current.clientWidth / 2, y: 50 });
    };
    centrar();
    window.addEventListener('resize', centrar);
    return () => window.removeEventListener('resize', centrar);
  }, []);

  if (!datos) {
    return (
      <div ref={contenedor} className="arbol-vacio">
        El árbol está vacío. Inserta una serie de números.
      </div>
    );
  }

  const camino = busqueda?.camino ?? [];

  // Dibujo personalizado de cada nodo (círculo con el valor dentro).
  const dibujarNodo = ({ nodeDatum }) => {
    if (nodeDatum.attributes?.vacio) {
      return <circle r={6} className="nodo-vacio" />;
    }
    const valor = nodeDatum.attributes.valor;
    let clase = 'nodo';
    if (camino.includes(valor)) clase += ' en-camino';
    if (busqueda?.encontrado && busqueda.valor === valor) clase += ' encontrado';
    return (
      <g className={clase}>
        <circle r={20} />
        <text dy="0.35em" textAnchor="middle">
          {nodeDatum.name}
        </text>
      </g>
    );
  };

  return (
    <div ref={contenedor} className="arbol-d3">
      <Tree
        data={datos}
        orientation="vertical"
        translate={traslado}
        pathFunc="straight"
        collapsible={false}
        separation={{ siblings: 1, nonSiblings: 1 }}
        nodeSize={{ x: 70, y: 90 }}
        renderCustomNodeElement={dibujarNodo}
        pathClassFunc={(link) => (link.target.data.attributes?.vacio ? 'enlace-vacio' : 'enlace')}
      />
    </div>
  );
}
