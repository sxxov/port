<script lang="ts">
	import {
		T,
		type Props,
		type Events,
		forwardEventHandlers,
	} from '@threlte/core';
	import * as THREE from 'three';
	import { degToRad } from 'three/src/math/MathUtils.js';

	interface $$Props extends Props<THREE.Group> {
		ref?: typeof ref;
		widthSurface?: typeof widthSurface;
		heightSurface?: typeof heightSurface;
		weightSurface?: typeof weightSurface;
		heightLeg?: typeof heightLeg;
		weightLeg?: typeof weightLeg;
		gapCloth?: typeof gapCloth;
	}
	type $$Events = Events<THREE.Group>;

	export let ref = new THREE.Group();
	export let widthSurface = 1;
	export let heightSurface = 1;
	export let weightSurface = 0.2;
	export let heightLeg = 1;
	export let weightLeg = 0.1;
	export let gapCloth = 0.1;
	export let heightCloth = (heightLeg + weightSurface + gapCloth) * 0.75;
	export let degCloth = 5;
	export let unclothed = false;

	$: radiusCloth = heightCloth * Math.tan(degToRad(degCloth));
	$: cornerLengthCloth = Math.sqrt(radiusCloth ** 2 / 2);
	$: cornerRotationCloth = Math.atan2(cornerLengthCloth, heightCloth);

	const component = forwardEventHandlers();
</script>

<T
	is={ref}
	bind:this={$component}
	{...$$restProps}
>
	<T.Mesh>
		<T.BoxGeometry args={[widthSurface, weightSurface, heightSurface]} />
		<slot name="surface-children">
			<T.MeshPhysicalMaterial color={new THREE.Color(0xeeeeee)} />
		</slot>
	</T.Mesh>

	<T.Mesh
		position={[
			(widthSurface - weightLeg) / 2,
			-(heightLeg + weightSurface) / 2,
			(heightSurface - weightLeg) / 2,
		]}
	>
		<T.BoxGeometry args={[weightLeg, heightLeg, weightLeg]} />
		<slot name="leg-children">
			<T.MeshPhysicalMaterial color={new THREE.Color(0xbbbbbb)} />
		</slot>
	</T.Mesh>
	<T.Mesh
		position={[
			(widthSurface - weightLeg) / 2,
			-(heightLeg + weightSurface) / 2,
			-(heightSurface - weightLeg) / 2,
		]}
	>
		<T.BoxGeometry args={[weightLeg, heightLeg, weightLeg]} />
		<slot name="leg-children">
			<T.MeshPhysicalMaterial color={new THREE.Color(0xbbbbbb)} />
		</slot>
	</T.Mesh>
	<T.Mesh
		position={[
			-(widthSurface - weightLeg) / 2,
			-(heightLeg + weightSurface) / 2,
			(heightSurface - weightLeg) / 2,
		]}
	>
		<T.BoxGeometry args={[weightLeg, heightLeg, weightLeg]} />
		<slot name="leg-children">
			<T.MeshPhysicalMaterial color={new THREE.Color(0xbbbbbb)} />
		</slot>
	</T.Mesh>
	<T.Mesh
		position={[
			-(widthSurface - weightLeg) / 2,
			-(heightLeg + weightSurface) / 2,
			-(heightSurface - weightLeg) / 2,
		]}
	>
		<T.BoxGeometry args={[weightLeg, heightLeg, weightLeg]} />
		<slot name="leg-children">
			<T.MeshPhysicalMaterial color={new THREE.Color(0xbbbbbb)} />
		</slot>
	</T.Mesh>

	{#if !unclothed}
		<T.Mesh
			position={[0, gapCloth + weightSurface / 2, 0]}
			rotation={[degToRad(90), 0, 0]}
		>
			<T.PlaneGeometry
				args={[
					widthSurface + gapCloth * 2,
					heightSurface + gapCloth * 2,
				]}
			/>
			<slot name="cloth-children">
				<T.MeshPhysicalMaterial
					side={THREE.DoubleSide}
					transmission={1}
					roughness={0.3}
					thickness={0.5}
				/>
			</slot>
		</T.Mesh>
		<T.Mesh
			position={[
				0,
				-(heightCloth / 2 - weightSurface / 2 - gapCloth),
				heightSurface / 2 + gapCloth,
			]}
			rotation={[0, 0, 0]}
		>
			<T.PlaneGeometry
				args={[widthSurface + gapCloth * 2, heightCloth]}
			/>
			<slot name="cloth-children">
				<T.MeshPhysicalMaterial
					side={THREE.DoubleSide}
					transmission={1}
					roughness={0.3}
					thickness={0.5}
				/>
			</slot>
		</T.Mesh>
		<T.Mesh
			position={[
				widthSurface / 2 + gapCloth,
				-(heightCloth / 2 - weightSurface / 2 - gapCloth),
				0,
			]}
			rotation={[0, degToRad(90), 0]}
		>
			<T.PlaneGeometry
				args={[heightSurface + gapCloth * 2, heightCloth]}
			/>
			<slot name="cloth-children">
				<T.MeshPhysicalMaterial
					side={THREE.DoubleSide}
					transmission={1}
					roughness={0.3}
					thickness={0.5}
				/>
			</slot>
		</T.Mesh>
		<T.Mesh
			position={[
				-(widthSurface / 2 + gapCloth),
				-(heightCloth / 2 - weightSurface / 2 - gapCloth),
				0,
			]}
			rotation={[0, degToRad(-90), 0]}
		>
			<T.PlaneGeometry
				args={[heightSurface + gapCloth * 2, heightCloth]}
			/>
			<slot name="cloth-children">
				<T.MeshPhysicalMaterial
					side={THREE.DoubleSide}
					transmission={1}
					roughness={0.3}
					thickness={0.5}
				/>
			</slot>
		</T.Mesh>
		<T.Mesh
			position={[
				0,
				-(heightCloth / 2 - weightSurface / 2 - gapCloth),
				-(heightSurface / 2 + gapCloth),
			]}
			rotation={[0, degToRad(180), 0]}
		>
			<T.PlaneGeometry
				args={[widthSurface + gapCloth * 2, heightCloth]}
			/>
			<slot name="cloth-children">
				<T.MeshPhysicalMaterial
					side={THREE.DoubleSide}
					transmission={1}
					roughness={0.3}
					thickness={0.5}
				/>
			</slot>
		</T.Mesh>
		<T.Group
			position={[
				widthSurface / 2 + gapCloth,
				weightSurface / 2 + gapCloth,
				heightSurface / 2 + gapCloth,
			]}
			rotation={[-cornerRotationCloth, 0, cornerRotationCloth]}
		>
			<T.Mesh position.y={-heightCloth / 2}>
				<T.ConeGeometry
					args={[radiusCloth, heightCloth, 32, 1, true]}
				/>
				<slot name="cloth-children">
					<T.MeshPhysicalMaterial
						side={THREE.DoubleSide}
						transmission={1}
						roughness={0.3}
						thickness={0.5}
					/>
				</slot>
			</T.Mesh>
		</T.Group>
		<T.Group
			position={[
				-(widthSurface / 2 + gapCloth),
				weightSurface / 2 + gapCloth,
				heightSurface / 2 + gapCloth,
			]}
			rotation={[-cornerRotationCloth, 0, -cornerRotationCloth]}
		>
			<T.Mesh position.y={-heightCloth / 2}>
				<T.ConeGeometry
					args={[radiusCloth, heightCloth, 32, 1, true]}
				/>
				<slot name="cloth-children">
					<T.MeshPhysicalMaterial
						side={THREE.DoubleSide}
						transmission={1}
						roughness={0.3}
						thickness={0.5}
					/>
				</slot>
			</T.Mesh>
		</T.Group>
		<T.Group
			position={[
				widthSurface / 2 + gapCloth,
				weightSurface / 2 + gapCloth,
				-(heightSurface / 2 + gapCloth),
			]}
			rotation={[cornerRotationCloth, 0, cornerRotationCloth]}
		>
			<T.Mesh position.y={-heightCloth / 2}>
				<T.ConeGeometry
					args={[radiusCloth, heightCloth, 32, 1, true]}
				/>
				<slot name="cloth-children">
					<T.MeshPhysicalMaterial
						side={THREE.DoubleSide}
						transmission={1}
						roughness={0.3}
						thickness={0.5}
					/>
				</slot>
			</T.Mesh>
		</T.Group>
		<T.Group
			position={[
				-(widthSurface / 2 + gapCloth),
				weightSurface / 2 + gapCloth,
				-(heightSurface / 2 + gapCloth),
			]}
			rotation={[cornerRotationCloth, 0, -cornerRotationCloth]}
		>
			<T.Mesh position.y={-heightCloth / 2}>
				<T.ConeGeometry
					args={[radiusCloth, heightCloth, 32, 1, true]}
				/>
				<slot name="cloth-children">
					<T.MeshPhysicalMaterial
						side={THREE.DoubleSide}
						transmission={1}
						roughness={0.3}
						thickness={0.5}
					/>
				</slot>
			</T.Mesh>
		</T.Group>
	{/if}
</T>
