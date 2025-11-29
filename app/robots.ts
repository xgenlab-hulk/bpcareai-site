import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',     // API routes
        '/admin/',   // Admin panel
        '/auth/',    // Authentication pages
        '/private/', // Private content
      ],
    },
    sitemap: 'https://bpcareai.com/sitemap.xml',
  };
}
