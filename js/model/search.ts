import util from '../util';

export type SearchInput<T = any> =
	| string
	| RegExp
	| ((
			data: string | null,
			rowData: T,
			rowIdx: number,
			columnIdx: number[] | number
	  ) => boolean);

export interface SearchOptions {
	/**
	 * Start the matching from the start of a word (true), or anywhere in the
	 * string to search (false).
	 */
	boundary: boolean;

	/**
	 * Flag to whether or not the filtering should be case-insensitive
	 */
	caseInsensitive: boolean;

	/**
	 * This option modifies the search to perform an exact match (string based)
	 * on the values in the table
	 */
	exact: boolean;

	/**
	 * Flag to indicate if the search term should be interpreted as a
	 * regular expression (true) or not (false) and therefore and special
	 * regex characters escaped.
	 */
	regex: boolean;

	/**
	 * Flag to indicate if DataTables should only trigger a search when
	 * the return key is pressed.
	 */
	return: boolean;

	/**
	 * Flag to indicate if DataTables is to use its smart filtering or not.
	 */
	smart: boolean;
}

/**
 * Internal object 
 */
export interface SearchObject extends SearchOptions {
	/**
	 * List of columns that should be included in the search.
	 */
	columns: number[] | null;

	/**
	 * Applied search term
	 */
	term: SearchInput;
}

export const defaults: SearchObject = {
	boundary: false,
	caseInsensitive: true,
	columns: null,
	exact: false,
	regex: false,
	return: false,
	term: '',
	smart: true
};

/**
 * Create a new search options object
 *
 * @param parts Values to assign, otherwise the defaults will be used
 * @returns New object
 */
export default function create(
	parts: Partial<SearchOptions> = {}
): SearchObject {
	return util.object.assignDeep({}, defaults, parts);
}
