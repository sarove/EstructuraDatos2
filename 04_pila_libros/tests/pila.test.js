/**
 * Pruebas de la pila y de la validación de libros.
 * Ejecutar con:  npm test
 * Estudiante: Salvador Rodriguez Velasco
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Stack } from '../src/structures/Stack.js';
import { mockBooks } from '../src/data/books.js';
import { isValidIsbn, validateBook } from '../src/data/bookValidation.js';

test('Stack: ejemplo de la clase (push 10, push 20, pop, peek, isEmpty)', () => {
  const stack = new Stack();
  stack.push(10);
  stack.push(20);
  assert.equal(stack.pop(), 20);
  assert.equal(stack.peek(), 10);
  assert.equal(stack.isEmpty(), false);
});

test('Stack: LIFO - el último en entrar es el primero en salir', () => {
  const stack = new Stack();
  ['A', 'B', 'C'].forEach((v) => stack.push(v));
  assert.equal(stack.size(), 3);
  assert.equal(stack.pop(), 'C');
  assert.equal(stack.pop(), 'B');
  assert.equal(stack.pop(), 'A');
  assert.equal(stack.pop(), null);
  assert.equal(stack.peek(), null);
  assert.equal(stack.isEmpty(), true);
});

test('Stack: print retorna de la cima a la base sin modificar la pila', () => {
  const stack = new Stack();
  [1, 2, 3].forEach((v) => stack.push(v));
  assert.deepEqual(stack.print(false), [3, 2, 1]);
  assert.deepEqual(stack.items, [1, 2, 3]);
});

test('Pila de libros con datos mock: la cima es el último libro apilado', () => {
  const stack = new Stack();
  mockBooks.forEach((b) => stack.push(b));
  assert.equal(stack.size(), mockBooks.length);
  assert.equal(stack.peek().name, mockBooks[mockBooks.length - 1].name);
});

test('Todos los libros mock tienen nombre, ISBN válido, autor y editorial', () => {
  mockBooks.forEach((b) => {
    assert.ok(b.name && b.author && b.editorial, b.name);
    assert.ok(isValidIsbn(b.isbn), `ISBN inválido: ${b.isbn}`);
  });
});

test('Validación: ISBN-10, ISBN-13, errores y duplicados', () => {
  assert.equal(isValidIsbn('0-306-40615-2'), true); // ISBN-10
  assert.equal(isValidIsbn('043942089X'), true); // ISBN-10 con X
  assert.equal(isValidIsbn('978-0-306-40615-7'), true); // ISBN-13
  assert.equal(isValidIsbn('978-0-306-40615-8'), false);
  assert.equal(isValidIsbn('12345'), false);

  const ok = { name: 'Rayuela', isbn: '978-0-306-40615-7', author: 'Julio Cortázar', editorial: 'Alfaguara' };
  assert.deepEqual(validateBook(ok, mockBooks), {});

  const bad = validateBook({ name: '', isbn: '123', author: 'Yo', editorial: '' });
  assert.deepEqual(Object.keys(bad).sort(), ['author', 'editorial', 'isbn', 'name']);

  const dup = validateBook({ ...ok, isbn: mockBooks[0].isbn }, mockBooks);
  assert.match(dup.isbn, /Ya existe/);
});
