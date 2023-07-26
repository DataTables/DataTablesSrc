/*! DataTables jQuery UI integration
 * ©2011-2014 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for jQuery UI. This requires jQuery UI and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using jQuery UI. See http://datatables.net/manual/styling/jqueryui
 * for further information.
 */

$.extend( DataTable.ext.classes, {
	"sWrapper":            "dataTables_wrapper dt-jqueryui",

	/* Full numbers paging buttons */
	"sPageButton":         "fg-button ui-button ui-state-default",
	"sPageButtonActive":   "ui-state-disabled",
	"sPageButtonDisabled": "ui-state-disabled",

	/* Features */
	"sPaging": "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi "+
		"ui-buttonset-multi paging_", /* Note that the type is postfixed */

	/* Scrolling */
	"sScrollHead": "dataTables_scrollHead "+"ui-state-default",
	"sScrollFoot": "dataTables_scrollFoot "+"ui-state-default",

	/* Misc */
	"sHeaderTH":  "ui-state-default",
	"sFooterTH":  "ui-state-default"
} );


DataTable.ext.renderer.layout.jqueryui = function ( settings, container, items ) {
	var rowHasDt = false;
	var row = $( '<div/>', {
			"class": 'dataTables_layout_row ui-helper-clearfix'
		} )
		.appendTo( container );

	$.each( items, function (key, val) {
		var cell = $( '<div/>', {
				id: val.id || null,
				"class": 'dataTables_layout_cell dt-'+key+' '+(val.className || '')
			} )
			.append( val.contents )
			.appendTo( row );

		if ($(val.contents).hasClass('dataTable')) {
			rowHasDt = true;
			cell.addClass('table');
		}
	} );
	
	if (! rowHasDt) {
		row.addClass('fg-toolbar ui-toolbar ui-widget-header');
	}
};
