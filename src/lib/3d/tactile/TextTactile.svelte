<script lang="ts">
	import { Text } from '@threlte/extras';
	import * as THREE from 'three';
	import ttf_bigelow_rules from '../../../assets/lib/3d/tactile/text/BigelowRules-Regular.ttf?url';
	import type { ComponentEvents, ComponentProps } from 'svelte';
	import { forwardEventHandlers } from '@threlte/core';

	type $$Events = ComponentEvents<Text>;
	interface $$Props extends ComponentProps<Text> {
		text: typeof text;
	}

	export let text: string;

	const component = forwardEventHandlers();
</script>

<Text
	bind:this={$component}
	{text}
	sdfGlyphSize={64}
	font={ttf_bigelow_rules}
	material={new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		emissive: 0xffffff,
		emissiveIntensity: 100,
	})}
	fontSize={1}
	anchorX="50%"
	anchorY="50%"
	{...!$$restProps['characters'] && {
		characters: [...new Set(text)].join(''),
	}}
	{...$$restProps}
/>
