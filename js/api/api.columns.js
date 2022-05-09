

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Columns
 *
 * {integer}           - column index (>=0 count from left, <0 count from right)
 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
 * "{string}:name"     - column name
 * "{string}"          - jQuery selector on column header nodes
 *
 */

// can be an array of these items, comma separated list, or an array of comma
// separated lists

var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;


// r1 and r2 are redundant - but it means that the parameters match for the
// iterator callback in columns().data()
var __columnData = function ( settings, column, r1, r2, rows ) {
	var a = [];
	for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
		a.push( _fnGetCellData( settings, rows[row], column ) );
	}
	return a;
};


var __column_selector = function ( settings, selector, opts )
{
	var
		columns = settings.aoColumns,
		names = _pluck( columns, 'sName' ),
		nodes = _pluck( columns, 'nTh' );

	var run = function ( s ) {
		var selInt = _intVal( s );

		// Selector - all
		if ( s === '' ) {
			return _range( columns.length );
		}

		// Selector - index
		if ( selInt !== null ) {
			return [ selInt >= 0 ?
				selInt : // Count from left
				columns.length + selInt // Count from right (+ because its a negative value)
			];
		}

		// Selector = function
		if ( typeof s === 'function' ) {
			var rows = _selector_row_indexes( settings, opts );

			return $.map( columns, function (col, idx) {
				return s(
						idx,
						__columnData( settings, idx, 0, 0, rows ),
						nodes[ idx ]
					) ? idx : null;
			} );
		}

		// jQuery or string selector
		var match = typeof s === 'string' ?
			s.match( __re_column_selector ) :
			'';

		if ( match ) {
			switch( match[2] ) {
				case 'visIdx':
				case 'visible':
					var idx = parseInt( match[1], 10 );
					// Visible index given, convert to column index
					if ( idx < 0 ) {
						// Counting from the right
						var visColumns = $.map( columns, function (col,i) {
							return col.bVisible ? i : null;
						} );
						return [ visColumns[ visColumns.length + idx ] ];
					}
					// Counting from the left
					return [ _fnVisibleToColumnIndex( settings, idx ) ];

				case 'name':
					// match by name. `names` is column index complete and in order
					return $.map( names, function (name, i) {
						return name === match[1] ? i : null;
					} );

				default:
					return [];
			}
		}

		// Cell in the table body
		if ( s.nodeName && s._DT_CellIndex ) {
			return [ s._DT_CellIndex.column ];
		}

		// jQuery selector on the TH elements for the columns
		var jqResult = $( nodes )
			.filter( s )
			.map( function () {
				return $.inArray( this, nodes ); // `nodes` is column index complete and in order
			} )
			.toArray();

		if ( jqResult.length || ! s.nodeName ) {
			return jqResult;
		}

		// Otherwise a node which might have a `dt-column` data attribute, or be
		// a child or such an element
		var host = $(s).closest('*[data-dt-column]');
		return host.length ?
			[ host.data('dt-column') ] :
			[];
	};

	return _selector_run( 'column', selector, run, settings, opts );
};


var __setColumnVis = function ( settings, column, vis ) {
	var
		cols = settings.aoColumns,
		col  = cols[ column ],
		data = settings.aoData,
		row, cells, i, ien, tr;

	// Get
	if ( vis === undefined ) {
		return col.bVisible;
	}

	// Set
	// No change
	if ( col.bVisible === vis ) {
		return;
	}

	if ( vis ) {
		// Insert column
		// Need to decide if we should use appendChild or insertBefore
		var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );

		for ( i=0, ien=data.length ; i<ien ; i++ ) {
			tr = data[i].nTr;
			cells = data[i].anCells;

			if ( tr ) {
				// insertBefore can act like appendChild if 2nd arg is null
				tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
			}
		}
	}
	else {
		// Remove column
		$( _pluck( settings.aoData, 'anCells', column ) ).detach();
	}

	// Common actions
	col.bVisible = vis;
};


_api_register( 'columns()', function ( selector, opts ) {
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
		return __column_selector( settings, selector, opts );
	}, 1 );

	// Want argument shifting here and in _row_selector?
	inst.selector.cols = selector;
	inst.selector.opts = opts;

	return inst;
} );

_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
	return this.iterator( 'column', function ( settings, column ) {
		return settings.aoColumns[column].nTh;
	}, 1 );
} );

_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
	return this.iterator( 'column', function ( settings, column ) {
		return settings.aoColumns[column].nTf;
	}, 1 );
} );

_api_registerPlural( 'columns().data()', 'column().data()', function () {
	return this.iterator( 'column-rows', __columnData, 1 );
} );

_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
	return this.iterator( 'column', function ( settings, column ) {
		return settings.aoColumns[column].mData;
	}, 1 );
} );

_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
	return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
		return _pluck_order( settings.aoData, rows,
			type === 'search' ? '_aFilterData' : '_aSortData', column
		);
	}, 1 );
} );

_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
	return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
		return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
	}, 1 );
} );

_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
	var that = this;
	var ret = this.iterator( 'column', function ( settings, column ) {
		if ( vis === undefined ) {
			return settings.aoColumns[ column ].bVisible;
		} // else
		__setColumnVis( settings, column, vis );
	} );

	// Group the column visibility changes
	if ( vis !== undefined ) {
		this.iterator( 'table', function ( settings ) {
			// Redraw the header after changes
			_fnDrawHead( settings, settings.aoHeader );
			_fnDrawHead( settings, settings.aoFooter );
	
			// Update colspan for no records display. Child rows and extensions will use their own
			// listeners to do this - only need to update the empty table item here
			if ( ! settings.aiDisplay.length ) {
				$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
			}
	
			_fnSaveState( settings );

			// Second loop once the first is done for events
			that.iterator( 'column', function ( settings, column ) {
				_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
			} );

			if ( calc === undefined || calc ) {
				that.columns.adjust();
			}
		});
	}

	return ret;
} );

_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
	return this.iterator( 'column', function ( settings, column ) {
		return type === 'visible' ?
			_fnColumnIndexToVisible( settings, column ) :
			column;
	}, 1 );
} );

_api_register( 'columns.adjust()', function () {
	return this.iterator( 'table', function ( settings ) {
		_fnAdjustColumnSizing( settings );
	}, 1 );
} );

_api_register( 'column.index()', function ( type, idx ) {
	if ( this.context.length !== 0 ) {
		var ctx = this.context[0];

		if ( type === 'fromVisible' || type === 'toData' ) {
			return _fnVisibleToColumnIndex( ctx, idx );
		}
		else if ( type === 'fromData' || type === 'toVisible' ) {
			return _fnColumnIndexToVisible( ctx, idx );
		}
	}
} );

_api_register( 'column()', function ( selector, opts ) {
	return _selector_first( this.columns( selector, opts ) );
} );
