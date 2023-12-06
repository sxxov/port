<script
	lang="ts"
	context="module"
>
</script>

<script lang="ts">
	import src_pace from 'pace-js?url';
	import png_favi from '../assets/common/favi/favicon.png?png&imagetools';
	import svg_favi from '../assets/common/favi/favicon.svg?url';
	import src_webmanifest from '../assets/common/favi/site.webmanifest?url';
	import '../app.pcss';
	import { Toaster } from '@sxxov/sv/toast';
	import Footer from '../lib/footer/Footer.svelte';
	import { client } from '@sxxov/ut/viewport';
	import * as THREE from 'three';
	import '../lib/3d/optimisation/enable-cache';
	import '../lib/3d/optimisation/patch-cache-image-bitmap-loader';
	import AmbientCanvas from '../lib/3d/canvas/AmbientCanvas.svelte';
	import DefaultPostProcessingProvider from './lib/environment/DefaultPostProcessingProvider.svelte';
	import DefaultExrHdriProvider from './lib/environment/DefaultExrHdriProvider.svelte';
	import { useLenisInitialisation } from '../lib/lenis/useLenis';
	import { useClientHistoryInitialisation } from '../lib/history/clientHistory';
	import Splash from '../lib/splash/Splash.svelte';
	import { DRACO_DECODER_URL } from '../lib/3d/part/dracoLoader';
	import Nav from '../lib/nav/Nav.svelte';

	useLenisInitialisation();
	useClientHistoryInitialisation();
</script>

<svelte:head>
	<meta charset="utf-8" />

	<script
		defer
		src={src_pace}
	></script>

	<link
		rel="preconnect"
		href={DRACO_DECODER_URL}
	/>

	<!-- Icon Tags -->
	<link
		rel="icon"
		type="image/svg+xml"
		href={svg_favi}
	/>
	<link
		rel="icon"
		type="image/png"
		href={png_favi}
	/>
	<link
		rel="manifest"
		href={src_webmanifest}
	/>

	<!-- Viewport Tag to prevent jank -->
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1"
	/>
</svelte:head>

<Splash />
<main>
	<Toaster />
	<Nav />

	<AmbientCanvas
		size={$client}
		shadows={THREE.PCFSoftShadowMap}
		useLegacyLights={false}
		toneMapping={THREE.ACESFilmicToneMapping}
		rendererParameters={{
			antialias: true,
			alpha: true,
			premultipliedAlpha: false,
		}}
	>
		<DefaultExrHdriProvider>
			<DefaultPostProcessingProvider>
				<slot />
			</DefaultPostProcessingProvider>
		</DefaultExrHdriProvider>
	</AmbientCanvas>
	<Footer />
</main>

<style lang="postcss">
	main {
		min-height: 100vh;
		min-height: 100lvh;
		width: inherit;
	}
</style>
