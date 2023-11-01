/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
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
	dom:
		"<'ui stackable grid'"+
			"<'row'"+
				"<'eight wide column'l>"+
				"<'right aligned eight wide column'f>"+
			">"+
			"<'row dt-table'"+
				"<'sixteen wide column'tr>"+
			">"+
			"<'row'"+
				"<'seven wide column'i>"+
				"<'right aligned nine wide column'p>"+
			">"+
		">",
	renderer: 'semanticUI'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper dt-semanticUI",
	sFilter:       "dataTables_filter ui input",
	sProcessing:   "dataTables_processing ui segment",
	sPageButton:   "paginate_button item"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.semanticUI = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( Array.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				var disabled = btnClass.indexOf('disabled') !== -1;
				var tag = disabled ?
					'div' :
					'a';

				if ( btnDisplay ) {
					node = $('<'+tag+'>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null,
							'href': disabled ? null : '#',
							'aria-controls': settings.sTableId,
							'aria-disabled': disabled ? 'true' : null,
							'aria-label': aria[ button ],
							'role': 'link',
							'aria-current': btnClass === 'active' ? 'page' : null,
							'data-dt-idx': button,
							'tabindex': disabled ? -1 : settings.iTabIndex
						} )
						.html( btnDisplay )
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<div class="ui stackable pagination menu"/>').children(),
		buttons
	);

	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
	}
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
