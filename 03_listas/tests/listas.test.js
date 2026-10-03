/**
 * Pruebas de las estructuras de datos (sin dependencias externas).
 * Ejecutar con:  npm test
 * Estudiante: Salvador Rodriguez Velasco
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LinkedList } from '../src/structures/LinkedList.js';
import { DoublyLinkedList } from '../src/structures/DoublyLinkedList.js';

const silence = () => {
  const original = console.log;
  console.log = () => {};
  return () => (console.log = original);
};

test('LinkedList: append, size, peek y print', () => {
  const restore = silence();
  const list = new LinkedList();
  ['A', 'B', 'C'].forEach((v) => list.append(v));

  assert.equal(list.size(), 3);
  assert.equal(list.head.value, 'A');
  assert.equal(list.tail.value, 'C');
  assert.equal(list.peek('B').next.value, 'C');
  assert.equal(list.peek('Z'), null);
  assert.equal(list.print(), 'A -> B -> C -> null');
  restore();
});

test('LinkedList: remove en cabeza, medio y cola', () => {
  const list = new LinkedList();
  ['A', 'B', 'C', 'D'].forEach((v) => list.append(v));

  list.remove('B'); // medio
  assert.deepEqual(list.toArray().map((n) => n.value), ['A', 'C', 'D']);

  list.remove('A'); // cabeza
  assert.equal(list.head.value, 'C');

  list.remove('D'); // cola
  assert.equal(list.tail.value, 'C');
  assert.equal(list.size(), 1);

  list.remove('C'); // último
  assert.equal(list.head, null);
  assert.equal(list.tail, null);
  assert.equal(list.size(), 0);
  assert.equal(list.remove('X'), null);
});

test('LinkedList: recorrido en orden con next (reproductor)', () => {
  const list = new LinkedList();
  [{ id: 1 }, { id: 2 }, { id: 3 }].forEach((s) => list.append(s));
  const played = [];
  let current = list.head;
  while (current) {
    played.push(current.value.id);
    current = current.next;
  }
  assert.deepEqual(played, [1, 2, 3]);
  assert.equal(list.peek((s) => s.id === 2).value.id, 2);
});

test('DoublyLinkedList: append enlaza prev y next, length correcto', () => {
  const list = new DoublyLinkedList();
  ['A', 'B', 'C'].forEach((v) => list.append(v));

  assert.equal(list.size(), 3);
  assert.equal(list.head.prev, null);
  assert.equal(list.tail.next, null);
  assert.equal(list.tail.prev.value, 'B');
  assert.equal(list.head.next.next.prev.prev, list.head);
});

test('DoublyLinkedList: remove reconecta ambos punteros', () => {
  const list = new DoublyLinkedList();
  ['A', 'B', 'C', 'D'].forEach((v) => list.append(v));

  list.remove('B');
  assert.equal(list.peek('A').next.value, 'C');
  assert.equal(list.peek('C').prev.value, 'A');

  list.remove('A');
  assert.equal(list.head.value, 'C');
  assert.equal(list.head.prev, null);

  list.remove('D');
  assert.equal(list.tail.value, 'C');
  assert.equal(list.tail.next, null);
  assert.equal(list.size(), 1);
});

test('DoublyLinkedList: historial Atrás / Adelante / nueva visita', () => {
  const restore = silence();
  const list = new DoublyLinkedList();
  ['google', 'uao', 'mdn', 'react'].forEach((v) => list.append(v));

  let current = list.tail; // react
  current = current.prev; // mdn  (Atrás)
  current = current.prev; // uao  (Atrás)
  assert.equal(current.value, 'uao');
  current = current.next; // mdn  (Adelante)
  assert.equal(current.value, 'mdn');

  // Visitar una página nueva descarta lo que está adelante
  const discarded = list.truncateAfter(current);
  assert.equal(discarded, 1);
  current = list.append('github');
  assert.equal(list.size(), 4);
  assert.equal(list.print(), 'null <- google <-> uao <-> mdn <-> github -> null');
  assert.equal(list.printReverse(), 'github -> mdn -> uao -> google -> null');
  assert.equal(current.prev.value, 'mdn');
  restore();
});
