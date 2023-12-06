import { traversePropertyElements } from '@sxxov/ut/traverse';
import { usePostProcessing } from './usePostProcessing';
import { IllegalStateError } from '@sxxov/ut/errors';
import type { OutlineEffect } from 'postprocessing';
import * as THREE from 'three';

export const useOutline = () => {
	const postProcessing = usePostProcessing();

	if (!postProcessing)
		throw new IllegalStateError(
			'Attempted to use outline without post processing context.',
		);

	let outline: OutlineEffect | undefined;
	postProcessing.effectMap.subscribe((effectMap) => {
		({ outline } = effectMap);
	});

	if (!outline)
		throw new IllegalStateError(
			"Attempted to use outline in post processing context that doesn't have an `outline` effect in the `effectMap`.",
		);

	const add = (ref: THREE.Object3D) => {
		if (!outline) return;

		traversePropertyElements(ref, 'children', (child) => {
			if (child instanceof THREE.Mesh && !('font' in child))
				outline!.selection.add(child);
		});
	};

	const remove = (ref: THREE.Object3D) => {
		if (!outline) return;

		traversePropertyElements(ref, 'children', (child) => {
			if (outline!.selection.has(child)) outline!.selection.delete(child);
		});
	};

	const clear = () => {
		if (!outline) return;

		outline.selection.clear();
	};

	return { add, remove, clear };
};
