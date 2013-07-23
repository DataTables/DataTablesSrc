

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
 *  @param {node} table The `table` node to check if it is a DataTable or not
 *    (note that other node types can be passed in, but will always return
 *    false).
 *  @returns {boolean} true the table given is a DataTable, or false otherwise
 *  @static
 *  @dtopt API-Static
 *
 *  @example
 *    var ex = document.getElementById('example');
 *    if ( ! $.fn.DataTable.isDataTable( ex ) ) {
 *      $(ex).dataTable();
 *    }
 */
DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
{
	var o = DataTable.settings;

	for ( var i=0 ; i<o.length ; i++ ) {
		if ( o[i].nTable === table || o[i].nScrollHead === table || o[i].nScrollFoot === table ) {
			return true;
		}
	}

	return false;
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
 *    $.each( $.fn.dataTable.fnTables(true), function () {
 *      $(table).DataTable().columns.adjust();
 *    } );
 */
DataTable.tables = DataTable.fnTables = function ( visible )
{
	var out = [];

	jQuery.each( DataTable.settings, function (i, o) {
		if ( !visible || (visible === true && $(o.nTable).is(':visible')) ) {
			out.push( o.nTable );
		}
	} );

	return out;
};

