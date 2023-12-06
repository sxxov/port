import { useThrelte } from '@threlte/core';
import { onDestroy, onMount } from 'svelte';

const cameraStack: THREE.Camera[] = [];

export const useEphemeralCamera = (camera: THREE.Camera) => {
	const { camera: c } = useThrelte();

	let init: THREE.Camera | undefined;

	onMount(() => {
		init = c.current;
		if (init) cameraStack.push(init);

		c.set(camera);
	});

	onDestroy(() => {
		if (!init) return;

		const indexOfInit = cameraStack.indexOf(init);

		if (indexOfInit >= 0) {
			if (c.current === camera) {
				cameraStack.splice(indexOfInit, Infinity);
				c.set(init);
			} else cameraStack.splice(indexOfInit, 1);
		}
	});
};
