import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves the repo from a subfolder (/Tenni_Wallet_UIUX/), so the
// build and `vite preview` use that base; the dev server stays at the root.
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  base: command === 'build' || isPreview ? '/Tenni_Wallet_UIUX/' : '/',
}))
