<script
	lang="ts"
	context="module"
>
	export const lmthContextKey = Symbol('lmth');
</script>

<script lang="ts">
	import { whenResize } from '@sxxov/sv/ut/action/actions';
	import { UnimplementedError } from '@sxxov/ut/errors';
	import type { Rect } from '@sxxov/ut/viewport';
	import {
		T,
		forwardEventHandlers,
		useFrame,
		useThrelte,
		type Events,
		type Props,
	} from '@threlte/core';
	import { onDestroy, onMount, setContext } from 'svelte';
	import * as THREE from 'three';
	import { getScreenSpacePointOnPlane } from './getScreenSpacePointOnPlane';
	import { getScreenSpaceSizeAtWorldZ } from './getScreenSpaceSizeAtWorldZ';
	import { type Css, css } from '@sxxov/ut/css';
	import { raise } from '@sxxov/ut/functional';
	import type { LmthContext } from './LmthContext';

	export let ref = new THREE.Group();
	export let width: Css = '100%';
	export let height: Css = '100%';
	export let z = -10;
	export let eager = false;
	export let debug = false;
	export let strategy: 'stretch' | 'fit' | 'fill' | 'put' | 'auto' =
		'stretch';
	export let align: 'start' | 'centre' | 'end' = 'centre';

	interface $$Props extends Props<THREE.Group> {
		ref?: typeof ref;
		z?: typeof z;
		eager?: typeof eager;
		debug?: typeof debug;
		strategy?: typeof strategy;
	}
	type $$Events = Events<THREE.Group>;

	let div: HTMLDivElement | undefined;
	let rect: Rect = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	};

	let scaleX = 0;
	let scaleY = 0;
	let x = 0;
	let y = 0;
	let camera: THREE.PerspectiveCamera;
	let cameraPrev: THREE.PerspectiveCamera | undefined;
	let cameraInitAttachedToScene = false;
	let cameraScheduleAddRef = false;

	const component = forwardEventHandlers();
	const ctx = useThrelte();
	const { camera: cameraAny, renderer, scene } = ctx;

	$: {
		if (!($cameraAny instanceof THREE.PerspectiveCamera))
			throw new UnimplementedError(
				`LMTH requires a PerspectiveCamera, got ${$cameraAny.constructor.name}`,
			);

		cameraPrev = camera;
		camera = $cameraAny;

		if (camera !== cameraPrev) {
			cameraPrev?.remove(ref);
			if (!cameraInitAttachedToScene) scene.remove(cameraPrev);
		}

		cameraInitAttachedToScene = scene.children.includes(camera);
		if (!cameraInitAttachedToScene) scene.attach(camera);

		// idk why, but adding ref here won't reflect in the scene
		// probably because threlte purges children when a new camera
		// is `makeDefault`ed
		// so we schedule it to be added in `useFrame()`
		cameraScheduleAddRef = true;
	}

	const groupBbox = new THREE.Box3();
	const viewport = new THREE.Vector2();
	let scheduleReupdateThree = false;
	// eslint-disable-next-line complexity
	const updateThree = () => {
		renderer.getSize(viewport);
		const plane = getScreenSpaceSizeAtWorldZ(camera, z);

		const planePointTopLeft = getScreenSpacePointOnPlane(
			viewport,
			{
				x: rect.x,
				y: rect.y,
			},
			plane,
		);
		const planePointBottomRight = getScreenSpacePointOnPlane(
			viewport,
			{
				x: rect.x + rect.width,
				y: rect.y + rect.height,
			},
			plane,
		);

		ref.scale.set(1, 1, 1);
		groupBbox.setFromObject(ref);
		const groupWidth = groupBbox.max.x - groupBbox.min.x;
		const groupHeight = groupBbox.max.y - groupBbox.min.y;
		const planeWidth = planePointBottomRight.x - planePointTopLeft.x;
		const planeHeight = -planePointBottomRight.y - -planePointTopLeft.y;

		let [fit, fill, stretch, put] = [false, false, false, false];
		switch (strategy) {
			case 'auto':
				if (rect.width > 0 && rect.height > 0) stretch = true;
				else put = true;
				break;
			case 'fit':
				fit = true;
				break;
			case 'fill':
				fill = true;
				break;
			case 'stretch':
				stretch = true;
				break;
			case 'put':
				put = true;
				break;
			default:
				throw new UnimplementedError(
					`Unknown strategy: ${String(strategy)}`,
				);
		}

		if (stretch) {
			const [x, y] = [
				groupWidth > 0 ? planeWidth / groupWidth : 1,
				groupHeight > 0 ? planeHeight / groupHeight : 1,
			];
			if (groupWidth <= 0 && groupHeight <= 0)
				scheduleReupdateThree = true;

			[scaleX, scaleY] = [x, y];
		} else if (fill) {
			const [x, y] = [
				groupWidth > 0 ? planeWidth / groupWidth : 1,
				groupHeight > 0 ? planeHeight / groupHeight : 1,
			];
			if (groupWidth <= 0 && groupHeight <= 0)
				scheduleReupdateThree = true;
			const scale = Math.max(x, y);

			[scaleX, scaleY] = [scale, scale];
		} else if (fit) {
			const [x, y] = [
				groupWidth > 0 ? planeWidth / groupWidth : 1,
				groupHeight > 0 ? planeHeight / groupHeight : 1,
			];
			if (groupWidth <= 0 && groupHeight <= 0)
				scheduleReupdateThree = true;
			const scale = Math.min(x, y);

			[scaleX, scaleY] = [scale, scale];
		} else if (put) [scaleX, scaleY] = [1, 1];

		// set position x & y
		x = planePointTopLeft.x + (groupWidth * scaleX) / 2;
		y = planePointTopLeft.y - (groupHeight * scaleY) / 2;

		const cameraPos = camera.getWorldPosition(new THREE.Vector3());
		const alignOffsetX =
			align === 'centre'
				? planeWidth / 2 - (groupWidth * scaleX) / 2
				: align === 'start'
				? 0
				: align === 'end'
				? planeWidth - groupWidth * scaleX
				: raise(
						new UnimplementedError(
							`Unknown align: ${String(align)}`,
						),
				  );
		if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z))
			ref.position.set(
				x - cameraPos.x + alignOffsetX,
				y - cameraPos.y,
				z - cameraPos.z,
			);
		if (Number.isFinite(scaleX) && Number.isFinite(scaleY))
			ref.scale.set(scaleX, scaleY, 1);
	};

	const updateDom = () => {
		if (!div) return;

		const domRect = div.getBoundingClientRect();

		rect.x = domRect.x;
		rect.y = domRect.y;
		rect.width = domRect.width;
		rect.height = domRect.height;

		rect = rect;
	};

	$: {
		rect;

		updateThree();
	}

	onMount(() => {
		updateDom();
	});

	setContext<LmthContext>(lmthContextKey, {
		updateDom,
		updateThree,
	});

	let firstUpdate = true;
	useFrame(() => {
		if (eager) updateDom();

		if (scheduleReupdateThree) {
			updateThree();
			scheduleReupdateThree = false;
		}

		if (firstUpdate) {
			updateThree();
			firstUpdate = false;
		}

		if (cameraScheduleAddRef) {
			camera.attach(ref);
			cameraScheduleAddRef = false;
		}
	});

	onDestroy(() => {
		if (!cameraInitAttachedToScene) scene.remove(camera);
		camera.remove(ref);
	});
</script>

<svelte:window
	on:resize={() => {
		updateDom();
	}}
	on:scroll={() => {
		updateDom();
	}}
/>
<div
	class="lmth"
	class:debug
	style="
		--width: {css(width)};
		--height: {css(height)};
	"
	bind:this={div}
	use:whenResize={({ width, height }) => {
		rect.width = width;
		rect.height = height;

		rect = rect;
	}}
/>
<T
	is={ref}
	name="lmth"
	{...$$restProps}
	bind:this={$component}
>
	<slot
		{x}
		{y}
		{z}
	/>
</T>

<style lang="postcss">
	.lmth {
		height: 100%;
		width: 100%;

		&.debug {
			outline: solid 1px red;
		}
	}
</style>
