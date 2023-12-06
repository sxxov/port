/* eslint-disable @typescript-eslint/naming-convention */
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import * as p from 'node:path';
import { postcssFontGrabber } from 'postcss-font-grabber';
// @ts-expect-error
import postcssImportUrl from 'postcss-import-url';
import postcssNested from 'postcss-nested';
// @ts-expect-error
import postcssMixins from 'postcss-mixins';

const dirname = p.dirname(new URL(import.meta.url).pathname);
const mode = process.env['NODE_ENV'];
const production = mode !== 'development';

export default {
	/** @type {import('postcss').Plugin[]} */
	plugins: [
		postcssImportUrl({
			modernBrowser: true,
		}),
		postcssMixins({
			mixinsDir: p.join(dirname, 'src/theme/'),
		}),
		postcssImport(),
		postcssFontGrabber({
			cssDest: '.',
			fontDest: 'static/_font',
		}),
		{
			postcssPlugin: 'remove "static" from postcss-font-grabber result',
			AtRule(rule) {
				if (rule.name !== 'font-face') return;
				for (const node of rule.nodes) {
					if (!(node.type === 'decl' && node.prop === 'src'))
						continue;

					node.value = node.value.replace(/\(static/g, '(');
				}
			},
		},
		postcssNested(),
		autoprefixer(),
		production &&
			cssnano({
				preset: 'default',
			}),
	],
};
