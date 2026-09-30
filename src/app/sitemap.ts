import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://flow.enterprise.io';
  const routes = [
    '',
    '/login',
    '/onboarding',
    '/app/org/acme/overview',
    '/app/org/acme/projects',
    '/app/org/acme/tasks',
    '/app/org/acme/finance',
    '/app/org/acme/engineering',
    '/app/org/acme/flow-ai',
    '/app/org/acme/integrations',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));
}
