import type { OrAnyString } from '@sxxov/ut/types';

const JPG_EMPTY =
	'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wAALCAABAAEBAREA/8QAJgABAAAAAAAAAAAAAAAAAAAAAxABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAAPwBH/9k';

export const stubGltfJpgTexture = <
	T extends {
		images: { mimeType: OrAnyString<'image/jpeg'>; uri: string }[];
	},
>(
	v: T,
): T & { images: { uri: typeof JPG_EMPTY }[] } => ({
	...v,
	images: v.images.map((v) => ({
		...v,
		uri: JPG_EMPTY,
	})),
});
