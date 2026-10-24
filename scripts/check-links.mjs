// Kiểm tra liên kết nội bộ trong dist/: mọi href/src nội bộ phải bắt đầu bằng BASE_PATH
// và trỏ tới file có thật. Chạy sau khi build: node scripts/check-links.mjs /khong-gian-biet-on
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = (process.argv[2] || '').replace(/\/+$/, '');
const dist = fileURLToPath(new URL('../dist/', import.meta.url));

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
})(dist);

const problems = [];
const external = new Set();
let checked = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const page = '/' + file.slice(dist.length).replace(/\\/g, '/');
  for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    const value = raw.replace(/&amp;/g, '&');
    if (/^https?:\/\//.test(value)) {
      external.add(value.split('#')[0]);
      continue;
    }
    if (/^(mailto:|tel:|data:|#)/.test(value) || value === '') continue;
    checked++;
    let path;
    if (value.startsWith('/')) {
      if (base && !value.startsWith(base + '/')) {
        problems.push(`${page}: ${attr}="${value}" thiếu base ${base}`);
        continue;
      }
      path = value.slice(base.length);
    } else {
      // Liên kết tương đối (trong nội dung Markdown).
      path = new URL(value, 'http://x' + page.replace(/index\.html$/, '')).pathname;
    }
    path = decodeURI(path.split('#')[0].split('?')[0]);
    const target = join(dist, path, path.endsWith('/') ? 'index.html' : '');
    if (!existsSync(target)) problems.push(`${page}: ${attr}="${value}" → không tồn tại`);
  }
}

console.log(`Đã kiểm tra ${files.length} trang, ${checked} liên kết nội bộ.`);
console.log(`Liên kết ngoài (${external.size}):\n  ` + [...external].sort().join('\n  '));
if (problems.length) {
  console.error(`\n${problems.length} lỗi:\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log('\nKhông có liên kết nội bộ hỏng.');
