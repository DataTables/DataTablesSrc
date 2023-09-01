
// Note that most of the paging logic is done in DataTable.ext.pager
_ext.features.register( 'paging', function ( settings, opts ) {
	// Don't show the paging input if the table doesn't have paging enabled
	if (! settings.oFeatures.bPaginate) {
		return null;
	}

	var
		type   = opts && opts.type
			? opts.type
			: settings.sPaginationType,
		plugin = DataTable.ext.pager[ type ],
		host = $('<div/>').addClass( settings.oClasses.sPaging + type ),
		counter = settings.pagingControls++,
		aria = settings.oLanguage.oAria.paginate || {};

	settings.aoDrawCallback.push( {
		fn: function( settings ) {
			var
				start      = settings._iDisplayStart,
				len        = settings._iDisplayLength,
				visRecords = settings.fnRecordsDisplay(),
				all        = len === -1,
				page = all ? 0 : Math.ceil( start / len ),
				pages = all ? 1 : Math.ceil( visRecords / len ),
				buttons = plugin(page, pages).flat();

			var buttonEls = [];

			for (var i=0 ; i<buttons.length ; i++) {
				var button = buttons[i];

				var btnInfo = _pagingButtonInfo(settings, button, page, pages);
				var btn = _fnRenderer( settings, 'pagingButton' )(
					settings,
					button,
					btnInfo.display,
					btnInfo.active,
					btnInfo.disabled
				);

				// Common attributes
				$(btn.clicker).attr({
					'aria-controls': settings.sTableId,
					'aria-disabled': btnInfo.disabled ? 'true' : null,
					'aria-current': btnInfo.active ? 'page' : null,
					'aria-label': aria[ button ],
					'data-dt-idx': button,
					'tabIndex': btnInfo.disabled ? -1 : settings.iTabIndex,
				});

				if (typeof button !== 'number') {
					$(btn.clicker).addClass(button);
				}

				_fnBindAction(
					btn.clicker, {action: button}, function(e) {
						e.preventDefault();

						_fnPageChange( settings, e.data.action, true );
					}
				);

				buttonEls.push(btn.display);
			}

			var wrapped = _fnRenderer(settings, 'pagingContainer')(
				settings, buttonEls
			);

			var activeEl = host.find(document.activeElement).data('dt-idx');

			host.empty().append(wrapped);

			if ( activeEl !== undefined ) {
				host.find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
			}
		}
	} );

	return host;
} );

/**
 * Get properties for a button based on the current paging state of the table
 *
 * @param {*} settings DT settings object
 * @param {*} button The button type in question
 * @param {*} page Table's current page
 * @param {*} pages Number of pages
 * @returns Info object
 */
function _pagingButtonInfo(settings, button, page, pages) {
	var lang = settings.oLanguage.oPaginate;
	var o = {
		display: '',
		active: false,
		disabled: false
	};

	switch ( button ) {
		case 'ellipsis':
			o.display = '&#x2026;';
			o.disabled = true;
			break;

		case 'first':
			o.display = lang.sFirst;

			if (page === 0) {
				o.disabled = true;
			}
			break;

		case 'previous':
			o.display = lang.sPrevious;

			if ( page === 0 ) {
				o.disabled = true;
			}
			break;

		case 'next':
			o.display = lang.sNext;

			if ( pages === 0 || page === pages-1 ) {
				o.disabled = true;
			}
			break;

		case 'last':
			o.display = lang.sLast;

			if ( pages === 0 || page === pages-1 ) {
				o.disabled = true;
			}
			break;

		default:
			if ( typeof button === 'number' ) {
				o.display = settings.fnFormatNumber( button + 1 );
				
				if (page === button) {
					o.active = true;
				}
			}
			break;
	}

	return o;
}
