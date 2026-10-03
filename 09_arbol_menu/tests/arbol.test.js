/**
 * Pruebas del árbol N-ario y del árbol de menús.
 * Ejecutar con:  npm test
 * Estudiante: Salvador Rodriguez Velasco
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Nodo, ArbolNario } from '../src/structures/ArbolNario.js';
import { crearArbolMenu } from '../src/data/menuTree.js';

// Árbol de la presentación: A(B(E(K,L,M),F,G), C, D(H,I,J))
function arbolClase() {
  const n = (v) => new Nodo(v);
  const A = n('A');
  const B = A.agregarHijo(n('B'));
  A.agregarHijo(n('C'));
  const D = A.agregarHijo(n('D'));
  const E = B.agregarHijo(n('E'));
  B.agregarHijo(n('F'));
  B.agregarHijo(n('G'));
  ['K', 'L', 'M'].forEach((v) => E.agregarHijo(n(v)));
  ['H', 'I', 'J'].forEach((v) => D.agregarHijo(n(v)));
  return new ArbolNario(A);
}

const valores = (lista) => lista.map(({ nodo }) => nodo.valor).join('');
const silencio = () => {};

test('DFS recorre en profundidad (ejemplo de la clase)', () => {
  assert.equal(valores(arbolClase().dfs(silencio)), 'ABEKLMFGCDHIJ');
});

test('BFS recorre por niveles (ejemplo de la clase)', () => {
  const recorrido = arbolClase().bfs(silencio);
  assert.equal(valores(recorrido), 'ABCDEFGHIJKLM');
  assert.deepEqual(
    recorrido.map((r) => r.nivel),
    [0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3]
  );
});

test('Terminología: tamaño, altura, hojas, grado', () => {
  const arbol = arbolClase();
  assert.equal(arbol.tamano(), 13);
  assert.equal(arbol.altura(), 3);
  assert.equal(arbol.hojas().map((n) => n.valor).join(''), 'KLMFGCHIJ');
  assert.equal(arbol.grado(), 3);
  assert.equal(new ArbolNario().tamano(), 0);
  assert.equal(new ArbolNario().altura(), -1);
});

test('buscar y rutaHasta', () => {
  const arbol = arbolClase();
  assert.equal(arbol.buscar((v) => v === 'L').valor, 'L');
  assert.equal(arbol.buscar((v) => v === 'Z'), null);
  assert.equal(arbol.rutaHasta((v) => v === 'L').map((n) => n.valor).join('>'), 'A>B>E>L');
  assert.deepEqual(arbol.rutaHasta((v) => v === 'Z'), []);
});

test('imprimir dibuja el árbol con conectores', () => {
  const raiz = new Nodo('Menú');
  const ayuda = raiz.agregarHijo(new Nodo('Ayuda'));
  raiz.agregarHijo(new Nodo('Salir'));
  ayuda.agregarHijo(new Nodo('FAQ'));
  assert.equal(
    new ArbolNario(raiz).imprimir(),
    ['Menú', '├── Ayuda', '│   └── FAQ', '└── Salir'].join('\n')
  );
});

// Componentes de prueba: cada nombre retorna una función distinta
const componentes = new Proxy({}, { get: (_, nombre) => Object.assign(() => null, { nombre }) });

test('Árbol de menús: cada ítem tiene title, link y component', () => {
  const menu = crearArbolMenu(componentes);
  const nodos = menu.dfs(silencio);
  assert.equal(nodos.length, 16);
  for (const { nodo } of nodos) {
    assert.ok(nodo.valor.title, 'title');
    assert.match(nodo.valor.link, /^\//, 'link');
    assert.equal(typeof nodo.valor.component, 'function', 'component');
  }
  const links = nodos.map(({ nodo }) => nodo.valor.link);
  assert.equal(new Set(links).size, links.length, 'links únicos');
});

test('Árbol de menús: estructura de menús y submenús', () => {
  const menu = crearArbolMenu(componentes);
  assert.deepEqual(
    menu.raiz.hijos.map((h) => h.valor.title),
    ['Perfil', 'Mensajes', 'Configuración', 'Ayuda', 'Cerrar sesión']
  );
  assert.equal(menu.altura(), 3);
  assert.equal(menu.hojas().length, 12);
  const ruta = menu.rutaHasta((v) => v.link === '/configuracion/seguridad/sesiones');
  assert.deepEqual(
    ruta.map((n) => n.valor.title),
    ['Menú principal', 'Configuración', 'Seguridad y privacidad', 'Sesiones activas']
  );
  assert.equal(menu.buscar((v) => v.link === '/ayuda/ticket').valor.component.nombre, 'TicketPage');
});
