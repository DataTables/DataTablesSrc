

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
	var rows;
	var run = function ( sel ) {
		var selInt = _intVal( sel );
		var i, ien;
		var aoData = settings.aoData;

		// Short cut - selector is a number and no options provided (default is
		// all records, so no need to check if the index is in there, since it
		// must be - dev error if the index doesn't exist).
		if ( selInt !== null && ! opts ) {
			return [ selInt ];
		}

		if ( ! rows ) {
			rows = _selector_row_indexes( settings, opts );
		}

		if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
			// Selector - integer
			return [ selInt ];
		}
		else if ( sel === null || sel === undefined || sel === '' ) {
			// Selector - none
			return rows;
		}

		// Selector - function
		if ( typeof sel === 'function' ) {
			return $.map( rows, function (idx) {
				var row = aoData[ idx ];
				return sel( idx, row._aData, row.nTr ) ? idx : null;
			} );
		}

		// Selector - node
		if ( sel.nodeName ) {
			var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
			var cellIdx = sel._DT_CellIndex;

			if ( rowIdx !== undefined ) {
				// Make sure that the row is actually still present in the table
				return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
					[ rowIdx ] :
					[];
			}
			else if ( cellIdx ) {
				return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
					[ cellIdx.row ] :
					[];
			}
			else {
				var host = $(sel).closest('*[data-dt-row]');
				return host.length ?
					[ host.data('dt-row') ] :
					[];
			}
		}

		// ID selector. Want to always be able to select rows by id, regardless
		// of if the tr element has been created or not, so can't rely upon
		// jQuery here - hence a custom implementation. This does not match
		// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
		// but to select it using a CSS selector engine (like Sizzle or
		// querySelect) it would need to need to be escaped for some characters.
		// DataTables simplifies this for row selectors since you can select
		// only a row. A # indicates an id any anything that follows is the id -
		// unescaped.
		if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
			// get row index from id
			var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
			if ( rowObj !== undefined ) {
				return [ rowObj.idx ];
			}

			// need to fall through to jQuery in case there is DOM id that
			// matches
		}
		
		// Get nodes in the order from the `rows` array with null values removed
		var nodes = _removeEmpty(
			_pluck_order( settings.aoData, rows, 'nTr' )
		);

		// Selector - jQuery selector string, array of nodes or jQuery object/
		// As jQuery's .filter() allows jQuery objects to be passed in filter,
		// it also allows arrays, so this will cope with all three options
		return $(nodes)
			.filter( sel )
			.map( function () {
				return this._DT_RowIndex;
			} )
			.toArray();
	};

	return _selector_run( 'row', selector, run, settings, opts );
};


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
	}, 1 );

	// Want argument shifting here and in __row_selector?
	inst.selector.rows = selector;
	inst.selector.opts = opts;

	return inst;
} );

_api_register( 'rows().nodes()', function () {
	return this.iterator( 'row', function ( settings, row ) {
		return settings.aoData[ row ].nTr || undefined;
	}, 1 );
} );

_api_register( 'rows().data()', function () {
	return this.iterator( true, 'rows', function ( settings, rows ) {
		return _pluck_order( settings.aoData, rows, '_aData' );
	}, 1 );
} );

_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
	return this.iterator( 'row', function ( settings, row ) {
		var r = settings.aoData[ row ];
		return type === 'search' ? r._aFilterData : r._aSortData;
	}, 1 );
} );

_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
	return this.iterator( 'row', function ( settings, row ) {
		_fnInvalidate( settings, row, src );
	} );
} );

_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
	return this.iterator( 'row', function ( settings, row ) {
		return row;
	}, 1 );
} );

_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
	var a = [];
	var context = this.context;

	// `iterator` will drop undefined values, but in this case we want them
	for ( var i=0, ien=context.length ; i<ien ; i++ ) {
		for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
			var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
			a.push( (hash === true ? '#' : '' )+ id );
		}
	}

	return new _Api( context, a );
} );

_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
	var that = this;

	this.iterator( 'row', function ( settings, row, thatIdx ) {
		var data = settings.aoData;
		var rowData = data[ row ];
		var i, ien, j, jen;
		var loopRow, loopCells;

		data.splice( row, 1 );

		// Update the cached indexes
		for ( i=0, ien=data.length ; i<ien ; i++ ) {
			loopRow = data[i];
			loopCells = loopRow.anCells;

			// Rows
			if ( loopRow.nTr !== null ) {
				loopRow.nTr._DT_RowIndex = i;
			}

			// Cells
			if ( loopCells !== null ) {
				for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
					loopCells[j]._DT_CellIndex.row = i;
				}
			}
		}

		// Delete from the display arrays
		_fnDeleteIndex( settings.aiDisplayMaster, row );
		_fnDeleteIndex( settings.aiDisplay, row );
		_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes

		// For server-side processing tables - subtract the deleted row from the count
		if ( settings._iRecordsDisplay > 0 ) {
			settings._iRecordsDisplay--;
		}

		// Check for an 'overflow' they case for displaying the table
		_fnLengthOverflow( settings );

		// Remove the row's ID reference if there is one
		var id = settings.rowIdFn( rowData._aData );
		if ( id !== undefined ) {
			delete settings.aIds[ id ];
		}
	} );

	this.iterator( 'table', function ( settings ) {
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			settings.aoData[i].idx = i;
		}
	} );

	return this;
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
		}, 1 );

	// Return an Api.rows() extended instance, so rows().nodes() etc can be used
	var modRows = this.rows( -1 );
	modRows.pop();
	$.merge( modRows, newRows );

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
	var row = ctx[0].aoData[ this[0] ];
	row._aData = data;

	// If the DOM has an id, and the data source is an array
	if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
		_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
	}

	// Automatically invalidate
	_fnInvalidate( ctx[0], this[0], 'data' );

	return this;
} );


_api_register( 'row().node()', function () {
	var ctx = this.context;

	return ctx.length && this.length ?
		ctx[0].aoData[ this[0] ].nTr || null :
		null;
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

