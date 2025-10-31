import * as is from './is';

/**
 * Object iteration function, executing a callback for each key in the object
 *
 * @param input Input object
 * @param fn Function to execute
 */
export function each<T>(
	input: Record<string, T> | null,
	fn: (key: string, val: T, counter: number) => void
): void {
	if (!input) {
		return;
	}

	let keys = Object.keys(input);

	for (let i = 0; i < keys.length; i++) {
		let key = keys[i];

		fn(key, input[key] as T, i);
	}
}

/**
 * Merge the contents of two or more objects into the first object.
 *
 * @param out Object to be assigned the properties
 * @param inputs Objects to take the values from
 * @returns The `output`, just for convenience - output === the return.
 */
export function assign<T>(
	out: Record<string, any>,
	...inputs: Array<Record<string, any>>
): T {
	return Object.assign(out, ...inputs);
}

/**
 * Deep merge the contents of two or more objects into the first object. This
 * breaks references for both objects and array.
 *
 * @param out Object to be assigned the properties
 * @param inputs Objects to take the values from
 * @returns The `output`, just for convenience - output === the return.
 */
export function assignDeep<T>(
	out: Record<string, any>,
	...inputs: Array<Record<string, any>>
): T {
	if (!out) {
		return {} as T;
	}

	for (let i = 0; i < inputs.length; i++) {
		let input = inputs[i];

		if (!input) {
			continue;
		}

		for (const [key, value] of Object.entries(input)) {
			if (Array.isArray(value)) {
				if (!Array.isArray(out[key])) {
					out[key] = [];
				}

				assignDeep(out[key], value);
			}
			else if (is.plainObject(value)) {
				if (!is.plainObject(out[key])) {
					out[key] = {};
				}

				assignDeep(out[key], value);
			}
			else {
				out[key] = input[key];
			}
		}
	}

	return out as T;
}

/**
 * Deep merge objects, but shallow copy arrays. The reason we need to do this,
 * is that we don't want to deep copy array init values (such as aaSorting)
 * since the dev wouldn't be able to override them, but we do want to deep copy
 * arrays.
 *
 * @param out Object to extend
 * @param extender Object from which the properties will be applied to out
 * @param breakRefs If true, then arrays will be sliced to take an independent
 *   copy with the exception of the `data` or `aaData` parameters if they are
 *   present. This is so you can pass in a collection to DataTables and have
 *   that used as your data source without breaking the references
 * @returns out Reference, just for convenience - out === the return.
 * @todo This doesn't take account of arrays inside the deep copied objects.
 */
export function assignDeepObjects<T>(
	out: Record<string, any>,
	extender: Record<string, any>,
	breakRefs: boolean = false
): T {
	let val;

	for (let prop in extender) {
		if (Object.prototype.hasOwnProperty.call(extender, prop)) {
			val = extender[prop];

			if (is.plainObject(val)) {
				if (!is.plainObject(out[prop])) {
					out[prop] = {};
				}

				assignDeep(out[prop], val);
			}
			else if (
				breakRefs &&
				prop !== 'data' &&
				prop !== 'aaData' &&
				Array.isArray(val)
			) {
				out[prop] = val.slice();
			}
			else {
				out[prop] = val;
			}
		}
	}

	return out as T;
}
