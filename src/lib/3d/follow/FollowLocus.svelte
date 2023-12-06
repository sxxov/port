<script lang="ts">
	import { inner, type Point } from '@sxxov/ut/viewport';
	import {
		T,
		forwardEventHandlers,
		useThrelte,
		type Events,
		type Props,
	} from '@threlte/core';
	import * as THREE from 'three';
	import { getScreenSpacePointOnPlane } from '../lmth/getScreenSpacePointOnPlane';
	import { getScreenSpaceSizeAtWorldZ } from '../lmth/getScreenSpaceSizeAtWorldZ';
	import { useAmbientRendererSize } from '../canvas/useAmbientRendererSize';

	type $$Props = Props<THREE.Group> & {
		z?: typeof z;
		ref?: typeof ref;
		point: typeof point;
	};
	type $$Events = Events<THREE.Group>;

	const { camera } = useThrelte();

	export let z = -2;
	export let ref = new THREE.Group();
	export let point: Point;

	const component = forwardEventHandlers();

	const size = useAmbientRendererSize() ?? inner;

	$: pointerWorldPoint = getScreenSpacePointOnPlane(
		$size,
		point,
		getScreenSpaceSizeAtWorldZ($camera as THREE.PerspectiveCamera, z),
	);
</script>

<T
	is={ref}
	position={[pointerWorldPoint.x, pointerWorldPoint.y, z]}
	{...$$restProps}
	bind:this={$component}
>
	<slot
		{ref}
		world={pointerWorldPoint}
		{z}
	/>
</T>
