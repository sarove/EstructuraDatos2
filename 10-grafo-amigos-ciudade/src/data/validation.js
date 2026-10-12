/**
 * Validación de los formularios.
 */
const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/;

export function validateCity(name, graph) {
  const clean = String(name ?? '').trim();
  if (clean.length < 3) return 'Ingrese el nombre de la ciudad (mínimo 3 caracteres).';
  if (!NAME_RE.test(clean)) return 'El nombre solo puede contener letras y espacios.';
  if (graph.findCityByName(clean)) return `La ciudad "${clean}" ya existe en el grafo.`;
  return null;
}

export function validatePerson({ name, age, cityId }, graph) {
  const errors = {};
  const clean = String(name ?? '').trim();
  const ageNum = Number(age);

  if (clean.length < 3) errors.name = 'Ingrese el nombre (mínimo 3 caracteres).';
  else if (!NAME_RE.test(clean)) errors.name = 'El nombre solo puede contener letras y espacios.';

  if (String(age ?? '').trim() === '' || !Number.isInteger(ageNum)) errors.age = 'Ingrese la edad en años (número entero).';
  else if (ageNum < 1 || ageNum > 120) errors.age = 'La edad debe estar entre 1 y 120 años.';

  if (!cityId || !graph.isCity(cityId)) errors.cityId = 'Seleccione la ciudad donde vive.';

  return errors;
}
