/**
 * Challenge 08 - Estructura de Datos y Algoritmos II
 * Estudiante: Salvador Rodriguez Velasco
 *
 * Clase ArbolBinario (árbol binario de búsqueda), basada en la Clase 09 - Árboles.
 *  - insertar(valor): menores a la izquierda, mayores a la derecha, sin duplicados.
 *  - preOrder / inOrder / postOrder: recorridos recursivos.
 *  - imprimirRecorridos(): imprime los tres recorridos por consola.
 *  - buscar(valor): indica si un valor está en el árbol.
 *  - toD3(): convierte el árbol a la estructura que exige react-d3-tree.
 */
import { Nodo } from './Nodo.js';

export class ArbolBinario {
  constructor() {
    this.raiz = null;
  }

  /**
   * Inserta un valor recorriendo el árbol desde la raíz.
   * Devuelve true si se insertó y false si el valor ya existía.
   */
  insertar(valor) {
    const nuevoNodo = new Nodo(valor);
    if (!this.raiz) {
      this.raiz = nuevoNodo;
      return true;
    }

    let actual = this.raiz;
    while (true) {
      if (valor === actual.valor) {
        return false; // No se permiten valores repetidos.
      }
      if (valor < actual.valor) {
        if (!actual.izquierda) {
          actual.izquierda = nuevoNodo;
          return true;
        }
        actual = actual.izquierda;
      } else {
        if (!actual.derecha) {
          actual.derecha = nuevoNodo;
          return true;
        }
        actual = actual.derecha;
      }
    }
  }

  /** Inserta una serie de números, en el orden dado. */
  insertarSerie(valores) {
    valores.forEach((v) => this.insertar(v));
    return this;
  }

  // PreOrder: Nodo - Izquierda - Derecha (N-L-R)
  preOrder(nodo = this.raiz, resultado = []) {
    if (nodo) {
      resultado.push(nodo.valor);
      this.preOrder(nodo.izquierda, resultado);
      this.preOrder(nodo.derecha, resultado);
    }
    return resultado;
  }

  // InOrder: Izquierda - Nodo - Derecha (L-N-R). En un ABB sale ordenado.
  inOrder(nodo = this.raiz, resultado = []) {
    if (nodo) {
      this.inOrder(nodo.izquierda, resultado);
      resultado.push(nodo.valor);
      this.inOrder(nodo.derecha, resultado);
    }
    return resultado;
  }

  // PostOrder: Izquierda - Derecha - Nodo (L-R-N)
  postOrder(nodo = this.raiz, resultado = []) {
    if (nodo) {
      this.postOrder(nodo.izquierda, resultado);
      this.postOrder(nodo.derecha, resultado);
      resultado.push(nodo.valor);
    }
    return resultado;
  }

  /** Imprime por consola los tres recorridos y los devuelve. */
  imprimirRecorridos() {
    const recorridos = {
      inOrder: this.inOrder(),
      postOrder: this.postOrder(),
      preOrder: this.preOrder(),
    };
    console.log('InOrder   (L-N-R):', recorridos.inOrder.join(' '));
    console.log('PostOrder (L-R-N):', recorridos.postOrder.join(' '));
    console.log('PreOrder  (N-L-R):', recorridos.preOrder.join(' '));
    return recorridos;
  }

  /**
   * Verifica si un valor está en el árbol.
   * Aprovecha el orden del ABB: en cada paso descarta la mitad del subárbol.
   * Devuelve { encontrado, camino } donde camino son los valores visitados.
   */
  buscar(valor) {
    const camino = [];
    let actual = this.raiz;
    while (actual) {
      camino.push(actual.valor);
      if (valor === actual.valor) return { encontrado: true, camino };
      actual = valor < actual.valor ? actual.izquierda : actual.derecha;
    }
    return { encontrado: false, camino };
  }

  /** Atajo booleano de buscar(). */
  contiene(valor) {
    return this.buscar(valor).encontrado;
  }

  /**
   * react-d3-tree espera objetos de la forma { name, attributes?, children? }.
   * Como la librería no distingue hijo izquierdo y derecho, cuando un nodo tiene
   * un solo hijo se agrega un nodo "vacío" en el otro lado para conservar la
   * posición correcta (izquierda / derecha) en el dibujo.
   */
  toD3(nodo = this.raiz) {
    if (!nodo) return null;
    const d3Nodo = { name: String(nodo.valor), attributes: { valor: nodo.valor } };
    if (!nodo.isLeaf()) {
      d3Nodo.children = [
        this.toD3(nodo.izquierda) ?? { name: '', attributes: { vacio: true } },
        this.toD3(nodo.derecha) ?? { name: '', attributes: { vacio: true } },
      ];
    }
    return d3Nodo;
  }
}
