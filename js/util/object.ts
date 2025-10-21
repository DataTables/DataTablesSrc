import { PlainObject, Primitive } from './types';


/**
 * Object iteration function, executing a callback for each key in the object
 *
 * @param input Input object
 * @param fn Function to execute
 */
export function each<T=Primitive>(
	input: PlainObject | null,
	fn: (key: string, val: T, counter: number) => void
): void {
	if (!input) {
		return;
	}

	let keys = Object.keys(input);

	for (let i=0 ; i<keys.length ; i++) {
		let key = keys[i];

		fn(key, input[key] as T, i);
	}
}
