/**
 * Validación de los campos del formulario de libros.
 * Estudiante: Salvador Rodriguez Velasco
 */

// Deja solo dígitos (y la X final de un ISBN-10)
export const cleanIsbn = (isbn) => String(isbn).toUpperCase().replace(/[^0-9X]/g, '');

// ISBN-10: suma de dígito * (10..1) debe ser múltiplo de 11. La X vale 10.
function isValidIsbn10(digits) {
  if (!/^\d{9}[\dX]$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const value = digits[i] === 'X' ? 10 : Number(digits[i]);
    sum += value * (10 - i);
  }
  return sum % 11 === 0;
}

// ISBN-13: pesos alternos 1 y 3; la suma debe ser múltiplo de 10.
function isValidIsbn13(digits) {
  if (!/^\d{13}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += Number(digits[i]) * (i % 2 === 0 ? 1 : 3);
  }
  return sum % 10 === 0;
}

export function isValidIsbn(isbn) {
  const digits = cleanIsbn(isbn);
  if (digits.length === 10) return isValidIsbn10(digits);
  if (digits.length === 13) return isValidIsbn13(digits);
  return false;
}

/**
 * Valida un libro. Retorna un objeto con los errores por campo
 * (vacío si todo está bien).
 * @param {object} book  { name, isbn, author, editorial }
 * @param {Array}  existing  libros que ya están en la pila (para no repetir ISBN)
 */
export function validateBook(book, existing = []) {
  const errors = {};
  const name = book.name?.trim() ?? '';
  const author = book.author?.trim() ?? '';
  const editorial = book.editorial?.trim() ?? '';
  const isbn = book.isbn?.trim() ?? '';

  if (name.length < 2) errors.name = 'Ingrese el nombre del libro (mínimo 2 caracteres).';
  if (author.length < 3) errors.author = 'Ingrese el autor (mínimo 3 caracteres).';
  if (editorial.length < 2) errors.editorial = 'Ingrese la editorial (mínimo 2 caracteres).';

  if (!isbn) {
    errors.isbn = 'Ingrese el ISBN.';
  } else if (!isValidIsbn(isbn)) {
    errors.isbn = 'ISBN inválido: debe tener 10 o 13 dígitos y un dígito de control correcto.';
  } else if (existing.some((b) => cleanIsbn(b.isbn) === cleanIsbn(isbn))) {
    errors.isbn = 'Ya existe un libro con ese ISBN en la pila.';
  }

  return errors;
}
