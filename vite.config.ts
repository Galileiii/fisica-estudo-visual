import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  // O build gera UM arquivo só (dist/index.html) com tudo embutido,
  // que abre com dois cliques, sem servidor e sem internet.
  plugins: [react(), viteSingleFile()],
  base: './',
  // preserveSymlinks + fs.strict:false mantêm o dev server funcionando quando a
  // pasta do projeto está atrás de um link simbólico/junção do Windows.
  resolve: { preserveSymlinks: true },
  server: {
    port: 5173,
    open: true,
    fs: { strict: false },
  },
})
