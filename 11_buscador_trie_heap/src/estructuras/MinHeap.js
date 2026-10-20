/**
 * Challenge 11 - Estructura de Datos y Algoritmos II
 * Estudiante: Salvador Rodriguez Velasco
 *
 * MinHeap representado con un arreglo (Clase 11).
 * Para el nodo en la posición i: hijo izquierdo 2i+1, hijo derecho 2i+2,
 * padre floor((i-1)/2).
 *
 * Igual que en la clase, pero con una función de comparación opcional
 * (less) para poder guardar objetos (productos) y no solo números.
 */
const defaultLess = (a, b) => a < b;

export class MinHeap {
  constructor(initial = [], less = defaultLess) {
    this.heap = [];
    this.less = less;

    if (initial.length > 0) {
      this.heap = [...initial];
      this.heapify();
    }
  }

  // push: inserta al final y lo sube hasta su lugar.
  push(value) {
    this.heap.push(value);
    this.percolateUp();
  }

  // pop: quita el mínimo (la raíz) y reordena el heap.
  pop() {
    if (this.heap.length === 0) return undefined;

    const n = this.heap.length;
    this.swap(0, n - 1);

    const min = this.heap.pop();
    this.percolateDown(0);

    return min;
  }

  // peek: consulta el mínimo sin quitarlo.
  peek() {
    return this.heap[0];
  }

  // heapify: convierte un arreglo cualquiera en un heap.
  heapify() {
    const start = Math.floor((this.heap.length - 2) / 2);

    for (let i = start; i >= 0; i--) {
      this.percolateDown(i);
    }
  }

  // percolateDown: baja el elemento cambiándolo por el hijo menor.
  percolateDown(index) {
    let curr = index;

    while (2 * curr + 1 < this.heap.length) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;

      const minChild =
        right < this.heap.length && this.less(this.heap[right], this.heap[left])
          ? right
          : left;

      if (this.less(this.heap[minChild], this.heap[curr])) {
        this.swap(curr, minChild);
        curr = minChild;
      } else {
        break;
      }
    }
  }

  // percolateUp: sube el último elemento mientras sea menor que su padre.
  percolateUp() {
    let curr = this.heap.length - 1;

    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);

      if (this.less(this.heap[curr], this.heap[parent])) {
        this.swap(curr, parent);
        curr = parent;
      } else {
        break;
      }
    }
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  size() {
    return this.heap.length;
  }

  toArray() {
    return [...this.heap];
  }
}
