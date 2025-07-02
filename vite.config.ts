
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
  },
  base: mode === 'development' ? '/' : '/activity-pulse-portfolio/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))

