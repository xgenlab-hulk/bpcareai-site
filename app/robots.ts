import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const privatePaths = ['/api/', '/admin/', '/auth/', '/private/'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: privatePaths },
      // 只减少两类高频抓取，保留普通搜索引擎对文章的访问。
      {
        userAgent: ['ShapBot', 'Meta-ExternalAgent'],
        disallow: [...privatePaths, '/articles/'],
      },
    ],
    sitemap: 'https://bpcareai.com/sitemap.xml',
  };
}
