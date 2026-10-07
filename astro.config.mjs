import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://oosaka0123-sudo.github.io',
  base: '/home-server-pc-2026',
  trailingSlash: 'always',
  integrations: [sitemap()]
});
