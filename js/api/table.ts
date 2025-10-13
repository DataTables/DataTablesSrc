
import { arrayApply } from "../util/support";
import Api from "./base";
import { headerLayout } from "../core/draw";

/**
 * Selector for HTML tables. Apply the given selector to the give array of
 * DataTables settings objects.
 *
 * @param {string|integer} [selector] jQuery selector string or integer
 * @param  {array} Array of DataTables settings objects to be filtered
 * @return {array}
 * @ignore
 */
export function table_selector( selector, a )
{
	if ( Array.isArray(selector) ) {
		var result = [];

		selector.forEach(function (sel) {
			var inner = table_selector(sel, a);

			arrayApply(result, inner);
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
Api.register( 'tables()', function ( selector ) {
	// A new instance is created if there was a selector specified
	return selector !== undefined && selector !== null ?
		new Api( table_selector( selector, this.context ) ) :
		this;
} );


Api.register( 'table()', function ( selector ) {
	var tables = this.tables( selector );
	var ctx = tables.context;

	// Truncate to the first matched table
	return ctx.length ?
		new Api( ctx[0] ) :
		tables;
} );

// Common methods, combined to reduce size
[
	['nodes', 'node', 'nTable'],
	['body', 'body', 'nTBody'],
	['header', 'header', 'nTHead'],
	['footer', 'footer', 'nTFoot'],
].forEach(function (item) {
	Api.registerPlural(
		'tables().' + item[0] + '()',
		'table().' + item[1] + '()' ,
		function () {
			return this.iterator( 'table', function ( ctx ) {
				return ctx[item[2]];
			}, 1 );
		}
	);
});

// Structure methods
[
	['header', 'aoHeader'],
	['footer', 'aoFooter'],
].forEach(function (item) {
	Api.register( 'table().' + item[0] + '.structure()' , function (selector) {
		var indexes = this.columns(selector).indexes().flatten().toArray();
		var ctx = this.context[0];
		var structure = headerLayout(ctx, ctx[item[1]], indexes)!;

		// The structure is in column index order - but from this method we want the return to be
		// in the columns() selector API order. In order to do that we need to map from one form
		// to the other
		var orderedIndexes = indexes.slice().sort(function (a, b) {
			return a - b;
		});

		return structure.map(function (row) {
			return indexes.map(function (colIdx) {
				return row[orderedIndexes.indexOf(colIdx)];
			});
		});
	});
});


Api.registerPlural( 'tables().containers()', 'table().container()' , function () {
	return this.iterator( 'table', function ( ctx ) {
		return ctx.nTableWrapper;
	}, 1 );
} );

Api.register( 'tables().every()', function ( fn ) {
	var that = this;

	return this.iterator('table', function (s, i) {
		fn.call(that.table(i), i);
	});
});

Api.register( 'caption()', function ( value, side ) {
	var context = this.context;

	// Getter - return existing node's content
	if ( value === undefined ) {
		var node = context[0].captionNode;

		return node && context.length ?
			node.innerHTML : 
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

Api.register( 'caption.node()', function () {
	var ctx = this.context;

	return ctx.length ? ctx[0].captionNode : null;
} );
