# Challenge 11 · Buscador inteligente + Top resultados (Trie + Heap)

**Estudiante:** Salvador Rodriguez Velasco
**Asignatura:** Estructura de Datos y Algoritmos II, Universidad Autónoma de Occidente

## Qué hace

1. Guarda productos `{ name, popularity }` en un **Trie**.
2. Busca por **prefijo** mientras se escribe.
3. Usa un **MinHeap** de tamaño K para devolver el **Top K** más popular.

```js
insert("air max", 90); insert("air force", 95); insert("air jordan", 85); insert("adidas boost", 80);
searchTopK("air", 2); // [{ name: "air force", popularity: 95 }, { name: "air max", popularity: 90 }]
```

## Cómo ejecutarlo

Requisito: Node.js 18 o superior.

```bash
npm install
npm run dev       # abre http://localhost:5173
npm run consola   # ejemplo del reto en la terminal
```

## Estructura

```
src/
  estructuras/Node.js          Nodo del Trie (value, isEndOfWord, children)
  estructuras/Trie.js          insert, search, startsWith (búsqueda por prefijo)
  estructuras/MinHeap.js       push, pop, peek, heapify, percolateUp/Down
  estructuras/SearchEngine.js  insert, searchByPrefix, searchTopK
  components/                  Buscador, Resultados, AgregarProducto, HeapVista, TrieVista
  data.js                      Productos iniciales
  App.jsx                      Componente principal
scripts/demo-consola.js        Demo por terminal
```
