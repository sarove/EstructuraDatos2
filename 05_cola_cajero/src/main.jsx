import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AtmQueueProvider } from './context/AtmQueueContext.jsx';
import './index.css';

// Punto de entrada: el Provider comparte la misma cola entre las pantallas
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AtmQueueProvider>
        <App />
      </AtmQueueProvider>
    </BrowserRouter>
  </StrictMode>
);
