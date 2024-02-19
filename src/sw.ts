// importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js')

/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { BroadcastUpdatePlugin } from 'workbox-broadcast-update';
const swCacheHeader = 'X-Sw-Cache';
const cacheList = ['workbox-offline-fallbacks', 'workbox-precache-v2'];

declare let self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then(function (cacheNames) {
				return Promise.all(
					cacheNames
						.filter(function (cacheName) {
							let shouldRemoveCache = true;
							cacheList.forEach((list) => {
								if (cacheName?.includes(list)) {
									shouldRemoveCache = false;
								}
							});

							return shouldRemoveCache;
						})
						.map(function (cacheName) {
							return caches.delete(cacheName);
						})
				);
			})
			.then(() => self.clients.claim())
	);
});

// Temp: Added console to test SW update
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

registerRoute(
	({ request }) => {
		return (
			request.mode === 'navigate' &&
			request.url.includes('/mutual-funds/discoverfunds') &&
			request.headers.get('User-Agent')?.includes('wv')
		); // enable cache only for Webview
	},
	new StaleWhileRevalidate({
		cacheName: 'pages',
		plugins: [
			new CacheableResponsePlugin({ statuses: [200] }),
			new ExpirationPlugin({
				maxEntries: 500,
				maxAgeSeconds: 60 * 60 * 24 * 5 // 5 days cache
			}),
			new BroadcastUpdatePlugin({
				headersToCheck: [swCacheHeader]
			})
		]
	})
);
// / Cache Web Manifest, CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
	({ request }) =>
		request.destination === 'style' ||
		request.destination === 'script' ||
		request.destination === 'manifest' ||
		request.destination === 'worker',
	new CacheFirst({
		cacheName: 'assets',
		plugins: [new CacheableResponsePlugin({ statuses: [200] })]
	})
);

// Cache images with a Cache First strategy
registerRoute(
	({ request }) => request.destination === 'image',
	new CacheFirst({
		cacheName: 'images',
		plugins: [
			new CacheableResponsePlugin({ statuses: [0, 200] }),
			// 50 entries max, 30 days max
			new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 })
		]
	})
);
