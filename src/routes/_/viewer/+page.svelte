<script lang="ts">
	import type { GLTF } from 'three-stdlib';
	import ViewerScene from './lib/ViewerScene.svelte';
	import { UnreachableError } from '@sxxov/ut/errors';
	import { toasts } from '@sxxov/sv/toast';
	import { Levels } from '@sxxov/sv/common/enums';
	import { gltfLoader } from '../../../lib/3d/part/gltfLoader';

	let gltf: GLTF | undefined;

	let fileInput: HTMLInputElement | undefined;
	const updateGltf = async (file: File) => {
		const reader = new FileReader();

		const buf = await new Promise<ArrayBuffer | null>((resolve) => {
			reader.addEventListener('load', () => {
				const { result: file } = reader;

				if (typeof file === 'string')
					throw new UnreachableError(
						'`readAsArrayBuffer` returned a string instead of an ArrayBuffer???',
					);

				resolve(file);
			});

			reader.readAsArrayBuffer(file);
		});

		if (!buf) {
			toasts.push({
				text: 'Failed to read file',
				level: Levels.ERROR,
			});

			return;
		}

		gltf = await gltfLoader.parseAsync(buf, '');
	};
</script>

<svelte:window
	on:dragover|preventDefault={({ dataTransfer }) => {
		if (dataTransfer) dataTransfer.dropEffect = 'link';
	}}
	on:drop|preventDefault={async ({ dataTransfer }) => {
		const [file] = dataTransfer?.files ?? [];

		if (!file) return;

		await updateGltf(file);
	}}
/>
<div
	class="viewer"
	role="presentation"
	on:keydown={(e) => {
		if (e.key === 'Escape') gltf = undefined;
		else if (e.key === 'Enter') fileInput?.click();
	}}
	on:click={() => {
		if (!fileInput) return;

		fileInput.click();
	}}
>
	<input
		type="file"
		class="file"
		accept=".gltf,.glb"
		bind:this={fileInput}
		on:change={async ({ currentTarget }) => {
			const [file] = currentTarget.files ?? [];

			if (!file) return;

			await updateGltf(file);
		}}
	/>
</div>
<ViewerScene {gltf} />

<style lang="postcss">
	.viewer {
		width: 100%;
		height: 100%;

		& > input.file {
			display: none;
		}
	}
</style>
