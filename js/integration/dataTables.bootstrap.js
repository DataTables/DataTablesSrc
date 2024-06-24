/*! DataTables Bootstrap 3 integration
 * © SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 3.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See https://datatables.net/manual/styling/bootstrap
 * for further information.
 */

/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( true, DataTable.ext.classes, {
	container: "dt-container form-inline dt-bootstrap",
	search: {
		input: "form-control input-sm"
	},
	length: {
		select: "form-control input-sm"
	},
	processing: {
		container: "dt-processing panel panel-default"
	},
	layout: {
		row: 'row dt-layout-row',
		cell: 'dt-layout-cell',
		tableRow: '',
		tableCell: 'col-12',
		start: 'dt-layout-start col-sm-6',
		end: 'dt-layout-end col-sm-6',
		full: 'dt-layout-full col-sm-12'
	}
} );

/* Bootstrap paging button renderer */
DataTable.ext.renderer.pagingButton.bootstrap = function (settings, buttonType, content, active, disabled) {
	var btnClasses = ['dt-paging-button', 'page-item'];

	if (active) {
		btnClasses.push('active');
	}

	if (disabled) {
		btnClasses.push('disabled')
	}

	var li = $('<li>').addClass(btnClasses.join(' '));
	var a = $('<a>', {
		'href': disabled ? null : '#',
		'class': 'page-link'
	})
		.html(content)
		.appendTo(li);

	return {
		display: li,
		clicker: a
	};
};

DataTable.ext.renderer.pagingContainer.bootstrap = function (settings, buttonEls) {
	return $('<ul/>').addClass('pagination').append(buttonEls);
};
