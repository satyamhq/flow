import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/app/org/*/admin'],
      },
    ],
    sitemap: 'https://flow.enterprise.io/sitemap.xml',
  };
}
