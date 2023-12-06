import type { Plugin } from 'vite';

const remoteModuleCache = new Map<string, string>();

export const vitePluginRemoteModuleLoader = () =>
	({
		name: 'remote module loader',

		resolveId(id) {
			if (
				id.startsWith('remote|module:http:/') ||
				id.startsWith('remote|module:https:/')
			)
				return `\0${id}`;
		},

		async load(id) {
			if (
				!(
					id.startsWith('\0remote:http:/') ||
					id.startsWith('\0remote:https:/')
				)
			)
				return null;

			let code = remoteModuleCache.get(id);

			if (!code) {
				code = await (
					await fetch(
						id.replace(
							/^.*remote\|module:http(s)?:\/\/?/,
							'http$1://',
						),
					)
				).text();

				remoteModuleCache.set(id, code);
			}

			return {
				code,
			};
		},
	}) satisfies Plugin;
