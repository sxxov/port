import type { EffectComposer } from 'postprocessing';
import type { PostProcessingEffectMap } from './PostProcessingEffectMap';
import type { Store } from '@sxxov/ut/store';

export interface PostProcessingContext {
	composer: EffectComposer;
	effectMap: Store<PostProcessingEffectMap>;
}
