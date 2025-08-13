/*! DataTables Bulma integration
 * © SpryMedia Ltd - datatables.net/license
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
	layout: {
		row: 'columns is-multiline',
		cell: 'is-flex is-justify-content-space-between is-align-items-center',
		tableRow: 'dt-layout-table',
		tableCell: 'column is-full',
		start: 'dt-layout-start column is-narrow',
		end: 'dt-layout-end column is-narrow',
		full: 'dt-layout-full column is-full'
	},
	length: {
		input: "custom-select custom-select-sm form-control form-control-sm"
	},
	processing: {
		container: "dt-processing card"
	},
	paging: {
		nav: 'pagination'
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
	return $('<ul class="pagination-list"></ul>').append(buttonEls);
};

DataTable.ext.renderer.layout.bulma = function ( settings, container, items ) {
	var classes = settings.oClasses.layout;
	var row = $('<div/>')
		.attr('id', items.id || null)
		.addClass(items.className || classes.row)
		.appendTo( container );

	DataTable.ext.renderer.layout._forLayoutRow(items, function (key, val) {
		if (key === 'id' || key === 'className') {
			return;
		}

		var klass = '';
		var style = {};

		if (val.table) {
			row.addClass(classes.tableRow);
			klass += classes.tableCell + ' ';
		}

		if (key === 'start') {
			klass += classes.start;
		}
		else if (key === 'end') {
			klass += classes.end;
			style.marginLeft = 'auto';
		}
		else {
			klass += classes.full;
		}

		$('<div/>')
			.attr({
				id: val.id || null,
				"class": val.className
					? val.className
					: classes.cell + ' ' + klass
			})
			.css(style)
			.append( val.contents )
			.appendTo( row );
	} );
};


// JavaScript enhancements on table initialisation
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
