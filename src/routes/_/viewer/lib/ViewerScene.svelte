<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import type { GLTF } from 'three-stdlib';
	import { useAmbientInteractivity } from '../../../../lib/3d/canvas/useAmbientInteractivity';

	useAmbientInteractivity();

	export let gltf: GLTF | undefined;
</script>

<T.PerspectiveCamera
	makeDefault
	fov={50}
	position={[0, 0, 5]}
>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

{#if gltf}
	<T is={gltf.scene} />
{/if}
