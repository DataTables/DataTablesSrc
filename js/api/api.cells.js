


var __cell_selector = function ( settings, selector, opts )
{
	var data = settings.aoData;
	var rows = _selector_row_indexes( settings, opts );
	var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
	var allCells = $( [].concat.apply([], cells) );
	var row;
	var columns = settings.aoColumns.length;
	var a, i, ien, j, o, host;

	return _selector_run( selector, function ( s ) {
		var fnSelector = typeof s === 'function';

		if ( s === null || s === undefined || fnSelector ) {
			// All cells and function selectors
			a = [];

			for ( i=0, ien=rows.length ; i<ien ; i++ ) {
				row = rows[i];

				for ( j=0 ; j<columns ; j++ ) {
					o = {
						row: row,
						column: j
					};

					if ( fnSelector ) {
						// Selector - function
						host = settings.aoData[ row ];

						if ( s( o, _fnGetCellData(settings, row, j), host.anCells[j] ) ) {
							a.push( o );
						}
					}
					else {
						// Selector - all
						a.push( o );
					}
				}
			}

			return a;
		}
		
		// Selector - index
		if ( $.isPlainObject( s ) ) {
			return [s];
		}

		// Selector - jQuery filtered cells
		return allCells
			.filter( s )
			.map( function (i, el) {
				row = el.parentNode._DT_RowIndex;

				return {
					row: row,
					column: $.inArray( el, data[ row ].anCells )
				};
			} )
			.toArray();
	} );
};




_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
	// Argument shifting
	if ( $.isPlainObject( rowSelector ) ) {
		// Indexes
		if ( rowSelector.row === undefined ) {
			// Selector options in first parameter
			opts = rowSelector;
			rowSelector = null;
		}
		else {
			// Cell index objects in first parameter
			opts = columnSelector;
			columnSelector = null;
		}
	}
	if ( $.isPlainObject( columnSelector ) ) {
		opts = columnSelector;
		columnSelector = null;
	}

	// Cell selector
	if ( columnSelector === null || columnSelector === undefined ) {
		return this.iterator( 'table', function ( settings ) {
			return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
		} );
	}

	// Row + column selector
	var columns = this.columns( columnSelector, opts );
	var rows = this.rows( rowSelector, opts );
	var a, i, ien, j, jen;

	var cells = this.iterator( 'table', function ( settings, idx ) {
		a = [];

		for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
			for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
				a.push( {
					row:    rows[idx][i],
					column: columns[idx][j]
				} );
			}
		}

		return a;
	}, 1 );

	$.extend( cells.selector, {
		cols: columnSelector,
		rows: rowSelector,
		opts: opts
	} );

	return cells;
} );


_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
	return this.iterator( 'cell', function ( settings, row, column ) {
		var cells = settings.aoData[ row ].anCells;
		return cells ?
			cells[ column ] :
			undefined;
	}, 1 );
} );


_api_register( 'cells().data()', function () {
	return this.iterator( 'cell', function ( settings, row, column ) {
		return _fnGetCellData( settings, row, column );
	}, 1 );
} );


_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
	type = type === 'search' ? '_aFilterData' : '_aSortData';

	return this.iterator( 'cell', function ( settings, row, column ) {
		return settings.aoData[ row ][ type ][ column ];
	}, 1 );
} );


_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
	return this.iterator( 'cell', function ( settings, row, column ) {
		return _fnGetCellData( settings, row, column, type );
	}, 1 );
} );


_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
	return this.iterator( 'cell', function ( settings, row, column ) {
		return {
			row: row,
			column: column,
			columnVisible: _fnColumnIndexToVisible( settings, column )
		};
	}, 1 );
} );


_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
	return this.iterator( 'cell', function ( settings, row, column ) {
		_fnInvalidate( settings, row, src, column );
	} );
} );



_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
	return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
} );


_api_register( 'cell().data()', function ( data ) {
	var ctx = this.context;
	var cell = this[0];

	if ( data === undefined ) {
		// Get
		return ctx.length && cell.length ?
			_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
			undefined;
	}

	// Set
	_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
	_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );

	return this;
} );

