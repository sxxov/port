<script lang="ts">
	import { useRender, useThrelte } from '@threlte/core';
	import {
		EffectComposer,
		EffectPass,
		RenderPass,
		type Effect,
	} from 'postprocessing';
	import type { PostProcessingEffectMap } from './PostProcessingEffectMap';

	const { camera, scene, renderer } = useThrelte();

	export let effectMap: PostProcessingEffectMap;
	export let composer = new EffectComposer(renderer);

	$: effects = Object.values(effectMap).filter(Boolean) as Effect[];

	let renderPass: RenderPass;
	let effectPasses: EffectPass[];

	$: {
		if (renderPass) composer.removePass(renderPass);
		renderPass = new RenderPass(scene, $camera);
		composer.addPass(renderPass);
	}

	$: {
		if (effectPasses)
			for (const pass of effectPasses) composer.removePass(pass);
		effectPasses = effects.map((effect) => new EffectPass($camera, effect));
		for (const pass of effectPasses) composer.addPass(pass);
	}

	useRender((_, delta) => {
		composer.render(delta);
	});
</script>
