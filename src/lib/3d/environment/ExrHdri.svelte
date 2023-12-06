<script lang="ts">
	import * as THREE from 'three';
	import { EXRLoader } from 'three-stdlib';
	import { useLoader, useThrelte } from '@threlte/core';
	import { onDestroy } from 'svelte';
	import { useSuspense } from '@threlte/extras';

	export let exr: string;
	export let exposure = 1;
	export let rotation = 0;

	const { scene, renderer } = useThrelte();
	const exrLoader = useLoader(EXRLoader);
	const suspend = useSuspense();

	$: texture = suspend(exrLoader.load(exr));

	let initialEnvironment = scene.environment;
	let initialToneMappingExposure = renderer.toneMappingExposure;
	$: if ($texture) {
		$texture.mapping = THREE.EquirectangularReflectionMapping;
		scene.environment = $texture;
	}
	$: if ($texture) $texture.rotation = rotation;
	$: renderer.toneMappingExposure = exposure;

	onDestroy(() => {
		scene.environment = initialEnvironment;
		renderer.toneMappingExposure = initialToneMappingExposure;
	});
</script>
