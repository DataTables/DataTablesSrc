

/**
 * Get the current page index.
 *
 * @return {integer} Current page index (zero based)
 *//**
 * Set the current page.
 *
 * Note that if you attempt to show a page which does not exist, DataTables will
 * not throw an error, but rather reset the paging.
 *
 * @param {integer|string} action The paging action to take. This can be one of:
 *  * `integer` - The page index to jump to
 *  * `string` - An action to take:
 *    * `first` - Jump to first page.
 *    * `next` - Jump to the next page
 *    * `previous` - Jump to previous page
 *    * `last` - Jump to the last page.
 * @returns {DataTables.Api} this
 */
_api_register( 'page()', function ( action ) {
	if ( action === undefined ) {
		return this.page.info().page; // not an expensive call
	}

	// else, have an action to take on all tables
	return this.iterator( 'table', function ( settings ) {
		_fnPageChange( settings, action );
	} );
} );


/**
 * Paging information for the first table in the current context.
 *
 * If you require paging information for another table, use the `table()` method
 * with a suitable selector.
 *
 * @return {object} Object with the following properties set:
 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
 *  * `pages` - Total number of pages
 *  * `start` - Display index for the first record shown on the current page
 *  * `end` - Display index for the last record shown on the current page
 *  * `length` - Display length (number of records). Note that generally `start
 *    + length = end`, but this is not always true, for example if there are
 *    only 2 records to show on the final page, with a length of 10.
 *  * `recordsTotal` - Full data set length
 *  * `recordsDisplay` - Data set length once the current filtering criterion
 *    are applied.
 */
_api_register( 'page.info()', function () {
	if ( this.context.length === 0 ) {
		return undefined;
	}

	var
		settings   = this.context[0],
		start      = settings._iDisplayStart,
		len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
		visRecords = settings.fnRecordsDisplay(),
		all        = len === -1;

	return {
		"page":           all ? 0 : Math.floor( start / len ),
		"pages":          all ? 1 : Math.ceil( visRecords / len ),
		"start":          start,
		"end":            settings.fnDisplayEnd(),
		"length":         len,
		"recordsTotal":   settings.fnRecordsTotal(),
		"recordsDisplay": visRecords,
		"serverSide":     _fnDataSource( settings ) === 'ssp'
	};
} );


/**
 * Get the current page length.
 *
 * @return {integer} Current page length. Note `-1` indicates that all records
 *   are to be shown.
 *//**
 * Set the current page length.
 *
 * @param {integer} Page length to set. Use `-1` to show all records.
 * @returns {DataTables.Api} this
 */
_api_register( 'page.len()', function ( len ) {
	// Note that we can't call this function 'length()' because `length`
	// is a JavaScript property of functions which defines how many arguments
	// the function expects.
	if ( len === undefined ) {
		return this.context.length !== 0 ?
			this.context[0]._iDisplayLength :
			undefined;
	}

	// else, set the page length
	return this.iterator( 'table', function ( settings ) {
		_fnLengthChange( settings, len );
	} );
} );

