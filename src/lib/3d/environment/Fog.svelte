<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import * as THREE from 'three';

	export let colour: THREE.ColorRepresentation = 0x0c1012;
	export let far = 50;
	export let near = 0;

	const { scene } = useThrelte();
	const fog = new THREE.Fog(colour, near, far);
	const initialFog = scene.fog;

	onMount(() => {
		scene.fog = fog;
	});

	$: fog.color.set(colour);
	$: fog.far = far;
	$: fog.near = near;

	onDestroy(() => {
		scene.fog = initialFog;
	});
</script>
