import 'dotenv/config';

import { sveltekit } from '@sveltejs/kit/vite';
import mkcert from 'vite-plugin-mkcert';
import resolve from '@rollup/plugin-node-resolve';
import { imagetools } from 'vite-imagetools';
import maicHelper from 'maic/helper';
import { isoImport } from 'vite-plugin-iso-import';
import inspect from 'vite-plugin-inspect';
import { vitePluginRemoteModuleLoader } from './tools/vite/plugins/vitePluginRemoteModuleLoader';
import { vitePluginRemoteAssetLoader } from './tools/vite/plugins/vitePluginRemoteAssetLoader';
import { vitePluginFileDirPathConstants } from './tools/vite/plugins/vitePluginFileDirPathConstants';
import { vitePluginThrelteSsrStub } from './tools/vite/plugins/vitePluginThrelteSsrStub';

const production = process.env['NODE_ENV'] === 'production';

export default {
	assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.bin'],
	ssr: {
		noExternal: [
			'postprocessing',
			'three',
			'three-stdlib',
			'three/examples/jsm/**/*',
			'@pmndrs/vanilla',
		],
	},
	plugins: [
		maicHelper({}),
		vitePluginRemoteModuleLoader(),
		vitePluginRemoteAssetLoader(),
		vitePluginFileDirPathConstants(),
		imagetools({
			include: ['**/*{?,&}imagetools'],
		}),
		isoImport(),
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		vitePluginThrelteSsrStub(),
		sveltekit(),
		mkcert(),
		inspect({
			build: true,
			outputDir: '.vite-inspect',
		}),
	],
};
