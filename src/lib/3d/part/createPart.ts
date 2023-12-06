import type { PartfulGltf } from './PartfulGltf';
import { gltfLoader } from './gltfLoader';
import { PartPaceSource } from './PartPaceSource';

const partCache = new Map<Record<any, any>, PartfulGltf>();
export const createPart = async <T extends Record<any, any>>(
	gltf: T,
): Promise<PartfulGltf> => {
	let part = partCache.get(gltf);

	if (!part) {
		const result = await PartPaceSource.instance.track(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			gltfLoader.parseAsync(gltf as any, ''),
		);
		const [object] = result.scene.children;

		part = {
			...result,
			object,
		};

		partCache.set(gltf, part);
	}

	return part;
};
