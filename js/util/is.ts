import { numToDecimal } from './conv';
import { reFormattedNumeric } from './regex';
import { stripHtml } from './string';

export function arrayLike(test: any) {
	return (
		test && // Exists
		typeof test !== 'string' && // Is not a string
		test.length !== undefined && // Has a length
		test.nodeType === undefined // Is not a text node
	);
}

/**
 * Check if a value is empty or not. Note that a string with `-` is considered
 * empty
 *
 * @param d Value to check
 * @returns `true` if empty, `false` otherwise
 */
export function empty<T>(d: T): boolean {
	return !d || d === true || d === '-' ? true : false;
}

/**
 * Check if a string is HTML. Note that a string without HTML in it can be
 * considered to be HTML still!
 *
 * @todo Can we drop this?
 * @param d
 * @returns
 */
export function html<T>(d: T): boolean {
	return empty(d) || typeof d === 'string';
}

/**
 * Is a string a number surrounded by HTML?
 *
 * @param d Value to check
 * @param decimalPoint Decimal place character
 * @param formatted Consider formatted numbers
 * @param allowEmpty Allow empty to be considered as a number
 * @returns True if a number, null otherwise
 */
export function htmlNum(
	d: any,
	decimalPoint: string,
	formatted: boolean,
	allowEmpty: boolean
) {
	if (allowEmpty && empty(d)) {
		return true;
	}

	// input and select strings mean that this isn't just a number
	if (typeof d === 'string' && d.match(/<(input|select)/i)) {
		return null;
	}

	return !html(d)
		? null
		: num(stripHtml(d), decimalPoint, formatted, allowEmpty)
		? true
		: null;
}

/**
 * Check if a given value is numeric, taking into account if it might be
 * formatted or uses a decimal point that is not a period.
 *
 * @param d Value to check
 * @param decimalPoint DP character
 * @param formatted Allow the number to be formatted or not
 * @param allowEmpty Allow an empty value to be considered a number
 * @returns `true` if numeric
 */
export function num(
	d: any,
	decimalPoint?: string,
	formatted?: boolean,
	allowEmpty?: boolean
): boolean {
	let type = typeof d;

	if (type === 'number' || type === 'bigint') {
		return true;
	}

	// If empty return immediately so there must be a number if it is a
	// formatted string (this stops the string "k", or "kr", etc being detected
	// as a formatted number for currency
	if (allowEmpty && empty(d)) {
		return true;
	}

	if (decimalPoint && type === 'string') {
		d = numToDecimal(d, decimalPoint);
	}

	if (formatted && type === 'string') {
		d = d.replace(reFormattedNumeric, '');
	}

	return !isNaN(parseFloat(d)) && isFinite(d);
}

/**
 * Determine if a value is a plain object or not
 *
 * @param value Value to check
 * @returns true if is a plain object, otherwise false
 */
export function plainObject(value: unknown) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	let proto = Object.getPrototypeOf(value);

	return proto === null || proto === Object.prototype;
}
