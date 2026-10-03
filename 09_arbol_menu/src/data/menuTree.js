import { Nodo, ArbolNario } from '../structures/ArbolNario.js';

/**
 * ÁRBOL N-ARIO DE MENÚS (datos simulados)
 * ------------------------------------------------------------
 * Estudiante: Salvador Rodriguez Velasco
 *
 * Cada ítem del menú es un Nodo cuyo valor tiene:
 *   - title:     texto que se muestra en el menú
 *   - link:      ruta (URL) a la que lleva el ítem
 *   - component: componente de React que se muestra en esa ruta
 *   - icon:      ícono decorativo
 *
 * Los componentes se reciben como parámetro ("componentes") para que el
 * árbol se pueda construir tanto en la aplicación (con los componentes
 * reales) como en las pruebas (con componentes de prueba).
 */

let contador = 0;

// Crea un nodo del menú
function item(title, link, component, icon) {
  contador += 1;
  return new Nodo({ id: `m${contador}`, title, link, component, icon });
}

export function crearArbolMenu(c) {
  contador = 0;

  // Raíz: el único nodo sin padre. Corresponde a la página de inicio.
  const raiz = item('Menú principal', '/', c.HomePage, '🌳');

  // ----- Nivel 1 -----
  raiz.agregarHijo(item('Perfil', '/perfil', c.ProfilePage, '👤'));
  raiz.agregarHijo(item('Mensajes', '/mensajes', c.MessagesPage, '✉️'));

  const configuracion = raiz.agregarHijo(
    item('Configuración', '/configuracion', c.SectionPage, '⚙️')
  );
  const ayuda = raiz.agregarHijo(item('Ayuda', '/ayuda', c.SectionPage, '❓'));
  raiz.agregarHijo(item('Cerrar sesión', '/cerrar-sesion', c.LogoutPage, '🚪'));

  // ----- Nivel 2: submenús de Configuración -----
  configuracion.agregarHijo(item('Cuenta', '/configuracion/cuenta', c.AccountPage, '🪪'));
  configuracion.agregarHijo(
    item('Perfil público', '/configuracion/perfil-publico', c.PublicProfilePage, '🌐')
  );
  const seguridad = configuracion.agregarHijo(
    item('Seguridad y privacidad', '/configuracion/seguridad', c.SectionPage, '🔒')
  );
  configuracion.agregarHijo(item('Contraseña', '/configuracion/contrasena', c.PasswordPage, '🔑'));
  configuracion.agregarHijo(
    item('Notificaciones', '/configuracion/notificaciones', c.NotificationsPage, '🔔')
  );

  // ----- Nivel 3: submenús de Seguridad y privacidad -----
  seguridad.agregarHijo(
    item('Verificación en dos pasos', '/configuracion/seguridad/dos-pasos', c.TwoFactorPage, '📱')
  );
  seguridad.agregarHijo(
    item('Sesiones activas', '/configuracion/seguridad/sesiones', c.SessionsPage, '💻')
  );

  // ----- Nivel 2: submenús de Ayuda -----
  ayuda.agregarHijo(item('Preguntas frecuentes', '/ayuda/preguntas-frecuentes', c.FaqPage, '📖'));
  ayuda.agregarHijo(item('Enviar un ticket', '/ayuda/ticket', c.TicketPage, '🎫'));
  ayuda.agregarHijo(item('Estado de la red', '/ayuda/estado-red', c.NetworkStatusPage, '📶'));

  return new ArbolNario(raiz);
}
