import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { gzipSync, brotliCompressSync } from 'zlib'
import { join } from 'path'

const srcPath = join(import.meta.dirname, 'src')

const aliases = {
  '@': srcPath,
  '@features': join(srcPath, 'features'),
  '@shared': join(srcPath, 'shared'),
  '@core': join(srcPath, 'core'),
  '@app': join(srcPath, 'app'),
  '@assets': join(srcPath, 'assets'),
  '@hooks': join(srcPath, 'hooks'),
  '@public': join(import.meta.dirname, 'public'),
}

function asyncVendorCss() {
  return {
    name: 'async-vendor-css',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/(?:vendor-|index-)[^"]+\.css)">/g,
        '<link rel="preload" href="$1" as="style" onload="this.rel=\'stylesheet\'">' +
        '<noscript><link rel="stylesheet" href="$1"></noscript>',
      )
    },
  }
}

function preloadCriticalAssets() {
  return {
    name: 'preload-critical-assets',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html
      const tags = []
      for (const fileName of Object.keys(ctx.bundle)) {
        if (/^assets\/heroSection-[^/]+\.webp$/i.test(fileName)) {
          tags.push(`<link rel="preload" as="image" href="/${fileName}" type="image/webp" fetchpriority="high">`)
        }
        if (/^assets\/poppins-(400|700)-[^/]+\.woff2$/i.test(fileName)) {
          tags.push(`<link rel="preload" as="font" href="/${fileName}" type="font/woff2" crossorigin>`)
        }
        if (/^assets\/LandingPage-[^/]+\.js$/i.test(fileName)) {
          tags.push(`<link rel="modulepreload" crossorigin href="/${fileName}">`)
        }
      }
      if (!tags.length) return html
      return html.replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
    },
  }
}

function compressDir(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      compressDir(fullPath)
    } else if (/\.(js|css|html|svg|json)$/i.test(entry) && stat.size >= 1024) {
      const content = readFileSync(fullPath)
      writeFileSync(fullPath + '.gz', gzipSync(content, { level: 9 }))
      writeFileSync(fullPath + '.br', brotliCompressSync(content))
    }
  }
}

function compressAssets() {
  return {
    name: 'compress-assets',
    apply: 'build',
    closeBundle() {
      const distDir = join(import.meta.dirname, 'dist')
      compressDir(distDir)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    asyncVendorCss(),
    preloadCriticalAssets(),
    compressAssets(),
    process.env.ANALYZE && visualizer({ open: false, filename: 'dist/stats.html', gzipSize: true }),
  ].filter(Boolean),
  resolve: {
    alias: aliases,
  },
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https: wss:; worker-src 'self' blob:; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
    },
  },
  esbuild: {
    drop: ['debugger'],
    pure: ['console.log', 'console.debug'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom/') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'vendor-react'
          if (id.includes('node_modules/@reduxjs/') || id.includes('node_modules/react-redux/') || id.includes('node_modules/redux-persist/')) return 'vendor-redux'
          if (id.includes('node_modules/chart.js/')) return 'vendor-charts'
          if (id.includes('node_modules/crypto-js/')) return 'vendor-crypto'
          if (id.includes('node_modules/axios/')) return 'vendor-axios'
          if (id.includes('node_modules/primereact/')) return 'vendor-primereact'
        },
      },
    },
  },
})
