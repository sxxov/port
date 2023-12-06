<script lang="ts">
	import { css, type Css } from '@sxxov/ut/css';
	import { whenResize } from '@sxxov/sv/ut/action/actions';
	import { mounted } from '@sxxov/sv/ut/stores';

	export let direction: 1 | -1 = 1;
	export let duration: Css = 20;
	export let gap: Css = 10;

	let containerWidth = 0;
	let itemWidth = 0;
	$: itemCount = Math.ceil(containerWidth / Math.max(itemWidth, 1) || 0) + 1;
</script>

<div
	class="marquee"
	style="
		--duration: {css(duration, 's')};
		--gap: {css(gap)};
		--count-item: {itemCount};
		--animation-iter-count-item: {$mounted ? 'infinite' : '0'};
	"
	use:whenResize={({ width: w }) => {
		containerWidth = w;
	}}
>
	<div
		class="content"
		class:animated={$mounted}
		class:forward={direction > 0}
		class:backward={direction < 0}
	>
		<div
			class="item"
			use:whenResize={({ width: w }) => {
				itemWidth = w;
			}}
		>
			<slot />
		</div>
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#each Array(itemCount).fill(undefined) as _}
			<div class="item">
				<slot />
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.marquee {
		/* display: inline-block; */

		width: 100%;
		height: 100%;

		overflow: hidden;
		overflow: clip;

		& .item {
			padding-right: var(--gap);
			white-space: nowrap;
		}

		& > .content {
			display: flex;

			height: 100%;

			& > .item {
				flex-shrink: 0;
			}

			/*
					BUG: for some reason, having the animation set initially will cause incorrect rendering
					when there are enough items to fully cover the overflow. this is reproducible in
					Chrome 111 & Firefox 111. the workaround is to only set the animation after the
					component has mounted.
				*/
			&.animated {
				&.forward > .item {
					animation: scroll-forward
						calc(var(--duration) / var(--count-item)) linear
						infinite;

					@keyframes scroll-forward {
						from {
							transform: translateX(-100%);
						}
						to {
							transform: translateX(0%);
						}
					}
				}

				&.backward > .item {
					animation: scroll-backward
						calc(var(--duration) / var(--count-item)) linear
						infinite;

					@keyframes scroll-backward {
						from {
							transform: translateX(0);
						}
						to {
							transform: translateX(-100%);
						}
					}
				}
			}
		}
	}
</style>
