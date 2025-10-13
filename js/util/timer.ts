/**
 * Debounce a function
 *
 * @param fn Function to be called
 * @param timeout Call frequency in mS
 * @returns Wrapped function
 */
export function debounce(fn: () => void, freq?: number): () => void;
export function debounce<T1>(fn: (a1: T1) => void, freq?: number): (a1: T1) => void;
export function debounce<T1, T2>(
	fn: (a1: T1, a2: T2) => void,
	freq?: number
): (a1: T1, a2: T2) => void;
export function debounce<T1, T2, T3>(
	fn: (a1: T1, a2: T2, a3: T3) => void,
	timeout?: number
): (a1: T1, a2: T2, a3: T3) => void;
export function debounce<T1 = unknown, T2 = unknown, T3 = unknown>(
	fn: (a1: T1, a2: T2, a3: T3) => void,
	timeout = 250
) {
	let timer: ReturnType<typeof setTimeout>;

	return function (...args: []) {
		clearTimeout(timer);

		timer = setTimeout(() => {
			fn.call(this, ...args);
		}, timeout);
	};
}

/**
 * Throttle the calls to a function. Arguments and context are maintained
 * for the throttled function.
 *
 * @param fn Function to be called
 * @param freq Call frequency in mS
 * @returns Wrapped function
 */
export function throttle(fn: () => void, freq?: number): () => void;
export function throttle<T1>(fn: (a1: T1) => void, freq?: number): (a1: T1) => void;
export function throttle<T1, T2>(
	fn: (a1: T1, a2: T2) => void,
	freq?: number
): (a1: T1, a2: T2) => void;
export function throttle<T1, T2, T3>(
	fn: (a1: T1, a2: T2, a3: T3) => void,
	freq?: number
): (a1: T1, a2: T2, a3: T3) => void;
export function throttle<T1 = unknown, T2 = unknown, T3 = unknown>(
	fn: (a1: T1, a2: T2, a3: T3) => void,
	freq = 200
) {
	let last: number | undefined, timer: ReturnType<typeof setTimeout>;

	return function (...args: []) {
		const now = +new Date();

		if (last && now < last + freq) {
			clearTimeout(timer);

			timer = setTimeout(() => {
				last = undefined;
				fn.call(this, ...args);
			}, freq);
		}
		else {
			last = now;
			fn.call(this, ...args);
		}
	};
}
