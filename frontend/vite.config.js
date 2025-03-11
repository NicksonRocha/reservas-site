import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist', // Diretório de saída
    assetsDir: 'assets', // Diretório para assets
    emptyOutDir: true, // Limpa a pasta dist antes de buildar
  },
  base: './', // Caminho relativo para permitir o funcionamento no S3 e CloudFront
});
