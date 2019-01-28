
/*
 * Public helper functions. These aren't used internally by DataTables, or
 * called by any of the options passed into DataTables, but they can be used
 * externally by developers working with DataTables. They are helper functions
 * to make working with DataTables a little bit easier.
 */

var __htmlEscapeEntities = function ( d ) {
	return typeof d === 'string' ?
		d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
		d;
};

/**
 * Helpers for `columns.render`.
 *
 * The options defined here can be used with the `columns.render` initialisation
 * option to provide a display renderer. The following functions are defined:
 *
 * * `moment` - Uses the MomentJS library to convert from a given format into another.
 * This renderer has three overloads:
 *   * 1 parameter:
 *     * `string` - Format to convert to (assumes input is ISO8601 and locale is `en`)
 *   * 2 parameters:
 *     * `string` - Format to convert from
 *     * `string` - Format to convert to. Assumes `en` locale
 *   * 3 parameters:
 *     * `string` - Format to convert from
 *     * `string` - Format to convert to
 *     * `string` - Locale
 * * `number` - Will format numeric data (defined by `columns.data`) for
 *   display, retaining the original unformatted data for sorting and filtering.
 *   It takes 5 parameters:
 *   * `string` - Thousands grouping separator
 *   * `string` - Decimal point indicator
 *   * `integer` - Number of decimal points to show
 *   * `string` (optional) - Prefix.
 *   * `string` (optional) - Postfix (/suffix).
 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
 *   parameters.
 *
 * @example
 *   // Column definition using the number renderer
 *   {
 *     data: "salary",
 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
 *   }
 *
 * @namespace
 */
DataTable.render = {
	moment: function ( from, to, locale ) {
		// Argument shifting
		if ( arguments.length === 1 ) {
			locale = 'en';
			to = from;
			from = 'YYYY-MM-DD';
		}
		else if ( arguments.length === 2 ) {
			locale = 'en';
		}
	
		return function ( d, type ) {
			var m = window.moment( d, from, locale, true );
	
			// Order and type get a number value from Moment, everything else
			// sees the rendered value
			var formatted = m.format( type === 'sort' || type === 'type' ? 'x' : to );

			// XSS protection
			return type === 'display' ?
				__htmlEscapeEntities( formatted ) :
				formatted;
		};
	},
	number: function ( thousands, decimal, precision, prefix, postfix ) {
		return {
			display: function ( d ) {
				if ( typeof d !== 'number' && typeof d !== 'string' ) {
					return d;
				}

				var negative = d < 0 ? '-' : '';
				var flo = parseFloat( d );

				// If NaN then there isn't much formatting that we can do - just
				// return immediately, escaping any HTML (this was supposed to
				// be a number after all)
				if ( isNaN( flo ) ) {
					return __htmlEscapeEntities( d );
				}

				flo = flo.toFixed( precision );
				d = Math.abs( flo );

				var intPart = parseInt( d, 10 );
				var floatPart = precision ?
					decimal+(d - intPart).toFixed( precision ).substring( 2 ):
					'';

				return negative + (prefix||'') +
					intPart.toString().replace(
						/\B(?=(\d{3})+(?!\d))/g, thousands
					) +
					floatPart +
					(postfix||'');
			}
		};
	},

	text: function () {
		return {
			display: __htmlEscapeEntities,
			filter: __htmlEscapeEntities
		};
	}
};

