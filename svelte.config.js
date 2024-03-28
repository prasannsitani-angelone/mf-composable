// import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-node';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			precompress: true
		}),
		files: {
			serviceWorker: 'src/sw.ts'
		},
		serviceWorker: {
			register: false
		},
		paths: {
			base: '/mutual-funds'
		},
		alias: { 'lib/': './src/routes/lib/', $components: './src/lib/components' },
		inlineStyleThreshold: 10240 // 10kb
	}
};

export default config;
