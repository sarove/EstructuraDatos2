import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite con el plugin de React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
