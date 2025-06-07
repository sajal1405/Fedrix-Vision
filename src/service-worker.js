/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Cache the dashboard/blog page assets
registerRoute(
  ({ request, url }) =>
    url.pathname.startsWith('/dashboard/blog') &&
    ['document', 'script', 'style'].includes(request.destination),
  new StaleWhileRevalidate({ cacheName: 'dashboard-blog-assets' })
);

// Cache Supabase blog API responses
registerRoute(
  ({ url }) => url.pathname.includes('/rest/v1/posts'),
  new StaleWhileRevalidate({ cacheName: 'blog-api' })
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
