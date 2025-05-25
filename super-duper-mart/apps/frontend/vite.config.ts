import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite' // ① UnoCSS をインポート

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), UnoCSS()], // ② UnoCSS プラグインを追加
})
