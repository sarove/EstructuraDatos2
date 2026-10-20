import { createContext, useContext, useState } from 'react';
import { Stack } from '../structures/Stack.js';
import { mockBooks } from '../data/books.js';

/**
 * Contexto que guarda UNA sola pila de libros para toda la aplicación.
 * Así la pantalla del formulario y la pantalla de la pila comparten
 * la misma instancia de Stack.
 * Estudiante: Salvador Rodriguez Velasco
 */
const BookStackContext = createContext(null);

let nextId = 1;
const withId = (book) => ({ ...book, id: nextId++ });

// Llena la pila con los datos simulados (mock)
function createBookStack() {
  const stack = new Stack();
  mockBooks.forEach((book) => stack.push(withId(book)));
  return stack;
}

export function BookStackProvider({ children }) {
  const [stack] = useState(createBookStack);
  const [, setVersion] = useState(0); // fuerza re-render tras modificar la pila
  const [log, setLog] = useState([]);
  const [popped, setPopped] = useState([]);

  const refresh = () => setVersion((v) => v + 1);
  const addLog = (msg) => setLog((prev) => [msg, ...prev].slice(0, 10));

  // push: agrega un libro nuevo en la cima
  const pushBook = (book) => {
    const newBook = withId({
      name: book.name.trim(),
      isbn: book.isbn.trim(),
      author: book.author.trim(),
      editorial: book.editorial.trim(),
    });
    stack.push(newBook);
    addLog(`push("${newBook.name}") → size() = ${stack.size()}`);
    refresh();
    return newBook;
  };

  // pop: saca el libro de la cima
  const popBook = () => {
    const book = stack.pop();
    if (book) {
      setPopped((prev) => [book, ...prev]);
      addLog(`pop() → "${book.name}" · size() = ${stack.size()}`);
    } else {
      addLog('pop() → null (la pila está vacía)');
    }
    refresh();
    return book;
  };

  // peek: consulta la cima sin sacarla
  const peekBook = () => {
    const book = stack.peek();
    addLog(book ? `peek() → "${book.name}"` : 'peek() → null (la pila está vacía)');
    return book;
  };

  // print: imprime en consola y en la pantalla de la cima a la base
  const printStack = () => {
    const books = stack.print();
    addLog(
      `print() → ${books.length ? books.map((b) => b.name).join(' | ') : '(vacía)'}`
    );
  };

  // Vuelve a llenar la pila con los datos mock
  const resetStack = () => {
    while (!stack.isEmpty()) stack.pop();
    mockBooks.forEach((book) => stack.push(withId(book)));
    setPopped([]);
    addLog(`Pila reiniciada con ${stack.size()} libros de ejemplo`);
    refresh();
  };

  const value = {
    stack,
    books: stack.print(false), // de la cima a la base, sin imprimir en consola
    top: stack.peek(),
    size: stack.size(),
    isEmpty: stack.isEmpty(),
    popped,
    log,
    pushBook,
    popBook,
    peekBook,
    printStack,
    resetStack,
  };

  return <BookStackContext.Provider value={value}>{children}</BookStackContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBookStack() {
  const ctx = useContext(BookStackContext);
  if (!ctx) throw new Error('useBookStack debe usarse dentro de <BookStackProvider>');
  return ctx;
}
