/**
 * Pruebas del grafo y del grafo de amigos y ciudades.
 * Ejecutar con:  npm test
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createMockGraph, mockCities, mockFriendships, mockPeople } from '../src/data/mockData.js';
import { toD3Data } from '../src/data/toD3Data.js';
import { validateCity, validatePerson } from '../src/data/validation.js';
import { FriendsCitiesGraph, slug } from '../src/structures/FriendsCitiesGraph.js';
import { Graph } from '../src/structures/Graph.js';

const silence = (fn) => {
  const original = console.log;
  console.log = () => {};
  try {
    return fn();
  } finally {
    console.log = original;
  }
};

test('Graph: ejemplo de la clase (LIM, CMX, SCL, AQP) y matriz de adyacencia', () => {
  const g = new Graph();
  ['LIM', 'CMX', 'SCL', 'AQP'].forEach((id) => g.addNode({ id }));
  g.addEdge('LIM', 'CMX');
  g.addEdge('CMX', 'SCL');
  g.addEdge('SCL', 'AQP');
  g.addEdge('AQP', 'LIM');

  assert.equal(g.nodes.length, 4);
  assert.deepEqual(g.adjList.LIM, ['CMX', 'AQP']);
  assert.equal(g.edgeCount(), 4);
  assert.deepEqual(g.adjacencyMatrix().matrix, [
    [0, 1, 0, 1],
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 1, 0],
  ]);
  assert.deepEqual(silence(() => g.printAdjacency('SCL')), ['CMX', 'AQP']);
  assert.equal(silence(() => g.printAdjacency('XXX')), null);
  assert.equal(g.searchNode('AQP').id, 'AQP');
  assert.equal(g.searchNode('BOG'), null);
});

test('Graph: aristas no dirigidas, sin duplicados ni lazos, y eliminación', () => {
  const g = new Graph();
  ['A', 'B', 'C'].forEach((id) => g.addNode({ id }));
  assert.equal(g.addNode({ id: 'A' }), null);
  assert.equal(g.addEdge('A', 'B'), true);
  assert.equal(g.addEdge('B', 'A'), false);
  assert.equal(g.addEdge('A', 'A'), false);
  assert.throws(() => g.addEdge('A', 'Z'));
  assert.ok(g.hasEdge('B', 'A'));
  g.addEdge('B', 'C');
  g.removeNode('B');
  assert.deepEqual(g.adjList, { A: [], C: [] });
  assert.equal(g.nodes.length, 2);
});

test('Datos mock: cada persona y cada ciudad es un nodo', () => {
  const g = createMockGraph();
  assert.equal(g.cities().length, mockCities.length);
  assert.equal(g.people().length, mockPeople.length);
  assert.equal(g.nodes.length, mockCities.length + mockPeople.length);
  // aristas = una "vive en" por persona + las amistades
  assert.equal(g.edgeCount(), mockPeople.length + mockFriendships.length);
});

test('Cada persona tiene nombre, edad y exactamente UNA ciudad', () => {
  const g = createMockGraph();
  for (const p of g.people()) {
    assert.ok(p.name);
    assert.ok(Number.isInteger(p.age));
    const ciudades = g.neighbors(p.id).filter((n) => n.type === 'city');
    assert.equal(ciudades.length, 1, p.name);
  }
  for (const c of g.cities()) assert.ok(c.name);
});

test('peopleInCity imprime la lista de personas de una ciudad', () => {
  const g = createMockGraph();
  const cali = g.findCityByName('Cali');
  const nombres = silence(() => g.printPeopleInCity(cali.id)).map((p) => p.name);
  assert.deepEqual(nombres, ['Ana María Gómez', 'Carlos Rojas', 'Valentina Cárdenas']);
  assert.equal(g.peopleInCity(g.findCityByName('Jamundí').id).length, 2);
  assert.deepEqual(g.peopleInCity('persona:1'), []);
});

test('Amigos y cambio de ciudad', () => {
  const g = createMockGraph();
  const ana = g.people().find((p) => p.name === 'Ana María Gómez');
  assert.deepEqual(
    g.friendsOf(ana.id).map((p) => p.name),
    ['Carlos Rojas', 'Julián Zapata', 'Paola Muñoz', 'Valentina Cárdenas']
  );
  const bogota = g.findCityByName('Bogota'); // sin tilde también la encuentra
  assert.equal(g.moveToCity(ana.id, bogota.id), true);
  assert.equal(g.cityOf(ana.id).name, 'Bogotá');
  assert.equal(g.peopleInCity(g.findCityByName('Cali').id).length, 2);
  assert.equal(g.neighbors(ana.id).filter((n) => n.type === 'city').length, 1);
});

test('Reglas: ciudad con nombre, persona con ciudad, amistad solo entre personas', () => {
  const g = new FriendsCitiesGraph();
  const cali = g.addCity('Cali');
  assert.throws(() => g.addCity(''));
  assert.throws(() => g.addCity('cali'));
  assert.throws(() => g.addPerson({ name: 'Ana', age: 20, cityId: 'ciudad:no-existe' }));
  assert.throws(() => g.addPerson({ name: 'Ana', age: 20.5, cityId: cali.id }));
  const ana = g.addPerson({ name: 'Ana', age: 20, cityId: cali.id });
  assert.throws(() => g.addFriendship(ana.id, cali.id));
  assert.throws(() => g.addFriendship(ana.id, ana.id));
  assert.equal(slug('Santa Marta'), 'santa-marta');
  assert.equal(g.findCityByName('CALI').id, cali.id);
});

test('toD3Data: nodos y enlaces para react-d3-graph', () => {
  const g = createMockGraph();
  const data = toD3Data(g);
  assert.equal(data.nodes.length, g.nodes.length);
  assert.equal(data.links.length, g.edgeCount());
  assert.ok(data.nodes.filter((n) => n.symbolType === 'square').length === mockCities.length);
  assert.ok(data.links.every((l) => g.searchNode(l.source) && g.searchNode(l.target)));
  assert.equal(data.links.filter((l) => l.strokeDasharray).length, mockFriendships.length);
});

test('Validación de formularios', () => {
  const g = createMockGraph();
  assert.equal(validateCity('Pereira', g), null);
  assert.match(validateCity('bogota', g), /ya existe/);
  assert.ok(validateCity('Ca', g));
  const cali = g.findCityByName('Cali').id;
  assert.deepEqual(validatePerson({ name: 'Luis Pérez', age: '22', cityId: cali }, g), {});
  const e = validatePerson({ name: 'L', age: '200', cityId: '' }, g);
  assert.deepEqual(Object.keys(e).sort(), ['age', 'cityId', 'name']);
});
