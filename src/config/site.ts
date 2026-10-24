/**
 * ============================================================
 *  URL MỤC LỤC THE MAGIC: điền vào đây khi ebook đã sẵn sàng.
 * ============================================================
 * Hai dạng:
 *  - Đường dẫn trong website này: 'the-magic/'  (ebook chép vào public/the-magic/ bằng scripts/sync-ebook.mjs)
 *  - Hoặc link ngoài đầy đủ: 'https://quytran91.github.io/ten-repo-khac/'
 *
 * - Để null: mọi nút vẫn hiện, khi nhấn sẽ báo "Mục lục The Magic đang được chuẩn bị".
 * - Điền link: mọi nút (START, ảnh sách, thanh đáy) mở thẳng trang đó, cùng tab.
 */
export const THE_MAGIC_INDEX_URL: string | null = 'the-magic/';

// Chặn lỗi gõ nhầm ngay khi build, để không bao giờ xuất bản một liên kết hỏng.
if (
  THE_MAGIC_INDEX_URL !== null &&
  !/^https?:\/\/\S+$/.test(THE_MAGIC_INDEX_URL) &&
  !/^[a-z0-9][\w./-]*$/i.test(THE_MAGIC_INDEX_URL)
) {
  throw new Error(`THE_MAGIC_INDEX_URL không hợp lệ: "${THE_MAGIC_INDEX_URL}". Cần dạng 'the-magic/' hoặc https://...`);
}

/** Thông tin hiển thị và SEO. */
export const site = {
  name: 'THE MAGIC',
  tagline: 'Hành trình biết ơn',
  /** Chữ trên tấm biển vàng ở thanh HUD (góc trên trái). */
  plate: 'Không Gian Biết Ơn',
  /** Ảnh đại diện trên thanh HUD (cắt từ góc poster). */
  avatar: 'images/avatar.webp',
  description:
    'Khám phá The Magic của Rhonda Byrne và bắt đầu hành trình thực hành lòng biết ơn trong 28 ngày.',
  locale: 'vi_VN',
  /** Ảnh chia sẻ mạng xã hội, đường dẫn trong thư mục public/. */
  ogImage: 'og-image-game.png',
} as const;
