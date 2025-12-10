import util from '../util';

export type SearchInput<T = any> =
	| string
	| RegExp
	| ((
			data: string | null,
			rowData: T,
			rowIdx: number,
			columnIdx: number | undefined
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
	 * Applied search term
	 */
	search: SearchInput;

	/**
	 * Flag to indicate if DataTables is to use its smart filtering or not.
	 */
	smart: boolean;
}

export const defaults: SearchOptions = {
	boundary: false,
	caseInsensitive: true,
	exact: false,
	regex: false,
	return: false,
	search: '',
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
): SearchOptions {
	return util.object.assignDeep({}, defaults, parts);
}
