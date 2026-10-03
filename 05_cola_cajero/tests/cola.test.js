/**
 * Pruebas de la cola, la cola del cajero y la validación.
 * Ejecutar con:  npm test
 * Estudiante: Salvador Rodriguez Velasco
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Queue } from '../src/structures/Queue.js';
import { AtmQueue } from '../src/structures/AtmQueue.js';
import {
  mockPeople,
  randomArrivalDate,
  validatePerson,
  ARRIVAL_WINDOW_MS,
} from '../src/data/people.js';

test('Queue: ejemplo de la clase (A, B, C → dequeue, peek, size)', () => {
  const queue = new Queue();
  queue.enqueue('A');
  queue.enqueue('B');
  queue.enqueue('C');
  assert.equal(queue.dequeue(), 'A');
  assert.equal(queue.peek(), 'B');
  assert.equal(queue.size(), 2);
});

test('Queue: FIFO y cola vacía', () => {
  const queue = new Queue();
  [1, 2, 3].forEach((v) => queue.enqueue(v));
  assert.deepEqual(queue.print(false), [1, 2, 3]);
  assert.equal(queue.dequeue(), 1);
  assert.equal(queue.dequeue(), 2);
  assert.equal(queue.dequeue(), 3);
  assert.equal(queue.dequeue(), null);
  assert.equal(queue.peek(), null);
  assert.equal(queue.isEmpty(), true);
});

const at = (hh, mm) => new Date(2026, 8, 25, hh, mm, 0);

test('AtmQueue: se ordena por fecha de llegada aunque se registren en otro orden', () => {
  const q = new AtmQueue();
  assert.equal(q.enqueue({ name: 'B', arrivalDate: at(9, 30) }), 0);
  assert.equal(q.enqueue({ name: 'D', arrivalDate: at(10, 15) }), 1); // llegó después: al final
  assert.equal(q.enqueue({ name: 'A', arrivalDate: at(9, 0) }), 0); // llegó antes que todos: al frente
  assert.equal(q.enqueue({ name: 'C', arrivalDate: at(9, 45) }), 2); // en medio
  assert.deepEqual(q.print(false).map((p) => p.name), ['A', 'B', 'C', 'D']);
});

test('AtmQueue: dequeue atiende siempre a quien llegó primero', () => {
  const q = new AtmQueue();
  q.enqueue({ name: 'tarde', arrivalDate: at(11, 0) });
  q.enqueue({ name: 'temprano', arrivalDate: at(8, 0) });
  assert.equal(q.peek().name, 'temprano');
  assert.equal(q.dequeue().name, 'temprano');
  assert.equal(q.dequeue().name, 'tarde');
  assert.equal(q.dequeue(), null);
});

test('AtmQueue: con la misma fecha se respeta el orden de registro', () => {
  const q = new AtmQueue();
  q.enqueue({ name: 'primero', arrivalDate: at(9, 0) });
  q.enqueue({ name: 'segundo', arrivalDate: at(9, 0) });
  assert.deepEqual(q.print(false).map((p) => p.name), ['primero', 'segundo']);
});

test('randomArrivalDate: siempre dentro de la ventana de las últimas 3 horas', () => {
  const now = at(12, 0);
  assert.equal(randomArrivalDate(now, () => 0).getTime(), now.getTime());
  const oldest = randomArrivalDate(now, () => 0.999999);
  assert.ok(now - oldest < ARRIVAL_WINDOW_MS);
  for (let i = 0; i < 200; i++) {
    const d = randomArrivalDate(now);
    assert.ok(d <= now && now - d < ARRIVAL_WINDOW_MS);
  }
});

test('Mock + cola: la impresión queda en orden cronológico', () => {
  const q = new AtmQueue();
  mockPeople.forEach((p) => q.enqueue({ ...p, arrivalDate: randomArrivalDate() }));
  const dates = q.print(false).map((p) => p.arrivalDate.getTime());
  assert.deepEqual(dates, [...dates].sort((a, b) => a - b));
  assert.equal(q.size(), mockPeople.length);
});

test('validatePerson: nombre y monto', () => {
  assert.deepEqual(validatePerson({ name: 'María José Díaz', amount: '150.000' }), {});
  assert.ok(validatePerson({ name: 'Al', amount: '50000' }).name);
  assert.ok(validatePerson({ name: 'Juan 123', amount: '50000' }).name);
  assert.ok(validatePerson({ name: 'Juan Pérez', amount: '' }).amount);
  assert.ok(validatePerson({ name: 'Juan Pérez', amount: '5000' }).amount);
  assert.ok(validatePerson({ name: 'Juan Pérez', amount: '3000000' }).amount);
  assert.match(validatePerson({ name: 'Juan Pérez', amount: '55000' }).amount, /múltiplo/);
});
