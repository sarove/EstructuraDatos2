import { useState } from 'react';
import { validateCity, validatePerson } from '../data/validation.js';

/**
 * Formularios para agregar nodos (ciudades y personas) y aristas
 * (amistades) al grafo.
 * Estudiante: Salvador Rodriguez Velasco
 */

export function AddCityForm({ graph, onAdd }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const err = validateCity(name, graph);
    setError(err);
    if (err) return;
    onAdd(name.trim());
    setName('');
  };

  return (
    <form className="panel form" onSubmit={submit} noValidate>
      <h3>🏙 Nueva ciudad</h3>
      <label className="field">
        <span>Nombre</span>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          placeholder="Ej: Pereira"
          className={error ? 'invalid' : ''}
        />
        {error && <small className="error">{error}</small>}
      </label>
      <button className="btn btn-primary" type="submit">
        Agregar nodo ciudad
      </button>
    </form>
  );
}

const EMPTY_PERSON = { name: '', age: '', cityId: '', friends: [] };

export function AddPersonForm({ graph, onAdd }) {
  const [form, setForm] = useState(EMPTY_PERSON);
  const [errors, setErrors] = useState({});
  const people = graph.people();

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleFriend = (id) =>
    set('friends', form.friends.includes(id) ? form.friends.filter((f) => f !== id) : [...form.friends, id]);

  const submit = (e) => {
    e.preventDefault();
    const found = validatePerson(form, graph);
    setErrors(found);
    if (Object.keys(found).length) return;
    onAdd({ name: form.name.trim(), age: Number(form.age), cityId: form.cityId, friends: form.friends });
    setForm(EMPTY_PERSON);
  };

  return (
    <form className="panel form" onSubmit={submit} noValidate>
      <h3>👤 Nueva persona</h3>
      <div className="row-2">
        <label className="field">
          <span>Nombre</span>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Ej: Luis Pérez"
            className={errors.name ? 'invalid' : ''}
          />
          {errors.name && <small className="error">{errors.name}</small>}
        </label>
        <label className="field narrow">
          <span>Edad</span>
          <input
            value={form.age}
            onChange={(e) => set('age', e.target.value.replace(/[^\d]/g, ''))}
            inputMode="numeric"
            placeholder="Ej: 22"
            className={errors.age ? 'invalid' : ''}
          />
          {errors.age && <small className="error">{errors.age}</small>}
        </label>
      </div>
      <label className="field">
        <span>Ciudad donde vive</span>
        <select
          value={form.cityId}
          onChange={(e) => set('cityId', e.target.value)}
          className={errors.cityId ? 'invalid' : ''}
        >
          <option value="">Seleccione…</option>
          {graph.cities().map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.cityId && <small className="error">{errors.cityId}</small>}
      </label>
      <fieldset className="friends-picker">
        <legend>Amigos (opcional)</legend>
        <div className="friends-grid">
          {people.map((p) => (
            <label key={p.id} className="check">
              <input type="checkbox" checked={form.friends.includes(p.id)} onChange={() => toggleFriend(p.id)} />
              {p.name}
            </label>
          ))}
        </div>
      </fieldset>
      <button className="btn btn-primary" type="submit">
        Agregar nodo persona
      </button>
    </form>
  );
}

export function AddFriendshipForm({ graph, onAdd }) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [error, setError] = useState(null);
  const people = graph.people();

  const submit = (e) => {
    e.preventDefault();
    if (!a || !b) return setError('Seleccione a las dos personas.');
    if (a === b) return setError('Una persona no puede ser amiga de sí misma.');
    if (graph.hasEdge(a, b)) return setError('Esas dos personas ya son amigas.');
    setError(null);
    onAdd(a, b);
    setA('');
    setB('');
  };

  return (
    <form className="panel form" onSubmit={submit} noValidate>
      <h3>🤝 Nueva amistad</h3>
      {[
        ['Persona 1', a, setA],
        ['Persona 2', b, setB],
      ].map(([label, value, setter]) => (
        <label key={label} className="field">
          <span>{label}</span>
          <select
            value={value}
            onChange={(e) => {
              setter(e.target.value);
              setError(null);
            }}
          >
            <option value="">Seleccione…</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      ))}
      {error && <small className="error">{error}</small>}
      <button className="btn btn-primary" type="submit">
        Agregar arista de amistad
      </button>
    </form>
  );
}
