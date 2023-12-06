<script lang="ts">
	import { Button, ButtonVariants } from '@sxxov/sv/button';
	import { Svg } from '@sxxov/sv/svg';
	import type { SvgString } from '@sxxov/ut/types';
	import type { HamburgerCtx } from './Hamburger.svelte';

	export let ctx: HamburgerCtx;
	export let icon: SvgString;
	export let name: string;

	$: ({ expanded } = ctx);
</script>

<div class="nav topping">
	<Button
		{...ButtonVariants.Secondary}
		{...ButtonVariants.Shadow.Sm}
		width="100%"
		on:click={() => {
			$expanded = false;
		}}
		on:click
	>
		<div
			class="content"
			slot="content"
		>
			<Svg svg={icon} />
			{name}
		</div>
		<div slot="right" />
	</Button>
</div>

<style lang="postcss">
	.topping {
		& .content {
			display: flex;
			align-items: center;
			gap: 7px;
		}
	}
</style>
