import ajax from './ajax';
import * as array from './array';
import * as conv from './conv';
import * as data from './data';
import external from './external';
import * as is from './is';
import * as object from './object';
import * as regex from './regex';
import * as string from './string';
import * as timer from './timer';
import * as version from './version';

// Note that the aliased properties are for compatibility with DataTables 2-
// which had a set of `util` functions.

export default {
	ajax,
	array,
	conv,
	data,

	/** @see timer.debounce */
	debounce: timer.debounce,

	/** @see string.normalize */
	diacritics: string.normalize,

	/** @see string.escapeHtml */
	escapeHtml: string.escapeHtml,

	/** @see string.escapeRegex */
	escapeRegex: string.escapeRegex,

	external,

	/** @see data.get */
	get: data.get,

	is,
	object,
	regex,

	/** @see data.set */
	set: data.set,

	string,

	/** @see string.stripHtml */
	stripHtml: string.stripHtml,

	/** @see timer.throttle */
	throttle: timer.throttle,

	timer,

	/** @see array.unique */
	unique: array.unique,

	version
};
