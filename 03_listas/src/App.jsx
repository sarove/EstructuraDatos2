import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import PlaylistPage from './pages/PlaylistPage.jsx';
import BrowserHistoryPage from './pages/BrowserHistoryPage.jsx';

/**
 * Componente raíz: define las rutas de las 2 páginas del Challenge 03
 *   /lista-enlazada          -> Lista enlazada simple (reproductor de canciones)
 *   /lista-doblemente-enlazada -> Lista doblemente enlazada (historial del navegador)
 */
export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lista-enlazada" element={<PlaylistPage />} />
          <Route path="/lista-doblemente-enlazada" element={<BrowserHistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
