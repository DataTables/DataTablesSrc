

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
	
	first_last: function (page, pages) {
		return ['first', 'last'];
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
	pagingButton: {
		_: function (settings, buttonType, content, active, disabled) {
			var classes = settings.oClasses;
			var btnClasses = [classes.sPageButton];
			var btn;

			if (active) {
				btnClasses.push(classes.sPageButtonActive);
			}

			if (disabled) {
				btnClasses.push(classes.sPageButtonDisabled)
			}

			if (buttonType === 'ellipsis') {
				btn = $('<span class="ellipsis"></span>').html(content)[0];
			}
			else {
				btn = $('<button>', {
					class: btnClasses.join(' '),
					role: 'link',
					type: 'button'
				}).html(content);
			}

			return {
				display: btn,
				clicker: btn
			}
		}
	},

	pagingContainer: {
		_: function (settings, buttons) {
			// No wrapping element - just append directly to the host
			return buttons;
		}
	}
} );

