<script lang="ts">
</script>

<span class="work chip">
	<slot />
</span>

<style lang="postcss">
	.work.chip {
		font-weight: 500;
		letter-spacing: -0.05em;
		font-size: 1.5rem;
		text-decoration: none;

		display: inline-block;
		padding: 7px 14px;
		box-sizing: border-box;
		vertical-align: super;

		position: relative;
		top: 0;

		border-radius: 99999px;
		border: 2px solid var(----colour-accent-primary);
	}
</style>
