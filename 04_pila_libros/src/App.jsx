import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import StackPage from './pages/StackPage.jsx';
import NewBookPage from './pages/NewBookPage.jsx';

/**
 * Rutas del Challenge 04
 *   /             -> Pila de libros (se imprime en pantalla)
 *   /nuevo-libro  -> Formulario para crear un libro y apilarlo (push)
 */
export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<StackPage />} />
          <Route path="/nuevo-libro" element={<NewBookPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
