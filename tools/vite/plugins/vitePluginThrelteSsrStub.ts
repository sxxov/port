/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Plugin } from 'vite';

const js = (strings: TemplateStringsArray, ...values: any[]) =>
	String.raw({ raw: strings }, ...values);

const SHIM_SSR_GENERIC = js`
import { create_ssr_component } from 'svelte/internal';

export default create_ssr_component(
	(_, __, ___, slots) => slots.default?.({}) ?? '',
);
`.trim();

const SHIM_SSR_T = js`
import { create_ssr_component } from 'svelte/internal';

const NoopComponent = create_ssr_component(
	(_, __, ___, slots) => slots.default?.({}) ?? '',
);

export const extend = () => {};

export const T = new Proxy(class {}, {
	construct: () => new NoopComponent(),
	get: () => NoopComponent,
});
`.trim();

export const vitePluginThrelteSsrStub = () =>
	({
		name: 'threlte ssr stub',
		resolveId(id) {
			if (id === 'use-unsafe-threlte') return `\0${id}`;
		},
		load(id) {
			if (id !== '\0use-unsafe-threlte') return;

			return {
				code: '',
			};
		},
		transform(code, id, { ssr = false } = {}) {
			if (!ssr) return;

			if (
				id.endsWith('.svelte') &&
				!id.includes('node_modules') &&
				code.includes('@threlte') &&
				!code.includes('use-unsafe-threlte')
			)
				return {
					code: SHIM_SSR_GENERIC,
				};

			if (
				id.includes('node_modules/@threlte/core') &&
				id.endsWith('/T.js')
			)
				return { code: SHIM_SSR_T };
		},
	}) satisfies Plugin;
