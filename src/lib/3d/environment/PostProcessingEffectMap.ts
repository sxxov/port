import type * as p from 'postprocessing';

// https://stackoverflow.com/a/69019874
type EntriesType =
	| [PropertyKey, unknown][]
	| readonly (readonly [PropertyKey, unknown])[];
// https://stackoverflow.com/a/50375286
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I,
) => void
	? I
	: never;
type LastOf<T> = UnionToIntersection<
	T extends any ? () => T : never
> extends () => infer R
	? R
	: never;
type Push<T extends any[], V> = [...T, V];
type TuplifyUnion<
	T,
	L = LastOf<T>,
	N = [T] extends [never] ? true : false,
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;
type UnionObjectFromArrayOfPairs<Arr extends EntriesType> =
	Arr extends (infer R)[]
		? R extends [infer K, infer V]
			? { [prop in K & PropertyKey]: V }
			: never
		: never;
type MergeIntersectingObjects<O> = { [key in keyof O]: O[key] };
type FromEntries<Arr extends EntriesType> = MergeIntersectingObjects<
	UnionToIntersection<UnionObjectFromArrayOfPairs<Arr>>
>;
type EffectKeys = Extract<keyof typeof p, `${string}Effect`>;

type StrictCase<S extends string> = S extends `${infer P1 extends
	Uppercase<string>}${infer P2 extends Uppercase<string>}${infer P3}`
	? `${Lowercase<P1>}${StrictCase<`${P2}${P3}`>}`
	: S extends `${infer P1}${infer P2}`
	? P2 extends ''
		? Lowercase<P1>
		: `${P1}${StrictCase<P2>}`
	: S;
type StrictPascalCase<S extends string> = Capitalize<StrictCase<S>>;
type StrictCamelCase<S extends string> = Uncapitalize<StrictCase<S>>;

type EffectCombination<K extends EffectKeys> = K extends `${infer Name}Effect`
	? [StrictCamelCase<Name>, InstanceType<(typeof p)[K]> | undefined]
	: never;
type EffectCombinations = EffectCombination<EffectKeys>;

export type PostProcessingEffectMap = Partial<
	FromEntries<TuplifyUnion<EffectCombinations>>
>;
