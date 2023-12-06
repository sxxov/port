<script lang="ts">
	import {
		forwardEventHandlers,
		T,
		type Props,
		type Events,
	} from '@threlte/core';
	import Part from './Part.svelte';
	import * as THREE from 'three';

	interface Instance {
		position: [x: number, y: number, z: number];
		rotation: [x: number, y: number, z: number, w: number];
		scale: [x: number, y: number, z: number];
	}

	type G = $$Generic<Record<string, Record<any, any>>>;
	interface $$Props extends Props<THREE.Group> {
		ref?: typeof ref;
		gltfs: typeof gltfs;
		instances: typeof instances;
	}
	type $$Events = Events<THREE.Group>;

	export let ref: THREE.Group = new THREE.Group();
	export let gltfs: G;
	export let instances: Record<keyof G, Instance[]> = Object.fromEntries(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		Object.entries(gltfs).map(([k]) => [
			k,
			[
				{
					position: [0, 0, 0],
					rotation: [0, 0, 0, 1],
					scale: [1, 1, 1],
				},
			],
		]),
	) as Record<keyof G, Instance[]>;

	const component = forwardEventHandlers();

	const entries = <T extends Record<any, any>>(
		object: T,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	): [keyof T, T[keyof T]][] => Object.entries(object) as any;
</script>

<T
	is={ref}
	bind:this={$component}
	{...$$restProps}
>
	{#each entries(instances) as [k, v], i (k)}
		{#each v as { position, rotation, scale }, ii}
			{@const gltf = gltfs[k]}
			{#if gltf}
				<slot
					name="part"
					partKey={k}
					partIndex={i}
					instanceIndex={ii}
					{gltf}
					{position}
					{rotation}
					{scale}
				>
					<Part
						{gltf}
						{position}
						quaternion={rotation}
						{scale}
						let:ref
					>
						<slot {ref} />
					</Part>
				</slot>
			{/if}
		{/each}
	{/each}</T
>
