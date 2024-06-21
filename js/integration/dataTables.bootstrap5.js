/*! DataTables Bootstrap 5 integration
 * © SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 5.
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
	container: "dt-container dt-bootstrap5",
	search: {
		input: "form-control form-control-sm"
	},
	length: {
		select: "form-select form-select-sm"
	},
	processing: {
		container: "dt-processing card"
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

DataTable.ext.renderer.layout.bootstrap = function ( settings, container, items ) {
	var row = $( '<div/>', {
			"class": items.full ?
				'row mt-2 justify-content-md-center' :
				'row mt-2 justify-content-between'
		} )
		.appendTo( container );

	$.each( items, function (key, val) {
		var klass;
		var cellClass = 'd-md-flex justify-content-between align-items-center';

		// Apply start / end (left / right when ltr) margins
		if (val.table) {
			klass = 'col-12';
		}
		else if (key === 'start') {
			klass = 'dt-layout-start col-md-auto me-auto ' + cellClass;
		}
		else if (key === 'end') {
			klass = 'dt-layout-end col-md-auto ms-auto ' + cellClass;
		}
		else {
			klass = 'dt-layout-full col-md ' + cellClass;
		}

		$( '<div/>', {
				id: val.id || null,
				"class": klass + ' ' + (val.className || '')
			} )
			.append( val.contents )
			.appendTo( row );
	} );
};
