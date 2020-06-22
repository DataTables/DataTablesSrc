
/**
 * Selector for HTML tables. Apply the given selector to the give array of
 * DataTables settings objects.
 *
 * @param {string|integer} [selector] jQuery selector string or integer
 * @param  {array} Array of DataTables settings objects to be filtered
 * @return {array}
 * @ignore
 */
var __table_selector = function ( selector, a )
{
	if ( Array.isArray(selector) ) {
		return $.map( selector, function (item) {
			return __table_selector(item, a);
		} );
	}

	// Integer is used to pick out a table by index
	if ( typeof selector === 'number' ) {
		return [ a[ selector ] ];
	}

	// Perform a jQuery selector on the table nodes
	var nodes = $.map( a, function (el, i) {
		return el.nTable;
	} );

	return $(nodes)
		.filter( selector )
		.map( function (i) {
			// Need to translate back from the table node to the settings
			var idx = $.inArray( this, nodes );
			return a[ idx ];
		} )
		.toArray();
};



/**
 * Context selector for the API's context (i.e. the tables the API instance
 * refers to.
 *
 * @name    DataTable.Api#tables
 * @param {string|integer} [selector] Selector to pick which tables the iterator
 *   should operate on. If not given, all tables in the current context are
 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
 *   select multiple tables or as an integer to select a single table.
 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
 */
_api_register( 'tables()', function ( selector ) {
	// A new instance is created if there was a selector specified
	return selector !== undefined && selector !== null ?
		new _Api( __table_selector( selector, this.context ) ) :
		this;
} );


_api_register( 'table()', function ( selector ) {
	var tables = this.tables( selector );
	var ctx = tables.context;

	// Truncate to the first matched table
	return ctx.length ?
		new _Api( ctx[0] ) :
		tables;
} );


_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
	return this.iterator( 'table', function ( ctx ) {
		return ctx.nTable;
	}, 1 );
} );


_api_registerPlural( 'tables().body()', 'table().body()' , function () {
	return this.iterator( 'table', function ( ctx ) {
		return ctx.nTBody;
	}, 1 );
} );


_api_registerPlural( 'tables().header()', 'table().header()' , function () {
	return this.iterator( 'table', function ( ctx ) {
		return ctx.nTHead;
	}, 1 );
} );


_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
	return this.iterator( 'table', function ( ctx ) {
		return ctx.nTFoot;
	}, 1 );
} );


_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
	return this.iterator( 'table', function ( ctx ) {
		return ctx.nTableWrapper;
	}, 1 );
} );

