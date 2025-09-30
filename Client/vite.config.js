import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react' // Import the react plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), // Add the react plugin
    tailwindcss()
  ],
})