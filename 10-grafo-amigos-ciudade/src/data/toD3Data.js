/**
 * Convierte el grafo al formato que espera react-d3-graph:
 *   { nodes: [{ id, ... }], links: [{ source, target, ... }] }
 * Cada ciudad recibe un color; sus habitantes usan ese mismo color.
 */

export const CITY_COLORS = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#65a30d'];

const FADED = '#d6dbe3';

export function cityColorMap(graph) {
  // El color depende del orden de creación, así no cambia al agregar ciudades
  const map = {};
  graph.nodes
    .filter((n) => n.type === 'city')
    .forEach((c, i) => {
      map[c.id] = CITY_COLORS[i % CITY_COLORS.length];
    });
  return map;
}

/**
 * @param {FriendsCitiesGraph} graph
 * @param {{ selectedCityId?: string, selectedPersonId?: string }} seleccion
 */
export function toD3Data(graph, { selectedCityId = null, selectedPersonId = null } = {}) {
  const colors = cityColorMap(graph);

  // Nodos resaltados según la selección
  let focus = null;
  if (selectedCityId) {
    focus = new Set([selectedCityId, ...graph.peopleInCity(selectedCityId).map((p) => p.id)]);
  } else if (selectedPersonId) {
    focus = new Set([selectedPersonId, ...(graph.adjList[selectedPersonId] ?? [])]);
  }
  const visible = (id) => !focus || focus.has(id);

  const nodes = graph.nodes.map((n) => {
    if (n.type === 'city') {
      return {
        id: n.id,
        label: `🏙 ${n.name}`,
        symbolType: 'square',
        size: 1100,
        color: visible(n.id) ? colors[n.id] : FADED,
        fontColor: visible(n.id) ? '#0f172a' : '#a3adbb',
        fontSize: 14,
        fontWeight: 'bold',
        strokeColor: n.id === selectedCityId ? '#0f172a' : 'none',
        strokeWidth: n.id === selectedCityId ? 3 : 1.5,
      };
    }
    const city = graph.cityOf(n.id);
    return {
      id: n.id,
      label: `${n.name} (${n.age})`,
      symbolType: 'circle',
      size: 420,
      color: visible(n.id) ? colors[city?.id] ?? '#64748b' : FADED,
      fontColor: visible(n.id) ? '#1e293b' : '#a3adbb',
      strokeColor: n.id === selectedPersonId ? '#0f172a' : '#ffffff',
      strokeWidth: n.id === selectedPersonId ? 3 : 1.5,
    };
  });

  const links = graph.edges().map((e) => {
    const on = visible(e.source) && visible(e.target);
    if (e.type === 'friendship') {
      return {
        source: e.source,
        target: e.target,
        color: on ? '#94a3b8' : '#eceff3',
        strokeWidth: 1.5,
        strokeDasharray: 5,
      };
    }
    return {
      source: e.source,
      target: e.target,
      color: on ? colors[e.target] : '#eceff3',
      strokeWidth: 2.5,
    };
  });

  return { nodes, links };
}
