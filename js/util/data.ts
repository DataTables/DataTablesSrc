import * as is from './is';
import * as object from './object';
import { GetFunction, PlainObject, SetFunction } from './types';

// Private variable that is used to match action syntax in the data property object
const __reArray = /\[.*?\]$/;
const __reFn = /\(\)$/;

/**
 * Split string on periods, taking into account escaped periods
 *
 * @param str String to split
 * @return Split string
 */
function splitObjNotation(str: string) {
	const parts = str.match(/(\\.|[^.])+/g) || [''];

	return parts.map(function (s) {
		return s.replace(/\\\./g, '.');
	});
}

/**
 * Create a function that will read data a common data point from different (but same structure)
 * data objects. This is primarily used to get data for a specific cell in a single column, but it
 * can also be used in other places, such as when using JSON notation.
 *
 * @param dataPoint The data point to get
 * @returns Function to get a data point's value from a source.
 */
export function get(dataPoint: string | number | null | GetFunction | PlainObject): GetFunction {
	if (dataPoint === null) {
		// Give an empty string for rendering / sorting etc
		return function (data) {
			// type, row and meta also passed, but not used
			return data;
		};
	}
	else if (typeof dataPoint === 'function') {
		return function (data, type, row, meta) {
			return dataPoint(data, type, row, meta);
		};
	}
	else if (
		typeof dataPoint === 'string' &&
		(dataPoint.indexOf('.') !== -1 ||
			dataPoint.indexOf('[') !== -1 ||
			dataPoint.indexOf('(') !== -1)
	) {
		/* If there is a . in the source string then the data source is in a
		 * nested object so we loop over the data for each level to get the next
		 * level down. On each loop we test for undefined, and if found immediately
		 * return. This allows entire objects to be missing and sDefaultContent to
		 * be used if defined, rather than throwing an error
		 */
		let fetchData = function (data: any, type: string, src: string) {
			let arrayNotation, funcNotation, out, innerSrc;

			if (src !== '') {
				let a = splitObjNotation(src);

				for (let i = 0, iLen = a.length; i < iLen; i++) {
					// Check if we are dealing with special notation
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);

					if (arrayNotation) {
						// Array notation
						a[i] = a[i].replace(__reArray, '');

						// Condition allows simply [] to be passed in
						if (a[i] !== '') {
							data = data[a[i]];
						}
						out = [];

						// Get the remainder of the nested object to get
						a.splice(0, i + 1);
						innerSrc = a.join('.');

						// Traverse each entry in the array getting the properties requested
						if (Array.isArray(data)) {
							for (let j = 0, jLen = data.length; j < jLen; j++) {
								out.push(fetchData(data[j], type, innerSrc));
							}
						}

						// If a string is given in between the array notation indicators, that
						// is used to join the strings together, otherwise an array is returned
						let join = arrayNotation[0].substring(1, arrayNotation[0].length - 1);
						data = join === '' ? out : out.join(join);

						// The inner call to fetchData has already traversed through the remainder
						// of the source requested, so we exit from the loop
						break;
					}
					else if (funcNotation) {
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[a[i]]();
						continue;
					}

					if (data === null || data[a[i]] === null) {
						return null;
					}
					else if (data === undefined || data[a[i]] === undefined) {
						return undefined;
					}

					data = data[a[i]];
				}
			}

			return data;
		};

		return function (data, type) {
			// row and meta also passed, but not used
			return fetchData(data, type!, dataPoint);
		};
	}
	else if (is.plainObject(dataPoint)) {
		// Build an object of get functions, and wrap them in a single call
		let o: {[key: string]: GetFunction} = {};

		object.each(dataPoint as PlainObject, function (key, val) {
			if (val) {
				o[key] = get(val as string);
			}
		});

		return function (data, type, row, meta) {
			let t = o[type!] || o._;

			return t !== undefined ? t(data, type, row, meta) : data;
		};
	}
	else {
		// Array or flat object mapping
		return function (data) {
			// row and meta also passed, but not used
			return data[dataPoint as string | number];
		};
	}
}

/**
 * Write a value into an existing data store
 *
 * @param dataPoint The data point to write to
 */
export function set(dataPoint: string | number | null | GetFunction | PlainObject): SetFunction {
	if (dataPoint === null) {
		// Nothing to do when the data source is null
		return function () {};
	}
	else if (typeof dataPoint === 'function') {
		return function (data, val, meta) {
			dataPoint(data, 'set', val, meta);
		};
	}
	else if (
		typeof dataPoint === 'string' &&
		(dataPoint.indexOf('.') !== -1 ||
			dataPoint.indexOf('[') !== -1 ||
			dataPoint.indexOf('(') !== -1)
	) {
		// Like the get, we need to get data from a nested object
		let setData: SetFunction = function (data, val, src) {
			let a = splitObjNotation(src),
				b;
			let aLast = a[a.length - 1];
			let arrayNotation, funcNotation, o, innerSrc;

			for (let i = 0, iLen = a.length - 1; i < iLen; i++) {
				// Protect against prototype pollution
				if (a[i] === '__proto__' || a[i] === 'constructor') {
					throw new Error('Cannot set prototype values');
				}

				// Check if we are dealing with an array notation request
				arrayNotation = a[i].match(__reArray);
				funcNotation = a[i].match(__reFn);

				if (arrayNotation) {
					a[i] = a[i].replace(__reArray, '');
					data[a[i]] = [];

					// Get the remainder of the nested object to set so we can recurse
					b = a.slice();
					b.splice(0, i + 1);
					innerSrc = b.join('.');

					// Traverse each entry in the array setting the properties requested
					if (Array.isArray(val)) {
						for (let j = 0, jLen = val.length; j < jLen; j++) {
							o = {};
							setData(o, val[j], innerSrc);
							data[a[i]].push(o);
						}
					}
					else {
						// We've been asked to save data to an array, but it
						// isn't array data to be saved. Best that can be done
						// is to just save the value.
						data[a[i]] = val;
					}

					// The inner call to setData has already traversed through the remainder
					// of the source and has set the data, thus we can exit here
					return;
				}
				else if (funcNotation) {
					// Function call
					a[i] = a[i].replace(__reFn, '');
					data = data[a[i]](val);
				}

				// If the nested object doesn't currently exist - since we are
				// trying to set the value - create it
				if (data[a[i]] === null || data[a[i]] === undefined) {
					data[a[i]] = {};
				}
				data = data[a[i]];
			}

			// Last item in the input - i.e, the actual set
			if (aLast.match(__reFn)) {
				// Function call
				data = data[aLast.replace(__reFn, '')](val);
			}
			else {
				// If array notation is used, we just want to strip it and use the property name
				// and assign the value. If it isn't used, then we get the result we want anyway
				data[aLast.replace(__reArray, '')] = val;
			}
		};

		return function (data, val) {
			// meta is also passed in, but not used
			return setData(data, val, dataPoint);
		};
	}
	else if (is.plainObject(dataPoint)) {
		/* Unlike get, only the underscore (global) option is used for for
		 * setting data since we don't know the type here. This is why an object
		 * option is not documented for `mData` (which is read/write), but it is
		 * for `mRender` which is read only.
		 */
		return set((dataPoint as PlainObject)._ as string);
	}
	else {
		// Array or flat object mapping
		return function (data, val) {
			// meta is also passed in, but not used
			data[dataPoint as string | number] = val;
		};
	}
}
