/**
 * PILA (Stack) - Principio LIFO: Last In, First Out
 * Array en JavaScript; el único método que hay que construir a mano
 * es peek (mirar la cima sin sacar el elemento).
 */
export class Stack {
  constructor() {
    this.items = [];
  }

  // push: agrega un elemento en la CIMA de la pila. O(1)
  push(value) {
    this.items.push(value);
    return this.items.length;
  }

  // pop: saca y retorna el elemento de la cima. O(1)
  pop() {
    return this.items.length > 0 ? this.items.pop() : null;
  }

  // peek: retorna el elemento de la cima SIN sacarlo. O(1)
  peek() {
    return this.items.length > 0 ? this.items[this.items.length - 1] : null;
  }

  // isEmpty: true si la pila no tiene elementos. O(1)
  isEmpty() {
    return this.items.length === 0;
  }

  // size: cantidad de elementos de la pila. O(1)
  size() {
    return this.items.length;
  }

  // print: imprime la pila desde la cima hasta la base. O(n)
  // Retorna además una copia en ese orden para poder dibujarla en pantalla.
  print(log = true) {
    const fromTop = this.items.slice().reverse();
    if (log) {
      fromTop.forEach((item) => {
        console.log(item);
      });
    }
    return fromTop;
  }
}
