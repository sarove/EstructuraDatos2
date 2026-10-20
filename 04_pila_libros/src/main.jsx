import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { BookStackProvider } from './context/BookStackContext.jsx';
import './index.css';

// Punto de entrada: el Provider comparte la misma pila entre las pantallas
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BookStackProvider>
        <App />
      </BookStackProvider>
    </BrowserRouter>
  </StrictMode>
);
