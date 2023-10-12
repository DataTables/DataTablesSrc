
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
		var result = [];

		selector.forEach(function (sel) {
			var inner = __table_selector(sel, a);

			result.push.apply(result, inner);
		});

		return result.filter( function (item) {
			return item;
		});
	}

	// Integer is used to pick out a table by index
	if ( typeof selector === 'number' ) {
		return [ a[ selector ] ];
	}

	// Perform a jQuery selector on the table nodes
	var nodes = a.map( function (el) {
		return el.nTable;
	} );

	return $(nodes)
		.filter( selector )
		.map( function () {
			// Need to translate back from the table node to the settings
			var idx = nodes.indexOf(this);
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


_api_register( 'table().header.structure()' , function (selector) {
	var indexes = this.columns(selector).indexes().flatten();
	var ctx = this.context[0];
	
	return _fnHeaderLayout(ctx, ctx.aoHeader, indexes);
} );


_api_register( 'table().footer.structure()' , function (selector) {
	var indexes = this.columns(selector).indexes().flatten();
	var ctx = this.context[0];
	
	return _fnHeaderLayout(ctx, ctx.aoFooter, indexes);
} );


_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
	return this.iterator( 'table', function ( ctx ) {
		return ctx.nTableWrapper;
	}, 1 );
} );

_api_register( 'caption()', function ( value, side ) {
	var context = this.context;

	// Getter - return existing node's content
	if ( value === undefined ) {
		var caption = context[0].captionNode;

		return caption && context.length ?
			caption.innerHTML : 
			null;
	}

	return this.iterator( 'table', function ( ctx ) {
		var table = $(ctx.nTable);
		var caption = $(ctx.captionNode);
		var container = $(ctx.nTableWrapper);

		// Create the node if it doesn't exist yet
		if ( ! caption.length ) {
			caption = $('<caption/>').html( value );
			ctx.captionNode = caption[0];

			// If side isn't set, we need to insert into the document to let the
			// CSS decide so we can read it back, otherwise there is no way to
			// know if the CSS would put it top or bottom for scrolling
			if (! side) {
				table.prepend(caption);

				side = caption.css('caption-side');
			}
		}

		caption.html( value );

		if ( side ) {
			caption.css( 'caption-side', side );
			caption[0]._captionSide = side;
		}

		if (container.find('div.dataTables_scroll').length) {
			var selector = (side === 'top' ? 'Head' : 'Foot');

			container.find('div.dataTables_scroll'+ selector +' table').prepend(caption);
		}
		else {
			table.prepend(caption);
		}
	}, 1 );
} );

_api_register( 'caption.node()', function () {
	var ctx = this.context;

	return ctx.length ? ctx[0].captionNode : null;
} );
