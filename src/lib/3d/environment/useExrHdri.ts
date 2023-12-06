import { getContext } from 'svelte';
import type { ExrHdriContext } from './ExrHdriContext';
import { exrHdriContextKey } from './ExrHdriProvider.svelte';

export const useExrHdri = (
	exr?: string,
	exposure?: number,
	rotation?: number,
): ExrHdriContext | undefined => {
	const ctx = getContext<ExrHdriContext>(exrHdriContextKey);

	if (!ctx) return undefined;
	if (exr) ctx.exr.set(exr);
	if (exposure) ctx.exposure.set(exposure);
	if (rotation) ctx.rotation.set(rotation);

	return ctx;
};
