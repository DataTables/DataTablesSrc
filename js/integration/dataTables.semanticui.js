/*! DataTables Bootstrap 3 integration
 * © SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for FomanticUI (formally SemanticUI)
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See https://datatables.net/manual/styling/bootstrap
 * for further information.
 */

/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	renderer: 'semanticUI'
} );


/* Default class modification */
$.extend( true, DataTable.ext.classes, {
	container: "dt-container dt-semanticUI",
	search: {
		input: "dt-search ui input"
	},
	processing: {
		container: "dt-processing ui segment"
	},
	table: 'dataTable table unstackable'
} );


/* Fomantic paging button renderer */
DataTable.ext.renderer.pagingButton.semanticUI = function (settings, buttonType, content, active, disabled) {
	var btnClasses = ['dt-paging-button', 'item'];

	if (active) {
		btnClasses.push('active');
	}

	if (disabled) {
		btnClasses.push('disabled')
	}

	var a = $('<'+(disabled ? 'div' : 'a')+'>', {
		'href': disabled ? null : '#',
		'class': 'page-link'
	})
		.addClass(btnClasses.join(' '))
		.html(content);

	return {
		display: a,
		clicker: a
	};
};

DataTable.ext.renderer.pagingContainer.semanticUI = function (settings, buttonEls) {
	return $('<div/>').addClass('ui unstackable pagination menu').append(buttonEls);
};


// JavaScript enhancements on table initialisation
$(document).on( 'init.dt', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var api = new $.fn.dataTable.Api( ctx );

	// Length menu drop down
	if ( $.fn.dropdown ) {
		$( 'div.dt-length select', api.table().container() ).dropdown();
	}

	// Filtering input
	$( 'div.dt-search.ui.input', api.table().container() ).removeClass('input').addClass('form');
	$( 'div.dt-search input', api.table().container() ).wrap( '<span class="ui input" />' );
} );
