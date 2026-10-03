import { crearArbolMenu } from './data/menuTree.js';
import * as pages from './pages/index.js';

/**
 * Instancia ÚNICA del árbol de menús que usa toda la aplicación.
 * Se construye con los componentes reales de cada página.
 * Estudiante: Salvador Rodriguez Velasco
 */
export const arbolMenu = crearArbolMenu(pages);

// Camino desde la raíz hasta el ítem cuyo link coincide con la URL
export const rutaPorLink = (link) => arbolMenu.rutaHasta((valor) => valor.link === link);
