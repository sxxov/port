<script lang="ts">
	import {
		T,
		forwardEventHandlers,
		useFrame,
		useThrelte,
		type Events,
		type Props,
	} from '@threlte/core';
	import { createEventDispatcher } from 'svelte';
	import * as THREE from 'three';

	type $$Props = {
		ref?: typeof ref;
		strategy?: 'auto' | 'frustum';
	} & Omit<Props<THREE.Group>, 'position'>;
	type $$Events = Events<THREE.Group> & {
		visible: undefined;
		hidden: undefined;
	};

	export let ref = new THREE.Group();
	export let strategy: 'auto' | 'frustum' | 'distance' = 'auto';

	$: frustum = strategy === 'frustum';
	$: distance = strategy === 'distance' || strategy === 'auto';

	const component = forwardEventHandlers();

	const { scene, camera } = useThrelte();
	const dispatch = createEventDispatcher();

	let visible = false;
	$: if (visible) dispatch('visible');
	else dispatch('hidden');

	const cameraWorldPosition = new THREE.Vector3();
	useFrame(() => {
		camera.current.getWorldPosition(cameraWorldPosition);

		visible = true;

		const bbox = new THREE.Box3().setFromObject(ref);

		if (visible && distance) {
			const far = Math.min(
				scene.fog instanceof THREE.Fog ? scene.fog.far : Infinity,
				camera.current instanceof THREE.PerspectiveCamera
					? camera.current.far
					: Infinity,
			);

			visible =
				Math.min(
					bbox.max.distanceTo(cameraWorldPosition),
					bbox.min.distanceTo(cameraWorldPosition),
				) < far;
			// console.log('distance', visible);
		}

		if (visible && frustum) {
			const frustum = new THREE.Frustum();
			frustum.setFromProjectionMatrix(
				new THREE.Matrix4().multiplyMatrices(
					camera.current.projectionMatrix,
					camera.current.matrixWorldInverse,
				),
			);

			visible = frustum.intersectsBox(bbox);
		}
	});
</script>

<T
	is={ref}
	{...$$restProps}
	bind:this={$component}
	{visible}
>
	<slot />
</T>
