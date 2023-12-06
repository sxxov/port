<script lang="ts">
	import { T, useFrame, useLoader, useThrelte } from '@threlte/core';
	import { GLTF, useGltf } from '@threlte/extras';
	import glb_logo from '../../../assets/routes/lib/logo/logo.glb?url';
	import EphemeralCamera from '../../../lib/3d/camera/EphemeralCamera.svelte';
	import FollowLocus from '../../../lib/3d/follow/FollowLocus.svelte';
	import { pointer } from '../../../lib/follow/pointer';
	import exr_hdri from '../../../assets/routes/lib/environment/hdri/dancing_hall_256.exr?url';
	import { EXRLoader } from 'three-stdlib';
	import * as THREE from 'three';
	import { degToRad } from 'three/src/math/MathUtils.js';

	// const { renderer } = useThrelte();
	// renderer.toneMappingExposure = 0.01;

	let rotation = 0;
	useFrame(() => {
		rotation = (rotation + 0.01) % (Math.PI * 2);
	});

	const gltf = useGltf(glb_logo, { useDraco: true });
	const exrLoader = useLoader(EXRLoader);

	$: texture = exrLoader.load(exr_hdri);
	// $: if ($gltf)
	// 	for (const child of $gltf.scene.children)
	// 		child.material = new THREE.MeshPhysicalMaterial({
	// 			transmission: 1,
	// 			roughness: 0,
	// 			thickness: 0.5,
	// 		});
</script>

<EphemeralCamera />
<FollowLocus point={$pointer}>
	{#if $gltf}
		<T is={$gltf.scene} />
	{/if}
</FollowLocus>
