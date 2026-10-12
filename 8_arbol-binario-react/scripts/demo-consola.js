// Demo por consola (sin navegador): npm run consola
// Estudiante: Salvador Rodriguez Velasco
import { ArbolBinario } from '../src/estructuras/ArbolBinario.js';
import { serieInicial } from '../src/data.js';

const arbol = new ArbolBinario().insertarSerie(serieInicial);
console.log('Serie insertada:', serieInicial.join(', '));
arbol.imprimirRecorridos();

for (const v of [44, 13]) {
  const { encontrado, camino } = arbol.buscar(v);
  console.log(`¿Está ${v} en el árbol? ${encontrado ? 'Sí' : 'No'} (camino: ${camino.join(' -> ')})`);
}
