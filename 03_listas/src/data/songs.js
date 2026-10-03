/**
 * Datos simulados (mock) para la lista de reproducción.
 * Duración expresada en segundos.
 * Estudiante: Salvador Rodriguez Velasco
 */
export const mockSongs = [
  { id: 1, title: 'Cali Pachanguero', artist: 'Grupo Niche', duration: 318, genre: 'Salsa' },
  { id: 2, title: 'Oiga, Mire, Vea', artist: 'Guayacán Orquesta', duration: 272, genre: 'Salsa' },
  { id: 3, title: 'La Tierra del Olvido', artist: 'Carlos Vives', duration: 266, genre: 'Vallenato pop' },
  { id: 4, title: 'Bonito', artist: 'Jarabe de Palo', duration: 214, genre: 'Pop rock' },
  { id: 5, title: 'Hips Don’t Lie', artist: 'Shakira', duration: 218, genre: 'Pop' },
  { id: 6, title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354, genre: 'Rock' },
];

/** Canciones extra que se pueden agregar con el botón "Agregar canción" */
export const extraSongs = [
  { title: 'Rebelión', artist: 'Joe Arroyo', duration: 391, genre: 'Salsa' },
  { title: 'Fruta Fresca', artist: 'Carlos Vives', duration: 263, genre: 'Vallenato pop' },
  { title: 'Hotel California', artist: 'Eagles', duration: 391, genre: 'Rock' },
  { title: 'Buscando América', artist: 'Rubén Blades', duration: 336, genre: 'Salsa' },
  { title: 'Clocks', artist: 'Coldplay', duration: 307, genre: 'Rock alternativo' },
];

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};
