import type { Store } from '@sxxov/ut/store';

export interface ExrHdriContext {
	exposure: Store<number>;
	exr: Store<string>;
	rotation: Store<number>;
}
