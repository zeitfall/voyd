import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess({ script: true }),
	kit: {
		adapter: adapter({
			pages: 'dist',
			assets: 'dist'
		}),
		paths: {
			base: process.env.BASE_PATH
		}
	}
};

export default config;
