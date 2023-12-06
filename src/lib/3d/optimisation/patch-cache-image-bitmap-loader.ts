/* eslint-disable
	@typescript-eslint/no-unsafe-return,
	@typescript-eslint/no-unsafe-assignment,
	@typescript-eslint/no-unsafe-argument,
*/
import * as THREE from 'three';

THREE.ImageBitmapLoader.prototype.load = function (
	url,
	onLoad,
	onProgress,
	onError,
) {
	if (url === undefined) url = '';
	if (this.path !== undefined) url = this.path + url;

	url = this.manager.resolveURL(url);

	// FIXME: There's a race condition here. If the function is called
	// after `FileLoader` resolves, but before `createImageBitmap`
	// resolves, the cache will be empty and the image will be loaded
	// again over the wire using `FileLoader`.

	// Related: https://github.com/mrdoob/three.js/pull/27270
	// Promise based cache would solve this issue.

	const scope = this;
	const imageBitmapCacheKey = `image-bitmap:${url}`;
	const cached = THREE.Cache.get(imageBitmapCacheKey);

	if (cached !== undefined) {
		scope.manager.itemStart(url);

		setTimeout(function () {
			if (onLoad) onLoad(cached);

			scope.manager.itemEnd(url);
		}, 0);

		return cached;
	}

	const loader = new THREE.FileLoader(this.manager);
	loader.setPath(this.path);
	loader.setResponseType('blob');
	loader.setRequestHeader(this.requestHeader);
	loader.setWithCredentials(
		this.withCredentials || this.crossOrigin !== 'anonymous',
	);

	loader.load(
		url,
		function (blob) {
			createImageBitmap(
				blob as unknown as Blob,
				Object.assign(scope.options!, {
					colorSpaceConversion: 'none',
				} as const),
			)
				.then(function (imageBitmap) {
					THREE.Cache.add(imageBitmapCacheKey, imageBitmap);

					if (onLoad) onLoad(imageBitmap);

					scope.manager.itemEnd(url);
				})
				.catch(function (e) {
					if (onError) onError(e);

					THREE.Cache.remove(imageBitmapCacheKey);

					scope.manager.itemError(url);
					scope.manager.itemEnd(url);
				});
		},
		onProgress,
		onError,
	);

	scope.manager.itemStart(url);
};
