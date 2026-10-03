# Challenge 05 · Cola del cajero automático en React

**Estudiante:** Salvador Rodriguez Velasco
**Asignatura:** Estructuras de Datos y Algoritmos II, Universidad Autónoma de Occidente

Cola (Queue, FIFO) de personas en un cajero. Cada persona tiene nombre, monto a retirar y una fecha de llegada aleatoria asignada por el sistema; la cola se imprime según esa fecha.

| Ruta | Pantalla |
|------|----------|
| `/` | Cola impresa según la fecha de llegada, con `dequeue`, `peek` y `print` |
| `/nueva-persona` | Formulario para crear una persona y agregarla con `enqueue` |

## Ejecución

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # pruebas de la cola
```

Requiere Node.js 20.19+ (recomendado 22 LTS). Ver `ESTUDIANTE.txt` y `docs/`.
