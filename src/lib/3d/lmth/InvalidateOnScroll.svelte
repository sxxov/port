<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import { onDestroy } from 'svelte';

	const { invalidate } = useThrelte();

	export let decayMillis = 1000;

	let rafHandle: ReturnType<typeof requestAnimationFrame> | undefined;
	const invalidateForTimeSpan = (millis: number) => {
		if (rafHandle) cancelAnimationFrame(rafHandle);

		const timeStart = Date.now();
		const timeEnd = timeStart + millis;

		const raf = () => {
			if (Date.now() > timeEnd) return;

			invalidate();

			rafHandle = requestAnimationFrame(raf);
		};

		raf();
	};

	onDestroy(() => {
		if (rafHandle) cancelAnimationFrame(rafHandle);
	});
</script>

<svelte:window on:scroll={() => void invalidateForTimeSpan(decayMillis)} />
