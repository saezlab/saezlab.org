// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  vite: {
      plugins: [tailwindcss()]
    },
   site: 'https://saezlab.github.io',
   base: '/saezlab.org-draft',
   trailingSlash: 'always',
  integrations: [react(), mdx()]
});