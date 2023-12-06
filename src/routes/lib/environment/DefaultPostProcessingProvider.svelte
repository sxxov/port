<script lang="ts">
	import { Store } from '@sxxov/ut/store';
	import { useLoader, useThrelte } from '@threlte/core';
	import {
		BloomEffect,
		BrightnessContrastEffect,
		ChromaticAberrationEffect,
		DotScreenEffect,
		HueSaturationEffect,
		KernelSize,
		LUT3DEffect,
		LUTCubeLoader,
		OutlineEffect,
		SMAAEffect,
		SMAAPreset,
		VignetteEffect,
		DepthOfFieldEffect,
	} from 'postprocessing';
	import * as THREE from 'three';
	import img_lut from '../../../assets/routes/lib/environment/lut/django-25.cube?url';
	import type { PostProcessingEffectMap } from '../../../lib/3d/environment/PostProcessingEffectMap';
	import PostProcessingProvider from '../../../lib/3d/environment/PostProcessingProvider.svelte';
	import { inner } from '@sxxov/ut/viewport';
	import { useAmbientRendererSize } from '../../../lib/3d/canvas/useAmbientRendererSize';

	const { scene, camera } = useThrelte();

	const rendererSize = useAmbientRendererSize();
	$: ({ width: vw, height: vh } = $rendererSize ?? { width: 0, height: 0 });

	const lutCubeLoader = useLoader(LUTCubeLoader as any);
	const lutTex = lutCubeLoader.load(img_lut);

	let effectMap: PostProcessingEffectMap = {};
	const effectMapStore = new Store<PostProcessingEffectMap>(effectMap);

	$: {
		$inner;

		effectMap = {
			bloom: new BloomEffect({
				intensity: 1,
				luminanceThreshold: 0.15,
				height: 512,
				width: 512,
				luminanceSmoothing: 0.08,
				mipmapBlur: true,
				kernelSize: KernelSize.MEDIUM,
			}),
			smaa: new SMAAEffect({
				preset: SMAAPreset.LOW,
			}),
			chromaticAberration: new ChromaticAberrationEffect({
				offset: new THREE.Vector2(0.001, 0),
				radialModulation: false,
				modulationOffset: 0,
			}),
			brightnessContrast: new BrightnessContrastEffect({
				contrast: 0,
				brightness: -0.3,
			}),
			outline: undefined as OutlineEffect | undefined,
			dotScreen: new DotScreenEffect({
				scale: 0.5,
			}),
			vignette: new VignetteEffect({
				eskil: false,
				offset: 0.1,
				darkness: 1,
			}),
			lut3d: undefined as LUT3DEffect | undefined,
			hueSaturation: new HueSaturationEffect({
				hue: 0,
				saturation: -1,
			}),
		} satisfies PostProcessingEffectMap;

		effectMapStore.set(effectMap);
	}

	$: {
		effectMap.lut3d =
			// kill. me.
			// Safari will render a black screen with LUT3DEffect
			// Ping me in the future when Safari gets deprecated
			$lutTex && !('webkitConvertPointFromNodeToPage' in globalThis)
				? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				  new LUT3DEffect($lutTex)
				: undefined;

		effectMapStore.trigger();
	}
	$: {
		effectMap.outline = new OutlineEffect(scene, $camera, {
			edgeStrength: 100,
			pulseSpeed: 0.0,
			visibleEdgeColor: 0xffffff,
			hiddenEdgeColor: 0x22090a,
			resolutionX: vw,
			resolutionY: vh,
			blur: true,
		});
		effectMap.outline.blurPass.kernelSize = KernelSize.LARGE;

		effectMapStore.trigger();
	}
</script>

<PostProcessingProvider
	ctx={{
		effectMap: effectMapStore,
	}}
>
	<slot />
</PostProcessingProvider>
