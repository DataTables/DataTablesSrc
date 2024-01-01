/*! DataTables Bulma integration
 * ©2020 SpryMedia Ltd - datatables.net/license
 */

/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	renderer: 'bulma'
} );


/* Default class modification */
$.extend( true, DataTable.ext.classes, {
	container: "dt-container dt-bulma",
	search: {
		input: "input"
	},
	length: {
		input: "custom-select custom-select-sm form-control form-control-sm"
	},
	processing: {
		container: "dt-processing card"
	}
} );


DataTable.ext.renderer.pagingButton.bulma = function (settings, buttonType, content, active, disabled) {
	var btnClasses = ['pagination-link'];

	if (active) {
		btnClasses.push('is-current');
	}

	var li = $('<li>');
	var a = $('<a>', {
		'href': disabled ? null : '#',
		'class': btnClasses.join(' '),
		'disabled': disabled
	})
		.html(content)
		.appendTo(li);

	return {
		display: li,
		clicker: a
	};
};

DataTable.ext.renderer.pagingContainer.bulma = function (settings, buttonEls) {
	var nav = $('<nav class="pagination" role="navigation" aria-label="pagination"><ul class="pagination-list"></ul></nav>');
	
	nav.find('ul').append(buttonEls);

	return nav;
};

DataTable.ext.renderer.layout.bulma = function ( settings, container, items ) {
	var style = {};
	var row = $( '<div/>', {
			"class": 'columns is-multiline'
		} )
		.appendTo( container );

	$.each( items, function (key, val) {
		var klass;

		if (val.table) {
			klass = 'column is-full';
		}
		else if (key === 'start') {
			klass = 'column is-narrow';
		}
		else if (key === 'end') {
			klass = 'column is-narrow';
			style.marginLeft = 'auto';
		}
		else {
			klass = 'column is-full';
			style.marginLeft = 'auto';
			style.marginRight = 'auto';
		}

		$( '<div/>', {
				id: val.id || null,
				"class": klass+' '+(val.className || '')
			} )
			.css(style)
			.append( val.contents )
			.appendTo( row );
	} );
};


// Javascript enhancements on table initialisation
$(document).on( 'init.dt', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var api = new $.fn.dataTable.Api( ctx );

	// Length menu drop down - needs to be wrapped with a div
	$( 'div.dt-length select', api.table().container() ).wrap('<div class="select">');

	// Filtering input
	// $( 'div.dt-search.ui.input', api.table().container() ).removeClass('input').addClass('form');
	// $( 'div.dt-search input', api.table().container() ).wrap( '<span class="ui input" />' );
} );
