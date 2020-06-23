

var extPagination = DataTable.ext.pager;

function _numbers ( page, pages ) {
	var
		numbers = [],
		buttons = extPagination.numbers_length,
		half = Math.floor( buttons / 2 ),
		i = 1;

	if ( pages <= buttons ) {
		numbers = _range( 0, pages );
	}
	else if ( page <= half ) {
		numbers = _range( 0, buttons-2 );
		numbers.push( 'ellipsis' );
		numbers.push( pages-1 );
	}
	else if ( page >= pages - 1 - half ) {
		numbers = _range( pages-(buttons-2), pages );
		numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
		numbers.splice( 0, 0, 0 );
	}
	else {
		numbers = _range( page-half+2, page+half-1 );
		numbers.push( 'ellipsis' );
		numbers.push( pages-1 );
		numbers.splice( 0, 0, 'ellipsis' );
		numbers.splice( 0, 0, 0 );
	}

	numbers.DT_el = 'span';
	return numbers;
}


$.extend( extPagination, {
	simple: function ( page, pages ) {
		return [ 'previous', 'next' ];
	},

	full: function ( page, pages ) {
		return [  'first', 'previous', 'next', 'last' ];
	},

	numbers: function ( page, pages ) {
		return [ _numbers(page, pages) ];
	},

	simple_numbers: function ( page, pages ) {
		return [ 'previous', _numbers(page, pages), 'next' ];
	},

	full_numbers: function ( page, pages ) {
		return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
	},
	
	first_last_numbers: function (page, pages) {
 		return ['first', _numbers(page, pages), 'last'];
 	},

	// For testing and plug-ins to use
	_numbers: _numbers,

	// Number of number buttons (including ellipsis) to show. _Must be odd!_
	numbers_length: 7
} );


$.extend( true, DataTable.ext.renderer, {
	pageButton: {
		_: function ( settings, host, idx, buttons, page, pages ) {
			var classes = settings.oClasses;
			var lang = settings.oLanguage.oPaginate;
			var aria = settings.oLanguage.oAria.paginate || {};
			var btnDisplay, btnClass, counter=0;

			var attach = function( container, buttons ) {
				var i, ien, node, button, tabIndex;
				var disabledClass = classes.sPageButtonDisabled;
				var clickHandler = function ( e ) {
					_fnPageChange( settings, e.data.action, true );
				};

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					button = buttons[i];

					if ( Array.isArray( button ) ) {
						var inner = $( '<'+(button.DT_el || 'div')+'/>' )
							.appendTo( container );
						attach( inner, button );
					}
					else {
						btnDisplay = null;
						btnClass = button;
						tabIndex = settings.iTabIndex;

						switch ( button ) {
							case 'ellipsis':
								container.append('<span class="ellipsis">&#x2026;</span>');
								break;

							case 'first':
								btnDisplay = lang.sFirst;

								if ( page === 0 ) {
									tabIndex = -1;
									btnClass += ' ' + disabledClass;
								}
								break;

							case 'previous':
								btnDisplay = lang.sPrevious;

								if ( page === 0 ) {
									tabIndex = -1;
									btnClass += ' ' + disabledClass;
								}
								break;

							case 'next':
								btnDisplay = lang.sNext;

								if ( pages === 0 || page === pages-1 ) {
									tabIndex = -1;
									btnClass += ' ' + disabledClass;
								}
								break;

							case 'last':
								btnDisplay = lang.sLast;

								if ( pages === 0 || page === pages-1 ) {
									tabIndex = -1;
									btnClass += ' ' + disabledClass;
								}
								break;

							default:
								btnDisplay = settings.fnFormatNumber( button + 1 );
								btnClass = page === button ?
									classes.sPageButtonActive : '';
								break;
						}

						if ( btnDisplay !== null ) {
							node = $('<a>', {
									'class': classes.sPageButton+' '+btnClass,
									'aria-controls': settings.sTableId,
									'aria-label': aria[ button ],
									'data-dt-idx': counter,
									'tabindex': tabIndex,
									'id': idx === 0 && typeof button === 'string' ?
										settings.sTableId +'_'+ button :
										null
								} )
								.html( btnDisplay )
								.appendTo( container );

							_fnBindAction(
								node, {action: button}, clickHandler
							);

							counter++;
						}
					}
				}
			};

			// IE9 throws an 'unknown error' if document.activeElement is used
			// inside an iframe or frame. Try / catch the error. Not good for
			// accessibility, but neither are frames.
			var activeEl;

			try {
				// Because this approach is destroying and recreating the paging
				// elements, focus is lost on the select button which is bad for
				// accessibility. So we want to restore focus once the draw has
				// completed
				activeEl = $(host).find(document.activeElement).data('dt-idx');
			}
			catch (e) {}

			attach( $(host).empty(), buttons );

			if ( activeEl !== undefined ) {
				$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
			}
		}
	}
} );

