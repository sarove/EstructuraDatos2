import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStack } from '../context/BookStackContext.jsx';
import { validateBook } from '../data/bookValidation.js';

/**
 * PANTALLA: FORMULARIO PARA CREAR UN LIBRO
 * Al enviar el formulario, el libro se agrega a la pila con push()
 * y se regresa a la pantalla de la pila para verlo en la cima.
 * Estudiante: Salvador Rodriguez Velasco
 */

const EMPTY = { name: '', isbn: '', author: '', editorial: '' };

const SAMPLE = {
  name: 'Rayuela',
  isbn: '978-0-306-40615-7',
  author: 'Julio Cortázar',
  editorial: 'Alfaguara',
};

const FIELDS = [
  { key: 'name', label: 'Nombre del libro', placeholder: 'Ej: Cien años de soledad' },
  { key: 'isbn', label: 'ISBN', placeholder: 'Ej: 978-0-307-47472-8 (10 o 13 dígitos)' },
  { key: 'author', label: 'Autor', placeholder: 'Ej: Gabriel García Márquez' },
  { key: 'editorial', label: 'Editorial', placeholder: 'Ej: Editorial Sudamericana' },
];

export default function NewBookPage() {
  const { books, top, size, pushBook } = useBookStack();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (touched) setErrors(validateBook(next, books));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    const found = validateBook(form, books);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // push: el libro nuevo queda en la cima de la pila
    const book = pushBook(form);
    navigate('/', { state: { addedId: book.id } });
  };

  const handleClear = () => {
    setForm(EMPTY);
    setErrors({});
    setTouched(false);
  };

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Pantalla 2 · Formulario · push()</p>
        <h1>➕ Nuevo libro</h1>
        <p className="lead">
          Complete los datos del libro. Al guardarlo se ejecuta <code>stack.push(libro)</code> y el
          libro queda en la <strong>cima</strong> de la pila.
        </p>
      </div>

      <div className="grid-2 grid-form">
        <form className="panel form" onSubmit={handleSubmit} noValidate>
          {FIELDS.map((f) => (
            <label key={f.key} className="field">
              <span>{f.label}</span>
              <input
                name={f.key}
                value={form[f.key]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className={errors[f.key] ? 'invalid' : ''}
                aria-invalid={Boolean(errors[f.key])}
                autoComplete="off"
              />
              {errors[f.key] && <small className="error">{errors[f.key]}</small>}
            </label>
          ))}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              📚 Agregar a la pila (push)
            </button>
            <button type="button" className="btn" onClick={() => setForm(SAMPLE)}>
              ✎ Llenar con ejemplo
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleClear}>
              Limpiar
            </button>
          </div>
        </form>

        <aside className="panel">
          <h3>Así quedará la pila</h3>
          <div className="stack-visual compact">
            <div className="book book-preview">
              <span className="top-marker">TOP →</span>
              <span className="book-title">{form.name.trim() || 'Nuevo libro'}</span>
              <span className="book-author">{form.author.trim() || 'Autor'}</span>
            </div>
            {top && (
              <div className="book book-ghost">
                <span className="book-title">{top.name}</span>
                <span className="book-author">cima actual · peek()</span>
              </div>
            )}
            {size > 1 && <div className="more">… {size - 1} libro(s) más debajo</div>}
            <div className="stack-base">BASE</div>
          </div>
          <p className="muted small">
            Después del push: <code>size()</code> = {size + 1}. El libro que hoy está en la cima
            quedará justo debajo del nuevo.
          </p>
        </aside>
      </div>
    </section>
  );
}
