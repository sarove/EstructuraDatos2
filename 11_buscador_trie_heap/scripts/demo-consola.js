// Demo por consola (sin navegador): npm run consola
// Estudiante: Salvador Rodriguez Velasco
import { SearchEngine } from '../src/estructuras/SearchEngine.js';
import { MinHeap } from '../src/estructuras/MinHeap.js';

console.log('=== Ejemplo del Challenge 11 ===');
const engine = new SearchEngine();
engine.insert('air max', 90);
engine.insert('air force', 95);
engine.insert('air jordan', 85);
engine.insert('adidas boost', 80);

console.log('search("air max"):', engine.trie.search('air max'));
console.log('search("air"):', engine.trie.search('air'), '(es solo un prefijo)');
console.log('searchByPrefix("air"):', engine.searchByPrefix('air').map((p) => p.name));
console.log('searchTopK("air", 2):', engine.searchTopK('air', 2));
console.log('searchTopK("a", 3):', engine.searchTopK('a', 3));

console.log('\n=== MinHeap: ejemplos de la clase ===');
const h1 = new MinHeap([3, 13, 19, 33, 42, 23, 21]);
console.log('Heap inicial:      ', h1.toArray().join(', '));
h1.push(7);
console.log('push(7) (sube 7):  ', h1.toArray().join(', '));

const h2 = new MinHeap([3, 13, 19, 33, 42, 23, 21]);
console.log('pop() devuelve:    ', h2.pop());
console.log('después de pop():  ', h2.toArray().join(', '));
console.log('peek():            ', h2.peek());

const h3 = new MinHeap([33, 42, 13, 19, 23, 3, 21]);
console.log('heapify([33, 42, 13, 19, 23, 3, 21]):', h3.toArray().join(', '));
