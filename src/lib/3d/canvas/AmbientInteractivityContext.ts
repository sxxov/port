import type { interactivity } from '@threlte/extras';

export interface AmbientInteractivityContext {
	interactivity: ReturnType<typeof interactivity>;
}
