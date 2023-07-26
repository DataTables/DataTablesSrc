/*! DataTables UIkit 3 integration
 */

/**
 * This is a tech preview of UIKit integration with DataTables.
 */

/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	renderer: 'uikit'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper uk-form dt-uikit",
	sFilterInput:  "uk-form-small uk-input",
	sLengthSelect: "uk-form-small uk-select",
	sProcessing:   "dataTables_processing uk-panel"
} );


/* UIkit paging button renderer */
DataTable.ext.renderer.pageButton.uikit = function ( settings, host, idx, buttons, page, pages ) {
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
				btnDisplay = null;
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '<i class="uk-icon-ellipsis-h"></i>';
						btnClass = 'uk-disabled disabled';
						break;

					case 'first':
						btnDisplay = '<i class="uk-icon-angle-double-left"></i> ' + lang.sFirst;
						btnClass = (page > 0 ?
							'' : ' uk-disabled disabled');
						break;

					case 'previous':
						btnDisplay = '<i class="uk-icon-angle-left"></i> ' + lang.sPrevious;
						btnClass = (page > 0 ?
							'' : 'uk-disabled disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext + ' <i class="uk-icon-angle-right"></i>';
						btnClass = (page < pages-1 ?
							'' : 'uk-disabled disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast + ' <i class="uk-icon-angle-double-right"></i>';
						btnClass = (page < pages-1 ?
							'' : ' uk-disabled disabled');
						break;

					default:
						if ( typeof button === 'number' ) {
							btnDisplay = button + 1;
							btnClass = page === button ?
								'uk-active' : '';
						}
						else {
							container.append( button );
						}
						break;
				}

				if ( btnDisplay ) {
					var disabled = btnClass.indexOf('disabled') !== -1;

					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $(( -1 != btnClass.indexOf('disabled') || -1 != btnClass.indexOf('active') ) ? '<span>' : '<a>', {
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
						)
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
		$(host).empty().html('<ul class="uk-pagination uk-pagination-right uk-flex-right"/>').children('ul'),
		buttons
	);

	if ( activeEl ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
	}
};


DataTable.ext.renderer.layout.uikit = function ( settings, container, items ) {
	var row = $( '<div/>', {
			"class": 'uk-flex uk-flex-between'
		} )
		.appendTo( container );

	$.each( items, function (key, val) {
		var klass = '';
		if ( key === 'left' ) {
			klass += 'uk-text-left';
		}
		else if ( key === 'right' ) {
			klass += 'uk-text-right';
		}
		else if ( key === 'full' ) {
			if ( val.table ) {
				klass += 'uk-width-1-1';
			}
			else {
				klass += 'uk-text-center';
			}
		}

		$( '<div/>', {
				id: val.id || null,
				"class": klass+' '+(val.className || '')
			} )
			.append( val.contents )
			.appendTo( row );
	} );
};
