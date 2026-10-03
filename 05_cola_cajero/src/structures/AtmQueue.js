import { Queue } from './Queue.js';

/**
 * COLA DEL CAJERO AUTOMÁTICO (ATM)
 * ------------------------------------------------------------
 * Estudiante: Salvador Rodriguez Velasco
 *
 * Extiende la cola de la clase. El reto pide que cada persona tenga una
 * FECHA DE LLEGADA ALEATORIA asignada por el sistema y que la cola se
 * imprima SEGÚN LA FECHA DE LLEGADA.
 *
 * Como la fecha es aleatoria, una persona que se registra ahora pudo
 * haber llegado ANTES que alguien que ya está en la cola. Para respetar
 * "el primero en llegar es el primero en ser atendido", enqueue inserta
 * a la persona en su posición cronológica (del más antiguo al más reciente).
 *
 *   - Si llegó después de todos  -> queda al final (igual que la cola normal).
 *   - Si llegó antes que alguien -> queda delante de esa persona.
 *   - Con fechas iguales se respeta el orden de registro (inserción estable).
 *
 * dequeue, peek, size, isEmpty y print se heredan sin cambios: el frente
 * siempre es la persona con la fecha de llegada más antigua.
 */
export class AtmQueue extends Queue {
  // enqueue ordenado por arrivalDate. O(n)
  enqueue(person) {
    let position = this.items.length;

    // Recorre desde el final hacia el frente mientras la persona
    // de adelante haya llegado DESPUÉS que la nueva.
    while (position > 0 && this.items[position - 1].arrivalDate > person.arrivalDate) {
      position--;
    }

    this.items.splice(position, 0, person);
    return position; // 0 = frente de la cola
  }
}
