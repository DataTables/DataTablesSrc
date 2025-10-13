
import * as timer from '../util/timer';
import * as data from '../util/data';

import { normalize, stripHtml, escapeHtml, unique } from "../util/internal";

// These functions can be replaced!
var _normalize = normalize;
var _stripHtml = stripHtml;
var _escapeHtml = escapeHtml

// Escape regular expression special characters
var _re_escape_regex = new RegExp(
	'(\\' +
		['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-'].join(
			'|\\'
		) +
		')',
	'g'
);



/**
 * DataTables utility methods
 * 
 * This namespace provides helper methods that DataTables uses internally to
 * create a DataTable, but which are not exclusively used only for DataTables.
 * These methods can be used by extension authors to save the duplication of
 * code.
 *
 *  @namespace
 */
const util = {
	/**
	 * Return a string with diacritic characters decomposed
	 * @param {*} mixed Function or string to normalize
	 * @param {*} both Return original string and the normalized string
	 * @returns String or undefined
	 */
	diacritics: function (mixed, both?) {
		var type = typeof mixed;

		if (type !== 'function') {
			return _normalize(mixed, both);
		}
		_normalize = mixed;
	},

	debounce: timer.debounce,

	throttle: timer.throttle,

	/**
	 * Escape a string such that it can be used in a regular expression
	 *
	 *  @param {string} val string to escape
	 *  @returns {string} escaped string
	 */
	escapeRegex: function ( val ) {
		return val.replace( _re_escape_regex, '\\$1' );
	},

	set: data.set,

	get: data.get,

	stripHtml: function (mixed) {
		var type = typeof mixed;

		if (type === 'function') {
			_stripHtml = mixed;
			return;
		}
		else if (type === 'string') {
			return _stripHtml(mixed);
		}
		return mixed;
	},

	escapeHtml: function (mixed) {
		var type = typeof mixed;

		if (type === 'function') {
			_escapeHtml = mixed;
			return;
		}
		else if (type === 'string' || Array.isArray(mixed)) {
			return _escapeHtml(mixed);
		}
		return mixed;
	},

	unique: unique
};

export default util;