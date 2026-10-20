/**
 * Challenge 11 - Estructura de Datos y Algoritmos II
 * Estudiante: Salvador Rodriguez Velasco
 *
 * Trie (árbol de caracteres) basado en la Clase 11.
 *  - insert(word, product): encadena un nodo por letra y marca el final.
 *  - search(word): true si la palabra completa existe.
 *  - startsWith(prefix): devuelve todos los productos cuyo nombre empieza por prefix.
 */
import { Node } from './Node.js';

export class Trie {
  constructor() {
    this.root = new Node(null);
  }

  insert(word, product = null) {
    let current = this.root;

    for (let character of word) {
      if (current.children[character] === undefined) {
        current.children[character] = new Node(character);
      }
      current = current.children[character];
    }
    current.isEndOfWord = true;
    current.product = product;
  }

  search(word) {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }

  /** Baja letra por letra desde la raíz. Devuelve el nodo final o null. */
  findNode(prefix) {
    let current = this.root;
    for (let character of prefix) {
      if (current.children[character] === undefined) {
        return null;
      }
      current = current.children[character];
    }
    return current;
  }

  /** Devuelve el producto guardado al final de una palabra, o null. */
  getProduct(word) {
    const node = this.findNode(word);
    return node && node.isEndOfWord ? node.product : null;
  }

  /**
   * Búsqueda por prefijo: primero se llega al nodo del prefijo y luego se
   * recorre (DFS) todo su subárbol recogiendo las palabras completas.
   */
  startsWith(prefix) {
    const start = this.findNode(prefix);
    const results = [];
    if (start === null) return results;

    const collect = (node) => {
      if (node.isEndOfWord) results.push(node.product);
      for (const character in node.children) {
        collect(node.children[character]);
      }
    };
    collect(start);
    return results;
  }

  /** Cantidad de nodos del Trie (sin contar la raíz). */
  countNodes(node = this.root) {
    let total = 0;
    for (const character in node.children) {
      total += 1 + this.countNodes(node.children[character]);
    }
    return total;
  }
}
