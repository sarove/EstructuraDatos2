import { Graph } from './Graph.js';

/**
 * GRAFO DE AMIGOS Y CIUDADES
 *
 * Extiende el grafo de la clase con las reglas del Challenge 10:
 *   - Cada PERSONA es un nodo  { id, type: 'person', name, age }
 *   - Cada CIUDAD  es un nodo  { id, type: 'city',   name }
 *   - Arista persona–ciudad  = "vive en"  (cada persona tiene UNA sola ciudad)
 *   - Arista persona–persona = "amistad"
 *
 * El tipo de una arista se deduce del tipo de los nodos que une.
 */

// "Santa Marta" -> "santa-marta" (sin tildes) para formar ids legibles
export const slug = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const byName = (a, b) => a.name.localeCompare(b.name, 'es');

export class FriendsCitiesGraph extends Graph {
  constructor() {
    super();
    this.personCounter = 0;
  }

  // ---------- Consultas por tipo ----------
  cities() {
    return this.nodes.filter((n) => n.type === 'city').sort(byName);
  }

  people() {
    return this.nodes.filter((n) => n.type === 'person').sort(byName);
  }

  isCity(id) {
    return this.searchNode(id)?.type === 'city';
  }

  isPerson(id) {
    return this.searchNode(id)?.type === 'person';
  }

  findCityByName(name) {
    return this.cities().find((c) => slug(c.name) === slug(name)) ?? null;
  }

  // ---------- Agregar nodos y aristas ----------

  // addCity: toda ciudad debe tener nombre (y no repetirse)
  addCity(name) {
    const clean = String(name ?? '').trim();
    if (!clean) throw new Error('La ciudad debe tener un nombre');
    if (this.findCityByName(clean)) throw new Error(`La ciudad "${clean}" ya existe`);
    return this.addNode({ id: `ciudad:${slug(clean)}`, type: 'city', name: clean });
  }

  // addPerson: nombre, edad y referencia OBLIGATORIA a una ciudad
  addPerson({ name, age, cityId }) {
    const clean = String(name ?? '').trim();
    if (!clean) throw new Error('La persona debe tener un nombre');
    if (!Number.isInteger(age) || age < 0) throw new Error('La edad debe ser un entero positivo');
    if (!this.isCity(cityId)) throw new Error('La persona debe estar referenciada a una ciudad existente');

    this.personCounter += 1;
    const person = this.addNode({
      id: `persona:${this.personCounter}`,
      type: 'person',
      name: clean,
      age,
    });
    this.addEdge(person.id, cityId); // arista "vive en"
    return person;
  }

  // addFriendship: arista entre dos personas distintas
  addFriendship(personId1, personId2) {
    if (!this.isPerson(personId1) || !this.isPerson(personId2)) {
      throw new Error('Una amistad solo puede unir a dos personas');
    }
    if (personId1 === personId2) throw new Error('Una persona no puede ser amiga de sí misma');
    return this.addEdge(personId1, personId2);
  }

  // moveToCity: cambia la ciudad manteniendo UNA sola referencia
  moveToCity(personId, newCityId) {
    if (!this.isPerson(personId) || !this.isCity(newCityId)) return false;
    const current = this.cityOf(personId);
    if (current?.id === newCityId) return false;
    if (current) this.removeEdge(personId, current.id);
    this.addEdge(personId, newCityId);
    return true;
  }

  // ---------- Consultas sobre las aristas ----------

  // cityOf: el único vecino de tipo ciudad de una persona
  cityOf(personId) {
    return this.neighbors(personId).find((n) => n.type === 'city') ?? null;
  }

  // friendsOf: vecinos de tipo persona
  friendsOf(personId) {
    return this.neighbors(personId).filter((n) => n.type === 'person').sort(byName);
  }

  // peopleInCity: personas que viven en una ciudad = vecinos de la ciudad
  peopleInCity(cityId) {
    if (!this.isCity(cityId)) return [];
    return this.neighbors(cityId).filter((n) => n.type === 'person').sort(byName);
  }

  // printPeopleInCity: imprime en consola la lista de personas de la ciudad
  printPeopleInCity(cityId) {
    const city = this.searchNode(cityId);
    const people = this.peopleInCity(cityId);
    console.log(`Personas que viven en ${city?.name ?? cityId}:`);
    people.forEach((p) => console.log(`  - ${p.name} (${p.age} años)`));
    return people;
  }

  // edgeType: tipo de arista según los nodos que une
  edgeType(id1, id2) {
    const a = this.searchNode(id1);
    const b = this.searchNode(id2);
    if (!a || !b) return null;
    if (a.type === 'person' && b.type === 'person') return 'friendship';
    return 'lives-in';
  }

  // edges: lista de aristas sin repetir [{ source, target, type }]
  edges() {
    const result = [];
    const seen = new Set();
    for (const [id, vecinos] of Object.entries(this.adjList)) {
      for (const vecino of vecinos) {
        const key = [id, vecino].sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        // la arista "vive en" se orienta persona -> ciudad para dibujarla
        const [source, target] = this.isCity(id) ? [vecino, id] : [id, vecino];
        result.push({ source, target, type: this.edgeType(id, vecino) });
      }
    }
    return result;
  }

  // removePerson: elimina la persona con sus aristas
  removePerson(personId) {
    if (!this.isPerson(personId)) return null;
    return this.removeNode(personId);
  }
}
