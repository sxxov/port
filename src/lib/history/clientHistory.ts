import { afterNavigate, goto } from '$app/navigation';
import { UnimplementedError } from '@sxxov/ut/errors';

const stack: URL[] = [];

export const clientHistory = {
	get length() {
		return stack.length;
	},
	get scrollRestoration() {
		return 'auto' as const;
	},
	get state() {
		return null;
	},
	back() {
		if (this.length > 0) {
			stack.pop();

			stack.pop();
			history.back();
		} else void goto('/');
	},
	forward() {
		if (history.length > this.length) {
			history.forward();
		}
	},
	go(delta: number) {
		if (delta === 0) return;

		if (delta < 0)
			if (-delta > this.length) {
				stack.length = 0;
				void goto('/');
			} else {
				stack.length -= -delta;
				stack.pop();
				history.go(delta);
			}
		else
			throw new UnimplementedError(
				'clientHistory.go(delta) where delta > 0',
			);
	},
	pushState(data, _, url) {
		if (!url) return;

		void goto(url);
	},
	replaceState(data, _, url) {
		if (!url) return;

		stack.pop();
		void goto(url, { replaceState: true });
	},
} as const satisfies History;

export const useClientHistoryInitialisation = () => {
	afterNavigate(() => {
		stack.push(new URL(location.href));
	});
};
