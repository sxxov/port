import { IllegalArgumentError } from '@sxxov/ut/errors';

export const resolveRouteUrl = (path: string) => {
	const route = /.*?routes\/(.*)/.exec(path)?.[1];

	if (!route)
		throw new IllegalArgumentError(
			`Attempted to resolve route URL for path "${path}" which is not inside a 'routes' folder.`,
		);

	const file = /\+(page|server|layout)(\.server)?\.(ts|js|svelte)$/i.exec(
		route,
	)?.[0];

	return `/${file ? route.slice(0, -file.length - 1) : route}`;
};
