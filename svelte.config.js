// import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
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
		inlineStyleThreshold: 300000
	}
};

export default config;
