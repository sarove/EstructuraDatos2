import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import QueuePage from './pages/QueuePage.jsx';
import NewPersonPage from './pages/NewPersonPage.jsx';

/**
 * Rutas del Challenge 05
 *   /               -> Cola del cajero impresa según la fecha de llegada
 *   /nueva-persona  -> Formulario para crear una persona y encolarla (enqueue)
 */
export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<QueuePage />} />
          <Route path="/nueva-persona" element={<NewPersonPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
