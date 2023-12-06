<script lang="ts">
	import { UnreachableError } from '@sxxov/ut/errors';
	import { raise } from '@sxxov/ut/functional';
	import {
		T,
		forwardEventHandlers,
		type Events,
		type Props,
	} from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import { createPart } from '../part/createPart';

	type $$Events = Events<THREE.Object3D>;
	type $$Props = Props<THREE.Object3D> & {
		gltf: typeof gltf;
		clone?: typeof clone;
		ref?: typeof ref;
	};

	export let gltf: Record<any, any>;
	export let clone = true;
	const setRef = (r: THREE.Object3D) => (ref = r);
	export let ref: THREE.Object3D | undefined = undefined;

	const suspend = useSuspense();
	const component = forwardEventHandlers();
</script>

{#await suspend(createPart(gltf)) then { object }}
	{#if object}
		{@const ref = clone ? object.clone(true) : object}
		{(setRef(ref), '')}
		<T
			is={ref}
			bind:this={$component}
			receiveShadow
			castShadow
			{...$$restProps}
		>
			<slot ref={ref ?? raise(new UnreachableError())} />
		</T>
	{/if}
{/await}
