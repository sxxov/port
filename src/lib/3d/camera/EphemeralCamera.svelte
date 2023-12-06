<script lang="ts">
	import {
		T,
		forwardEventHandlers,
		type Props,
		type Events,
	} from '@threlte/core';
	import * as THREE from 'three';
	import { useEphemeralCamera } from './useEphemeralCamera';

	type $$Props = Props<THREE.PerspectiveCamera>;
	type $$Events = Events<THREE.PerspectiveCamera>;

	export let ref = new THREE.PerspectiveCamera(30);
	ref.name = 'EphemeralCamera';
	useEphemeralCamera(ref);

	const component = forwardEventHandlers();
</script>

<T
	is={ref}
	{...$$restProps}
	bind:this={$component}
>
	<slot {ref} />
</T>
