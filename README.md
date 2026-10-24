# THE MAGIC · Hành trình biết ơn

Landing page một trang, phong cách màn hình bắt đầu của game phiêu lưu pixel. Mục tiêu duy nhất:
dẫn người đọc tới mục lục ebook The Magic. Astro 5 + TypeScript + CSS, xuất web tĩnh cho GitHub Pages.

## Ebook The Magic đi kèm

Ebook (bản web Muse + theme game) nằm trong `public/the-magic/` và được deploy cùng landing tại
`https://quytran91.github.io/manifest/the-magic/`. Khi ebook có thay đổi:

```bash
# 1. Trong Downloads\28ngay: bấm đúp AP-THEME-GAME.bat (nối mục lục + áp theme)
# 2. Chép ebook vào landing:
npm run sync:ebook
# 3. Commit và push lên GitHub; workflow tự deploy.
```

## Điền URL mục lục The Magic

Mở `src/config/site.ts`, sửa dòng:

```ts
export const THE_MAGIC_INDEX_URL: string | null = null;
```

thành, ví dụ:

```ts
export const THE_MAGIC_INDEX_URL: string | null = 'https://quytran91.github.io/the-magic/';
```

- Để `null`: mọi nút vẫn hiện; nhấn sẽ hiện thông báo "Mục lục The Magic đang được chuẩn bị".
- Điền URL: cả 3 nút (hero, phần sách, thanh đáy trên điện thoại) mở thẳng URL đó, cùng tab.
- Hiện đang là `'the-magic/'` (ebook đi kèm trong website). Có thể thay bằng link ngoài `https://...`.
- Build sẽ báo lỗi nếu giá trị sai dạng.

## Chạy và build

```bash
npm install
npm run dev              # http://localhost:4321/
npm run check            # typecheck
npm run build:subpath    # build như khi deploy ở /manifest/
npm run preview:subpath  # xem tại http://localhost:4321/manifest/
```

Kiểm tra liên kết nội bộ sau khi build (trong Git Bash thêm `MSYS_NO_PATHCONV=1` ở đầu):

```bash
npm run check:links -- /manifest
```

## Deploy GitHub Pages

Push lên nhánh `main`, rồi trong repo: **Settings → Pages → Source: GitHub Actions**. Workflow
`.github/workflows/deploy.yml` tự lấy domain và đường dẫn con (`/ten-repo/`). Mọi đường dẫn nội bộ đi
qua hàm `url()` trong `src/lib/url.ts` nên chạy được ở cả domain gốc lẫn thư mục con.

## Ảnh

| File | Nguồn |
| --- | --- |
| `public/images/manifest-poster.png` | Poster gốc (“ChatGPT Image Oct 23, 2026, 08_06_22 PM.png”), dùng làm ảnh dự phòng |
| `public/images/manifest-poster.webp`, `manifest-poster-600.webp` | Bản nén từ poster gốc (900px và 600px), trình duyệt ưu tiên tải bản này |
| `public/images/the-magic-book-cover-img.webp` | Bìa sách The Magic |

Đổi poster: thay `manifest-poster.png` rồi tạo lại hai bản WebP (cùng tên) bằng `sharp`.
Ảnh chia sẻ mạng xã hội (Zalo, Facebook…): `public/og-image-game.png` (1200×630), dựng từ
`scripts/og-card.html` rồi chụp ở cửa sổ 1200×630. Khi đổi ảnh, nên đổi luôn tên file (và `ogImage`
trong `src/config/site.ts`) vì Zalo/Facebook giữ ảnh cũ theo đường dẫn khá lâu.

## Cấu trúc

```
src/config/site.ts      URL mục lục, tên, mô tả
src/pages/index.astro   landing page (3 phần + thanh đáy + thông báo)
src/components/Cta.astro  nút mở mục lục (thẻ <a> khi có URL, <button> khi chưa có)
src/styles/             màu (tokens.css), font và nút game (global.css)
src/pages/404.astro     trang không tìm thấy
```
