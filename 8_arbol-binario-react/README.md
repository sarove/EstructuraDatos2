# Challenge 08 · Árbol binario en React

**Estudiante:** Salvador Rodriguez Velasco
**Asignatura:** Estructura de Datos y Algoritmos II, Universidad Autónoma de Occidente

## Qué hace

1. Inserta una serie de números en un árbol binario de búsqueda y lo imprime por consola en InOrder, PostOrder y PreOrder.
2. Verifica si un valor está en el árbol (`ArbolBinario.buscar` / `contiene`).
3. Dibuja el árbol con [react-d3-tree](https://github.com/bkrem/react-d3-tree).

## Cómo ejecutarlo

Requisito: Node.js 18 o superior.

```bash
npm install
npm run dev       # abre http://localhost:5173
npm run consola   # recorridos y búsqueda solo en la terminal
```

## Estructura

```
src/
  estructuras/Nodo.js          Clase Nodo (valor, izquierda, derecha, isLeaf)
  estructuras/ArbolBinario.js  Insertar, recorridos, buscar y toD3
  components/ControlesArbol.jsx Formularios de insertar y buscar
  components/Recorridos.jsx    Muestra los recorridos en pantalla
  components/ArbolD3.jsx       Dibujo con react-d3-tree
  data.js                      Serie de ejemplo de la Clase 09
  App.jsx                      Componente principal
scripts/demo-consola.js        Demo por terminal
```
