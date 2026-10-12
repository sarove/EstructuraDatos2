/**
 * Challenge 08 - Estructura de Datos y Algoritmos II
 * Estudiante: Salvador Rodriguez Velasco
 *
 * Clase Nodo: estructura básica del árbol binario (Clase 09 - Árboles).
 * Cada nodo guarda un valor y dos referencias: hijo izquierdo y derecho.
 */
export class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.izquierda = null;
    this.derecha = null;
  }

  // Un nodo es hoja cuando no tiene hijos.
  isLeaf() {
    return this.izquierda === null && this.derecha === null;
  }
}
