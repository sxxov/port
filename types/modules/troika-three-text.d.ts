/* eslint-disable @typescript-eslint/naming-convention */
declare module 'troika-three-text' {
	import { Mesh, type Vector2, type Vector3, type Texture } from 'three';

	/**
	 * Preload a given font and optionally pre-generate glyph SDFs for one or
	 * more character sequences. This can be useful to avoid long pauses when
	 * first showing text in a scene, by preloading the needed fonts and glyphs
	 * up front along with other assets.
	 *
	 * @param options - An object containing preload options.
	 * @param options.font - URL of the font file to preload. If not given, the
	 *   default font will be loaded.
	 * @param options.characters - One or more character sequences for which to
	 *   pre- generate glyph SDFs. Note that this will honor ligature
	 *   substitution, so you may need to specify ligature sequences in addition
	 *   to their individual characters to get all possible glyphs, e.g. `["t",
	 *   "h", "th"]` to get the "t" and "h" glyphs plus the "th" ligature.
	 * @param options.sdfGlyphSize - The size at which to prerender the SDF
	 *   textures for the specified `characters`.
	 * @param callback - A function that will be called when the preloading is
	 *   complete.
	 */
	export function preloadFont(
		options: {
			font?: string;
			characters: string | string[];
			sdfGlyphSize: number;
		},
		callback: (result: TroikaTextRenderInfo) => void,
	): void;

	export interface TroikaTextRenderInfo {
		parameters: TypesetParams;
		sdfTexture: Texture;
		sdfGlyphSize: number;
		sdfExponent: number;
		glyphBounds: Float32Array;
		glyphAtlasIndices: number[];
		glyphColors?: Uint8Array;
		caretPositions?: Float32Array;
		caretHeight?: number;
		ascender: number;
		descender: number;
		capHeight: number;
		xHeight: number;
		lineHeight: number;
		topBaseline: number;
		blockBounds: number[];
		visibleBounds: number[];
		chunkedBounds: {
			start: number;
			end: number;
			rect: number[];
		}[];
		timings: {
			quads?: number;
			sdf?: Record<number, number>;
			sdfTotal?: number;
			total?: number;
		};
	}

	export class Text extends Mesh {
		constructor();

		text: string;
		anchorX: number | string;
		anchorY: number | string;
		curveRadius: number;
		direction: string;
		font: string | null;
		unicodeFontsURL: string | null;
		fontSize: number;
		fontWeight: number | string;
		fontStyle: string;
		lang: string;
		letterSpacing: number;
		lineHeight: number | string;
		maxWidth: number;
		overflowWrap: string;
		textAlign: string;
		textIndent: number;
		whiteSpace: string;

		material: THREE.Material | THREE.Material[];
		color: string | number | THREE.Color | null;
		colorRanges: Record<number, string | number | THREE.Color> | null;
		outlineWidth: number | string;
		outlineColor: string | number | THREE.Color;
		outlineOpacity: number;
		outlineBlur: number | string;
		outlineOffsetX: number | string;
		outlineOffsetY: number | string;
		strokeWidth: number | string;
		strokeColor: string | number | THREE.Color;
		strokeOpacity: number;
		fillOpacity: number;
		depthOffset: number;
		clipRect: [number, number, number, number] | null;
		orientation: string;
		glyphGeometryDetail: number;
		sdfGlyphSize: number | null;
		gpuAccelerateSDF: boolean;
		debugSDF: boolean;

		sync(callback?: () => void): void;
		localPositionToTextCoords(position: Vector3, target?: Vector2): Vector2;
		worldPositionToTextCoords(position: Vector3, target?: Vector2): Vector2;

		textRenderInfo: TroikaTextRenderInfo;

		dispose(): void;
	}
}
