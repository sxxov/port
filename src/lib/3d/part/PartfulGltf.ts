import type { GLTF } from 'three-stdlib';

export interface PartfulGltf extends GLTF {
	object: THREE.Object3D | undefined;
}
