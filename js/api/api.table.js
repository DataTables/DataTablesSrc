

(/** @lends <global> */function() {

var _Api = DataTable.Api;


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
_Api.register( 'tables()', function ( selector ) {
	// A new instance is created if there was a selector specified
	return selector ?
		new _Api( _table_selector( selector, this.context ) ) :
		this;
} );


_Api.register( 'table()', function ( selector ) {
	var tables = this.tables( selector );
	var ctx = tables.context;

	// Truncate to the first matched table
	if ( ctx.length ) {
		ctx.length = 1;
	}

	return tables;
} );


_Api.registerPlural( 'tables().nodes()', 'table().node()' , function () {
	return this.iterator( 'table', function ( ctx ) {
		return ctx.nTable;
	} );
} );


_Api.registerPlural( 'tables().body()', 'table().body()' , function () {
	return this.iterator( 'table', function ( ctx ) {
		return ctx.nTBody;
	} );
} );


_Api.registerPlural( 'tables().head()', 'table().head()' , function () {
	return this.iterator( 'table', function ( ctx ) {
		return ctx.nTHead;
	} );
} );


_Api.registerPlural( 'tables().foot()', 'table().foot()' , function () {
	return this.iterator( 'table', function ( ctx ) {
		return ctx.nTFoot;
	} );
} );


}());

