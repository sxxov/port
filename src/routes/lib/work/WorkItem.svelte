<script lang="ts">
	import { Svg } from '@sxxov/sv/svg';
	import { ic_arrow_outward } from 'maic/two_tone';
	import { pointer } from '../../../lib/follow/pointer';

	export let href: string;
	export let src: string;
	export let disabled = false;
</script>

<div
	class="work item"
	class:disabled
>
	<a
		target="_blank"
		{href}
	>
		<div class="arrow">
			<div class="content">
				<div class="tail"></div>
				<div class="head">
					<div class="a"></div>
					<div class="b"></div>
				</div>
			</div>
		</div>

		<slot />
	</a>
	<div class="overlay"></div>
	<img
		{src}
		alt="Site preview"
		style="
		--transform: translate({$pointer.x}px, {$pointer.y}px);
	"
	/>
</div>

<style lang="postcss">
	.work.item {
		display: contents;

		& > a {
			font-weight: 900;
			letter-spacing: -0.05em;
			font-size: 4rem;
			text-decoration-thickness: 1px;
			text-underline-offset: 24px;

			max-width: max-content;
			word-break: break-word;

			--transition-base: font-size 0.5s var(----ease-slow-slow),
				font-weight 0.5s var(----ease-slow-slow),
				letter-spacing 0.5s var(----ease-slow-slow);
			--transition-underline-in: text-underline-offset 0.5s
				var(----ease-fast-slow);
			--transition-underline-out: text-underline-offset 0.5s
				var(----ease-slow-fast);

			transition: var(--transition-base), var(--transition-underline-out);

			&.disabled {
				cursor: not-allowed;
			}

			&:not(.disabled):hover {
				text-decoration-thickness: 1px;
				text-underline-offset: 42px;

				font-weight: 100;
				font-size: 8rem;
				letter-spacing: -0.1em;

				transition: var(--transition-base),
					var(--transition-underline-in);

				& > .arrow {
					--colour: var(----colour-accent-primary);
					--width-tail: calc(min(100vw - 56px));
					--width-head: 28px;
					--duration-width: 0.5s 0.2s;
					--easing: var(----ease-fast-slow);
				}
			}

			& > .arrow {
				--weight: 2px;
				--width-tail: 0px;
				--width-head: 0px;
				--hypot-head: 39.59797974644666px;
				--duration-width: 0.3s 0s;
				--duration-background: 0.2s;
				--easing: var(----ease-slow-fast);
				--colour: var(----colour-accent-primary);

				position: absolute;
				width: var(--width-tail);

				transition: width var(--duration-width) var(--easing);

				top: calc(1em + 42px - 1px);
				transform: translateY(-50%);

				& > .content {
					position: relative;
					top: 0;

					& > .tail {
						position: absolute;
						top: calc(50% - var(--weight) / 2);
						left: 0;
						width: var(--width-tail);
						height: var(--weight);
						background: var(--colour);

						transition:
							background var(--duration-background) var(--easing),
							width var(--duration-width) var(--easing);
					}

					& > .head {
						position: absolute;
						top: calc(50% - var(--weight) / 2);
						left: calc(var(--width-tail) - var(--weight));

						transition: left var(--duration-width) var(--easing);

						& > * {
							position: absolute;
							width: var(--width-head);
							height: var(--weight);
							background: var(--colour);
							left: calc(
								var(--hypot-head) / 2 * -1 - var(--weight)
							);
							transform-origin: right center;

							transition:
								background var(--duration-background)
									var(--easing),
								width var(--duration-width) var(--easing);

							&.a {
								transform: rotate(45deg) translate(0, 50%);
							}

							&.b {
								transform: rotate(-45deg) translate(0, -50%);
							}
						}
					}
				}
			}
		}

		& > .overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			pointer-events: none;

			background: black;
			opacity: 1;

			z-index: -2;

			transition: opacity 0.1s var(----ease-slow-slow);
		}

		& > img {
			position: fixed;
			top: 0;
			left: 0;
			max-width: 800px;
			max-height: 50vh;

			pointer-events: none;

			z-index: -1;

			transform: translate(0%, -100%) var(--transform);
			filter: brightness(0.5);

			opacity: 1;
			transition: opacity 0s var(----ease-slow-fast);
		}

		& > a:not(:hover) ~ .overlay {
			opacity: 0;
			transition: opacity 0.5s 0.1s var(----ease-slow-fast);
		}

		& > a:not(:hover) ~ img {
			opacity: 0;
		}
	}
</style>
