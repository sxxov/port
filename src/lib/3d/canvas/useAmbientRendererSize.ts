import { getContext } from 'svelte';
import type { AmbientRendererSizeContext } from './AmbientRendererSizeContext';
import { ambientRendererSizeContextKey } from './AmbientCanvas.svelte';

export const useAmbientRendererSize = ():
	| AmbientRendererSizeContext
	| undefined =>
	getContext<AmbientRendererSizeContext>(ambientRendererSizeContextKey);
