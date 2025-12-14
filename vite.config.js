import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import pluginDts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	esbuild: {
		keepNames: true,
		minifyIdentifiers: false,
	},
	build: {
		sourcemap: process.env.NODE_ENV === 'dev',
		lib: {
			name: 'voyd',
			entry: resolve(__dirname, './src/index.ts'),
		},
	},
	resolve: {
		alias: {
			'~': resolve(__dirname, './src'),
		},
	},
	plugins: [
		pluginDts({ rollupTypes: true })
	],
});
