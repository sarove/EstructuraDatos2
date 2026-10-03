/**
 * LISTA ENLAZADA SIMPLE (Singly Linked List)
 * ------------------------------------------------------------
 * Estructuras de Datos y Algoritmos II - UAO
 * Estudiante: Salvador Rodriguez Velasco
 *
 * Implementación basada en la Clase 03 - Listas:
 *   - Node:       value + next
 *   - LinkedList: head, tail, length
 *   - Métodos:    append, peek, size, remove, print
 *
 * Se agrega toArray() solo como utilidad para que React
 * pueda dibujar los nodos en pantalla.
 */

// 1) Clase Node: cada elemento de la lista.
//    Tiene el dato (value) y la referencia al siguiente nodo (next).
export class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// 2) Clase LinkedList: guarda la cabeza (head), la cola (tail)
//    y la cantidad de nodos (length).
export class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // append: agrega un nuevo nodo al final de la lista. O(1)
  append(value) {
    const newNode = new Node(value);

    if (!this.head) {
      // Lista vacía: el nuevo nodo es la cabeza
      this.head = newNode;
    } else {
      // El último nodo actual apunta al nuevo
      this.tail.next = newNode;
    }

    // El nuevo nodo pasa a ser la cola
    this.tail = newNode;
    this.length++;
    return newNode;
  }

  // peek: busca y retorna el nodo cuyo valor cumpla la condición. O(n)
  // Acepta un valor directo o una función de comparación (útil con objetos).
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

  // size: retorna el número de elementos de la lista. O(1)
  size() {
    return this.length;
  }

  // remove: elimina un nodo y une el anterior con el siguiente. O(n)
  // Nota: en la diapositiva se declara "let current" dentro del método
  // cuando "current" ya es un parámetro, lo que genera un SyntaxError.
  // Aquí se usa un parámetro de búsqueda y una variable local distinta.
  remove(value) {
    if (!this.head) return null;

    const matches =
      typeof value === 'function' ? value : (v) => v === value;

    // Caso 1: el nodo a eliminar es la cabeza
    if (matches(this.head.value)) {
      const removed = this.head;
      this.head = this.head.next;

      // Si la lista quedó vacía, la cola también es null
      if (!this.head) {
        this.tail = null;
      }

      this.length--;
      removed.next = null;
      return removed;
    }

    // Caso 2: recorrer hasta el nodo ANTERIOR al que se elimina
    let current = this.head;
    while (current.next && !matches(current.next.value)) {
      current = current.next;
    }

    // Si se encontró, se "salta" el nodo eliminado
    if (current.next) {
      const removed = current.next;
      current.next = current.next.next;

      // Si se eliminó la cola, el anterior pasa a ser la cola
      if (!current.next) this.tail = current;

      this.length--;
      removed.next = null;
      return removed;
    }

    return null;
  }

  // print: imprime el contenido de la lista en consola. O(n)
  // Recibe opcionalmente una función para formatear cada valor.
  print(format = (v) => v) {
    let current = this.head;
    let result = '';
    while (current) {
      result += format(current.value) + ' -> ';
      current = current.next;
    }
    const text = result + 'null';
    console.log(text);
    return text;
  }

  // toArray: utilidad para renderizar la lista en React. O(n)
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
