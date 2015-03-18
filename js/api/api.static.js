

/**
 * Provide a common method for plug-ins to check the version of DataTables being
 * used, in order to ensure compatibility.
 *
 *  @param {string} version Version string to check for, in the format "X.Y.Z".
 *    Note that the formats "X" and "X.Y" are also acceptable.
 *  @returns {boolean} true if this version of DataTables is greater or equal to
 *    the required version, or false if this version of DataTales is not
 *    suitable
 *  @static
 *  @dtopt API-Static
 *
 *  @example
 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
 */
DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
{
	var aThis = DataTable.version.split('.');
	var aThat = version.split('.');
	var iThis, iThat;

	for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
		iThis = parseInt( aThis[i], 10 ) || 0;
		iThat = parseInt( aThat[i], 10 ) || 0;

		// Parts are the same, keep comparing
		if (iThis === iThat) {
			continue;
		}

		// Parts are different, return immediately
		return iThis > iThat;
	}

	return true;
};


/**
 * Check if a `<table>` node is a DataTable table already or not.
 *
 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
 *      selector for the table to test. Note that if more than more than one
 *      table is passed on, only the first will be checked
 *  @returns {boolean} true the table given is a DataTable, or false otherwise
 *  @static
 *  @dtopt API-Static
 *
 *  @example
 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
 *      $('#example').dataTable();
 *    }
 */
DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
{
	var t = $(table).get(0);
	var is = false;

	$.each( DataTable.settings, function (i, o) {
		var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
		var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;

		if ( o.nTable === t || head === t || foot === t ) {
			is = true;
		}
	} );

	return is;
};


/**
 * Get all DataTable tables that have been initialised - optionally you can
 * select to get only currently visible tables.
 *
 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
 *    or visible tables only.
 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
 *    DataTables
 *  @static
 *  @dtopt API-Static
 *
 *  @example
 *    $.each( $.fn.dataTable.tables(true), function () {
 *      $(table).DataTable().columns.adjust();
 *    } );
 */
DataTable.tables = DataTable.fnTables = function ( visible )
{
	return $.map( DataTable.settings, function (o) {
		if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
			return o.nTable;
		}
	} );
};


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
DataTable.util = {
	/**
	 * Throttle the calls to a function. Arguments and context are maintained
	 * for the throttled function.
	 *
	 * @param {function} fn Function to be called
	 * @param {integer} freq Call frequency in mS
	 * @return {function} Wrapped function
	 */
	throttle: _fnThrottle,


	/**
	 * Escape a string such that it can be used in a regular expression
	 *
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 */
	escapeRegex: _fnEscapeRegex
};


/**
 * Convert from camel case parameters to Hungarian notation. This is made public
 * for the extensions to provide the same ability as DataTables core to accept
 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
 * parameters.
 *
 *  @param {object} src The model object which holds all parameters that can be
 *    mapped.
 *  @param {object} user The object to convert from camel case to Hungarian.
 *  @param {boolean} force When set to `true`, properties which already have a
 *    Hungarian value in the `user` object will be overwritten. Otherwise they
 *    won't be.
 */
DataTable.camelToHungarian = _fnCamelToHungarian;

