
/*
 * This is really a good bit rubbish this method of exposing the internal methods
 * publicly... - To be fixed in 2.0 using methods on the prototype
 */

/**
 * Reference to internal functions for use by plug-in developers. Note that
 * these methods are references to internal functions and are considered to be
 * private. If you use these methods, be aware that they are liable to change
 * between versions.
 *  @namespace
 */
$.extend( DataTable.ext.internal, {
	_fnGetCellData: _fnGetCellData,

	/**
	 * Attach an `api` method to the jQuery instance for the DataTable, so
	 * the DataTables API can be easily accessed.
	 */
	api: function () {
		return new _Api( this ); // executed in jQuery scope
	}
} );

