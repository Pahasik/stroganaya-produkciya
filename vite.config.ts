import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/*
  base подставляется из переменной окружения VITE_BASE.
  - Локально она не задана → '/'.
  - На GitHub Pages workflow подставляет '/<имя-репозитория>/',
    поэтому переименование репозитория ничего не ломает.
*/
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
})
