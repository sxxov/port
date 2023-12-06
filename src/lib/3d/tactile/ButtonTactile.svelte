<script lang="ts">
	import { Tween } from '@sxxov/ut/animation';
	import { bezierQuintInOut, bezierQuintOut } from '@sxxov/ut/bezier/beziers';
	import { Store } from '@sxxov/ut/store';
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { degToRad } from 'three/src/math/MathUtils.js';
	import { gltfs } from '../../../assets/lib/3d/tactile/button/parts';
	import Part from '../part/Part.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { useOutline } from '../environment/useOutline';
	import { useAmbientCursor } from '../canvas/useAmbientCursor';

	const dispatch = createEventDispatcher();

	export let ref = new THREE.Group();
	export let outlineless = false;
	export let disabled = false;

	const { cursorHoverCount } = useAmbientCursor()!;

	const hovering = new Store(false);
	const tweenHoverIn = new Tween(0, 1, 50, bezierQuintOut);
	const tweenHoverOut = new Tween(1, 0, 300, bezierQuintOut);
	$: tweenHover = $hovering ? tweenHoverIn : tweenHoverOut;
	$: tweenHover.seekToProgress(0), void tweenHover.play();

	const pressing = new Store(false);
	const tweenPressIn = new Tween(0, 1, 0, bezierQuintOut);
	const tweenPressOut = new Tween(1, 0, 300, bezierQuintOut);
	$: tweenPress = $pressing ? tweenPressIn : tweenPressOut;
	$: tweenPress.seekToProgress(0), void tweenPress.play();

	const tweenPulse = new Tween(0, 1, 1000, bezierQuintInOut);
	$: if ($tweenPulse >= 1) void tweenPulse.play(-1);
	else if ($tweenPulse <= 0) void tweenPulse.play(1);

	$: if (disabled) {
		$hovering = false;
		$pressing = false;
	}

	let add: ReturnType<typeof useOutline>['add'] | undefined;
	let remove: ReturnType<typeof useOutline>['remove'] | undefined;
	$: if (outlineless) remove?.(ref);
	else {
		if (!(add && remove)) ({ add, remove } = useOutline());

		if ($hovering || $pressing) add(ref);
		else remove(ref);
	}

	// BUG: pointer* events seem to fire multiple times
	// use a store to dedupe them
	onMount(() => {
		const hoverUnsubscribe = hovering.subscribeLazy((hovering) => {
			if (hovering) dispatch('pointerenter');
			else dispatch('pointerleave');
		});

		const pressUnsubscribe = pressing.subscribeLazy((pressing) => {
			if (pressing) dispatch('pointerdown');
			else {
				dispatch('pointerup');
				dispatch('click');
			}
		});

		return () => {
			hoverUnsubscribe();
			pressUnsubscribe();
		};
	});

	const incrementCursorHoverCount = () => {
		++$cursorHoverCount;
	};
	const decrementCursorHoverCount = () => {
		--$cursorHoverCount;
	};

	$: if ($hovering) incrementCursorHoverCount();
	else decrementCursorHoverCount();
</script>

<T
	is={ref}
	on:pointerenter={() => {
		if (disabled) return;

		$hovering = true;
	}}
	on:pointerleave={() => {
		if (disabled) return;

		$hovering = false;
	}}
	on:pointerdown={() => {
		if (disabled) return;

		$pressing = true;
	}}
	on:pointerup={() => {
		if (disabled) return;

		$pressing = false;
	}}
>
	<slot
		{ref}
		hover={$tweenHover}
		press={$tweenPress}
		hovering={$hovering}
		pressing={$pressing}
	>
		<T.Group rotation.x={degToRad(180)}>
			<Part gltf={gltfs.base} />
			<Part
				gltf={gltfs.pressable}
				scale.z={($tweenHover + 1) * 1.5 - $tweenPress}
			/>
			<T.PointLight
				position={[0, 0, -2]}
				intensity={$tweenHover * 10 +
					$tweenPress * 50 +
					$tweenPulse * -5}
				color={new THREE.Color(0x0000ff)}
				distance={3}
			/>
		</T.Group>
	</slot>
</T>
