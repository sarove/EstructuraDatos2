/**
 * ÁRBOL N-ARIO (N-ary Tree)
 * ------------------------------------------------------------
 * Estructuras de Datos y Algoritmos II - UAO
 * Estudiante: Salvador Rodriguez Velasco
 *
 * Implementación basada en la Clase 09 - Árboles:
 *   - Nodo:        valor + hijos (lista de referencias a otros nodos)
 *   - agregarHijo: agrega un nodo como hijo de otro nodo
 *   - dfs:         recorrido en profundidad (recursivo)
 *   - bfs:         recorrido por niveles (usa una cola)
 *
 * A diferencia del árbol binario (izquierda / derecha), en un árbol
 * N-ario cada nodo puede tener CUALQUIER cantidad de hijos.
 */

// 1) Clase Nodo: guarda un valor y la lista de sus hijos
export class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.hijos = [];
  }

  // agregarHijo: agrega un nodo a la lista de hijos. Retorna el hijo
  // para poder encadenar la construcción del árbol.
  agregarHijo(nodo) {
    this.hijos.push(nodo);
    return nodo;
  }

  // esHoja: un nodo hoja es el que no tiene hijos
  esHoja() {
    return this.hijos.length === 0;
  }
}

// 2) Clase ArbolNario: parte de un nodo raíz, el único sin padre
export class ArbolNario {
  constructor(raiz = null) {
    this.raiz = raiz;
  }

  /**
   * DFS (Depth-First Search) - recorrido en profundidad, preorden.
   * Visita el nodo y luego, recursivamente, cada uno de sus hijos:
   * baja lo más profundo posible por una rama antes de seguir con la otra.
   * @param {(nodo, nivel) => void} visitar  acción por cada nodo
   * @returns {Array<{nodo, nivel}>} nodos en el orden visitado
   */
  dfs(visitar = (nodo) => console.log(nodo.valor), nodo = this.raiz, nivel = 0, resultado = []) {
    if (!nodo) return resultado;
    visitar(nodo, nivel);
    resultado.push({ nodo, nivel });
    for (const hijo of nodo.hijos) {
      this.dfs(visitar, hijo, nivel + 1, resultado);
    }
    return resultado;
  }

  /**
   * BFS (Breadth-First Search) - recorrido por niveles.
   * Usa una COLA: saca el primero, lo visita y encola sus hijos.
   * Así imprime nivel por nivel, de izquierda a derecha.
   * @returns {Array<{nodo, nivel}>} nodos en el orden visitado
   */
  bfs(visitar = (nodo) => console.log(nodo.valor)) {
    const resultado = [];
    if (!this.raiz) return resultado;

    const cola = [{ nodo: this.raiz, nivel: 0 }];
    while (cola.length > 0) {
      const actual = cola.shift();
      visitar(actual.nodo, actual.nivel);
      resultado.push(actual);
      cola.push(...actual.nodo.hijos.map((hijo) => ({ nodo: hijo, nivel: actual.nivel + 1 })));
    }
    return resultado;
  }

  // buscar: primer nodo (en DFS) cuyo valor cumple la condición
  buscar(condicion, nodo = this.raiz) {
    if (!nodo) return null;
    if (condicion(nodo.valor)) return nodo;
    for (const hijo of nodo.hijos) {
      const encontrado = this.buscar(condicion, hijo);
      if (encontrado) return encontrado;
    }
    return null;
  }

  /**
   * rutaHasta: camino desde la raíz hasta el nodo que cumple la condición.
   * Sirve para las "migas de pan" y para abrir los submenús padres.
   * @returns {Nodo[]} [raiz, ..., nodoEncontrado]  o  [] si no existe
   */
  rutaHasta(condicion, nodo = this.raiz, camino = []) {
    if (!nodo) return [];
    const nuevoCamino = [...camino, nodo];
    if (condicion(nodo.valor)) return nuevoCamino;
    for (const hijo of nodo.hijos) {
      const ruta = this.rutaHasta(condicion, hijo, nuevoCamino);
      if (ruta.length) return ruta;
    }
    return [];
  }

  // tamano: cantidad total de nodos
  tamano(nodo = this.raiz) {
    if (!nodo) return 0;
    return 1 + nodo.hijos.reduce((suma, hijo) => suma + this.tamano(hijo), 0);
  }

  // altura: nivel máximo del árbol (la raíz está en el nivel 0)
  altura(nodo = this.raiz) {
    if (!nodo) return -1;
    if (nodo.esHoja()) return 0;
    return 1 + Math.max(...nodo.hijos.map((hijo) => this.altura(hijo)));
  }

  // hojas: nodos que no tienen hijos
  hojas() {
    return this.dfs(() => {}).filter(({ nodo }) => nodo.esHoja()).map(({ nodo }) => nodo);
  }

  // grado: máximo número de hijos que tiene un nodo del árbol
  grado() {
    return Math.max(0, ...this.dfs(() => {}).map(({ nodo }) => nodo.hijos.length));
  }

  /**
   * imprimir: representación en texto del árbol, con conectores.
   *   Menú
   *   ├── Perfil
   *   └── Ayuda
   *       └── Preguntas frecuentes
   */
  imprimir(formato = (valor) => String(valor)) {
    if (!this.raiz) return '(árbol vacío)';
    const lineas = [formato(this.raiz.valor)];

    const recorrer = (nodo, prefijo) => {
      nodo.hijos.forEach((hijo, i) => {
        const esUltimo = i === nodo.hijos.length - 1;
        lineas.push(`${prefijo}${esUltimo ? '└── ' : '├── '}${formato(hijo.valor)}`);
        recorrer(hijo, prefijo + (esUltimo ? '    ' : '│   '));
      });
    };

    recorrer(this.raiz, '');
    return lineas.join('\n');
  }
}
