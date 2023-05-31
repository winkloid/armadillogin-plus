import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Terminal from "vite-plugin-terminal"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: "./armadillogin.winkloid.de.key",
      cert: "./armadillogin.winkloid.de.crt"
    },
    host: "armadillogin.winkloid.de",
    hmr: {
      host: "armadillogin.winkloid.de",
    },
  },
  plugins: [react(), Terminal()],
})
