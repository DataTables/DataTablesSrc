
import Context from '../model/settings';
import { pluck } from './internal';
import { log } from './support';
import { createTr } from './draw';
import { getRowDisplay, rowAttributes } from './draw';
import ext from '../ext/index';
import RowModel from '../model/row';
import util from '../api/util';

/**
 * Add a data array to the table, creating DOM node etc. This is the parallel to
 * _fnGatherData, but for adding rows from a JavaScript source, rather than a
 * DOM source.
 *  @param {object} settings dataTables settings object
 *  @param {array} data data array to be added
 *  @param {node} [tr] TR element to add to the table - optional. If not given,
 *    DataTables will create a row automatically
 *  @param {array} [tds] Array of TD|TH elements for the row - must be given
 *    if nTr is.
 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
 *  @memberof DataTable#oApi
 */
export function addData ( settings: Context, dataIn, tr?, tds? )
{
	/* Create the object for storing information about this new row */
	var rowIdx = settings.aoData.length;
	var rowModel = $.extend( true, {}, new RowModel(), {
		src: tr ? 'dom' : 'data',
		idx: rowIdx
	} ) as any;

	rowModel._aData = dataIn;
	settings.aoData.push( rowModel );

	var columns = settings.aoColumns;

	for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
	{
		// Invalidate the column types as the new data needs to be revalidated
		columns[i].sType = null;
	}

	/* Add to the display array */
	settings.aiDisplayMaster.push( rowIdx );

	var id = settings.rowIdFn( dataIn );
	if ( id !== undefined ) {
		settings.aIds[ id ] = rowModel;
	}

	/* Create the DOM information, or register it if already present */
	if ( tr || ! settings.oFeatures.bDeferRender )
	{
		createTr( settings, rowIdx, tr, tds );
	}

	return rowIdx;
}


/**
 * Add one or more TR elements to the table. Generally we'd expect to
 * use this for reading data from a DOM sourced table, but it could be
 * used for an TR element. Note that if a TR is given, it is used (i.e.
 * it is not cloned).
 *  @param {object} settings dataTables settings object
 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
 *  @returns {array} Array of indexes for the added rows
 *  @memberof DataTable#oApi
 */
export function addTr( settings: Context, trs )
{
	var row;

	// Allow an individual node to be passed in
	if ( ! (trs instanceof $) ) {
		trs = $(trs);
	}

	return trs.map( function (i, el) {
		row = getRowElements( settings, el );
		return addData( settings, row.data, el, row.cells );
	} );
}


/**
 * Get the data for a given cell from the internal cache, taking into account data mapping
 *  @param {object} settings dataTables settings object
 *  @param {int} rowIdx aoData row id
 *  @param {int} colIdx Column index
 *  @param {string} type data get type ('display', 'type' 'filter|search' 'sort|order')
 *  @returns {*} Cell data
 *  @memberof DataTable#oApi
 */
export function getCellData( settings: Context, rowIdx, colIdx, type? )
{
	if (type === 'search') {
		type = 'filter';
	}
	else if (type === 'order') {
		type = 'sort';
	}

	var row = settings.aoData[rowIdx];

	if (! row) {
		return undefined;
	}

	var draw           = settings.iDraw;
	var col            = settings.aoColumns[colIdx];
	var rowData        = row._aData;
	var defaultContent = col.sDefaultContent;
	var cellData       = col.fnGetData( rowData, type, {
		settings: settings,
		row:      rowIdx,
		col:      colIdx
	} );

	// Allow for a node being returned for non-display types
	if (type !== 'display' && cellData && typeof cellData === 'object' && cellData.nodeName) {
		cellData = cellData.innerHTML;
	}

	if ( cellData === undefined ) {
		if ( settings.iDrawError != draw && defaultContent === null ) {
			log( settings, 0, "Requested unknown parameter "+
				(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
				" for row "+rowIdx+", column "+colIdx, 4 );

			settings.iDrawError = draw;
		}

		return defaultContent;
	}

	// When the data source is null and a specific data type is requested (i.e.
	// not the original data), we can use default column data
	if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
		cellData = defaultContent;
	}
	else if ( typeof cellData === 'function' ) {
		// If the data source is a function, then we run it and use the return,
		// executing in the scope of the data object (for instances)
		return cellData.call( rowData );
	}

	if ( cellData === null && type === 'display' ) {
		return '';
	}

	if ( type === 'filter' ) {
		var formatters = ext.type.search;

		if ( col.sType && formatters[ col.sType ] ) {
			cellData = formatters[ col.sType ]( cellData );
		}
	}

	return cellData;
}


/**
 * Set the value for a specific cell, into the internal data cache
 *  @param {object} settings dataTables settings object
 *  @param {int} rowIdx aoData row id
 *  @param {int} colIdx Column index
 *  @param {*} val Value to set
 *  @memberof DataTable#oApi
 */
export function setCellData( settings: Context, rowIdx, colIdx, val )
{
	var col     = settings.aoColumns[colIdx];
	var rowData = settings.aoData[rowIdx]._aData;

	col.fnSetData( rowData, val, {
		settings: settings,
		row:      rowIdx,
		col:      colIdx
	}  );
}

/**
 * Write a value to a cell
 * @param {*} td Cell
 * @param {*} val Value
 */
export function writeCell(td, val)
{
	if (val && typeof val === 'object' && val.nodeName) {
		$(td)
			.empty()
			.append(val);
	}
	else {
		td.innerHTML = val;
	}
}


/**
 * Return an array with the full table data
 *  @param {object} oSettings dataTables settings object
 *  @returns array {array} aData Master data array
 *  @memberof DataTable#oApi
 */
export function getDataMaster ( settings: Context )
{
	return pluck( settings.aoData, '_aData' );
}


/**
 * Nuke the table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
export function clearTable( settings: Context )
{
	settings.aoData.length = 0;
	settings.aiDisplayMaster.length = 0;
	settings.aiDisplay.length = 0;
	settings.aIds = {};
}


/**
 * Mark cached data as invalid such that a re-read of the data will occur when
 * the cached data is next requested. Also update from the data source object.
 *
 * @param {object} settings DataTables settings object
 * @param {int}    rowIdx   Row index to invalidate
 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
 *     or 'data'
 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
 *     row will be invalidated
 *
 * @todo For the modularisation of v1.11 this will need to become a callback, so
 *   the sort and filter methods can subscribe to it. That will required
 *   initialisation options for sorting, which is why it is not already baked in
 */
export function invalidate( settings: Context, rowIdx, src, colIdx? )
{
	var row = settings.aoData[ rowIdx ];
	var i, iLen;

	// Remove the cached data for the row
	row._aSortData = null;
	row._aFilterData = null;
	row.displayData = null;

	// Are we reading last data from DOM or the data object?
	if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
		// Read the data from the DOM
		row._aData = getRowElements(
				settings, row, colIdx, colIdx === undefined ? undefined : row._aData
			)
			.data;
	}
	else {
		// Reading from data object, update the DOM
		var cells = row.anCells;
		var display = getRowDisplay(settings, rowIdx);

		if ( cells ) {
			if ( colIdx !== undefined ) {
				writeCell(cells[colIdx], display[colIdx]);
			}
			else {
				for ( i=0, iLen=cells.length ; i<iLen ; i++ ) {
					writeCell(cells[i], display[i]);
				}
			}
		}
	}

	// Column specific invalidation
	var cols = settings.aoColumns;
	if ( colIdx !== undefined ) {
		// Type - the data might have changed
		cols[ colIdx ].sType = null;

		// Max length string. Its a fairly cheep recalculation, so not worth
		// something more complicated
		cols[ colIdx ].wideStrings = null;
	}
	else {
		for ( i=0, iLen=cols.length ; i<iLen ; i++ ) {
			cols[i].sType = null;
			cols[i].wideStrings = null;
		}

		// Update DataTables special `DT_*` attributes for the row
		rowAttributes( settings, row );
	}
}


/**
 * Build a data source object from an HTML row, reading the contents of the
 * cells that are in the row.
 *
 * @param {object} settings DataTables settings object
 * @param {node|object} TR element from which to read data or existing row
 *   object from which to re-read the data from the cells
 * @param {int} [colIdx] Optional column index
 * @param {array|object} [d] Data source object. If `colIdx` is given then this
 *   parameter should also be given and will be used to write the data into.
 *   Only the column in question will be written
 * @returns {object} Object with two parameters: `data` the data read, in
 *   document order, and `cells` and array of nodes (they can be useful to the
 *   caller, so rather than needing a second traversal to get them, just return
 *   them from here).
 */
export function getRowElements( settings: Context, row, colIdx?, d? )
{
	var
		tds: HTMLTableCellElement[] = [],
		td = row.firstChild,
		name, col, i=0, contents,
		columns = settings.aoColumns,
		objectRead = settings._rowReadObject;

	// Allow the data object to be passed in, or construct
	d = d !== undefined ?
		d :
		objectRead ?
			{} :
			[];

	var attr = function ( str, cell  ) {
		if ( typeof str === 'string' ) {
			var idx = str.indexOf('@');

			if ( idx !== -1 ) {
				var att = str.substring( idx+1 );
				var setter = util.set( str );
				setter( d, cell.getAttribute( att ) );
			}
		}
	};

	// Read data from a cell and store into the data object
	var cellProcess = function ( cell ) {
		if ( colIdx === undefined || colIdx === i ) {
			col = columns[i];
			contents = (cell.innerHTML).trim();

			if ( col && col._bAttrSrc ) {
				var setter = util.set( col.mData._ );
				setter( d, contents );

				attr( col.mData.sort, cell );
				attr( col.mData.type, cell );
				attr( col.mData.filter, cell );
			}
			else {
				// Depending on the `data` option for the columns the data can
				// be read to either an object or an array.
				if ( objectRead ) {
					if ( ! col._setter ) {
						// Cache the setter function
						col._setter = util.set( col.mData );
					}
					col._setter( d, contents );
				}
				else {
					d[i] = contents;
				}
			}
		}

		i++;
	};

	if ( td ) {
		// `tr` element was passed in
		while ( td ) {
			name = td.nodeName.toUpperCase();

			if ( name == "TD" || name == "TH" ) {
				cellProcess( td );
				tds.push( td );
			}

			td = td.nextSibling;
		}
	}
	else {
		// Existing row object passed in
		tds = row.anCells;

		for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
			cellProcess( tds[j] );
		}
	}

	// Read the ID from the DOM if present
	var rowNode = row.firstChild ? row : row.nTr;

	if ( rowNode ) {
		var id = rowNode.getAttribute( 'id' );

		if ( id ) {
			util.set( settings.rowId )( d, id );
		}
	}

	return {
		data: d,
		cells: tds
	};
}
