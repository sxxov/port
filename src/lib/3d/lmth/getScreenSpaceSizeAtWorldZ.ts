import type { Size } from '@threlte/core';
import type { PerspectiveCamera } from 'three';

// https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
export const getScreenSpaceSizeAtWorldZ = (
	camera: PerspectiveCamera,
	z: number,
): Size => {
	// compensate for cameras not positioned at z=0
	// const cameraOffset = camera.position.z;
	// if (z < cameraOffset) z -= cameraOffset;
	// else z += cameraOffset;

	// vertical fov in radians
	const vFov = (camera.fov * Math.PI) / 180;

	// Math.abs to ensure the result is always positive
	const height = 2 * Math.tan(vFov / 2) * Math.abs(z);
	const width = height * camera.aspect;

	return {
		width,
		height,
	};
};
