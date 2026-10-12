/**
 * Challenge 11 - Smart search engine + Top results
 * Estudiante: Salvador Rodriguez Velasco
 *
 *  - Los productos se guardan en un Trie (por nombre).
 *  - La búsqueda por prefijo usa Trie.startsWith.
 *  - El Top K más popular se obtiene con un MinHeap de tamaño K.
 */
import { Trie } from './Trie.js';
import { MinHeap } from './MinHeap.js';

// Normaliza el texto para que "Air Max " y "air max" sean lo mismo.
export const normalize = (text) => text.trim().toLowerCase().replace(/\s+/g, ' ');

// "a es menos popular que b". En empate, el nombre alfabéticamente mayor
// se considera menor, para que el Top K quede en orden alfabético.
export const lessPopular = (a, b) =>
  a.popularity < b.popularity || (a.popularity === b.popularity && a.name > b.name);

export class SearchEngine {
  constructor() {
    this.trie = new Trie();
    this.count = 0;
  }

  /** Inserta un producto. Si el nombre ya existe, actualiza su popularidad. */
  insert(name, popularity) {
    const key = normalize(name);
    if (!key) return null;
    if (!this.trie.search(key)) this.count++;
    const product = { name: key, popularity: Number(popularity) };
    this.trie.insert(key, product);
    return product;
  }

  /** Todos los productos que empiezan por el prefijo. */
  searchByPrefix(prefix) {
    return this.trie.startsWith(normalize(prefix));
  }

  /**
   * Top K más populares que empiezan por el prefijo.
   * Se mantiene un MinHeap con a lo sumo K productos: si se pasa de K se
   * saca el mínimo (el menos popular). Al final el heap tiene los K mejores;
   * se sacan con pop (de menor a mayor) y se invierte el arreglo.
   * Complejidad: O(m log K), con m = productos que coinciden con el prefijo.
   */
  searchTopK(prefix, k) {
    const { top } = this.searchTopKDetallado(prefix, k);
    return top;
  }

  /** Igual que searchTopK pero devuelve también datos para mostrar el proceso. */
  searchTopKDetallado(prefix, k) {
    const matches = this.searchByPrefix(prefix);
    const heap = new MinHeap([], lessPopular);

    for (const product of matches) {
      heap.push(product);
      if (heap.size() > k) heap.pop();
    }
    const heapArray = heap.toArray();

    const top = [];
    while (heap.size() > 0) top.push(heap.pop());
    top.reverse();

    return { top, matches, heapArray };
  }

  /** Suma popularidad a un producto (por ejemplo, cuando alguien lo visita). */
  addPopularity(name, amount = 1) {
    const product = this.trie.getProduct(normalize(name));
    if (product) product.popularity += amount;
    return product;
  }

  all() {
    return this.trie.startsWith('');
  }

  size() {
    return this.count;
  }
}
