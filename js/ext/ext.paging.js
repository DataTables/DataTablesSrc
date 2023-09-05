

var extPagination = DataTable.ext.pager;

// Paging buttons configuration
$.extend( extPagination, {
	simple: function () {
		return [ 'previous', 'next' ];
	},

	full: function ( page, pages ) {
		return [  'first', 'previous', 'next', 'last' ];
	},

	numbers: function () {
		return [ 'numbers' ];
	},

	simple_numbers: function () {
		return [ 'previous', 'numbers', 'next' ];
	},

	full_numbers: function () {
		return [ 'first', 'previous', 'numbers', 'next', 'last' ];
	},
	
	first_last: function () {
		return ['first', 'last'];
	},
	
	first_last_numbers: function () {
 		return ['first', 'numbers', 'last'];
 	},

	// For testing and plug-ins to use
	_numbers: _pagingNumbers,

	// Number of number buttons - legacy, use `numbers` option for paging feature
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
