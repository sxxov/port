import type { ThrelteContext } from '@threlte/core';
import { Store } from '@sxxov/ut/store';

export const threlte = new Store<ThrelteContext | undefined>(undefined);
