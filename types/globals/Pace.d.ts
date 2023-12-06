import type { OrAnyNumber } from '@sxxov/ut/types';
import type { Class } from 'type-fest';

declare global {
	namespace Pace {
		export function start(): void;
		export function restart(): void;
		export function stop(): void;
		export function track(fn: () => void): void;
		export function ignore(fn: () => void): void;
		export function once(event: EventType, handler: () => void): void;
		export function on(event: EventType, handler: () => void): void;
		export function off(event: EventType, handler: () => void): void;

		export const options: Options;
		export const sources: (ElementSource | ProgressSource)[];
		export const running: boolean;

		type EventType = 'start' | 'stop' | 'restart' | 'done' | 'hide';

		interface ElementSource {
			elements: HTMLElement[];
		}

		interface ProgressSource {
			progress: OrAnyNumber<0 | 100>;
		}

		interface Options {
			className: string;
			catchupTime: number;
			initialRate: number;
			minTime: number;
			ghostTime: number;
			maxProgressPerFrame: number;
			easeFactor: number;
			startOnPageLoad: boolean;
			restartOnPushState: boolean;
			restartOnRequestAfter: number | boolean;
			target: string;
			elements:
				| {
						checkInterval?: number;
						selectors: string[];
				  }
				| boolean;
			eventLag:
				| {
						minSamples?: number;
						sampleCount?: number;
						lagThreshold?: number;
				  }
				| boolean;
			ajax:
				| {
						trackMethods?: string[];
						trackWebSockets?: boolean;
						ignoreURLs?: string[];
				  }
				| boolean;
			extraSources: Class<ElementSource | ProgressSource>[];
		}
	}

	declare const Pace: typeof Pace;
}
