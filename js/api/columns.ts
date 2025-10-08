
import Api from "./base";
import { getCellData } from "../core/data";
import { intVal, range, pluck, pluck_order } from "../core/internal";
import { selector_row_indexes, selector_run, selector_opts, selector_first } from "./selectors";
import { columnIndexToVisible, visibleToColumnIndex, columnsFromHeader, columnTypes, visibleColumns, adjustColumnSizing } from "../core/columns";
import { colGroup } from "../core/sizing";
import { drawHead } from "../core/draw";
import { saveState } from "../core/state";
import { callbackFire } from "../core/support";

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

var __re_column_selector = /^([^:]+)?:(name|title|visIdx|visible)$/;


// r1 and r2 are redundant - but it means that the parameters match for the
// iterator callback in columns().data()
function columnData ( settings, column, r1, r2, rows, type? ) {
	var a: any[] = [];
	for ( var row=0, iLen=rows.length ; row<iLen ; row++ ) {
		a.push( getCellData( settings, rows[row], column, type ) );
	}
	return a;
};


function columnHeader ( settings, column, row? ) {
	var header = settings.aoHeader;
	var titleRow = settings.titleRow;
	var target: any = null;

	if (row !== undefined) {
		target = row;
	}
	else if (titleRow === true) { // legacy orderCellsTop support
		target = 0;
	}
	else if (titleRow === false) {
		target = header.length - 1;
	}
	else if (titleRow !== null) {
		target = titleRow;
	}
	else {
		// Automatic - find the _last_ unique cell from the top that is not empty (last for
		// backwards compatibility)
		for (var i=0 ; i<header.length ; i++) {
			if (header[i][column].unique && $('span.dt-column-title', header[i][column].cell).text()) {
				target = i;
			}
		}

		if (target === null) {
			target = 0;
		}
	}

	return header[target][column].cell;
};

function columnHeaderCells (header) {
	var out: any[] = [];

	for (var i=0 ; i<header.length ; i++) {
		for (var j=0 ; j<header[i].length ; j++) {
			var cell = header[i][j].cell;

			if (!out.includes(cell)) {
				out.push(cell);
			}
		}
	}

	return out;
}

var __column_selector = function ( settings, selector, opts )
{
	var
		columns = settings.aoColumns,
		names, titles,
		nodes = columnHeaderCells(settings.aoHeader);
	
	var run = function ( s ) {
		var selInt = intVal( s );

		// Selector - all
		if ( s === '' ) {
			return range( columns.length );
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
			var rows = selector_row_indexes( settings, opts );

			return columns.map(function (col, idx) {
				return s(
						idx,
						columnData( settings, idx, 0, 0, rows ),
						columnHeader( settings, idx )
					) ? idx : null;
			});
		}

		// jQuery or string selector
		var match = typeof s === 'string' ?
			s.match( __re_column_selector ) :
			'';

		if ( match ) {
			switch( match[2] ) {
				case 'visIdx':
				case 'visible':
					// Selector is a column index
					if (match[1] && match[1].match(/^\d+$/)) {
						var idx = parseInt( match[1], 10 );

						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = columns.map( function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ visibleToColumnIndex( settings, idx ) ];
					}
					
					return columns.map( function (col, mapIdx) {
						// Not visible, can't match
						if (! col.bVisible) {
							return null;
						}

						// Selector
						if (match && match[1]) {
							return $(nodes[mapIdx]).filter(match[1]).length > 0 ? mapIdx : null;
						}

						// `:visible` on its own
						return mapIdx;
					} );

				case 'name':
					// Don't get names, unless needed, and only get once if it is
					if (!names) {
						names = pluck( columns, 'sName' );
					}

					// match by name. `names` is column index complete and in order
					return names.map( function (name, i) {
						return match && name === match[1] ? i : null;
					} );

				case 'title':
					if (!titles) {
						titles = pluck( columns, 'sTitle' );
					}

					// match by column title
					return titles.map( function (title, i) {
						return match && title === match[1] ? i : null;
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
				return columnsFromHeader( this ); // `nodes` is column index complete and in order
			} )
			.toArray()
			.sort(function (a, b) {
				return a - b;
			});

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

	var selected = selector_run( 'column', selector, run, settings, opts );

	return opts.columnOrder && opts.columnOrder === 'index'
		? selected.sort(function (a, b) { return a - b; })
		: selected; // implied
};


var __setColumnVis = function ( settings, column, vis ) {
	var
		cols = settings.aoColumns,
		col  = cols[ column ],
		data = settings.aoData,
		cells, i, iLen, tr;

	// Get
	if ( vis === undefined ) {
		return col.bVisible;
	}

	// Set
	// No change
	if ( col.bVisible === vis ) {
		return false;
	}

	if ( vis ) {
		// Insert column
		// Need to decide if we should use appendChild or insertBefore
		var insertBefore = pluck(cols, 'bVisible').indexOf(true, column+1);

		for ( i=0, iLen=data.length ; i<iLen ; i++ ) {
			if (data[i]) {
				tr = data[i].nTr;
				cells = data[i].anCells;

				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
	}
	else {
		// Remove column
		$( pluck( settings.aoData, 'anCells', column ) ).detach();
	}

	// Common actions
	col.bVisible = vis;

	colGroup(settings);
	
	return true;
};


Api.register( 'columns()', function ( selector, opts ) {
	// argument shifting
	if ( selector === undefined ) {
		selector = '';
	}
	else if ( $.isPlainObject( selector ) ) {
		opts = selector;
		selector = '';
	}

	opts = selector_opts( opts );

	var inst = this.iterator( 'table', function ( settings ) {
		return __column_selector( settings, selector, opts );
	}, 1 );

	// Want argument shifting here and in _row_selector?
	inst.selector.cols = selector;
	inst.selector.opts = opts;

	return inst;
} );

Api.registerPlural( 'columns().header()', 'column().header()', function ( row ) {
	return this.iterator( 'column', function (settings, column) {
		return columnHeader(settings, column, row);
	}, 1 );
} );

Api.registerPlural( 'columns().footer()', 'column().footer()', function ( row ) {
	return this.iterator( 'column', function ( settings, column ) {
		var footer = settings.aoFooter;

		if (! footer.length) {
			return null;
		}

		return settings.aoFooter[row !== undefined ? row : 0][column].cell;
	}, 1 );
} );

Api.registerPlural( 'columns().data()', 'column().data()', function () {
	return this.iterator( 'column-rows', columnData, 1 );
} );

Api.registerPlural( 'columns().render()', 'column().render()', function ( type ) {
	return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
		return columnData( settings, column, i, j, rows, type );
	}, 1 );
} );

Api.registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
	return this.iterator( 'column', function ( settings, column ) {
		return settings.aoColumns[column].mData;
	}, 1 );
} );

Api.registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
	return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
		return pluck_order( settings.aoData, rows,
			type === 'search' ? '_aFilterData' : '_aSortData', column
		);
	}, 1 );
} );

Api.registerPlural( 'columns().init()', 'column().init()', function () {
	return this.iterator( 'column', function ( settings, column ) {
		return settings.aoColumns[column];
	}, 1 );
} );

Api.registerPlural( 'columns().names()', 'column().name()', function () {
	return this.iterator( 'column', function ( settings, column ) {
		return settings.aoColumns[column].sName;
	}, 1 );
} );

Api.registerPlural( 'columns().nodes()', 'column().nodes()', function () {
	return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
		return pluck_order( settings.aoData, rows, 'anCells', column ) ;
	}, 1 );
} );

Api.registerPlural( 'columns().titles()', 'column().title()', function (title, row) {
	return this.iterator( 'column', function ( settings, column ) {
		// Argument shifting
		if (typeof title === 'number') {
			row = title;
			title = undefined;
		}

		var span = $('span.dt-column-title', this.column(column).header(row));

		if (title !== undefined) {
			span.html(title);
			return this;
		}

		return span.html();
	}, 1 );
} );

Api.registerPlural( 'columns().types()', 'column().type()', function () {
	return this.iterator( 'column', function ( settings, column ) {
		var colObj = settings.aoColumns[column]
		var type = colObj.sType;

		// If the type was invalidated, then resolve it. This actually does
		// all columns at the moment. Would only happen once if getting all
		// column's data types.
		if (! type) {
			columnTypes(settings);

			type = colObj.sType;
		}

		return type;
	}, 1 );
} );

Api.registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
	var that = this;
	var changed: any[] = [];
	var ret = this.iterator( 'column', function ( settings, column ) {
		if ( vis === undefined ) {
			return settings.aoColumns[ column ].bVisible;
		} // else
		
		if (__setColumnVis( settings, column, vis )) {
			changed.push(column);
		}
	} );

	// Group the column visibility changes
	if ( vis !== undefined ) {
		this.iterator( 'table', function ( settings ) {
			// Redraw the header after changes
			drawHead( settings, settings.aoHeader );
			drawHead( settings, settings.aoFooter );
	
			// Update colspan for no records display. Child rows and extensions will use their own
			// listeners to do this - only need to update the empty table item here
			if ( ! settings.aiDisplay.length ) {
				$(settings.nTBody).find('td[colspan]').attr('colspan', visibleColumns(settings));
			}
	
			saveState( settings );

			// Second loop once the first is done for events
			that.iterator( 'column', function ( ctx, column ) {
				if (changed.includes(column)) {
					callbackFire( ctx, null, 'column-visibility', [ctx, column, vis, calc] );
				}
			} );

			if ( changed.length && (calc === undefined || calc) ) {
				that.columns.adjust();
			}
		});
	}

	return ret;
} );

Api.registerPlural( 'columns().widths()', 'column().width()', function () {
	// Injects a fake row into the table for just a moment so the widths can
	// be read, regardless of colspan in the header and rows being present in
	// the body
	var columns = this.columns(':visible').count();
	var row = $('<tr>').html('<td>' + Array(columns).join('</td><td>') + '</td>');

	$(this.table().body()).append(row);

	var widths = row.children().map(function () {
		return $(this).outerWidth();
	});

	row.remove();
	
	return this.iterator( 'column', function ( settings, column ) {
		var visIdx = columnIndexToVisible( settings, column );

		return visIdx !== null ? widths[visIdx] : 0;
	}, 1);
} );

Api.registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
	return this.iterator( 'column', function ( settings, column ) {
		return type === 'visible' ?
			columnIndexToVisible( settings, column ) :
			column;
	}, 1 );
} );

Api.register( 'columns.adjust()', function () {
	return this.iterator( 'table', function ( settings ) {
		// Force a column sizing to happen with a manual call - otherwise it can skip
		// if the size hasn't changed
		settings.containerWidth = -1;

		adjustColumnSizing( settings );
	}, 1 );
} );

Api.register( 'column.index()', function ( type, idx ) {
	if ( this.context.length !== 0 ) {
		var ctx = this.context[0];

		if ( type === 'fromVisible' || type === 'toData' ) {
			return visibleToColumnIndex( ctx, idx );
		}
		else if ( type === 'fromData' || type === 'toVisible' ) {
			return columnIndexToVisible( ctx, idx );
		}
	}
} );

Api.register( 'column()', function ( selector, opts ) {
	return selector_first( this.columns( selector, opts ) );
} );
