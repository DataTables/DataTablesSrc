/*! Legacy interfaces for DataTables
 * ©2018 SpryMedia Ltd - datatables.net/license
 */

/*
 * This file contains legacy interfaces to make DataTables v2 backwards
 * compatible with sites and apps designed for use with the DataTables v1
 * API and options. This file should only be used if you are transitioning
 * from a DataTables v1 install that used legacy methods. It should not
 * be used for new installs.
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';

var DataTable = $.fn.dataTable;
var internalApi = DataTable.ext.internal;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Methods added to jQuery when initialising a jQuery selector
 */
$.extend( internalApi, {
	/**
	 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
	 * return the resulting jQuery object.
	 */
	$: function ( settings, selector, opts ) {
		return this.api(true).$( selector, opts );
	},

	/**
	 * Almost identical to $ in operation, but in this case returns the data for the matched
	 * rows
	 */
	_: function ( settings, selector, opts ) {
		return this.api(true).rows( selector, opts ).data();
	},

	/**
	 * Add a single new row or multiple rows of data to the table. Please note
	 * that this is suitable for client-side processing only
	 */
	fnAddData: function( settings, data, redraw ) {
		var api = this.api( true );

		/* Check if we want to add multiple rows or not */
		var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
			api.rows.add( data ) :
			api.row.add( data );

		if ( redraw === undefined || redraw ) {
			api.draw();
		}

		return rows.flatten().toArray();
	},

	/**
	 * This function will make DataTables recalculate the column sizes, based on the data
	 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
	 * through the width parameter)
	 */
	fnAdjustColumnSizing: function ( settings, redraw ) {
		var api = this.api( true ).columns.adjust();
		var scroll = settings.oScroll;

		if ( redraw === undefined || redraw ) {
			api.draw( false );
		}
		else if ( scroll.sX !== "" || scroll.sY !== "" ) {
			/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
			internalApi._fnScrollDraw( settings );
		}
	},

	/**
	 * Quickly and simply clear a table
	 */
	fnClearTable: function( settingts, redraw ) {
		var api = this.api( true ).clear();

		if ( redraw === undefined || redraw ) {
			api.draw();
		}
	},

	/**
	 * The exact opposite of 'opening' a row, this function will close any rows which
	 * are currently 'open'.
	 */
	fnClose: function( settings, nTr ) {
		this.api( true ).row( nTr ).child.hide();
	},

	/**
	 * Remove a row from the table
	 */
	fnDeleteRow: function( settings, target, callback, redraw )
	{
		var api = this.api( true );
		var rows = api.rows( target );
		var data = settings.aoData[ rows[0][0] ];

		rows.remove();

		if ( callback ) {
			callback.call( this, settings, data );
		}

		if ( redraw === undefined || redraw ) {
			api.draw();
		}

		return data;
	},

	/**
	 * Restore the table to it's original state in the DOM by removing all of DataTables
	 * enhancements, alterations to the DOM structure of the table and event listeners.
	 */
	fnDestroy: function ( settings, remove )
	{
		this.api( true ).destroy( remove );
	},

	/**
	 * Redraw the table
	 */
	fnDraw: function( settings, complete )
	{
		// Note that this isn't an exact match to the old call to _fnDraw - it takes
		// into account the new data, but can hold position.
		this.api( true ).draw( complete );
	},

	/**
	 * Filter the input based on data
	 */
	fnFilter: function( settings, sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
	{
		var api = this.api( true );

		if ( iColumn === null || iColumn === undefined ) {
			api.search( sInput, bRegex, bSmart, bCaseInsensitive );
		}
		else {
			api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
		}

		api.draw();
	},

	/**
	 * Get the data for the whole table, an individual row or an individual cell based on the
	 * provided parameters.
	 */
	fnGetData: function( settings, src, col )
	{
		var api = this.api( true );

		if ( src !== undefined ) {
			var type = src.nodeName ? src.nodeName.toLowerCase() : '';

			return col !== undefined || type == 'td' || type == 'th' ?
				api.cell( src, col ).data() :
				api.row( src ).data() || null;
		}

		return api.data().toArray();
	},

	/**
	 * Get an array of the TR nodes that are used in the table's body. Note that you will
	 * typically want to use the '$' API method in preference to this as it is more
	 * flexible.
	 */
	fnGetNodes: function( settings, iRow )
	{
		var api = this.api( true );

		return iRow !== undefined ?
			api.row( iRow ).node() :
			api.rows().nodes().flatten().toArray();
	},

	/**
	 * Get the array indexes of a particular cell from it's DOM element
	 * and column index including hidden columns
	 */
	fnGetPosition: function( settings, node )
	{
		var api = this.api( true );
		var nodeName = node.nodeName.toUpperCase();

		if ( nodeName == 'TR' ) {
			return api.row( node ).index();
		}
		else if ( nodeName == 'TD' || nodeName == 'TH' ) {
			var cell = api.cell( node ).index();

			return [
				cell.row,
				cell.columnVisible,
				cell.column
			];
		}
		return null;
	},

	/**
	 * Check to see if a row is 'open' or not.
	 */
	fnIsOpen: function( settings, tr )
	{
		return this.api( true ).row( tr ).child.isShown();
	},

	/**
	 * This function will place a new row directly after a row which is currently
	 * on display on the page, with the HTML contents that is passed into the
	 * function. This can be used, for example, to ask for confirmation that a
	 * particular record should be deleted.
	 */
	fnOpen: function( settings, tr, html, klass )
	{
		return this.api( true )
			.row( tr )
			.child( html, klass )
			.show()
			.child()[0];
	},

	/**
	 * Change the pagination - provides the internal logic for pagination in a simple API
	 * function. With this function you can have a DataTables table go to the next,
	 * previous, first or last pages.
	 */
	fnPageChange: function ( settings, action, redraw )
	{
		var api = this.api( true ).page( action );

		if ( redraw === undefined || redraw ) {
			api.draw(false);
		}
	},

	/**
	 * Show a particular column
	 */
	fnSetColumnVis: function ( settings, col, show, redraw )
	{
		var api = this.api( true ).column( col ).visible( show );

		if ( redraw === undefined || redraw ) {
			api.columns.adjust().draw();
		}
	},

	/**
	 * Get the settings for a particular table for external manipulation
	 */
	fnSettings: function( settings )
	{
		return settings;
	},

	/**
	 * Sort the table by a particular column
	 */
	fnSort: function( settings, sort )
	{
		this.api( true ).order( sort ).draw();
	},


	/**
	 * Attach a sort listener to an element for a given column
	 */
	fnSortListener: function( settings, node, column, callback )
	{
		this.api( true ).order.listener( node, column, callback );
	},

	/**
	 * Update a table cell or row - this method will accept either a single value to
	 * update the cell with, an array of values with one element for each column or
	 * an object in the same format as the original data source. The function is
	 * self-referencing in order to make the multi column updates easier.
	 */
	fnUpdate: function( settings, data, row, column, redraw, action )
	{
		var api = this.api( true );

		if ( column === undefined || column === null ) {
			api.row( row ).data( data );
		}
		else {
			api.cell( row, column ).data( data );
		}

		if ( action === undefined || action ) {
			api.columns.adjust();
		}

		if ( redraw === undefined || redraw ) {
			api.draw();
		}

		return 0;
	},

	/**
	 * Provide a common method for plug-ins to check the version of DataTables being used, in order
	 * to ensure compatibility.
	 */
	fnVersionCheck: DataTable.versionCheck
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Static methods
 */
DataTable.fnVersionCheck = DataTable.versionCheck;
DataTable.fnIsDataTable = DataTable.isDataTable;
DataTable.fnTables = DataTable.tables;



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Legacy Ajax / server-side processing
 */
$(document).on( 'options.dt', function (e, opts) {
	// sAjaxSource and sAjaxDataProp support
	if ( opts.sAjaxSource && ! opts.ajax ) {
		opts.ajax = opts.sAjaxDataProp ?
			{ // data source property
				url: opts.sAjaxSource,
				dataSrc: opts.sAjaxDataProp
			} :
			opts.sAjaxSource; // just the url
	}

	// fnServerData support - ajax as a function
	if ( opts.fnServerData ) {
		opts.ajax = function (data, callback, s) {
			opts.fnServerData(
				opts.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				s
			);
		};
	}

	// lengthMenu as a 2D array - convert to array of objects
	if ( opts.lengthMenu && Array.isArray(opts.lengthMenu[0]) ) {
		var menu = [];

		for ( var i=0 ; i<opts.lengthMenu ; i++ ) {
			menu.push({
				label: opts.lengthMenu[0][i],
				value: opts.lengthMenu[1][i]
			});
		}

		opts.lengthMenu = menu;
	}
} );

$(document).on( 'preInit.dt', function (e, settings) {
	var api = new $.fn.dataTable.Api( settings );

	// Legacy server-side processing parameter style
	api.on( 'preXhr', function (e, s, d, xhr) {
		var legacy = DataTable.ext.legacy.ajax;
		var init = api.init();
		var serverParams = function () {
			if ( init.fnServerParams ) {
				init.fnServerParams( s, xhr.data );
			}
		}
		if ( init.sAjaxSource && legacy === null ) {
			legacy = true;
		}

		if ( ! legacy || ! api.page.info().serverSide ) {
			serverParams();
			return;
		}

		// Going for the legacy style - convert
		var data = xhr.data;
		var features = s.oFeatures;
		var oldStyle = [];
		var param = function ( name, value ) {
			oldStyle.push( {
				name: name,
				value: value
			} );
		};

		param( 'sEcho',          data.draw );
		param( 'iColumns',       data.columns.length );
		param( 'sColumns',       $.map( data.columns, function (col) { return col.name; } ).join(',') );
		param( 'iDisplayStart',  data.start );
		param( 'iDisplayLength', data.length );

		for ( var i=0 ; i<data.columns.length ; i++ ) {
			var column = data.columns[i];

			param( "mDataProp_"+i, column.data );

			if ( features.bFilter ) {
				param( 'sSearch_'+i,     column.search.value );
				param( 'bRegex_'+i,      column.search.regex );
				param( 'bSearchable_'+i, column.searchable );
			}

			if ( features.bSort ) {
				param( 'bSortable_'+i, column.orderable );
			}
		}

		if ( features.bSort ) {
			$.each( data.order, function ( i, val ) {
				param( 'iSortCol_'+i, val.column );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', data.order.length );
		}

		if ( features.bFilter ) {
			param( 'sSearch', data.search.value );
			param( 'bRegex', data.search.regex );
		}
	
		xhr.data = oldStyle;


		// fnServerParams - after server-side processing conversion
		serverParams();
	} );
} );


}));
