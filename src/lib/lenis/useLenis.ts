import { browser } from '$app/environment';
import { afterNavigate } from '$app/navigation';
import Lenis from '@studio-freight/lenis';
import { Store } from '@sxxov/ut/store';
import { onMount } from 'svelte';

export const lenis = new Store<Lenis | undefined>(undefined);
let rafHandle: ReturnType<typeof requestAnimationFrame> | undefined;

const createLenis = () => {
	let instance = lenis.get();

	if (instance) instance.destroy();
	if (rafHandle) cancelAnimationFrame(rafHandle);

	instance = new Lenis({
		duration: 0.5,
	});
	instance.on('scroll', () => {
		document.documentElement.dispatchEvent(new CustomEvent('scroll'));
	});

	rafHandle = requestAnimationFrame(function raf(time) {
		instance!.raf(time);
		rafHandle = requestAnimationFrame(raf);
	});

	lenis.set(instance);
};

export const useLenisInitialisation = () => {
	afterNavigate(createLenis);
	onMount(createLenis);
};

export const useLenis = () => lenis;
