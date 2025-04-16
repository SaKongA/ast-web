import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ['console.lostzone.cn']
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}); 