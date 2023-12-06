<script
	lang="ts"
	context="module"
>
	export const postProcessingContextKey = Symbol('postProcessing');
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import type { PostProcessingContext } from './PostProcessingContext';
	import PostProcessing from './PostProcessing.svelte';
	import { useThrelte } from '@threlte/core';
	import { EffectComposer } from 'postprocessing';
	import { Store } from '@sxxov/ut/store';
	import type { PostProcessingEffectMap } from './PostProcessingEffectMap';

	const defaultCtx: PostProcessingContext = {
		composer: new EffectComposer(useThrelte().renderer),
		effectMap: new Store<PostProcessingEffectMap>({}),
	};

	export let ctx: Partial<PostProcessingContext> = {};
	$: resolvedCtx = {
		...defaultCtx,
		...ctx,
	};

	$: ({ effectMap } = resolvedCtx);

	$: setContext<PostProcessingContext>(postProcessingContextKey, resolvedCtx);
</script>

<PostProcessing effectMap={$effectMap} />
<slot />
