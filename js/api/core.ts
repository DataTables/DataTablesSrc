
import Api from "./base";
import { log, callbackFire } from "../core/support";
import { clearTable } from "../core/data";
import { pluck } from "../core/internal";
import { sortingClasses } from "../core/sort";

/**
 *
 */
Api.register( '$()', function ( selector, opts ) {
	var
		rows   = this.rows( opts ).nodes(), // Get all rows
		jqRows = $(rows) as any;

	return $( [].concat(
		jqRows.filter( selector ).toArray(),
		jqRows.find( selector ).toArray()
	) );
} );


// jQuery functions to operate on the tables
$.each( [ 'on', 'one', 'off' ], function (i, key) {
	Api.register( key+'()', function ( /* event, handler */ ) {
		var args = Array.prototype.slice.call(arguments);

		// Add the `dt` namespace automatically if it isn't already present
		args[0] = args[0].split( /\s/ ).map( function ( e ) {
			return ! e.match(/\.dt\b/) ?
				e+'.dt' :
				e;
			} ).join( ' ' );

		var inst = $( this.tables().nodes() );
		inst[key].apply( inst, args );
		return this;
	} );
} );


Api.register( 'clear()', function () {
	return this.iterator( 'table', function ( settings ) {
		clearTable( settings );
	} );
} );


Api.register( 'error()', function (msg) {
	return this.iterator( 'table', function ( settings ) {
		log( settings, 0, msg );
	} );
} );


Api.register( 'settings()', function () {
	return new Api( this.context, this.context );
} );


Api.register( 'init()', function () {
	var ctx = this.context;
	return ctx.length ? ctx[0].oInit : null;
} );


Api.register( 'data()', function () {
	return this.iterator( 'table', function ( settings ) {
		return pluck( settings.aoData, '_aData' );
	} ).flatten();
} );


Api.register( 'trigger()', function ( name, args, bubbles ) {
	return this.iterator( 'table', function ( settings ) {
		return callbackFire( settings, null, name, args, bubbles );
	} ).flatten();
} );


Api.register( 'ready()', function ( fn ) {
	var ctx = this.context;

	// Get status of first table
	if (! fn) {
		return ctx.length
			? (ctx[0]._bInitComplete || false)
			: null;
	}

	// Function to run either once the table becomes ready or
	// immediately if it is already ready.
	return this.tables().every(function () {
		var api = this;

		if (this.context[0]._bInitComplete) {
			fn.call(api);
		}
		else {
			this.on('init.dt.DT', function () {
				fn.call(api);
			});
		}
	} );
} );


Api.register( 'destroy()', function ( remove ) {
	remove = remove || false;

	return this.iterator( 'table', function ( settings ) {
		var classes   = settings.oClasses;
		var table     = settings.nTable;
		var tbody     = settings.nTBody;
		var thead     = settings.nTHead;
		var tfoot     = settings.nTFoot;
		var jqTable   = $(table);
		var jqTbody   = $(tbody);
		var jqWrapper = $(settings.nTableWrapper);
		var rows      = settings.aoData.map( function (r) { return r ? r.nTr : null; } );
		var orderClasses = classes.order;

		// Flag to note that the table is currently being destroyed - no action
		// should be taken
		settings.bDestroying = true;

		// Fire off the destroy callbacks for plug-ins etc
		callbackFire( settings, "aoDestroyCallback", "destroy", [settings], true );

		// If not being removed from the document, make all columns visible
		if ( ! remove ) {
			new Api( settings ).columns().visible( true );
		}

		// Container width change listener
		if (settings.resizeObserver) {
			settings.resizeObserver.disconnect();
		}

		// Blitz all `DT` namespaced events (these are internal events, the
		// lowercase, `dt` events are user subscribed and they are responsible
		// for removing them
		jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
		$(window).off('.DT-'+settings.sInstance);

		// When scrolling we had to break the table up - restore it
		if ( table != thead.parentNode ) {
			jqTable.children('thead').detach();
			jqTable.append( thead );
		}

		if ( tfoot && table != tfoot.parentNode ) {
			jqTable.children('tfoot').detach();
			jqTable.append( tfoot );
		}

		// Clean up the header / footer
		cleanHeader(thead, 'header');
		cleanHeader(tfoot, 'footer');
		settings.colgroup.remove();

		settings.aaSorting = [];
		settings.aaSortingFixed = [];
		sortingClasses( settings );

		$(jqTable).find('th, td').removeClass(
			$.map(DataTable.ext.type.className, function (v) {
				return v;
			}).join(' ')
		);

		$('th, td', thead)
			.removeClass(
				orderClasses.none + ' ' +
				orderClasses.canAsc + ' ' +
				orderClasses.canDesc + ' ' +
				orderClasses.isAsc + ' ' +
				orderClasses.isDesc
			)
			.css('width', '')
			.removeAttr('aria-sort');

		// Add the TR elements back into the table in their original order
		jqTbody.children().detach();
		jqTbody.append( rows );

		var orig = settings.nTableWrapper.parentNode;
		var insertBefore = settings.nTableWrapper.nextSibling;

		// Remove the DataTables generated nodes, events and classes
		var removedMethod = remove ? 'remove' : 'detach';
		jqTable[ removedMethod ]();
		jqWrapper[ removedMethod ]();

		// If we need to reattach the table to the document
		if ( ! remove && orig ) {
			// insertBefore acts like appendChild if !arg[1]
			orig.insertBefore( table, insertBefore );

			// Restore the width of the original table - was read from the style property,
			// so we can restore directly to that
			jqTable
				.css( 'width', settings.sDestroyWidth )
				.removeClass( classes.table );
		}

		/* Remove the settings object from the settings array */
		var idx = DataTable.settings.indexOf(settings);
		if ( idx !== -1 ) {
			DataTable.settings.splice( idx, 1 );
		}
	} );
} );


// Add the `every()` method for rows, columns and cells in a compact form
$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
	Api.register( type+'s().every()', function ( fn ) {
		var opts = this.selector.opts;
		var api = this;
		var inst;
		var counter = 0;

		return this.iterator( 'every', function ( settings, selectedIdx, tableIdx ) {
			inst = api[ type ](selectedIdx, opts);

			if (type === 'cell') {
				fn.call(inst, inst[0][0].row, inst[0][0].column, tableIdx, counter);
			}
			else {
				fn.call(inst, selectedIdx, tableIdx, counter);
			}

			counter++;
		} );
	} );
} );


// i18n method for extensions to be able to use the language object from the
// DataTable
Api.register( 'i18n()', function ( token, def, plural ) {
	var ctx = this.context[0];
	var resolved = DataTable.ext.get( token )( ctx.oLanguage );

	if ( resolved === undefined ) {
		resolved = def;
	}

	if ( $.isPlainObject( resolved ) ) {
		resolved = plural !== undefined && resolved[ plural ] !== undefined
			? resolved[ plural ]
			: plural === false
				? resolved
				: resolved._;
	}

	return typeof resolved === 'string'
		? resolved.replace( '%d', plural ) // nb: plural might be undefined,
		: resolved;
} );

// Needed for header and footer, so pulled into its own function
function cleanHeader(node, className) {
	$(node).find('span.dt-column-order').remove();
	$(node).find('span.dt-column-title').each(function () {
		var title = $(this).html();
		$(this).parent().parent().append(title);
		$(this).remove();
	});
	$(node).find('div.dt-column-' + className).remove();

	$('th, td', node).removeAttr('data-dt-column');
}
