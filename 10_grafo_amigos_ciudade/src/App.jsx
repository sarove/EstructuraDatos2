import { useState } from 'react';
import { createMockGraph } from './data/mockData.js';
import { cityColorMap } from './data/toD3Data.js';
import GraphView from './components/GraphView.jsx';
import CityPeoplePanel from './components/CityPeoplePanel.jsx';
import PersonCard from './components/PersonCard.jsx';
import AdjacencyPanel from './components/AdjacencyPanel.jsx';
import { AddCityForm, AddPersonForm, AddFriendshipForm } from './components/Forms.jsx';

/**
 * Componente principal del Challenge 10.
 * El grafo se crea UNA vez con los datos mock y se conserva en el estado.
 * Como sus métodos lo modifican por dentro, se usa un contador "version"
 * para que React vuelva a dibujar después de cada cambio.
 * Estudiante: Salvador Rodriguez Velasco
 */
export default function App() {
  const [graph] = useState(createMockGraph);
  const [version, setVersion] = useState(0);
  const [selection, setSelection] = useState(() => {
    const cali = graph.findCityByName('Cali');
    return cali ? { type: 'city', id: cali.id } : null;
  });
  const [lastCityId, setLastCityId] = useState(selection?.id ?? null);
  const [log, setLog] = useState([]);

  const refresh = () => setVersion((v) => v + 1);
  const addLog = (msg) => setLog((prev) => [msg, ...prev].slice(0, 12));
  const name = (id) => graph.searchNode(id)?.name ?? id;

  // ----- Selección (desde el grafo o desde los paneles) -----
  const selectCity = (id) => {
    setSelection({ type: 'city', id });
    setLastCityId(id);
  };
  const selectPerson = (id) => {
    setSelection({ type: 'person', id });
    const city = graph.cityOf(id);
    if (city) setLastCityId(city.id);
  };
  const selectNode = (id) => (graph.isCity(id) ? selectCity(id) : selectPerson(id));

  // Ciudad del panel: la seleccionada, la de la persona seleccionada o la última vista
  const panelCityId =
    selection?.type === 'city'
      ? selection.id
      : selection?.type === 'person'
        ? graph.cityOf(selection.id)?.id ?? lastCityId
        : lastCityId;

  // ----- Operaciones sobre el grafo -----
  const printPeople = (cityId) => {
    const people = graph.printPeopleInCity(cityId);
    addLog(
      `peopleInCity("${name(cityId)}") → ${people.length ? people.map((p) => `${p.name} (${p.age})`).join(', ') : '[ ]'}`
    );
  };

  const addCity = (cityName) => {
    const city = graph.addCity(cityName);
    addLog(`addNode({ id: "${city.id}", type: "city", name: "${city.name}" })`);
    refresh();
    selectCity(city.id);
  };

  const addPerson = ({ name: personName, age, cityId, friends }) => {
    const person = graph.addPerson({ name: personName, age, cityId });
    friends.forEach((f) => graph.addFriendship(person.id, f));
    addLog(
      `addPerson("${person.name}", ${age}) + addEdge(${person.id}, ${cityId})` +
        (friends.length ? ` + ${friends.length} amistad(es)` : '')
    );
    refresh();
    selectPerson(person.id);
  };

  const addFriendship = (a, b) => {
    graph.addFriendship(a, b);
    addLog(`addEdge("${name(a)}", "${name(b)}") · amistad`);
    refresh();
  };

  const movePerson = (personId, cityId) => {
    const from = graph.cityOf(personId);
    if (graph.moveToCity(personId, cityId)) {
      addLog(`${name(personId)}: removeEdge(${from?.name}) + addEdge(${name(cityId)})`);
      setLastCityId(cityId);
      refresh();
    }
  };

  const removePerson = (personId) => {
    const person = graph.removePerson(personId);
    if (person) {
      addLog(`removeNode("${person.name}") y sus aristas`);
      setSelection(null);
      refresh();
    }
  };

  const printGraph = () => {
    graph.printGraph();
    addLog('printGraph() → objeto adjList impreso en la consola del navegador (F12)');
  };

  const colors = cityColorMap(graph);
  const friendships = graph.edges().filter((e) => e.type === 'friendship').length;
  const stats = [
    ['Nodos', graph.nodes.length],
    ['Aristas', graph.edgeCount()],
    ['Ciudades', graph.cities().length],
    ['Personas', graph.people().length],
    ['Amistades', friendships],
  ];

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <span className="brand-badge">10</span>
            <span>Challenge · Grafos</span>
          </div>
          <span className="navbar-sub">Grafo de amigos y ciudades con react-d3-graph</span>
        </div>
      </header>

      <main className="container">
        <div className="page-header">
          <p className="eyebrow">Estructuras de Datos y Algoritmos II · UAO</p>
          <h1>🕸 Grafo de amigos y ciudades</h1>
          <p className="lead">
            Cada <strong>persona</strong> y cada <strong>ciudad</strong> es un nodo. Las aristas unen a
            cada persona con la ciudad donde vive y con sus amigos. Haga clic en un nodo del grafo para
            ver quién vive en una ciudad o los amigos de una persona.
          </p>
        </div>

        <div className="stats">
          {stats.map(([label, value]) => (
            <div className="stat" key={label}>
              <span className="stat-label">{label}</span>
              <span className="stat-value">{value}</span>
            </div>
          ))}
        </div>

        <div className="grid-main">
          <div className="panel graph-panel">
            <div className="panel-head">
              <h3>Grafo (react-d3-graph)</h3>
              <div className="toolbar">
                <button className="btn btn-small" onClick={() => setSelection(null)} disabled={!selection}>
                  Ver todo
                </button>
                <button className="btn btn-small" onClick={printGraph}>
                  🖨 printGraph()
                </button>
              </div>
            </div>
            <div className="legend">
              {graph.cities().map((c) => (
                <span key={c.id} style={{ '--c': colors[c.id] }}>
                  <i className="sq" /> {c.name}
                </span>
              ))}
              <span>
                <i className="ln solid" /> vive en
              </span>
              <span>
                <i className="ln dashed" /> amistad
              </span>
            </div>
            <GraphView
              graph={graph}
              version={version}
              selection={selection}
              onSelectNode={selectNode}
              onClearSelection={() => setSelection(null)}
            />
            <p className="muted small">
              Arrastre los nodos para reorganizarlos · rueda del mouse para acercar o alejar · clic en el
              fondo para quitar la selección.
            </p>
          </div>

          <aside className="side">
            <CityPeoplePanel
              graph={graph}
              cityId={panelCityId}
              selectedPersonId={selection?.type === 'person' ? selection.id : null}
              onSelectCity={selectCity}
              onSelectPerson={selectPerson}
              onPrint={printPeople}
            />
            {selection?.type === 'person' && (
              <PersonCard
                graph={graph}
                personId={selection.id}
                onMove={movePerson}
                onRemove={removePerson}
                onSelectPerson={selectPerson}
                onClose={() => setSelection(panelCityId ? { type: 'city', id: panelCityId } : null)}
              />
            )}
          </aside>
        </div>

        <div className="grid-forms">
          <AddCityForm graph={graph} onAdd={addCity} />
          <AddPersonForm graph={graph} onAdd={addPerson} />
          <AddFriendshipForm graph={graph} onAdd={addFriendship} />
        </div>

        <AdjacencyPanel graph={graph} />

        <div className="panel console">
          <h3>Consola</h3>
          {log.length === 0 ? (
            <p className="console-empty small">Las operaciones sobre el grafo aparecerán aquí.</p>
          ) : (
            <ul>
              {log.map((line, i) => (
                <li key={i}>&gt; {line}</li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>
          <strong>Salvador Rodriguez Velasco</strong> · Ingeniería Informática · Universidad Autónoma de
          Occidente
        </p>
        <p>Estructuras de Datos y Algoritmos II · Challenge 10 – Grafos</p>
      </footer>
    </div>
  );
}
