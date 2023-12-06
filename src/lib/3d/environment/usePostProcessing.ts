import { getContext } from 'svelte';
import { postProcessingContextKey } from './PostProcessingProvider.svelte';
import type { PostProcessingContext } from './PostProcessingContext';
import type { PostProcessingEffectMap } from './PostProcessingEffectMap';

export const usePostProcessing = (
	effectMap?: PostProcessingEffectMap,
): PostProcessingContext | undefined => {
	const ctx = getContext<PostProcessingContext>(postProcessingContextKey);

	if (!ctx) return undefined;
	if (effectMap) ctx.effectMap.set(effectMap);

	return ctx;
};
