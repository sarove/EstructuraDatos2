/**
 * COLA (Queue) - Principio FIFO: First In, First Out
 * ------------------------------------------------------------
 * Estructuras de Datos y Algoritmos II - UAO
 * Estudiante: Salvador Rodriguez Velasco
 *
 * Implementación basada en la Clase 06 - Pilas y Colas.
 * Se usa un arreglo interno (items):
 *   - El FRENTE (front) es la posición 0: de ahí se atiende (dequeue).
 *   - El FINAL  (back)  es la última posición: ahí se agrega (enqueue).
 *
 * Como indica la clase, push, shift y length vienen del prototipo de
 * Array en JavaScript; el único método que hay que construir a mano
 * es peek (mirar el frente sin sacarlo).
 */
export class Queue {
  constructor() {
    this.items = [];
  }

  // enqueue: agrega un elemento al FINAL de la cola. O(1)
  enqueue(item) {
    this.items.push(item);
    return this.items.length - 1; // posición en la que quedó
  }

  // dequeue: saca y retorna el elemento del FRENTE. O(n) por shift()
  dequeue() {
    return this.items.length > 0 ? this.items.shift() : null;
  }

  // peek: retorna el elemento del frente SIN sacarlo. O(1)
  peek() {
    return this.items.length > 0 ? this.items[0] : null;
  }

  // size: cantidad de elementos. O(1)
  size() {
    return this.items.length;
  }

  // isEmpty: true si la cola no tiene elementos. O(1)
  isEmpty() {
    return this.items.length === 0;
  }

  // print: imprime la cola del frente al final. O(n)
  // Retorna además una copia para poder dibujarla en pantalla.
  print(log = true) {
    if (log) {
      this.items.forEach((item) => {
        console.log(item);
      });
    }
    return this.items.slice();
  }
}
