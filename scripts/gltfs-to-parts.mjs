import * as path from 'node:path';
import * as fs from 'node:fs/promises';

const [, , targetDir, outDir = `${targetDir}/out`] = process.argv;

if (!targetDir)
	throw new Error(
		`Usage: node ${path.basename(
			new URL(import.meta.url).pathname,
		)} <targetDir> [outDir]`,
	);

const targetFilenames = await fs.readdir(targetDir);
const targetGltfExt = 'GLTF_SEPARATE.gltf';
const targetBinExt = 'GLTF_SEPARATE.bin';

await fs.mkdir(outDir, { recursive: true });

const getTargetExt = (/** @type {string} */ filename) =>
	[targetGltfExt, targetBinExt].find((ext) => filename.endsWith(ext));

const getCanonicalName = (
	/** @type {string} */ filename,
	/** @type {string} */ targetExt,
) => {
	const indexedName = filename.slice(0, -(targetExt.length + 1));
	const index = Number(indexedName.slice(indexedName.lastIndexOf('.') + 1));
	const canonicalName = (
		Number.isNaN(index)
			? indexedName
			: indexedName.slice(0, indexedName.lastIndexOf('.'))
	)
		.toLowerCase()
		.replace(/[\W_]/g, '-')
		.replace(/--+/g, '-')
		.replace(/(0+)(\d+)$/, '$2')
		.replace(/([^-\d])(\d+)$/, '$1-$2');

	return canonicalName;
};

const getVariableName = (/** @type {string} */ name) =>
	name.replace(/\W/g, '_').replace(/^(\d)/, '_$1');

const getImportPlaceholder = (
	/** @type {string} */ name,
	/** @type {string} */ tag,
) => `ඞ ${tag} { ${name} }`;

const /** @type {Map<string, Record<any, any>>} */ canonicalNameToGltfFile =
		new Map();
const /** @type {Map<string, Buffer>} */ canonicalNameToBinFile = new Map();
const /** @type {Map<string, string[]>} */ canonicalNameToVariantNames =
		new Map();
const /**
	 * @type {Map<
	 * 	string,
	 * 	{
	 * 		position: [x: number, y: number, z: number];
	 * 		rotation: [x: number, y: number, z: number, w: number];
	 * 		scale: [x: number, y: number, z: number];
	 * 	}[]
	 * >}
	 */ canonicalNameToGltfInstances = new Map();
const /** @type {Map<string, Buffer>} */ miscellaneousNameToFile = new Map();
for (const targetFilename of targetFilenames) {
	const targetPath = path.join(targetDir, targetFilename);
	const stats = await fs.stat(targetPath);

	if (!stats.isFile()) continue;

	const targetExt = getTargetExt(targetFilename);

	switch (targetExt) {
		case targetBinExt:
			// we're loading this from the gltf file
			continue;

		case targetGltfExt:
			{
				const gltfFilename = targetFilename;
				const gltfBuffer = await fs.readFile(
					path.join(targetDir, gltfFilename),
				);
				const gltfJson = JSON.parse(gltfBuffer.toString('utf8'));

				if (!gltfJson.nodes || !gltfJson.buffers) continue;

				let canonicalName = getCanonicalName(
					targetFilename,
					targetGltfExt,
				);

				if (gltfJson.nodes.length > 1)
					throw new Error('Multiple nodes not supported');

				if (gltfJson.buffers.length > 1)
					throw new Error('Multiple buffers not supported');

				const binFilename = gltfJson.buffers[0].uri;
				const binBuffer = await fs.readFile(
					path.join(targetDir, decodeURIComponent(binFilename)),
				);

				let binDupe = canonicalNameToBinFile.get(canonicalName);

				const commit = () => {
					canonicalNameToGltfFile.set(canonicalName, gltfJson);
					canonicalNameToBinFile.set(canonicalName, binBuffer);
				};

				const instance = (/** @type {string} */ canonicalName) => {
					let instances =
						canonicalNameToGltfInstances.get(canonicalName);
					if (!instances) {
						instances = [];
						canonicalNameToGltfInstances.set(
							canonicalName,
							instances,
						);
					}

					instances.push({
						position: gltfJson.nodes[0].translation ?? [0, 0, 0],
						rotation: gltfJson.nodes[0].rotation ?? [0, 0, 0, 1],
						scale: gltfJson.nodes[0].scale ?? [1, 1, 1],
					});
				};

				const canonicaliseVariant = () => {
					let variantNames =
						canonicalNameToVariantNames.get(canonicalName);
					if (!variantNames) {
						variantNames = [];
						canonicalNameToVariantNames.set(
							canonicalName,
							variantNames,
						);
					}

					canonicalName = `${canonicalName}-x${
						variantNames.length + 1
					}`;
					variantNames.push(canonicalName);
				};

				if (binDupe) {
					const variants =
						canonicalNameToVariantNames.get(canonicalName);
					const isDifferentFromOriginal = !binDupe.equals(binBuffer);

					if (isDifferentFromOriginal) {
						const variantDupe = variants?.find((variant) =>
							canonicalNameToBinFile
								.get(variant)
								?.equals(binBuffer),
						);
						const isDifferentFromVariants = !variantDupe;

						if (isDifferentFromVariants) {
							canonicaliseVariant();
							commit();
							instance(canonicalName);
						} else instance(variantDupe);
					} else instance(canonicalName);
					// don't commit if it's the same
				} else {
					commit();
					instance(canonicalName);
				}
			}
			break;

		default:
			{
				const buffer = await fs.readFile(
					path.join(targetDir, targetFilename),
				);
				miscellaneousNameToFile.set(targetFilename, buffer);
			}
			break;
	}
}

gltf: for (const [canonicalName, json] of canonicalNameToGltfFile) {
	let head = '';
	let body = JSON.stringify(json, undefined, '\t');

	const /** @type {Map<string, string>} */ importPlaceholderToFilename =
			new Map();

	if (json['buffers']) {
		const tag = 'buffer';

		for (const buffer of json['buffers']) {
			if (!buffer.uri) continue;

			if (canonicalNameToBinFile.has(canonicalName)) {
				const filename = `${canonicalName}.bin`;
				const variableName = getVariableName(filename);
				const placeholder = getImportPlaceholder(variableName, tag);
				buffer.uri = placeholder;
				importPlaceholderToFilename.set(placeholder, filename);
			}
		}
	}

	if (json['images']) {
		const tag = 'image';

		for (const image of json['images']) {
			if (!image.uri) continue;

			const filename = image.uri;
			const variableName = getVariableName(filename);
			const placeholder = getImportPlaceholder(variableName, tag);
			image.uri = placeholder;
			importPlaceholderToFilename.set(placeholder, filename);
		}
	}

	const importStatements = [...importPlaceholderToFilename.values()].map(
		(filename) =>
			`import ${getVariableName(filename)} from './${filename}?url';\n`,
	);

	head += importStatements.join('');

	let string = JSON.stringify(json, undefined, '\t');
	for (const [placeholder, canonicalName] of importPlaceholderToFilename)
		string = string.replace(
			`"${placeholder}"`,
			getVariableName(canonicalName),
		);
	body = string;

	const data = `${head}\nexport default ${body}`;
	const outPath = path.join(outDir, `${canonicalName}.ts`);
	console.log(`Writing ${outPath}`);
	await fs.writeFile(outPath, data);
}

bin: for (const [canonicalName, buffer] of canonicalNameToBinFile) {
	const outPath = path.join(outDir, `${canonicalName}.bin`);
	console.log(`Writing ${outPath}`);
	await fs.writeFile(outPath, buffer);
}

other: for (const [filename, buffer] of miscellaneousNameToFile) {
	const outPath = path.join(outDir, filename);
	console.log(`Writing ${outPath}`);
	await fs.writeFile(outPath, buffer);
}

db: {
	gltfs: {
		const data = `${[...canonicalNameToGltfFile]
			.map(
				([canonicalName]) =>
					`export { default as ${getVariableName(
						canonicalName,
					)} } from './${canonicalName}.js';\n`,
			)
			.join('')}`;
		const outPath = path.join(outDir, 'gltfs.db.ts');
		console.log(`Writing ${outPath}`);
		await fs.writeFile(outPath, data);
	}

	instances: {
		const data = `export interface Instance {\n\tposition: [x: number, y: number, z: number];\n\trotation: [x: number, y: number, z: number, w: number];\n\tscale: [x: number, y: number, z: number];\n}\n\n${[
			...canonicalNameToGltfInstances,
		]
			.map(
				([canonicalName, instances]) =>
					`export const ${getVariableName(
						canonicalName,
					)}: Instance[] = ${JSON.stringify(instances)};\n`,
			)
			.join('')}`;
		const outPath = path.join(outDir, 'instances.db.ts');
		console.log(`Writing ${outPath}`);
		await fs.writeFile(outPath, data);
	}

	index: {
		const data = `export * as gltfs from './gltfs.db.js';\nexport * as instances from './instances.db.js';\n`;
		const outPath = path.join(outDir, 'index.ts');
		console.log(`Writing ${outPath}`);
		await fs.writeFile(outPath, data);
	}
}
