/*! DataTables jQuery UI integration
 * © SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for jQuery UI.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using jQuery UI. See https://datatables.net/manual/styling/jqueryui
 * for further information.
 */

$.extend( true, DataTable.ext.classes, {
	container: 'dt-container dt-jqueryui',
	paging: {
		active: 'ui-state-disabled',
		button: 'fg-button ui-button ui-state-default',
		container: 'dt-paging fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi',
		disabled: 'ui-state-disabled'
	},
	thead: {
		cell: 'ui-state-default fg-toolbar ui-toolbar ui-widget-header'
	},
	tfoot: {
		cell: 'ui-state-default ui-widget-header'
	},
	layout: {
		row: 'dt-layout-row ui-helper-clearfix',
		tableCell: 'table',
	}
} );

// Set the defaults for DataTables initialisation
$.extend(true, DataTable.defaults, {
	renderer: 'jqueryui'
});
