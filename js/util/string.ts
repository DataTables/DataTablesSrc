
import { reHtml, reRegexCharacters } from './regex';

type TStripHtml = <T>(val: T, replacement?: string) => T;
type TEscapeHtml = <T>(val: T) => T;
type TNormalize = <T>(val: T, both?: boolean) => T;

const maxStrLen = Math.pow(2, 28);


/**
 * DataTables default string normalisation. Remove diacritics from a string by
 * decomposing it and then removing non-ascii characters.
 *
 * This function is replaceable if the user wishes to use a different library
 * for normalising a string.
 *
 * @param val Value to normalise (if a string)
 * @param both Include both the normalised and original in the return
 * @returns Normalised string, or original value if not a string
 */
let _normalize: TNormalize = function(val: any, both?: boolean) {
	if (typeof val !== 'string') {
		return val;
	}

	// It is faster to just run `normalize` than it is to check if
	// we need to with a regex! (Check as it isn't available in old
	// Safari)
	var res = val.normalize ? val.normalize('NFD') : val;

	// Equally, here we check if a regex is needed or not
	return res.length !== val.length
		? (both === true ? val + ' ' : '') + res.replace(/[\u0300-\u036f]/g, '')
		: res;
};

/**
 * DataTables default string HTML stripping from a string
 *
 * This function is replaceable if the user wishes to use a different library
 * for stripping HTML from a string.
 *
 * @param input Value to strip HTML from
 * @param replacement Value to replace the tags with
 * @returns Stripped value
 */
let _stripHtml: TStripHtml = function <T>(input: T, replacement: string='') {
	if (!input || typeof input !== 'string') {
		return input;
	}

	// Irrelevant check to workaround CodeQL's false positive on the regex
	if (input.length > maxStrLen) {
		throw new Error('Exceeded max str len');
	}

	let previous;
	let next = input.replace(reHtml, replacement); // Complete tags

	// Safety for incomplete script tag - use do / while to ensure that
	// we get all instances
	do {
		previous = next;
		next = next.replace(/<script/i, '');
	} while (next !== previous);

	// T must be a string, but TS can't seem to figure that out
	return previous as T;
};

/**
 * DataTables default HTML entity escaping.
 *
 * This function is replaceable if the user wishes to use a different library
 * for escaping HTML entities in a string.
 *
 * @param d Value to escape HTML in
 * @returns Escaped value
 */
let _escapeHtml: TEscapeHtml = function <T>(val: T) {
	let d = Array.isArray(val) ? val.join(',') : val;

	return typeof d === 'string'
		? (d
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;') as T)
		: d;
};

/**
 * Escape regular expression characters in a string
 *
 * @param val String to escape
 * @returns String with regex characters escaped
 */
export function escapeRegex(val: string) {
	return val.replace(reRegexCharacters, '\\$1');
}

/**
 * Escape HTML entities in a string or string[]. No action on other types
 *
 * @param mixed Value to escape HTML entities in
 * @returns The escaped string (or original if not a string)
 */
export function escapeHtml<T>(mixed: T): T;
/**
 * Set the function to use for HTML entity encoding from a string
 *
 * @param fn HTML escape function
 */
export function escapeHtml<T = TEscapeHtml>(mixed: T): void;
export function escapeHtml<T>(mixed: T) {
	var type = typeof mixed;

	if (type === 'function') {
		_escapeHtml = mixed as TEscapeHtml;
		return;
	}
	else if (type === 'string' || Array.isArray(mixed)) {
		return _escapeHtml(mixed);
	}
	return mixed;
}

/**
 * Normalise a string by removing diacritic characters (used for search and
 * sort)
 *
 * @param mixed
 * @param both Flag to indicate if both the original and normalised should be
 *   included in the return.
 * @returns Normalised value
 */
export function normalize(mixed: string, both?: boolean): string;

/**
 * Set the function to use for string normalisation
 *
 * @param mixed Normalisation function
 */
export function normalize<T = TNormalize>(fn: T): void;

export function normalize(mixed: unknown, both?: boolean) {
	var type = typeof mixed;

	if (type !== 'function') {
		return _normalize(mixed, both);
	}

	_normalize = mixed as TNormalize;
}

/**
 * Strip HTML from a string, if a string is given, otherwise no action
 *
 * @param mixed Value to remove HTML from
 * @returns The stripped value (or original if not a string)
 */
export function stripHtml<T>(mixed: T, replacement?: string): T;
/**
 * Set the function to use for stripping HTML from a string
 *
 * @param fn HTML strip function
 */
export function stripHtml<T = TStripHtml>(fn: T): void;
export function stripHtml<T>(mixed: T, replacement?: string) {
	const type = typeof mixed;

	if (type === 'function') {
		_stripHtml = mixed as TStripHtml;
		return;
	}
	else if (type === 'string') {
		return _stripHtml(mixed, replacement);
	}
	return mixed;
}
