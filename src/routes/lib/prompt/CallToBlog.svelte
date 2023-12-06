<script lang="ts">
	import Marquee from './Marquee.svelte';
</script>

<div class="call-to-blog">
	<div class="marquee">
		<a href="https://blog.ljs.lol">
			<Marquee
				duration={30}
				gap={14}
				><div class="content">
					Read more on the <b>Blog</b>®
				</div></Marquee
			>
		</a>
	</div>
</div>

<style lang="postcss">
	.call-to-blog {
		position: sticky;
		top: 0;

		height: 56px;
		border-block: 1px solid var(----colour-background-secondary);
		background: var(----colour-background-primary);

		z-index: 1;

		& > .marquee {
			position: relative;
			top: 50%;
			transform: translate(0, -50%);

			& > a {
				text-underline-offset: 0.32em;

				& .content {
					font-family: var(----font-family-display);
					font-size: 1rem;
					font-weight: 500;

					text-transform: uppercase;
				}
			}
		}
	}
</style>
