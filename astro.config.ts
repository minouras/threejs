import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';
// 相対パスで出したい場合、↓をインストールして使用
// import relativeLinks from 'astro-relative-links';

// https://astro.build/config
export default defineConfig({
  // *** テストサーバー用 ************
  site: 'https://minouras.github.io/catalog',
  base: '/catalog/',
  // ***********************
  integrations: [
    mdx(),
    sitemap(),
    // relativeLinks(),  ※相対パスにしたい時
  ],
  vite: {
    define: {
      'import.meta.vitest': 'undefined',
    },
    // @ts-ignore
    plugins: [visualizer(), tailwindcss()],
    build: {
      rollupOptions: { output: { assetFileNames: 'assets/[name][extname]' } },
    },
  },
  build: {
    assets: 'astroAssets',
    inlineStylesheets: `never`,
  },
});
