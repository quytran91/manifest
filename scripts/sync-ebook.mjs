// Chép ebook The Magic (bản web do Muse xuất + theme game) vào public/the-magic/ để deploy cùng landing.
//   node scripts/sync-ebook.mjs                 → nguồn mặc định: C:\Users\Admin\Downloads\28ngay\28ngay
//   node scripts/sync-ebook.mjs "<thư-mục-ebook>"
// Nên chạy AP-THEME-GAME.bat trong thư mục ebook trước, để mục lục và theme đã được cập nhật.
import { cpSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = process.argv[2] || 'C:/Users/Admin/Downloads/28ngay/28ngay';
const dest = fileURLToPath(new URL('../public/the-magic/', import.meta.url));

if (!existsSync(`${src}/index.html`)) {
  console.error(`Không thấy ${src}/index.html`);
  process.exit(1);
}
rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
const pages = readdirSync(dest).filter((f) => f.endsWith('.html')).length;
console.log(`Đã chép ebook (${pages} trang) vào public/the-magic/`);
