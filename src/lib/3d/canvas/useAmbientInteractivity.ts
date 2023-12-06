import { getContext } from 'svelte';
import { ambientInteractivityContextKey } from './AmbientCanvas.svelte';
import type { AmbientInteractivityContext } from './AmbientInteractivityContext';

export const useAmbientInteractivity = (enabled = true) => {
	const { interactivity } = getContext<AmbientInteractivityContext>(
		ambientInteractivityContextKey,
	);
	interactivity.enabled.set(enabled);

	return interactivity;
};
