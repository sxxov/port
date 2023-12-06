<script lang="ts">
	import { expoIn, expoOut } from 'svelte/easing';
	import { useAmbientRendererSize } from '../lib/3d/canvas/useAmbientRendererSize';
	import Meta from '../lib/meta/Meta.svelte';
	import Logo from '../lib/nav/Logo.svelte';
	import WorkItem from './lib/work/WorkItem.svelte';
	import WorkChip from './lib/work/lib/WorkChip.svelte';
	import LogoScene from './lib/logo/LogoScene.svelte';
	import Contact from '../lib/footer/Contact.svelte';
	import Hash from '../lib/nav/Hash.svelte';
	import CallToBlog from './lib/prompt/CallToBlog.svelte';
	import src_deceitville from '../assets/routes/previews/deceitville.png?url&imagetools';
	import src_mew_chang_tsing from '../assets/routes/previews/mew-chang-tsing.png?url&imagetools';
	import src_auto_intro from '../assets/routes/previews/auto-intro.png?url&imagetools';
	import src_cloething from '../assets/routes/previews/cloething.png?url&imagetools';
	import src_succide from '../assets/routes/previews/succide.png?url&imagetools';
	import src_vortex_oobe from '../assets/routes/previews/vortex-oobe.jpeg?url&imagetools';
	import src_first_website from '../assets/routes/previews/first-website.png?url&imagetools';

	export const dropDown = (
		element: Element,
		{ delay = 0, duration = 500, easing = expoOut } = {},
	) => {
		const computed = getComputedStyle(element);
		const opacity = Number(computed.opacity);
		const transform =
			computed.transform === 'none' ? '' : computed.transform;

		return {
			delay,
			duration,
			easing,
			css: (t: number, u: number) => `
				transform: ${transform} translateY(${u * 200}px);
				opacity: ${opacity * Math.min(t * 2, 1)};
			`,
		};
	};

	let scrollY = 0;
	const rendererSize = useAmbientRendererSize();
	$: ({ height: vh } = $rendererSize ?? { height: 0 });
</script>

<Meta
	title="lim jia sheng"
	description="not your grandma's designer; not your grandma's developer."
	keywords={[
		'designer',
		'portfolio',
		'developer',
		'web developer',
		'frontend engineer',
		'frontend developer',
		'creative developer',
		'malaysia',
		'ui/ux designer',
		'frontend designer',
		'web designer',
		'freelance',
		'ui',
		'user interface',
		'ui/ux',
	]}
	src=""
/>
<svelte:window bind:scrollY />
<LogoScene />
<div class="route home">
	<Hash
		id="works"
		name="Works"
	/>
	<div class="frame"></div>
	<div class="content">
		<!-- <div class="logo">
			<Logo
				height="50vh"
				width="max-content"
				colour="----colour-accent-primary"
			/>
		</div> -->
		<h1>
			Lim
			<br />
			Jia
			<br />
			Sheng
		</h1>
		<section class="works">
			<h2>Work</h2>
			<div class="content">
				<WorkItem
					href="https://deceitville.ljs.lol"
					src={src_deceitville}>Deceitville</WorkItem
				>
				<WorkItem
					href="https://mewchangtsing.com"
					src={src_mew_chang_tsing}>Mew Chang Tsing</WorkItem
				>
				<WorkItem
					href="https://cloething.staging.ljs.lol"
					src={src_cloething}
					>Cloe<span class="group"
						>thing <WorkChip>Demo</WorkChip></span
					></WorkItem
				>
				<WorkItem
					href="https://ai.sxxov.design"
					src={src_auto_intro}
					>Auto <span class="group"
						>Intro <WorkChip>Experiment</WorkChip></span
					></WorkItem
				>
				<WorkItem
					href="https://succide.staging.sxxov.design/"
					src={src_succide}
					>Succ<span class="group">ide <WorkChip>Game</WorkChip></span
					></WorkItem
				>
				<WorkItem
					href="https://vortex-oobe.staging.sxxov.design"
					src={src_vortex_oobe}
					>VorteXR Lab <span class="group"
						>Launch <WorkChip>Mobile AR</WorkChip></span
					></WorkItem
				>
				<WorkItem
					href="https://old.ljs.lol"
					src={src_first_website}
					>My First <span class="group"
						>Website <WorkChip>Demo</WorkChip></span
					></WorkItem
				>
			</div>
		</section>
	</div>
	<Hash
		id="blog"
		name="Blog"
	/>
	<CallToBlog />
	<Hash
		id="contact"
		name="Contact"
	/>
	<Contact />
</div>

<style lang="postcss">
	.home {
		display: contents;

		& > .frame {
			position: fixed;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;

			z-index: 10;
			mix-blend-mode: difference;

			pointer-events: none;
		}

		& > .content {
			display: flex;
			flex-direction: column;
			gap: 28px;

			position: relative;

			z-index: 1;

			padding: 28px;
			padding-bottom: 112px;
			box-sizing: border-box;

			width: 100%;
			min-height: 100vh;
			min-height: 100lvh;

			& > .logo {
				width: max-content;
			}

			& > h1 {
				padding-top: 84px;
				margin-top: 0;
				text-transform: lowercase;
			}

			& > section {
				& > h2 {
					text-transform: lowercase;
					font-size: 1rem;

					&::after {
						content: ':';
					}
				}

				&.works {
					& > .content {
						display: flex;
						flex-direction: column;
						gap: 14px;

						@media (max-width: 768px) {
							gap: 56px;
						}

						& .group {
							white-space: nowrap;
							word-break: break-word;
						}
					}
				}
			}
		}
	}
</style>
