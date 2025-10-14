
import { unique } from "../util/array";
import * as data from '../util/data';
import * as string from '../util/string';
import * as timer from '../util/timer';


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
	diacritics: string.normalize,

	debounce: timer.debounce,

	throttle: timer.throttle,

	escapeRegex: string.escapeRegex,

	set: data.set,

	get: data.get,

	stripHtml: string.stripHtml,

	escapeHtml: string.escapeHtml,

	unique: unique
};

export default util;