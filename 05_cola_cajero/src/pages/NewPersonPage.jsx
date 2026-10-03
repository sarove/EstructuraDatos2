import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtmQueue } from '../context/AtmQueueContext.jsx';
import {
  validatePerson,
  parseAmount,
  formatMoney,
  formatTime,
  AMOUNT_MIN,
  AMOUNT_MAX,
} from '../data/people.js';

/**
 * PANTALLA: FORMULARIO PARA CREAR UNA PERSONA
 * El usuario ingresa nombre y monto. La fecha de llegada NO se digita:
 * la asigna el sistema al azar al momento de guardar. Luego se ejecuta
 * enqueue() y se vuelve a la pantalla de la cola.
 * Estudiante: Salvador Rodriguez Velasco
 */

const EMPTY = { name: '', amount: '' };
const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

export default function NewPersonPage() {
  const { people, size, addPerson } = useAtmQueue();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  const update = (next) => {
    setForm(next);
    if (touched) setErrors(validatePerson(next));
  };

  const handleChange = (e) => update({ ...form, [e.target.name]: e.target.value });

  // Muestra el monto con separador de miles mientras se escribe
  const handleAmountChange = (e) => {
    const value = parseAmount(e.target.value);
    update({ ...form, amount: value ? value.toLocaleString('es-CO') : '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    const found = validatePerson(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // enqueue: el sistema asigna la fecha de llegada aleatoria
    const { person } = addPerson({ name: form.name, amount: parseAmount(form.amount) });
    navigate('/', { state: { addedId: person.id } });
  };

  const first = people[0];
  const last = people[people.length - 1];

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Pantalla 2 · Formulario · enqueue()</p>
        <h1>➕ Nueva persona en la cola</h1>
        <p className="lead">
          Ingrese el nombre y el monto a retirar. Al guardar, el sistema asigna una{' '}
          <strong>fecha de llegada aleatoria</strong> y ejecuta <code>queue.enqueue(persona)</code>.
        </p>
      </div>

      <div className="grid-2 grid-form">
        <form className="panel form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Nombre completo</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: María José Díaz"
              className={errors.name ? 'invalid' : ''}
              aria-invalid={Boolean(errors.name)}
              autoComplete="off"
            />
            {errors.name && <small className="error">{errors.name}</small>}
          </label>

          <label className="field">
            <span>Monto a retirar (COP)</span>
            <input
              name="amount"
              value={form.amount}
              onChange={handleAmountChange}
              placeholder="Ej: 150.000"
              inputMode="numeric"
              className={errors.amount ? 'invalid' : ''}
              aria-invalid={Boolean(errors.amount)}
              autoComplete="off"
            />
            {errors.amount ? (
              <small className="error">{errors.amount}</small>
            ) : (
              <small className="hint-text">
                Entre {formatMoney(AMOUNT_MIN)} y {formatMoney(AMOUNT_MAX)}, en múltiplos de $ 10.000.
              </small>
            )}
          </label>

          <div className="quick-amounts">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                className="chip"
                onClick={() => update({ ...form, amount: a.toLocaleString('es-CO') })}
              >
                {formatMoney(a)}
              </button>
            ))}
          </div>

          <label className="field">
            <span>Fecha de llegada</span>
            <input value="Se asigna automáticamente (aleatoria) al guardar" readOnly tabIndex={-1} />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              🏧 Agregar a la cola (enqueue)
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setForm(EMPTY);
                setErrors({});
                setTouched(false);
              }}
            >
              Limpiar
            </button>
          </div>
        </form>

        <aside className="panel">
          <h3>¿Dónde quedará en la fila?</h3>
          <p className="muted small">
            Depende de la hora de llegada que asigne el sistema (dentro de las últimas 3 horas):
          </p>
          <ul className="where-list">
            <li>
              Si llegó <strong>antes</strong> que {first ? first.name : 'todos'}
              {first && ` (${formatTime(first.arrivalDate)})`} → queda en el <strong>frente</strong>.
            </li>
            <li>
              Si llegó <strong>después</strong> que {last ? last.name : 'todos'}
              {last && ` (${formatTime(last.arrivalDate)})`} → queda al <strong>final</strong>.
            </li>
            <li>En otro caso, queda entre las dos personas cuya hora la rodea.</li>
          </ul>
          <div className="info-box">
            Actualmente hay <strong>{size}</strong> persona(s) en la cola. Después del enqueue,{' '}
            <code>size()</code> = {size + 1}.
          </div>
        </aside>
      </div>
    </section>
  );
}
