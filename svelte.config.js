import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-vercel';

const production = process.env['NODE_ENV'] === 'production';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [vitePreprocess()],
	onwarn(
		/** @type {{ code: string }} */ warning,
		/** @type {(v: typeof warning) => void} */ handler,
	) {
		if (warning.code === 'css-unused-selector') return;
		handler(warning);
	},
	compilerOptions: {
		dev: !production,
	},
	kit: {
		adapter: adapter({
			runtime: 'edge',
		}),
		files: {
			appTemplate: 'src/app.html',
		},
	},
	vitePlugin: {},
};
