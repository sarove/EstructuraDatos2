/**
 * GRAFO NO DIRIGIDO - Lista de adyacencia
 * ------------------------------------------------------------
  * dos parámetros:
 *   - nodes:   lista de nodos (vértices)
 *   - adjList: objeto de adyacencia { idNodo: [ids de nodos vecinos] }
 * y los métodos addNode, addEdge, searchNode, printAdjacency y printGraph.
 *
 * Cada nodo es un objeto con un "id" único y sus datos. En la lista de
 * adyacencia se guardan solo los ids.
 */
export class Graph {
  constructor() {
    this.nodes = [];
    this.adjList = {};
  }

  // addNode: agrega un vértice y su lista de adyacencia vacía. O(1)
  // (En la diapositiva aparece "this.nodes.push[node]" con corchetes,
  //  lo que no agrega nada; aquí se llama a push(node).)
  addNode(node) {
    if (!node || node.id === undefined) throw new Error('El nodo debe tener un id');
    if (this.adjList[node.id]) return null; // ya existe
    this.nodes.push(node);
    this.adjList[node.id] = [];
    return node;
  }

  // addEdge: agrega una arista NO dirigida (en las dos listas). O(grado)
  addEdge(id1, id2) {
    if (!this.adjList[id1] || !this.adjList[id2]) {
      throw new Error(`No se puede unir ${id1} con ${id2}: uno de los nodos no existe`);
    }
    if (id1 === id2 || this.hasEdge(id1, id2)) return false;
    this.adjList[id1].push(id2);
    this.adjList[id2].push(id1);
    return true;
  }

  // removeEdge: quita la arista de las dos listas. O(grado)
  removeEdge(id1, id2) {
    if (!this.hasEdge(id1, id2)) return false;
    this.adjList[id1] = this.adjList[id1].filter((id) => id !== id2);
    this.adjList[id2] = this.adjList[id2].filter((id) => id !== id1);
    return true;
  }

  // removeNode: quita el nodo y todas sus aristas. O(V + E)
  removeNode(id) {
    if (!this.adjList[id]) return null;
    [...this.adjList[id]].forEach((vecino) => this.removeEdge(id, vecino));
    delete this.adjList[id];
    const node = this.searchNode(id);
    this.nodes = this.nodes.filter((n) => n.id !== id);
    return node;
  }

  // hasEdge: ¿existe una arista entre los dos nodos? O(grado)
  hasEdge(id1, id2) {
    return Boolean(this.adjList[id1]?.includes(id2));
  }

  // searchNode: busca un nodo en la lista de nodos. O(V)
  searchNode(id) {
    if (!this.nodes.length) return null;
    return this.nodes.find((n) => n.id === id) ?? null;
  }

  // neighbors: nodos vecinos (objetos completos) de un nodo. O(grado · V)
  neighbors(id) {
    return (this.adjList[id] ?? []).map((vecino) => this.searchNode(vecino));
  }

  // degree: número de aristas de un nodo
  degree(id) {
    return this.adjList[id]?.length ?? 0;
  }

  // edgeCount: número de aristas (cada una aparece en dos listas)
  edgeCount() {
    return Object.values(this.adjList).reduce((suma, lista) => suma + lista.length, 0) / 2;
  }

  // printAdjacency: imprime la lista de vecinos de un nodo
  printAdjacency(id) {
    if (this.searchNode(id)) {
      console.log(this.adjList[id]);
      return this.adjList[id];
    }
    return null;
  }

  // printGraph: imprime el objeto de adyacencia completo
  printGraph() {
    console.log(this.adjList);
    return this.adjList;
  }

  /**
   * adjacencyMatrix: representación con matriz de adyacencia.
   * En un grafo no dirigido la matriz es simétrica: 1 si hay arista, 0 si no.
   */
  adjacencyMatrix(ids = this.nodes.map((n) => n.id)) {
    const matrix = ids.map((fila) => ids.map((col) => (this.hasEdge(fila, col) ? 1 : 0)));
    return { ids, matrix };
  }
}
