import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

import type { UserConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
const config: UserConfig = {
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			minify: true,
			srcDir: './src',
			mode: 'production',
			strategies: 'injectManifest',
			filename: 'sw.ts',
			scope: '/mutual-funds/',
			base: '/mutual-funds/',
			selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
			manifest: {
				name: 'Angelone MF',
				short_name: 'Angelone MF',
				start_url: '/mutual-funds/discoverfunds',
				lang: 'en',
				scope: '/',
				display: 'standalone',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				icons: [
					{
						src: '/mutual-funds/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/mutual-funds/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			injectManifest: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			devOptions: {
				enabled: false,
				suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
				type: 'module',
				navigateFallback: '/'
			},
			// if you have shared info in svelte config file put in a separate module and use it also here
			kit: {}
		}),
		visualizer({
			emitFile: true,
			filename: 'stats.html'
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	build: {
		modulePreload: {
			resolveDependencies: () => []
		}
	},
	server: {
		port: 3000,
		strictPort: false
	},
	optimizeDeps: {
		include: ['lodash.get', 'lodash.isequal', 'lodash.clonedeep', 'just-throttle', 'dayjs']
	},
	define: {
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? '"production"' : '"development"'
	}
};

export default config;
