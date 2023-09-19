/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for FomanticUI (formally SemanticUI)
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */

/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	renderer: 'semanticUI'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	container: "dataTables_wrapper dt-semanticUI ui stackable grid",
	search: {
		input: "dataTables_filter ui input"
	},
	processing: {
		container: "dataTables_processing ui segment"
	}
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pagingButton.semanticUI = function (settings, buttonType, content, active, disabled) {
	var btnClasses = ['paginate_button', 'item'];

	if (active) {
		btnClasses.push('active');
	}

	if (disabled) {
		btnClasses.push('disabled')
	}

	var li = $('<li>').addClass(btnClasses.join(' '));
	var a = $('<'+(disabled ? 'div' : 'a')+'>', {
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

DataTable.ext.renderer.pagingContainer.semanticUI = function (settings, buttonEls) {
	return $('<div/>').addClass('ui unstackable pagination menu').append(buttonEls);
};


// Javascript enhancements on table initialisation
$(document).on( 'init.dt', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var api = new $.fn.dataTable.Api( ctx );

	// Length menu drop down
	if ( $.fn.dropdown ) {
		$( 'div.dataTables_length select', api.table().container() ).dropdown();
	}

	// Filtering input
	$( 'div.dataTables_filter.ui.input', api.table().container() ).removeClass('input').addClass('form');
	$( 'div.dataTables_filter input', api.table().container() ).wrap( '<span class="ui input" />' );
} );


DataTable.ext.renderer.layout.semanticUI = function ( settings, container, items ) {
	var row = $( '<div/>', {
			"class": items.full ?
				'row' :
				'row'
		} )
		.appendTo( container );

	$.each( items, function (key, val) {
		var klass = '';
		if ( key === 'left' ) {
			klass += 'left floated eight wide column';
		}
		else if ( key === 'right' ) {
			klass += 'right floated right aligned eight wide column';
		}
		else if ( key === 'full' ) {
			klass += 'center aligned sixteen wide column';
		}

		$( '<div/>', {
				id: val.id || null,
				"class": klass+' '+(val.className || '')
			} )
			.append( val.contents )
			.appendTo( row );
	} );
};
