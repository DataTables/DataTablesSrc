

/**
 *
 */
_api_register( '$()', function ( selector, opts ) {
	var
		rows   = this.rows( opts ).nodes(), // Get all rows
		jqRows = $(rows);

	return $( [].concat(
		jqRows.filter( selector ).toArray(),
		jqRows.find( selector ).toArray()
	) );
} );


// jQuery functions to operate on the tables
$.each( [ 'on', 'one', 'off' ], function (i, key) {
	_api_register( key+'()', function ( /* event, handler */ ) {
		var args = Array.prototype.slice.call(arguments);

		// Add the `dt` namespace automatically if it isn't already present
		args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
			return ! e.match(/\.dt\b/) ?
				e+'.dt' :
				e;
			} ).join( ' ' );

		var inst = $( this.tables().nodes() );
		inst[key].apply( inst, args );
		return this;
	} );
} );


_api_register( 'clear()', function () {
	return this.iterator( 'table', function ( settings ) {
		_fnClearTable( settings );
	} );
} );


_api_register( 'settings()', function () {
	return new _Api( this.context, this.context );
} );


_api_register( 'init()', function () {
	var ctx = this.context;
	return ctx.length ? ctx[0].oInit : null;
} );


_api_register( 'data()', function () {
	return this.iterator( 'table', function ( settings ) {
		return _pluck( settings.aoData, '_aData' );
	} ).flatten();
} );


_api_register( 'destroy()', function ( remove ) {
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
		var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
		var i, ien;

		// Flag to note that the table is currently being destroyed - no action
		// should be taken
		settings.bDestroying = true;

		// Fire off the destroy callbacks for plug-ins etc
		_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );

		// If not being removed from the document, make all columns visible
		if ( ! remove ) {
			new _Api( settings ).columns().visible( true );
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

		settings.aaSorting = [];
		settings.aaSortingFixed = [];
		_fnSortingClasses( settings );

		$( rows ).removeClass( settings.asStripeClasses.join(' ') );

		$('th, td', thead).removeClass( classes.sSortable+' '+
			classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
		);

		// Add the TR elements back into the table in their original order
		jqTbody.children().detach();
		jqTbody.append( rows );

		var orig = settings.nTableWrapper.parentNode;

		// Remove the DataTables generated nodes, events and classes
		var removedMethod = remove ? 'remove' : 'detach';
		jqTable[ removedMethod ]();
		jqWrapper[ removedMethod ]();

		// If we need to reattach the table to the document
		if ( ! remove && orig ) {
			// insertBefore acts like appendChild if !arg[1]
			orig.insertBefore( table, settings.nTableReinsertBefore );

			// Restore the width of the original table - was read from the style property,
			// so we can restore directly to that
			jqTable
				.css( 'width', settings.sDestroyWidth )
				.removeClass( classes.sTable );

			// If the were originally stripe classes - then we add them back here.
			// Note this is not fool proof (for example if not all rows had stripe
			// classes - but it's a good effort without getting carried away
			ien = settings.asDestroyStripes.length;

			if ( ien ) {
				jqTbody.children().each( function (i) {
					$(this).addClass( settings.asDestroyStripes[i % ien] );
				} );
			}
		}

		/* Remove the settings object from the settings array */
		var idx = $.inArray( settings, DataTable.settings );
		if ( idx !== -1 ) {
			DataTable.settings.splice( idx, 1 );
		}
	} );
} );


// Add the `every()` method for rows, columns and cells in a compact form
$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
	_api_register( type+'s().every()', function ( fn ) {
		var opts = this.selector.opts;
		var api = this;

		return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
			// Rows and columns:
			//  arg1 - index
			//  arg2 - table counter
			//  arg3 - loop counter
			//  arg4 - undefined
			// Cells:
			//  arg1 - row index
			//  arg2 - column index
			//  arg3 - table counter
			//  arg4 - loop counter
			fn.call(
				api[ type ](
					arg1,
					type==='cell' ? arg2 : opts,
					type==='cell' ? opts : undefined
				),
				arg1, arg2, arg3, arg4
			);
		} );
	} );
} );


// i18n method for extensions to be able to use the language object from the
// DataTable
_api_register( 'i18n()', function ( token, def, plural ) {
	var ctx = this.context[0];
	var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );

	if ( resolved === undefined ) {
		resolved = def;
	}

	if ( plural !== undefined && $.isPlainObject( resolved ) ) {
		resolved = resolved[ plural ] !== undefined ?
			resolved[ plural ] :
			resolved._;
	}

	return resolved.replace( '%d', plural ); // nb: plural might be undefined,
} );