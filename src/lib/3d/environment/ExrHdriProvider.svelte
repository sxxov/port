<script
	lang="ts"
	context="module"
>
	export const exrHdriContextKey = Symbol('exrHdri');
</script>

<script lang="ts">
	import { setContext } from 'svelte';

	import ExrHdri from './ExrHdri.svelte';
	import type { ExrHdriContext } from './ExrHdriContext';
	import { Store } from '@sxxov/ut/store';

	const defaultCtx = {
		exr: new Store(''),
		exposure: new Store(1),
		rotation: new Store(0),
	};

	export let ctx: Partial<ExrHdriContext> = {};
	$: resolvedCtx = {
		...defaultCtx,
		...ctx,
	};

	$: ({ exr, exposure, rotation } = resolvedCtx);

	setContext<ExrHdriContext>(exrHdriContextKey, resolvedCtx);
</script>

<ExrHdri
	exr={$exr}
	exposure={$exposure}
	rotation={$rotation}
/>
<slot />
