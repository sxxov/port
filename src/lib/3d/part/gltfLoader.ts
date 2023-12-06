import { GLTFLoader } from 'three-stdlib';
import { dracoLoader } from './dracoLoader';

/** Global GLTF loader instance */
export const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
