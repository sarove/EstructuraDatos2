import { createContext, useContext, useState } from 'react';
import { AtmQueue } from '../structures/AtmQueue.js';
import { mockPeople, randomArrivalDate, randomNames, formatMoney, formatTime } from '../data/people.js';

/**
 * Contexto que guarda UNA sola cola del cajero para toda la aplicación.
 * La pantalla del formulario y la pantalla de la cola comparten la
 * misma instancia de AtmQueue.
 * Estudiante: Salvador Rodriguez Velasco
 */
const AtmQueueContext = createContext(null);

// Número de registro: indica en qué orden se registró cada persona
let nextTicket = 1;

// Crea una persona. La FECHA DE LLEGADA la asigna el sistema al azar.
function createPerson({ name, amount }) {
  const ticket = nextTicket++;
  return {
    id: ticket,
    ticket: `R-${String(ticket).padStart(3, '0')}`,
    name: name.trim(),
    amount,
    arrivalDate: randomArrivalDate(),
  };
}

// Llena la cola con los datos simulados (mock)
function fillWithMock(queue) {
  mockPeople.forEach((p) => queue.enqueue(createPerson(p)));
}

function createAtmQueue() {
  const queue = new AtmQueue();
  fillWithMock(queue);
  return queue;
}

export function AtmQueueProvider({ children }) {
  const [queue] = useState(createAtmQueue);
  const [, setVersion] = useState(0); // fuerza re-render tras modificar la cola
  const [log, setLog] = useState([]);
  const [served, setServed] = useState([]);

  const refresh = () => setVersion((v) => v + 1);
  const addLog = (msg) => setLog((prev) => [msg, ...prev].slice(0, 10));

  // enqueue: agrega a la persona según su fecha de llegada
  const addPerson = (data) => {
    const person = createPerson(data);
    const position = queue.enqueue(person);
    addLog(
      `enqueue("${person.name}", llegada ${formatTime(person.arrivalDate)}) → posición ${position + 1} de ${queue.size()}`
    );
    refresh();
    return { person, position };
  };

  const addRandomPerson = () => {
    const name = randomNames[Math.floor(Math.random() * randomNames.length)];
    const amount = (Math.floor(Math.random() * 60) + 1) * 10000; // 10.000 a 600.000
    return addPerson({ name, amount });
  };

  // dequeue: atiende a quien está en el frente (llegó primero)
  const serveNext = () => {
    const person = queue.dequeue();
    if (person) {
      setServed((prev) => [{ ...person, servedAt: new Date() }, ...prev]);
      addLog(`dequeue() → "${person.name}" retira ${formatMoney(person.amount)} · size() = ${queue.size()}`);
    } else {
      addLog('dequeue() → null (no hay personas en la cola)');
    }
    refresh();
    return person;
  };

  // peek: consulta quién sigue sin sacarlo de la cola
  const peekFront = () => {
    const person = queue.peek();
    addLog(person ? `peek() → "${person.name}" (llegó ${formatTime(person.arrivalDate)})` : 'peek() → null');
    return person;
  };

  // print: imprime en consola la cola del frente al final
  const printQueue = () => {
    const people = queue.print();
    addLog(
      `print() → ${people.length ? people.map((p) => `${p.name} (${formatTime(p.arrivalDate)})`).join(' | ') : '(vacía)'}`
    );
  };

  const resetQueue = () => {
    while (!queue.isEmpty()) queue.dequeue();
    fillWithMock(queue);
    setServed([]);
    addLog(`Cola reiniciada con ${queue.size()} personas de ejemplo (nuevas fechas aleatorias)`);
    refresh();
  };

  const people = queue.print(false);

  const value = {
    queue,
    people, // del frente al final = orden de llegada
    front: queue.peek(),
    size: queue.size(),
    isEmpty: queue.isEmpty(),
    pendingAmount: people.reduce((sum, p) => sum + p.amount, 0),
    served,
    servedAmount: served.reduce((sum, p) => sum + p.amount, 0),
    log,
    addPerson,
    addRandomPerson,
    serveNext,
    peekFront,
    printQueue,
    resetQueue,
  };

  return <AtmQueueContext.Provider value={value}>{children}</AtmQueueContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAtmQueue() {
  const ctx = useContext(AtmQueueContext);
  if (!ctx) throw new Error('useAtmQueue debe usarse dentro de <AtmQueueProvider>');
  return ctx;
}
