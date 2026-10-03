import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

/**
 * Páginas de ayuda y cierre de sesión.
 * Estudiante: Salvador Rodriguez Velasco
 */

const FAQ = [
  [
    '¿Cómo se construye este menú?',
    'Cada ítem es un Nodo de un árbol N-ario con title, link y component. Los submenús se agregan con agregarHijo(). El menú lateral se dibuja recorriendo el árbol con DFS de forma recursiva.',
  ],
  [
    '¿Qué diferencia hay entre un árbol binario y uno N-ario?',
    'En un árbol binario cada nodo tiene como máximo dos hijos (izquierdo y derecho). En un árbol N-ario cada nodo tiene una lista de hijos de cualquier tamaño, como un menú que puede tener cualquier número de submenús.',
  ],
  [
    '¿Qué es un nodo hoja en este menú?',
    'Es un ítem sin submenús, por ejemplo “Cerrar sesión” o “Contraseña”. Los nodos con hijos (ramas) muestran una flecha para desplegarse.',
  ],
  [
    '¿Cómo se generan las rutas de la aplicación?',
    'En App.jsx se recorre el árbol con DFS y, por cada nodo, se crea una <Route> con su link como path y su component como elemento.',
  ],
];

export function FaqPage({ nodo, nivel }) {
  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Preguntas frecuentes sobre este proyecto.
      </PageHeader>
      <div className="panel faq">
        {FAQ.map(([q, a], i) => (
          <details key={q} open={i === 0}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function TicketPage({ nodo, nivel }) {
  const [form, setForm] = useState({ subject: '', category: 'plataforma', detail: '' });
  const [ticket, setTicket] = useState(null);
  const valid = form.subject.trim().length >= 5 && form.detail.trim().length >= 10;

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    setTicket(`TK-${Math.floor(1000 + Math.random() * 9000)}`);
    setForm({ subject: '', category: 'plataforma', detail: '' });
  };

  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Reporte un problema a soporte (simulado).
      </PageHeader>
      {ticket && (
        <div className="alert">
          ✓ Ticket <strong>{ticket}</strong> creado. Soporte responderá pronto.
        </div>
      )}
      <form className="panel form" onSubmit={submit}>
        <label className="field">
          <span>Asunto</span>
          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Mínimo 5 caracteres"
          />
        </label>
        <label className="field">
          <span>Categoría</span>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="plataforma">Plataforma</option>
            <option value="cuenta">Cuenta</option>
            <option value="otro">Otro</option>
          </select>
        </label>
        <label className="field">
          <span>Descripción</span>
          <textarea
            rows={4}
            value={form.detail}
            onChange={(e) => setForm({ ...form, detail: e.target.value })}
            placeholder="Mínimo 10 caracteres"
          />
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={!valid}>
            Enviar ticket
          </button>
        </div>
      </form>
    </section>
  );
}

const SERVICES = [
  ['Campus virtual', 'operativo'],
  ['Correo institucional', 'operativo'],
  ['Wi-Fi del campus', 'degradado'],
  ['Biblioteca digital', 'operativo'],
  ['Sistema de matrículas', 'mantenimiento'],
];

const STATUS_LABEL = { operativo: 'Operativo', degradado: 'Rendimiento degradado', mantenimiento: 'En mantenimiento' };

export function NetworkStatusPage({ nodo, nivel }) {
  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Estado de los servicios (datos simulados).
      </PageHeader>
      <div className="panel list-panel">
        {SERVICES.map(([name, status]) => (
          <div key={name} className="msg">
            <span className={`status-dot ${status}`} />
            <div className="msg-body">
              <strong>{name}</strong>
            </div>
            <span className={`status-label ${status}`}>{STATUS_LABEL[status]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LogoutPage({ nodo, nivel }) {
  const [out, setOut] = useState(false);
  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Nodo hoja del primer nivel.
      </PageHeader>
      <div className="panel logout">
        {out ? (
          <>
            <p className="big">👋 Sesión cerrada (simulado).</p>
            <Link to="/" className="btn btn-primary" onClick={() => setOut(false)}>
              Volver al inicio
            </Link>
          </>
        ) : (
          <>
            <p className="big">¿Desea cerrar la sesión?</p>
            <div className="form-actions">
              <button className="btn btn-danger" onClick={() => setOut(true)}>
                Cerrar sesión
              </button>
              <Link to="/" className="btn">
                Cancelar
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
