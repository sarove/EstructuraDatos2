import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';

/**
 * Páginas de perfil, mensajes y cuenta (datos simulados).
 * Estudiante: Salvador Rodriguez Velasco
 */

const USER = {
  name: 'Salvador Rodriguez Velasco',
  email: 'salvador.rodriguez@uao.edu.co',
  program: 'Ingeniería Informática',
  semester: 'Sexto semestre',
  city: 'Santiago de Cali',
};

export function ProfilePage({ nodo, nivel }) {
  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Información del usuario.
      </PageHeader>
      <div className="panel profile">
        <div className="avatar">SR</div>
        <div>
          <h2>{USER.name}</h2>
          <p className="muted">
            {USER.program} · {USER.semester}
          </p>
          <dl className="kv">
            <dt>Correo</dt>
            <dd>{USER.email}</dd>
            <dt>Ciudad</dt>
            <dd>{USER.city}</dd>
            <dt>Asignatura</dt>
            <dd>Estructuras de Datos y Algoritmos II</dd>
          </dl>
        </div>
      </div>
    </section>
  );
}

const MESSAGES = [
  { from: 'Prof. Jonathan López', subject: 'Entrega del Challenge 09', time: '09:15', unread: true },
  { from: 'Monitoría EDA II', subject: 'Taller de recorridos DFS y BFS', time: 'Ayer', unread: true },
  { from: 'Registro Académico', subject: 'Calendario de parciales', time: 'Lun', unread: false },
  { from: 'Grupo de estudio', subject: 'Repaso de árboles binarios', time: 'Dom', unread: false },
];

export function MessagesPage({ nodo, nivel }) {
  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Bandeja de entrada (datos simulados).
      </PageHeader>
      <div className="panel list-panel">
        {MESSAGES.map((m) => (
          <div key={m.subject} className={m.unread ? 'msg unread' : 'msg'}>
            <span className="dot" />
            <div className="msg-body">
              <strong>{m.from}</strong>
              <span>{m.subject}</span>
            </div>
            <span className="muted small">{m.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AccountPage({ nodo, nivel }) {
  const [saved, setSaved] = useState(false);
  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Datos de la cuenta.
      </PageHeader>
      <form
        className="panel form"
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
        }}
      >
        <label className="field">
          <span>Nombre</span>
          <input defaultValue={USER.name} onChange={() => setSaved(false)} />
        </label>
        <label className="field">
          <span>Correo electrónico</span>
          <input type="email" defaultValue={USER.email} onChange={() => setSaved(false)} />
        </label>
        <label className="field">
          <span>Idioma</span>
          <select defaultValue="es" onChange={() => setSaved(false)}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            Guardar cambios
          </button>
          {saved && <span className="ok">✓ Cambios guardados (simulado)</span>}
        </div>
      </form>
    </section>
  );
}

export function PublicProfilePage({ nodo, nivel }) {
  const [prefs, setPrefs] = useState({ foto: true, correo: false, cursos: true });
  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }));
  const items = [
    ['foto', 'Mostrar foto de perfil'],
    ['correo', 'Mostrar correo electrónico'],
    ['cursos', 'Mostrar cursos inscritos'],
  ];
  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Qué información ven otros usuarios.
      </PageHeader>
      <div className="panel list-panel">
        {items.map(([k, label]) => (
          <label key={k} className="switch-row">
            <span>{label}</span>
            <input type="checkbox" checked={prefs[k]} onChange={() => toggle(k)} />
            <span className="switch" aria-hidden="true" />
          </label>
        ))}
      </div>
    </section>
  );
}
