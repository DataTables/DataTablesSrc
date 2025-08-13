


/**
 * Template object for the way in which DataTables holds information about
 * search information for the global filter and individual column filters.
 *  @namespace
 */
DataTable.models.oSearch = {
	/**
	 * Flag to whether or not the filtering should be case-insensitive
	 */
	"caseInsensitive": true,

	/**
	 * Applied search term
	 */
	"search": "",

	/**
	 * Flag to indicate if the search term should be interpreted as a
	 * regular expression (true) or not (false) and therefore and special
	 * regex characters escaped.
	 */
	"regex": false,

	/**
	 * Flag to indicate if DataTables is to use its smart filtering or not.
	 */
	"smart": true,

	/**
	 * Flag to indicate if DataTables should only trigger a search when
	 * the return key is pressed.
	 */
	"return": false
};

