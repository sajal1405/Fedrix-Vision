/* eslint-disable no-restricted-globals */
// public/service-worker.js
// This file is a service worker that provides caching and offline capabilities
// for your web application using Workbox. It's configured to precache static assets
// and set up runtime caching for API calls.

// Import Workbox modules for service worker functionality.
// clientsClaim() takes control of all clients as soon as the service worker is activated.
// precacheAndRoute() is used to precache static assets defined in self.__WB_MANIFEST.
// cleanupOutdatedCaches() removes old caches not managed by Workbox.
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response"; // For caching specific HTTP responses

// Takes control of all clients as soon as the service worker is activated.
clientsClaim();

// Precache all of the assets specified in the build manifest.
// self.__WB_MANIFEST is injected by Workbox during the build process and contains
// a list of all static assets that should be precached (e.g., HTML, CSS, JS bundles).
precacheAndRoute(self.__WB_MANIFEST);

// Clean up any old or outdated caches managed by Workbox.
cleanupOutdatedCaches();

// --- Runtime Caching Strategies ---

// Cache dashboard/blog page assets (documents, scripts, styles) using StaleWhileRevalidate.
// This strategy serves cached content immediately while updating the cache in the background.
// It's good for pages that can tolerate slightly outdated content in exchange for speed.
registerRoute(
  ({ request, url }) =>
    url.pathname.startsWith("/dashboard/blog") &&
    ["document", "script", "style"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "dashboard-blog-assets",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache opaque responses (e.g., cross-origin) and successful responses
      }),
    ],
  })
);

// Cache Supabase blog API responses using StaleWhileRevalidate.
// This caches the API data for offline access and faster subsequent loads.
registerRoute(
  ({ url }) => url.pathname.includes("/rest/v1/posts"), // Matches Supabase API calls to 'posts' table
  new StaleWhileRevalidate({
    cacheName: "blog-api",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache Supabase 'profiles' table API responses
registerRoute(
  ({ url }) => url.pathname.includes("/rest/v1/profiles"),
  new StaleWhileRevalidate({
    cacheName: "profiles-api",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache Supabase 'tasks' table API responses
registerRoute(
  ({ url }) => url.pathname.includes("/rest/v1/tasks"),
  new StaleWhileRevalidate({
    cacheName: "tasks-api",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache Supabase 'events' table API responses
registerRoute(
  ({ url }) => url.pathname.includes("/rest/v1/events"),
  new StaleWhileRevalidate({
    cacheName: "events-api",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache Supabase 'reminders' table API responses
registerRoute(
  ({ url }) => url.pathname.includes("/rest/v1/reminders"),
  new StaleWhileRevalidate({
    cacheName: "reminders-api",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache Supabase 'scheduled_posts' table API responses
registerRoute(
  ({ url }) => url.pathname.includes("/rest/v1/scheduled_posts"),
  new StaleWhileRevalidate({
    cacheName: "scheduled-posts-api",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache image assets (png, jpg, jpeg, svg, gif) using CacheFirst strategy.
// CacheFirst is ideal for static assets that don't change often, ensuring speed.
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// General catch-all for other static assets (e.g., from public folder or other domains).
// Use StaleWhileRevalidate for broad coverage.
registerRoute(
  ({ url }) => {
    // Exclude certain paths if they are dynamically served or shouldn't be cached aggressively
    return !url.pathname.includes("/api/") && !url.pathname.includes("/auth/");
  },
  new StaleWhileRevalidate({
    cacheName: "general-assets",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);


// This listener handles messages sent from the main application to the service worker.
// Specifically, it listens for a 'SKIP_WAITING' message, which tells the service worker
// to immediately activate the new version without waiting for all clients to close.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

