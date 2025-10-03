import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'vite';
import pluginDts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	build: {
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
	plugins: [pluginDts()],
});
