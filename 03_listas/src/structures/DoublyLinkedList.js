/**
 * LISTA DOBLEMENTE ENLAZADA (Doubly Linked List)
 * ------------------------------------------------------------
 * Estructuras de Datos y Algoritmos II - UAO
 * Estudiante: Salvador Rodriguez Velasco
 *
 * Implementación basada en la Clase 03 - Listas:
 *   - Node:  value + next + prev
 *   - append y remove actualizan también el puntero prev
 *
 * Métodos adicionales para el historial del navegador:
 *   - truncateAfter(node): elimina todo lo que está después de un nodo
 *     (lo que hace un navegador real al visitar una página nueva
 *      después de haber regresado con "Atrás").
 *   - toArray(): utilidad para que React dibuje los nodos.
 */

// 1) Nodo doble: además de next, guarda la referencia al anterior (prev).
export class DoublyNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

// 2) Lista doblemente enlazada: head, tail y length
export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // append: agrega al final y enlaza en ambos sentidos. O(1)
  // Nota: en la diapositiva, el caso de lista vacía hace "return" antes
  // de incrementar length. Aquí se incrementa en ambos casos.
  append(value) {
    const newNode = new DoublyNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.length++;
      return newNode;
    }

    this.tail.next = newNode; // el último apunta hacia adelante al nuevo
    newNode.prev = this.tail; // el nuevo apunta hacia atrás al último
    this.tail = newNode;      // el nuevo es la cola

    this.length++;
    return newNode;
  }

  // peek: busca el primer nodo que cumpla la condición. O(n)
  peek(value, current = this.head) {
    const matches =
      typeof value === 'function' ? value : (v) => v === value;

    while (current) {
      if (matches(current.value)) {
        return current;
      }
      current = current.next;
    }

    return null;
  }

  // size: cantidad de nodos. O(1)
  size() {
    return this.length;
  }

  // remove: elimina el nodo y reconecta prev y next. O(n)
  // Nota: en la diapositiva se usa "this.size--", pero size es un método;
  // el contador correcto es this.length.
  remove(value) {
    if (!this.head) return null;

    const matches =
      typeof value === 'function' ? value : (v) => v === value;

    let current = this.head;

    while (current) {
      if (matches(current.value)) {
        if (current === this.head) {
          this.head = current.next;
          if (this.head) this.head.prev = null;
        }

        if (current === this.tail) {
          this.tail = current.prev;
          if (this.tail) this.tail.next = null;
        }

        if (current.prev) current.prev.next = current.next;
        if (current.next) current.next.prev = current.prev;

        this.length--;
        current.next = null;
        current.prev = null;
        return current;
      }
      current = current.next;
    }

    return null;
  }

  // truncateAfter: corta la lista después de "node" (historial hacia adelante). O(k)
  truncateAfter(node) {
    if (!node) return 0;

    let removed = 0;
    let current = node.next;
    while (current) {
      const next = current.next;
      current.prev = null;
      current.next = null;
      removed++;
      current = next;
    }

    node.next = null;
    this.tail = node;
    this.length -= removed;
    return removed;
  }

  // print: recorre de head a tail. O(n)
  print(format = (v) => v) {
    let current = this.head;
    let result = 'null <- ';
    while (current) {
      result += format(current.value) + (current.next ? ' <-> ' : '');
      current = current.next;
    }
    const text = result + ' -> null';
    console.log(text);
    return text;
  }

  // printReverse: recorre de tail a head (gracias a prev). O(n)
  printReverse(format = (v) => v) {
    let current = this.tail;
    let result = '';
    while (current) {
      result += format(current.value) + ' -> ';
      current = current.prev;
    }
    const text = result + 'null';
    console.log(text);
    return text;
  }

  // toArray: utilidad para renderizar en React. O(n)
  toArray() {
    const nodes = [];
    let current = this.head;
    while (current) {
      nodes.push(current);
      current = current.next;
    }
    return nodes;
  }
}
