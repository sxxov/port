<script
	lang="ts"
	context="module"
>
	import type { IUniform } from 'three';

	interface PulseUniforms {
		uTime: IUniform<number>;
		uColour: IUniform<THREE.Color>;
	}

	const PULSE_VERT = /* glsl */ `
		uniform float uTime;
		uniform vec3 uColour;

		varying vec3 colour;

		#define PI 3.14159265359
		#define T (uTime * 25.)

		void main() {
			float disp = max(
				max(
					0.,
					1. - pow(3. * abs(uv.y - fract(T) + 0.5), 0.25)
				),
				1. - pow(3. * abs(uv.y - fract(T) - 0.5), 0.25)
			) / 100.;
			colour = mix(
				mix(vec3(1.), uColour, 0.9),
				uColour,
				disp * 200.
			);
			gl_Position =
				projectionMatrix
				* modelViewMatrix
				* vec4(position + normal * 25. * disp, 1.);
		}
	`;

	const PULSE_FRAG = /* glsl */ `
		uniform float time;
		uniform vec2 resolution;

		varying vec3 colour;

		#define PI 3.14159265359
		#define T (time / 2.)

		void main(void) {
			gl_FragColor = vec4(colour, 0.5);
		}
	`;
</script>

<script lang="ts">
	import * as THREE from 'three';
	import { T, useFrame } from '@threlte/core';
	import { mounted } from '@sxxov/sv/ut/stores';
	import { LoaderCircle } from '@sxxov/sv/loaders';

	const u = {
		uTime: { value: 1.0 },
		uColour: { value: new THREE.Color(0x000000) },
	} satisfies PulseUniforms;

	export let ref = new THREE.Mesh(
		new THREE.SphereGeometry(1, 128, 128),
		new THREE.ShaderMaterial({
			uniforms: u,
			vertexShader: PULSE_VERT,
			fragmentShader: PULSE_FRAG,
		}),
	);

	let rotation: [x: number, y: number, z: number] = [0, 0, 0];

	useFrame((ctx, delta) => {
		u.uTime.value += delta / 20;
		rotation[1] += delta * 2;
		rotation[2] += delta;
	});
</script>

{#if $mounted}
	<T
		is={ref}
		{rotation}
	/>
{:else}
	<LoaderCircle
		height={56}
		width={56}
	/>
{/if}
