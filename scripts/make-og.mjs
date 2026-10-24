// Tạo public/og-image.png (1200×630) cho chia sẻ mạng xã hội.
// Chạy lại sau khi đổi tên: node scripts/make-og.mjs "THE MAGIC" "Hành trình biết ơn"
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const name = (process.argv[2] || 'THE MAGIC').normalize('NFC');
const line = (process.argv[3] || 'Hành trình biết ơn').normalize('NFC');
const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));

// Cambria/Segoe UI: font hệ thống có đủ dấu tiếng Việt (Georgia vẽ hỏng chữ "ế").
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="g" cx="70%" cy="30%" r="65%">
      <stop offset="0" stop-color="#FFD34E" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#071D35" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#071D35"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="40" y="40" width="1120" height="550" rx="24" fill="none" stroke="#FFD34E" stroke-width="5"/>
  <rect x="540" y="130" width="120" height="120" rx="18" fill="#FFD34E" stroke="#DB493C" stroke-width="6"/>
  <path d="M582 160l52 30-52 30z" fill="#071D35"/>
  <text x="600" y="385" text-anchor="middle" font-family="'Segoe UI Black', 'Segoe UI', Arial, sans-serif" font-weight="900" font-size="110" letter-spacing="6" fill="#FFD34E" stroke="#DB493C" stroke-width="4" paint-order="stroke">${name}</text>
  <text x="600" y="470" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="40" letter-spacing="2" fill="#FFF8E7">${line}</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Đã tạo', out);
