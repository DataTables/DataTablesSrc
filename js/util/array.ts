/**
 * Determine if all values in the array are unique. This means we can short
 * cut the _unique method at the cost of a single loop. A sorted array is used
 * to easily check the values.
 *
 * @param  src Source array
 * @return true if all unique, false otherwise
 */
function allUnique(src: any[]) {
	if (src.length < 2) {
		return true;
	}

	var sorted = src.slice().sort();
	var last = sorted[0];

	for (var i = 1, iLen = sorted.length; i < iLen; i++) {
		if (sorted[i] === last) {
			return false;
		}

		last = sorted[i];
	}

	return true;
}

/**
 * Flatten an array
 *
 * Surprisingly this is faster than [].concat.apply
 * https://jsperf.com/flatten-an-array-loop-vs-reduce/2
 *
 * @param out Array to write to
 * @param val Source array, or single value
 * @returns Flattened array
 */
export function flatten(out: any[], val: any) {
	if (Array.isArray(val)) {
		for (var i = 0; i < val.length; i++) {
			flatten(out, val[i]);
		}
	}
	else {
		out.push(val);
	}

	return out;
}

export function intersection(a1: any[], a2: any[]): any[] {
	return a1.filter(item => a2.includes(item));
}

/**
 * Pluck items from an array of objects, or from a nested array of objects
 *
 * @param a Array to get values from
 * @param prop Property to read values from
 * @param prop2 Inner property to get values from if a 2D array
 * @returns Array of read values
 */
export function pluck(a: any[], prop: string, prop2?: string) {
	let out: any[] = [],
		i = 0,
		iLen = a.length;

	// Could have the test in the loop for slightly smaller code, but speed
	// is essential here
	if (prop2 !== undefined) {
		for (; i < iLen; i++) {
			if (a[i] && a[i][prop]) {
				out.push(a[i][prop][prop2]);
			}
		}
	}
	else {
		for (; i < iLen; i++) {
			if (a[i]) {
				out.push(a[i][prop]);
			}
		}
	}

	return out;
}

/**
 * Basically the same as _pluck, but rather than looping over the source array we use `order`
 * as the indexes to pick from the source array
 *
 * @param a Array to get values from
 * @param prop Property to read values from
 * @param prop2 Inner property to get values from if a 2D array
 * @returns Array of read values
 */
export function pluckOrder(
	a: any[],
	order: number[],
	prop: string,
	prop2?: string
) {
	let out: any[] = [],
		i = 0,
		iLen = order.length;

	// Could have the test in the loop for slightly smaller code, but speed
	// is essential here
	if (prop2 !== undefined) {
		for (; i < iLen; i++) {
			if (a[order[i]] && a[order[i]][prop]) {
				out.push(a[order[i]][prop][prop2]);
			}
		}
	}
	else {
		for (; i < iLen; i++) {
			if (a[order[i]]) {
				out.push(a[order[i]][prop]);
			}
		}
	}

	return out;
}

/**
 * Create an array with a list of numbers, in sequence starting from 0 for the length given
 *
 * @param len Array size
 * @returns Array with the sequence of numbers
 */;
export function range(len: number): number[];
/**
 * Create an array with a list of numbers, in sequence from the start to the end numbers given.
 *
 * @param start Start number (inclusive)
 * @param end End number (not inclusive)
 */
export function range(start: number, end: number): number[];
export function range(len: number, start?: number) {
	var out: number[] = [];
	var end;

	if (start === undefined) {
		start = 0;
		end = len;
	}
	else {
		end = start;
		start = len;
	}

	for (var i = start; i < end; i++) {
		out.push(i);
	}

	return out;
}

/**
 * Remove all falsy values from an array
 *
 * @param a Source array
 * @returns A new array, with empty values removed
 */
export function removeEmpty(a: any[]) {
	var out: any[] = [];

	for (var i = 0, iLen = a.length; i < iLen; i++) {
		if (a[i]) {
			// careful - will remove all falsy values!
			out.push(a[i]);
		}
	}

	return out;
}

/**
 * Find the unique elements in a source array.
 *
 * @param src Source array
 * @return Array of unique items
 */
export function unique(src: any[]) {
	if (Array.from && Set) {
		return Array.from(new Set(src));
	}

	if (allUnique(src)) {
		return src.slice();
	}

	// A faster unique method is to use object keys to identify used values,
	// but this doesn't work with arrays or objects, which we must also
	// consider. See jsperf.app/compare-array-unique-versions/4 for more
	// information.
	var out: any[] = [],
		val,
		i,
		iLen = src.length,
		j,
		k = 0;

	again: for (i = 0; i < iLen; i++) {
		val = src[i];

		for (j = 0; j < k; j++) {
			if (out[j] === val) {
				continue again;
			}
		}

		out.push(val);
		k++;
	}

	return out;
}
