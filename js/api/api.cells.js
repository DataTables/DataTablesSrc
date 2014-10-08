


var __cell_selector = function ( settings, selector, opts )
{
	var data = settings.aoData;
	var rows = _selector_row_indexes( settings, opts );
	var cells = _pluck_order( data, rows, 'anCells' );
	var allCells = $( [].concat.apply([], cells) );
	var row;
	var columns = settings.aoColumns.length;
	var a, i, ien, j;

	return _selector_run( selector, function ( s ) {
		if ( s === null || s === undefined ) {
			// All cells
			a = [];

			for ( i=0, ien=rows.length ; i<ien ; i++ ) {
				row = rows[i];

				for ( j=0 ; j<columns ; j++ ) {
					a.push( {
						row: row,
						column: j
					} );
				}
			}

			return a;
		}
		else if ( $.isPlainObject( s ) ) {
			return [s];
		}

		// jQuery filtered cells
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
		if ( typeof rowSelector.row !== undefined ) {
			opts = columnSelector;
			columnSelector = null;
		}
		else {
			opts = rowSelector;
			rowSelector = null;
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
	} );

	$.extend( cells.selector, {
		cols: columnSelector,
		rows: rowSelector,
		opts: opts
	} );

	return cells;
} );


_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
	return this.iterator( 'cell', function ( settings, row, column ) {
		return settings.aoData[ row ].anCells[ column ];
	} );
} );


_api_register( 'cells().data()', function () {
	return this.iterator( 'cell', function ( settings, row, column ) {
		return _fnGetCellData( settings, row, column );
	} );
} );


_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
	type = type === 'search' ? '_aFilterData' : '_aSortData';

	return this.iterator( 'cell', function ( settings, row, column ) {
		return settings.aoData[ row ][ type ][ column ];
	} );
} );


_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
	return this.iterator( 'cell', function ( settings, row, column ) {
		return _fnGetCellData( settings, row, column, type );
	} );
} );


_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
	return this.iterator( 'cell', function ( settings, row, column ) {
		return {
			row: row,
			column: column,
			columnVisible: _fnColumnIndexToVisible( settings, column )
		};
	} );
} );


_api_register( [
	'cells().invalidate()',
	'cell().invalidate()'
], function ( src ) {
	var selector = this.selector;

	// Use the rows method of the instance to perform the invalidation, rather
	// than doing it here. This avoids needing to handle duplicate rows from
	// the cells.
	this.rows( selector.rows, selector.opts ).invalidate( src );

	return this;
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
	_fnInvalidateRow( ctx[0], cell[0].row, 'data', cell[0].column );

	return this;
} );

