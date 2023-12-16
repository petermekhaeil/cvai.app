import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		target: "es2022"
	},
	esbuild: {
		target: "es2022"
	},
	optimizeDeps: {
		esbuildOptions: {
			target: "es2022",
		}
	}
});
