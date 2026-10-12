# Challenge 10 · Grafo de amigos y ciudades

**Estudiante:** Salvador Rodriguez Velasco
**Asignatura:** Estructuras de Datos y Algoritmos II, Universidad Autónoma de Occidente

Grafo no dirigido (lista de adyacencia) donde cada persona y cada ciudad es un nodo. Cada persona tiene nombre, edad y una arista hacia la ciudad donde vive; las amistades son aristas entre personas. La aplicación imprime las personas que viven en una ciudad y dibuja el grafo con [react-d3-graph](https://www.npmjs.com/package/react-d3-graph).

## Ejecución

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # pruebas del grafo
```

Requiere Node.js 20.19+ (recomendado 22 LTS).

`react-d3-graph` 2.6.0 declara compatibilidad con React 16 y d3 5; el archivo `.npmrc` (`legacy-peer-deps=true`) permite instalarla con React 19. Ver `ESTUDIANTE.txt` y `docs/`.
