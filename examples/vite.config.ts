import { defineConfig, type PluginOption } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import pluginSSL from '@vitejs/plugin-basic-ssl';

const plugins: PluginOption[] = [sveltekit()];

if (process.argv.includes('--host')) {
	plugins.push(pluginSSL());
}

export default defineConfig({ plugins });
