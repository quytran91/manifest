/**
 * Ghép đường dẫn nội bộ với base URL của Astro (hỗ trợ GitHub Pages subpath).
 * Dùng cho MỌI liên kết và asset nội bộ: url('tu-sach/') → '/khong-gian-biet-on/tu-sach/'.
 * Liên kết tuyệt đối (http..., mailto:, #) được giữ nguyên.
 */
export function url(path = ''): string {
  if (/^([a-z]+:|#)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  return `${base}/${clean}`;
}

/** Đường dẫn tuyệt đối (kèm domain), dùng cho canonical và Open Graph. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(url(path), site ?? 'http://localhost').href;
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
