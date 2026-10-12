import { useEffect, useMemo, useRef, useState } from 'react';
import { Graph as D3Graph } from 'react-d3-graph';
import { toD3Data } from '../data/toD3Data.js';

/**
 * Dibuja el grafo en pantalla con la librería react-d3-graph.
 * El grafo se convierte primero a { nodes, links } con toD3Data().
 * Estudiante: Salvador Rodriguez Velasco
 */
export default function GraphView({ graph, version, selection, onSelectNode, onClearSelection }) {
  const contenedor = useRef(null);
  const [width, setWidth] = useState(700);

  // react-d3-graph necesita un ancho numérico: se mide el contenedor
  useEffect(() => {
    const el = contenedor.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(280, Math.floor(entry.contentRect.width)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const data = useMemo(
    () =>
      toD3Data(graph, {
        selectedCityId: selection?.type === 'city' ? selection.id : null,
        selectedPersonId: selection?.type === 'person' ? selection.id : null,
      }),
    // version cambia cada vez que se modifica el grafo
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [graph, version, selection]
  );

  const height = width < 600 ? 420 : 540;

  const config = useMemo(
    () => ({
      width,
      height,
      directed: false,
      nodeHighlightBehavior: true,
      linkHighlightBehavior: true,
      highlightDegree: 1,
      highlightOpacity: 0.25,
      maxZoom: 3,
      minZoom: 0.4,
      d3: { gravity: -260, linkLength: 95, linkStrength: 1, alphaTarget: 0.05 },
      node: {
        labelProperty: 'label',
        fontSize: 11,
        highlightFontSize: 12,
        highlightFontWeight: 'bold',
        highlightStrokeColor: '#0f172a',
        labelPosition: 'bottom',
      },
      link: {
        highlightColor: '#0f172a',
        semanticStrokeWidth: false,
      },
    }),
    [width, height]
  );

  return (
    <div className="graph-box" ref={contenedor}>
      {data.nodes.length > 0 ? (
        <D3Graph
          id="grafo-amigos-ciudades"
          data={data}
          config={config}
          onClickNode={(id) => onSelectNode(id)}
          onClickGraph={onClearSelection}
        />
      ) : (
        <p className="muted">El grafo está vacío.</p>
      )}
    </div>
  );
}
