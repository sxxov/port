import { getContext } from 'svelte';
import type { LmthContext } from './LmthContext';
import { lmthContextKey } from './Lmth.svelte';

export const useLmth = (): LmthContext | undefined =>
	getContext<LmthContext>(lmthContextKey);
