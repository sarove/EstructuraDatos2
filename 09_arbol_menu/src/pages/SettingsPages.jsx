import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';

/**
 * Páginas de configuración: seguridad, contraseña y notificaciones.
 * Estudiante: Salvador Rodriguez Velasco
 */

export function TwoFactorPage({ nodo, nivel }) {
  const [enabled, setEnabled] = useState(false);
  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Nodo de nivel 3: Menú principal › Configuración › Seguridad y privacidad › Verificación en
        dos pasos.
      </PageHeader>
      <div className="panel">
        <p>
          Estado:{' '}
          <span className={enabled ? 'tag tag-hoja' : 'tag tag-off'}>
            {enabled ? 'Activada' : 'Desactivada'}
          </span>
        </p>
        <ol className="steps">
          <li>Instale una aplicación de autenticación en su teléfono.</li>
          <li>Escanee el código QR que genera el sistema.</li>
          <li>Ingrese el código de 6 dígitos para confirmar.</li>
        </ol>
        <button className="btn btn-primary" onClick={() => setEnabled((v) => !v)}>
          {enabled ? 'Desactivar' : 'Activar'} verificación (simulado)
        </button>
      </div>
    </section>
  );
}

const SESSIONS = [
  { device: 'Portátil · Chrome · Windows 11', place: 'Cali, Colombia', last: 'Activa ahora', current: true },
  { device: 'Celular · Safari · iOS', place: 'Jamundí, Colombia', last: 'Hace 2 horas', current: false },
  { device: 'Sala de cómputo · Firefox · Linux', place: 'Campus UAO', last: 'Hace 3 días', current: false },
];

export function SessionsPage({ nodo, nivel }) {
  const [sessions, setSessions] = useState(SESSIONS);
  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Dispositivos con sesión iniciada (datos simulados).
      </PageHeader>
      <div className="panel list-panel">
        {sessions.map((s) => (
          <div key={s.device} className="msg">
            <span className="card-icon">💻</span>
            <div className="msg-body">
              <strong>{s.device}</strong>
              <span className="muted small">
                {s.place} · {s.last}
              </span>
            </div>
            {s.current ? (
              <span className="tag tag-hoja">Este equipo</span>
            ) : (
              <button
                className="btn btn-small"
                onClick={() => setSessions((list) => list.filter((x) => x !== s))}
              >
                Cerrar
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// Fuerza de la contraseña: suma un punto por cada criterio cumplido
function strength(pwd) {
  const rules = [pwd.length >= 8, /[A-Z]/.test(pwd), /[0-9]/.test(pwd), /[^A-Za-z0-9]/.test(pwd)];
  return rules.filter(Boolean).length;
}

export function PasswordPage({ nodo, nivel }) {
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const score = strength(pwd);
  const labels = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Fuerte'];
  const valid = score >= 3 && pwd === confirm;

  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Cambio de contraseña.
      </PageHeader>
      <form
        className="panel form"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) setDone(true);
        }}
      >
        <label className="field">
          <span>Nueva contraseña</span>
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setDone(false);
            }}
            autoComplete="new-password"
          />
        </label>
        <div className="meter" aria-label={`Fuerza: ${labels[score]}`}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={i < score ? `on s${score}` : ''} />
          ))}
          <small>{pwd ? labels[score] : 'Mínimo 8 caracteres, una mayúscula, un número y un símbolo'}</small>
        </div>
        <label className="field">
          <span>Confirmar contraseña</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setDone(false);
            }}
            autoComplete="new-password"
          />
          {confirm && confirm !== pwd && <small className="error">Las contraseñas no coinciden.</small>}
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={!valid}>
            Actualizar contraseña
          </button>
          {done && <span className="ok">✓ Contraseña actualizada (simulado)</span>}
        </div>
      </form>
    </section>
  );
}

export function NotificationsPage({ nodo, nivel }) {
  const [prefs, setPrefs] = useState({ correo: true, push: true, notas: true, foros: false });
  const items = [
    ['correo', 'Resumen diario por correo'],
    ['push', 'Notificaciones en el navegador'],
    ['notas', 'Publicación de calificaciones'],
    ['foros', 'Nuevas respuestas en foros'],
  ];
  return (
    <section>
      <PageHeader nodo={nodo} nivel={nivel}>
        Preferencias de notificación.
      </PageHeader>
      <div className="panel list-panel">
        {items.map(([k, label]) => (
          <label key={k} className="switch-row">
            <span>{label}</span>
            <input
              type="checkbox"
              checked={prefs[k]}
              onChange={() => setPrefs((p) => ({ ...p, [k]: !p[k] }))}
            />
            <span className="switch" aria-hidden="true" />
          </label>
        ))}
      </div>
    </section>
  );
}
