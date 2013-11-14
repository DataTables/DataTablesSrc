

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Rows
 *
 * {}          - no selector - use all available rows
 * {integer}   - row aoData index
 * {node}      - TR node
 * {string}    - jQuery selector to apply to the TR elements
 * {array}     - jQuery array of nodes, or simply an array of TR nodes
 *
 */


var __row_selector = function ( settings, selector, opts )
{
	return _selector_run( selector, function ( sel ) {
		var selInt = _intVal( sel );

		// Short cut - selector is a number and no options provided (default is
		// all records, so no need to check if the index is in there, since it
		// must be - dev error if the index doesn't exist).
		if ( selInt !== null && ! opts ) {
			return [ selInt ];
		}

		var rows = _selector_row_indexes( settings, opts );

		if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
			// Selector - integer
			return [ selInt ];
		}
		else if ( ! sel ) {
			// Selector - none
			return rows;
		}

		// Get nodes in the order from the `rows` array (can't use `pluck`) @todo - use pluck_order
		var nodes = [];
		for ( var i=0, ien=rows.length ; i<ien ; i++ ) {
			nodes.push( settings.aoData[ rows[i] ].nTr );
		}

		if ( sel.nodeName ) {
			// Selector - node
			if ( $.inArray( sel, nodes ) !== -1 ) {
				return [ sel._DT_RowIndex ];// sel is a TR node that is in the table
										// and DataTables adds a prop for fast lookup
			}
		}

		// Selector - jQuery selector string, array of nodes or jQuery object/
		// As jQuery's .filter() allows jQuery objects to be passed in filter,
		// it also allows arrays, so this will cope with all three options
		return $(nodes)
			.filter( sel )
			.map( function () {
				return this._DT_RowIndex;
			} )
			.toArray();
	} );
};


/**
 *
 */
_api_register( 'rows()', function ( selector, opts ) {
	// argument shifting
	if ( selector === undefined ) {
		selector = '';
	}
	else if ( $.isPlainObject( selector ) ) {
		opts = selector;
		selector = '';
	}

	opts = _selector_opts( opts );

	var inst = this.iterator( 'table', function ( settings ) {
		return __row_selector( settings, selector, opts );
	} );

	// Want argument shifting here and in __row_selector?
	inst.selector.rows = selector;
	inst.selector.opts = opts;

	return inst;
} );


_api_registerPlural( 'rows().nodes()', 'row().node()' , function () {
	return this.iterator( 'row', function ( settings, row ) {
		// use pluck order on an array rather - rows gives an array, row gives it individually
		return settings.aoData[ row ].nTr || undefined;
	} );
} );


_api_register( 'rows().data()', function ( data ) {
	return this.iterator( true, 'rows', function ( settings, rows ) {
		return _pluck_order( settings.aoData, rows, '_aData' );
	} );
} );

_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
	return this.iterator( 'row', function ( settings, row ) {
		return type === 'search' ? row._aFilterData : row._aSortData;
	} );
} );

_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
	return this.iterator( 'row', function ( settings, row ) {
		_fnInvalidateRow( settings, row, src );
	} );
} );


_api_registerPlural( 'rows().indexes()', 'row().index()', function ( src ) {
	return this.iterator( 'row', function ( settings, row ) {
		return row;
	} );
} );


_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
	var that = this;

	return this.iterator( 'row', function ( settings, row, thatIdx ) {
		var data = settings.aoData;

		data.splice( row, 1 );

		// Update the _DT_RowIndex parameter on all rows in the table
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			if ( data[i].nTr !== null ) {
				data[i].nTr._DT_RowIndex = i;
			}
		}

		// Remove the target row from the search array
		var displayIndex = $.inArray( row, settings.aiDisplay );

		// Delete from the display arrays
		_fnDeleteIndex( settings.aiDisplayMaster, row );
		_fnDeleteIndex( settings.aiDisplay, row );
		_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes

		// Check for an 'overflow' they case for displaying the table
		_fnLengthOverflow( settings );
	} );
} );


_api_register( 'rows.add()', function ( rows ) {
	var newRows = this.iterator( 'table', function ( settings ) {
			var row, i, ien;
			var out = [];

			for ( i=0, ien=rows.length ; i<ien ; i++ ) {
				row = rows[i];

				if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
					out.push( _fnAddTr( settings, row )[0] );
				}
				else {
					out.push( _fnAddData( settings, row ) );
				}
			}

			return out;
		} );

	// Return an Api.rows() extended instance, so rows().nodes() etc can be used
	var modRows = this.rows( -1 );
	modRows.pop();
	modRows.push.apply( modRows, newRows );

	return modRows;
} );





/**
 *
 */
_api_register( 'row()', function ( selector, opts ) {
	return _selector_first( this.rows( selector, opts ) );
} );


_api_register( 'row().data()', function ( data ) {
	var ctx = this.context;

	if ( data === undefined ) {
		// Get
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ]._aData :
			undefined;
	}

	// Set
	ctx[0].aoData[ this[0] ]._aData = data;

	// Automatically invalidate
	_fnInvalidateRow( ctx[0], this[0], 'data' );

	return this;
} );


_api_register( 'row.add()', function ( row ) {
	// Allow a jQuery object to be passed in - only a single row is added from
	// it though - the first element in the set
	if ( row instanceof $ && row.length ) {
		row = row[0];
	}

	var rows = this.iterator( 'table', function ( settings ) {
		if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
			return _fnAddTr( settings, row )[0];
		}
		return _fnAddData( settings, row );
	} );

	// Return an Api.rows() extended instance, with the newly added row selected
	return this.row( rows[0] );
} );

