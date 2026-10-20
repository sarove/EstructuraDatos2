/**
 * Challenge 11 - Estructura de Datos y Algoritmos II
 * Estudiante: Salvador Rodriguez Velasco
 *
 * Nodo del Trie (Clase 11 - Tries & Heaps).
 * La información no está en el nodo sino en el camino: cada nodo representa
 * una letra y el camino desde la raíz forma la palabra.
 */
export function Node(value) {
  this.value = value;          // carácter que representa el nodo (null en la raíz)
  this.isEndOfWord = false;    // true si aquí termina el nombre de un producto
  this.children = {};          // mapa carácter -> Node
  this.product = null;         // datos del producto cuando isEndOfWord es true
}
