<script lang="ts">
	import ExrHdriProvider from '../../../lib/3d/environment/ExrHdriProvider.svelte';
	import exr_hdri from '../../../assets/routes/lib/environment/hdri/dancing_hall_256.exr?url';
	import { Store } from '@sxxov/ut/store';
</script>

<ExrHdriProvider
	ctx={{
		exr: new Store(exr_hdri),
	}}
>
	<slot />
</ExrHdriProvider>
