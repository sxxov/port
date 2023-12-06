<script lang="ts">
	import { Tween } from '@sxxov/sv/animation';
	import { bezierQuintOut } from '@sxxov/ut/bezier/beziers';
	import { T } from '@threlte/core';
	import { Suspense } from '@threlte/extras';
	import type { ComponentProps } from 'svelte';
	import { useLmth } from '../lmth/useLmth';
	import DePlaceholder from './LoaderBlob.svelte';

	type $$Props = ComponentProps<Suspense>;

	const lmth = useLmth();
</script>

<Suspense
	let:suspended
	{...$$restProps}
>
	<DePlaceholder slot="fallback" />

	<Tween
		start={0}
		end={1}
		duration={300}
		bezier={bezierQuintOut}
		let:v
		let:tween
	>
		<T.Group
			position.z={1 - v}
			scale={v > 0 ? 1 : 0}
		>
			<slot {suspended} />
		</T.Group>
		{(v && lmth?.updateThree(), '')}
		{(suspended ? tween.stop() : tween.play(), '')}
	</Tween>

	{#if !suspended}
		{(lmth?.updateDom(), '')}
	{/if}
</Suspense>
