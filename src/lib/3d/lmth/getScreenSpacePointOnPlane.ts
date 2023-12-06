import { map } from '@sxxov/ut/math';
import type { Point } from '@sxxov/ut/viewport';
import type { Size } from '@threlte/core';

export const getScreenSpacePointOnPlane = (
	viewport: Size,
	screenPoint: Point,
	plane: Size,
) => {
	const planarPoint = {
		x: map(
			screenPoint.x,
			0,
			viewport.width,
			-plane.width / 2,
			plane.width / 2,
		),
		y: map(
			screenPoint.y,
			0,
			viewport.height,
			plane.height / 2,
			-plane.height / 2,
		),
	};

	return planarPoint;
};
