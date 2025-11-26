/**
 * 共用的 slugify 函数（用于生成 URL 友好的 slug）
 */

/**
 * 将文本转为 slug（小写、连字符分隔）
 * @param text 输入文本
 * @returns slug 字符串
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
