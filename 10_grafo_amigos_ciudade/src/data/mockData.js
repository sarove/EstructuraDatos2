import { FriendsCitiesGraph } from '../structures/FriendsCitiesGraph.js';

/**
 * Datos simulados (mock) del grafo de amigos y ciudades.
 */
export const mockCities = ['Cali', 'Bogotá', 'Medellín', 'Barranquilla', 'Jamundí'];

// [nombre, edad, ciudad]
export const mockPeople = [
  ['Ana María Gómez', 21, 'Cali'],
  ['Carlos Rojas', 24, 'Cali'],
  ['Valentina Cárdenas', 19, 'Cali'],
  ['Julián Zapata', 27, 'Jamundí'],
  ['Laura Ortiz', 22, 'Jamundí'],
  ['Santiago Mejía', 30, 'Bogotá'],
  ['Daniela Arango', 26, 'Bogotá'],
  ['Andrés Quintero', 35, 'Medellín'],
  ['Mariana López', 23, 'Medellín'],
  ['Camila Restrepo', 28, 'Medellín'],
  ['Sebastián Castaño', 32, 'Barranquilla'],
  ['Paola Muñoz', 29, 'Barranquilla'],
];

// Amistades entre personas [nombre1, nombre2]
export const mockFriendships = [
  ['Ana María Gómez', 'Carlos Rojas'],
  ['Ana María Gómez', 'Valentina Cárdenas'],
  ['Ana María Gómez', 'Julián Zapata'],
  ['Carlos Rojas', 'Laura Ortiz'],
  ['Carlos Rojas', 'Santiago Mejía'],
  ['Valentina Cárdenas', 'Mariana López'],
  ['Julián Zapata', 'Laura Ortiz'],
  ['Santiago Mejía', 'Daniela Arango'],
  ['Daniela Arango', 'Camila Restrepo'],
  ['Andrés Quintero', 'Mariana López'],
  ['Andrés Quintero', 'Camila Restrepo'],
  ['Andrés Quintero', 'Sebastián Castaño'],
  ['Sebastián Castaño', 'Paola Muñoz'],
  ['Paola Muñoz', 'Ana María Gómez'],
];

// Construye el grafo completo a partir de los datos mock
export function createMockGraph() {
  const graph = new FriendsCitiesGraph();

  // 1) Un nodo por cada ciudad
  const cityIds = {};
  mockCities.forEach((name) => {
    cityIds[name] = graph.addCity(name).id;
  });

  // 2) Un nodo por cada persona, referenciado a su ciudad
  const personIds = {};
  mockPeople.forEach(([name, age, city]) => {
    personIds[name] = graph.addPerson({ name, age, cityId: cityIds[city] }).id;
  });

  // 3) Aristas de amistad
  mockFriendships.forEach(([a, b]) => graph.addFriendship(personIds[a], personIds[b]));

  return graph;
}
