
// opts
// - type - button configuration
// - buttons - number of buttons to show - must be odd
DataTable.feature.register( 'paging', function ( settings, opts ) {
	// Don't show the paging input if the table doesn't have paging enabled
	if (! settings.oFeatures.bPaginate) {
		return null;
	}

	opts = $.extend({
		buttons: DataTable.ext.pager.numbers_length,
		type: settings.sPaginationType,
		boundaryNumbers: true,
		firstLast: true,
		previousNext: true,
		numbers: true
	}, opts);

	var host = $('<div/>')
		.addClass(settings.oClasses.paging.container + (opts.type ? ' paging_' + opts.type : ''));
	var draw = function () {
		_pagingDraw(settings, host, opts);
	};

	settings.aoDrawCallback.push(draw);

	// Responsive redraw of paging control
	$(settings.nTable).on('column-sizing.dt.DT', draw);

	return host;
}, 'p' );

/**
 * Dynamically create the button type array based on the configuration options.
 * This will only happen if the paging type is not defined.
 */
function _pagingDynamic(opts) {
	var out = [];

	if (opts.numbers) {
		out.push('numbers');
	}

	if (opts.previousNext) {
		out.unshift('previous');
		out.push('next');
	}

	if (opts.firstLast) {
		out.unshift('first');
		out.push('last');
	}

	return out;
}

function _pagingDraw(settings, host, opts) {
	if (! settings._bInitComplete) {
		return;
	}

	var
		plugin = opts.type
			? DataTable.ext.pager[ opts.type ]
			: _pagingDynamic,
		aria = settings.oLanguage.oAria.paginate || {},
		start      = settings._iDisplayStart,
		len        = settings._iDisplayLength,
		visRecords = settings.fnRecordsDisplay(),
		all        = len === -1,
		page = all ? 0 : Math.ceil( start / len ),
		pages = all ? 1 : Math.ceil( visRecords / len ),
		buttons = plugin(opts)
			.map(function (val) {
				return val === 'numbers'
					? _pagingNumbers(page, pages, opts.buttons, opts.boundaryNumbers)
					: val;
			})
			.flat();

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

		var ariaLabel = typeof button === 'string'
			? aria[ button ]
			: aria.number
				? aria.number + (button+1)
				: null;

		// Common attributes
		$(btn.clicker).attr({
			'aria-controls': settings.sTableId,
			'aria-disabled': btnInfo.disabled ? 'true' : null,
			'aria-current': btnInfo.active ? 'page' : null,
			'aria-label': ariaLabel,
			'data-dt-idx': button,
			'tabIndex': btnInfo.disabled
				? -1
				: settings.iTabIndex
					? settings.iTabIndex
					: null, // `0` doesn't need a tabIndex since it is the default
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

	// Responsive - check if the buttons are over two lines based on the
	// height of the buttons and the container.
	if (
		buttonEls.length && // any buttons
		opts.buttons > 1 && // prevent infinite
		$(host).height() >= ($(buttonEls[0]).outerHeight() * 2) - 10
	) {
		_pagingDraw(settings, host, $.extend({}, opts, { buttons: opts.buttons - 2 }));
	}
}

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

/**
 * Compute what number buttons to show in the paging control
 *
 * @param {*} page Current page
 * @param {*} pages Total number of pages
 * @param {*} buttons Target number of number buttons
 * @param {boolean} addFirstLast Indicate if page 1 and end should be included
 * @returns Buttons to show
 */
function _pagingNumbers ( page, pages, buttons, addFirstLast ) {
	var
		numbers = [],
		half = Math.floor(buttons / 2),
		before = addFirstLast ? 2 : 1,
		after = addFirstLast ? 1 : 0;

	if ( pages <= buttons ) {
		numbers = _range(0, pages);
	}
	else if (buttons === 1) {
		// Single button - current page only
		numbers = [page];
	}
	else if (buttons === 3) {
		// Special logic for just three buttons
		if (page <= 1) {
			numbers = [0, 1, 'ellipsis'];
		}
		else if (page >= pages - 2) {
			numbers = _range(pages-2, pages);
			numbers.unshift('ellipsis');
		}
		else {
			numbers = ['ellipsis', page, 'ellipsis'];
		}
	}
	else if ( page <= half ) {
		numbers = _range(0, buttons-before);
		numbers.push('ellipsis');

		if (addFirstLast) {
			numbers.push(pages-1);
		}
	}
	else if ( page >= pages - 1 - half ) {
		numbers = _range(pages-(buttons-before), pages);
		numbers.unshift('ellipsis');

		if (addFirstLast) {
			numbers.unshift(0);
		}
	}
	else {
		numbers = _range(page-half+before, page+half-after);
		numbers.push('ellipsis');
		numbers.unshift('ellipsis');

		if (addFirstLast) {
			numbers.push(pages-1);
			numbers.unshift(0);
		}
	}

	return numbers;
}
