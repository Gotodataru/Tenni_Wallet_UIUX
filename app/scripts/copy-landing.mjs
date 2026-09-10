#!/usr/bin/env node
/**
 * Copies the static landing page and the brand assets into the build, so
 * GitHub Pages serves them next to the catalog:
 * /Tenni_Wallet_UIUX/landing/ and /Tenni_Wallet_UIUX/brand/.
 */
import { cpSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

for (const dir of ['landing', 'brand']) {
  const from = fileURLToPath(new URL(`../../${dir}`, import.meta.url))
  const to = fileURLToPath(new URL(`../dist/${dir}`, import.meta.url))
  cpSync(from, to, { recursive: true })
}
console.log('✓ landing and brand copied to dist/')
