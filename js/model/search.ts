/**
 * Template object for the way in which DataTables holds information about
 * search information for the global filter and individual column filters.
 */ 
export default class Search {
	/**
	 * Flag to whether or not the filtering should be case-insensitive
	 */
	public caseInsensitive: boolean = true;

	/**
	 * Applied search term
	 */
	public search: string = '';

	/**
	 * Flag to indicate if the search term should be interpreted as a
	 * regular expression (true) or not (false) and therefore and special
	 * regex characters escaped.
	 */
	public regex: boolean = false;

	/**
	 * Flag to indicate if DataTables is to use its smart filtering or not.
	 */
	public smart: boolean = true;

	/**
	 * Flag to indicate if DataTables should only trigger a search when
	 * the return key is pressed.
	 */
	public return: boolean = false;
}
