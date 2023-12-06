<script
	lang="ts"
	context="module"
>
	export const ambientRendererSizeContextKey = Symbol('ambientRendererSize');
	export const ambientInteractivityContextKey = Symbol('ambientInteractive');
	export const ambientCursorContextKey = Symbol('ambientCursor');
</script>

<script lang="ts">
	import 'use-unsafe-threlte';

	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { whenResize } from '@sxxov/sv/ut/action/actions';
	import { css } from '@sxxov/ut/css';
	import { Store } from '@sxxov/ut/store';
	import type { Size } from '@sxxov/ut/viewport';
	import { client, inner } from '@sxxov/ut/viewport';
	import { Canvas, forwardEventHandlers, useFrame } from '@threlte/core';
	import { interactivity, useInteractivity } from '@threlte/extras';
	import {
		setContext,
		type ComponentEvents,
		type ComponentProps,
	} from 'svelte';
	import { useLenis } from '../../lenis/useLenis';
	import type { AmbientCursorContext } from './AmbientCursorContext';
	import type { AmbientInteractivityContext } from './AmbientInteractivityContext';
	import type { AmbientRendererSizeContext } from './AmbientRendererSizeContext';

	type $$Props = ComponentProps<Canvas>;
	type $$Events = ComponentEvents<Canvas>;

	const component = forwardEventHandlers();
	let active = false;

	let width = 0;
	let height = 0;

	let initialScrollY = -1;
	const updateInitialScrollY = () => {
		initialScrollY = window.scrollY;
	};
	const lenis = useLenis();
	let shouldRestoreUnhydratedScroll = true;
	$: if (initialScrollY >= 0) window.scrollY = initialScrollY;
	$: if (initialScrollY >= 0 && $lenis && shouldRestoreUnhydratedScroll) {
		$lenis.scrollTo(initialScrollY);
	}
	beforeNavigate(() => {
		shouldRestoreUnhydratedScroll = false;
	});

	let portalDiv: HTMLDivElement;
	const portal = (content: HTMLElement, portal: HTMLElement) => {
		portal.appendChild(content);

		return {
			destroy() {
				portal.removeChild(content);
			},
		};
	};

	$: vw = Math.max($inner.width, $client.width);
	$: vh = Math.max($inner.height, $client.height);

	const rendererSize = new Store<Size>({
		width: vw || (browser ? 1 : 0),
		height: vh || (browser ? 1 : 0),
	});
	$: $rendererSize.width = width || vw || (browser ? 1 : 0);
	$: $rendererSize.height = height || vh || (browser ? 1 : 0);
	setContext<AmbientRendererSizeContext>(
		ambientRendererSizeContextKey,
		rendererSize,
	);

	const setInteractivity = (v: ReturnType<typeof interactivity>) => {
		interactivityCtx.interactivity = v;
		v.enabled.set(false);
	};
	const interactivityCtx: AmbientInteractivityContext = {
		interactivity: undefined as any,
	};
	$: interactive = interactivityCtx.interactivity?.enabled;

	beforeNavigate(() => {
		interactive.set(false);
	});

	setContext<AmbientInteractivityContext>(
		ambientInteractivityContextKey,
		interactivityCtx,
	);

	const cursor: AmbientCursorContext['cursor'] = new Store(undefined);
	const cursorActive: AmbientCursorContext['cursorActive'] = new Store(
		undefined,
	);
	const cursorHover: AmbientCursorContext['cursorHover'] = new Store(
		undefined,
	);
	const cursorHoverCount: AmbientCursorContext['cursorHoverCount'] =
		new Store(0);
	$: if ($cursorHoverCount < 0) $cursorHoverCount = 0;
	const cursorCtx: AmbientCursorContext = {
		cursor,
		cursorHover,
		cursorHoverCount,
		cursorActive,
	};

	setContext<AmbientCursorContext>(ambientCursorContextKey, cursorCtx);
</script>

<div class="ambient-canvas">
	<div
		class="canvas"
		class:active
		class:interactive={$interactive}
		style="
			--cursor: {css(($cursorHoverCount > 0 ? '--cursor-hover' : $cursor) ?? 'auto')};
			--cursor-hover: {css($cursorHover ?? 'pointer')};
			--cursor-active: {css($cursorActive ?? '--cursor')};
		"
		use:whenResize={({ width: w, height: h }) => {
			if (width !== w) width = w;
			if (height !== h) height = h;
		}}
	>
		{#if browser}
			{(updateInitialScrollY(), '')}
			<Canvas
				{...$$restProps}
				size={$rendererSize}
				bind:this={$component}
			>
				<div use:portal={portalDiv}>
					<slot />
				</div>
				{((() => {
					const f = useFrame(() => {
						active = true;
						f.stop();
					});
				})(),
				!interactivityCtx.interactivity &&
					setInteractivity(interactivity()),
				useInteractivity(),
				'')}
			</Canvas>
		{/if}
	</div>
	<div
		class="portal"
		bind:this={portalDiv}
	>
		{#if !browser}
			<div>
				<slot />
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.ambient-canvas {
		display: contents;

		& > .canvas {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			height: 100lvh;

			opacity: 0;
			transition: opacity 1s var(----ease-slow-slow);

			z-index: 1;

			& > :global(canvas) {
				user-select: none;
				-webkit-tap-highlight-color: transparent;

				cursor: var(--cursor);

				&:active {
					cursor: var(--cursor-active);
				}
			}

			&:not(.interactive) {
				pointer-events: none;
			}

			&.active {
				opacity: 1;
			}
		}

		& > .portal {
			display: contents;
		}
	}
</style>
