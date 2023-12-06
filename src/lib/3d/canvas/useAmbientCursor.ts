import { getContext, onMount } from 'svelte';
import { ambientCursorContextKey } from './AmbientCanvas.svelte';
import type { AmbientCursorContext } from './AmbientCursorContext';

const cursorStack: [
	cursor: ReturnType<AmbientCursorContext['cursor']['get']>,
	cursorHover: ReturnType<AmbientCursorContext['cursorHover']['get']>,
	cursorActive: ReturnType<AmbientCursorContext['cursorActive']['get']>,
][] = [];

export const useAmbientCursor = (
	cursor?: ReturnType<AmbientCursorContext['cursor']['get']>,
	cursorHover?: ReturnType<AmbientCursorContext['cursorHover']['get']>,
	cursorActive?: ReturnType<AmbientCursorContext['cursorActive']['get']>,
): AmbientCursorContext | undefined => {
	const ctx = getContext<AmbientCursorContext>(ambientCursorContextKey);
	const initialCursor = ctx.cursor.get();
	const initialCursorHover = ctx.cursorHover.get();
	const initialCursorActive = ctx.cursorActive.get();

	const i = cursorStack.push([
		initialCursor,
		initialCursorHover,
		initialCursorActive,
	]);

	onMount(() => {
		if (cursor) ctx.cursor.set(cursor);
		if (cursorHover) ctx.cursorHover.set(cursorHover);
		if (cursorActive) ctx.cursorActive.set(cursorActive);

		return () => {
			if (i > cursorStack.length) return;
			cursorStack.splice(i - 1, Infinity);

			ctx.cursorHoverCount.set(0);
			ctx.cursor.set(initialCursor);
			ctx.cursorHover.set(initialCursorHover);
			ctx.cursorActive.set(initialCursorActive);
		};
	});

	return ctx;
};
