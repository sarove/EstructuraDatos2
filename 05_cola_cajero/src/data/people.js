/**
 * Datos simulados (mock) y utilidades de la cola del cajero.
 * Estudiante: Salvador Rodriguez Velasco
 */

// Ventana de llegada: la persona llegó en algún momento de las últimas 3 horas
export const ARRIVAL_WINDOW_MS = 3 * 60 * 60 * 1000;

/**
 * Fecha de llegada ALEATORIA asignada por el sistema.
 * Se puede inyectar "now" y "random" para hacer pruebas repetibles.
 */
export function randomArrivalDate(now = new Date(), random = Math.random) {
  // Desplazamiento aleatorio en segundos completos dentro de la ventana
  const offset = Math.floor(random() * (ARRIVAL_WINDOW_MS / 1000)) * 1000;
  const date = new Date(now.getTime() - offset);
  date.setMilliseconds(0);
  return date;
}

// Personas de ejemplo: nombre y monto a retirar (COP)
export const mockPeople = [
  { name: 'Ana María Gómez', amount: 200000 },
  { name: 'Carlos Andrés Rojas', amount: 50000 },
  { name: 'Luisa Fernanda Ortiz', amount: 1200000 },
  { name: 'Jhon Jairo Valencia', amount: 300000 },
  { name: 'Paola Andrea Muñoz', amount: 80000 },
  { name: 'Diego Alejandro Paz', amount: 500000 },
];

// Nombres para el botón "Agregar persona aleatoria"
export const randomNames = [
  'Valentina Cárdenas',
  'Santiago Mejía',
  'Camila Restrepo',
  'Julián Zapata',
  'Daniela Arango',
  'Andrés Felipe Quintero',
  'Mariana López',
  'Sebastián Castaño',
];

export const AMOUNT_MIN = 10000;
export const AMOUNT_MAX = 2000000;
export const AMOUNT_STEP = 10000;

const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export const formatMoney = (value) => currency.format(value);

export const formatDateTime = (date) =>
  date.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

export const formatTime = (date) =>
  date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

// Convierte "150.000" o "$ 150000" en 150000
export const parseAmount = (text) => Number(String(text).replace(/[^\d]/g, ''));

/**
 * Valida los datos del formulario. Retorna los errores por campo.
 */
export function validatePerson({ name, amount }) {
  const errors = {};
  const cleanName = String(name ?? '').trim();
  const value = parseAmount(amount);

  if (cleanName.length < 3) {
    errors.name = 'Ingrese el nombre de la persona (mínimo 3 caracteres).';
  } else if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/.test(cleanName)) {
    errors.name = 'El nombre solo puede contener letras y espacios.';
  }

  if (!String(amount ?? '').trim() || !value) {
    errors.amount = 'Ingrese el monto a retirar.';
  } else if (value < AMOUNT_MIN || value > AMOUNT_MAX) {
    errors.amount = `El monto debe estar entre ${formatMoney(AMOUNT_MIN)} y ${formatMoney(AMOUNT_MAX)}.`;
  } else if (value % AMOUNT_STEP !== 0) {
    errors.amount = `El cajero entrega billetes: el monto debe ser múltiplo de ${formatMoney(AMOUNT_STEP)}.`;
  }

  return errors;
}
