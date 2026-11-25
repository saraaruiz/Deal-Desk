import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // "@/..." -> src/...  (the shadcn alias: components land in src/components/ui)
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
