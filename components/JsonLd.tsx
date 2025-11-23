// JSON-LD 结构化数据组件

export const SITE_URL = 'https://bpcareai.com';
export const SITE_NAME = 'BPCare AI';
export const SITE_LOGO = `${SITE_URL}/icon.png`;

// 通用 JSON-LD 渲染组件
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Article JSON-LD 数据生成
export function generateArticleJsonLd({
  title,
  description,
  date,
  slug,
}: {
  title: string;
  description: string;
  date: string;
  slug: string;
}) {
  const isoDate = new Date(date).toISOString();

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    datePublished: isoDate,
    dateModified: isoDate,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: SITE_LOGO,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/articles/${slug}`,
    },
    inLanguage: 'en',
  };
}

// WebSite JSON-LD 数据
export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/articles?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

// Organization JSON-LD 数据
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: SITE_LOGO,
};
