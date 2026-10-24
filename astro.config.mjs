// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Domain và đường dẫn con được lấy từ biến môi trường để cùng một mã nguồn
 * chạy được ở cả domain gốc (https://ten.github.io/) lẫn project subpath
 * (https://ten.github.io/ten-repo/). Workflow GitHub Pages tự điền hai biến này.
 *   SITE_URL  = https://quytran91.github.io
 *   BASE_PATH = /khong-gian-biet-on   (để trống nếu deploy ở domain gốc)
 */
const site = process.env.SITE_URL || 'https://quytran91.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) })],
});
