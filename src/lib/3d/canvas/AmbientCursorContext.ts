import type { Store } from '@sxxov/ut/store';
import type { useCursor } from '@threlte/extras';
import type { Writable } from 'svelte/store';

export type Cursor = Exclude<
	Parameters<typeof useCursor>[0],
	undefined | Writable<any>
>;

export interface AmbientCursorContext {
	cursor: Store<Cursor | undefined>;
	cursorHover: Store<Cursor | undefined>;
	cursorHoverCount: Store<number>;
	cursorActive: Store<Cursor | undefined>;
}
