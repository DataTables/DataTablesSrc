
/*
 * This is really a good bit rubbish this method of exposing the internal methods
 * publicly... - To be fixed in 2.0 using methods on the prototype
 */


/**
 * Create a wrapper function for exporting an internal functions to an external API.
 *  @param {string} fn API function name
 *  @returns {function} wrapped function
 *  @memberof DataTable#internal
 */
function _fnExternApiFunc (fn)
{
	return function() {
		var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
			Array.prototype.slice.call(arguments)
		);
		return DataTable.ext.internal[fn].apply( this, args );
	};
}


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

