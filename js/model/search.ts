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
	 * Applied search term
	 */
	search: SearchInput;

	/**
	 * Flag to indicate if the search term should be interpreted as a
	 * regular expression (true) or not (false) and therefore and special
	 * regex characters escaped.
	 */
	regex: boolean;

	/**
	 * Flag to indicate if DataTables is to use its smart filtering or not.
	 */
	smart: boolean;

	/**
	 * Flag to indicate if DataTables should only trigger a search when
	 * the return key is pressed.
	 */
	return: boolean;
}

/**
 * Template object for the way in which DataTables holds information about
 * search information for the global filter and individual column filters.
 */
export default {
	/**
	 * Flag to whether or not the filtering should be case-insensitive
	 */
	caseInsensitive: true,

	/**
	 * Applied search term
	 */
	search: '',

	/**
	 * Flag to indicate if the search term should be interpreted as a
	 * regular expression (true) or not (false) and therefore and special
	 * regex characters escaped.
	 */
	regex: false,

	/**
	 * Flag to indicate if DataTables is to use its smart filtering or not.
	 */
	smart: true,

	/**
	 * Flag to indicate if DataTables should only trigger a search when
	 * the return key is pressed.
	 */
	return: false,
} as SearchOptions;
