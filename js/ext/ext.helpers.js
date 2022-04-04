
/*
 * Public helper functions. These aren't used internally by DataTables, or
 * called by any of the options passed into DataTables, but they can be used
 * externally by developers working with DataTables. They are helper functions
 * to make working with DataTables a little bit easier.
 */

var __htmlEscapeEntities = function ( d ) {
	return typeof d === 'string' ?
		d
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;') :
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
	moment: function ( from, to, locale, def ) {
		// Argument shifting
		if ( arguments.length === 1 ) {
			locale = 'en';
			to = from;
			from = from;
		}
		else if ( arguments.length === 2 ) {
			locale = 'en';
		}

		var typeName = 'moment-' + to;

		// Add type detection and sorting specific to this date format - we need to be able to identify
		// date type columns as such, rather than as numbers in extensions. Hence the need for this.
		if (! DataTable.ext.type.order[typeName]) {
			// The renderer will give the value to type detect as the type!
			DataTable.ext.type.detect.unshift(function (d) {
				return d === typeName ? typeName : false;
			});

			// Use moment to sort dates - the dates are already moment objects from the `sort` renderer
			DataTable.ext.type.order[typeName + '-asc'] = function (a, b) {
				return a.isSame(b)
					? 0
					: a.isBefore(b)
						? -1
						: 1;
			}

			DataTable.ext.type.order[typeName + '-desc'] = function (a, b) {
				return a.isSame(b)
					? 0
					: a.isAfter(b)
						? -1
						: 1;
			}
		}
	
		return function ( d, type ) {
			// Allow for a default value
			if (d === null || d === undefined) {
				if (def === '--now') {
					// We treat everything as UTC further down, so no changes are
					// made, as such need to get the local date / time as if it were
					// UTC
					var local = new Date();
					d = new Date( Date.UTC(
						local.getFullYear(), local.getMonth(), local.getDate(),
						local.getHours(), local.getMinutes(), local.getSeconds()
					) );
				}
				else {
					d = '';
				}
			}

			if (type === 'type') {
				// Typing uses the type name for fast matching
				return typeName;
			}

			if (d === '') {
				return type === 'sort'
					? moment('0000-01-01')
					: d;
			}

			// Shortcut. If `from` and `to` are the same, we are using the renderer to
			// format for ordering, not display - its already in the display format.
			if ( from === to && type !== 'sort' && type !== 'type' && ! (d instanceof Date) ) {
				return d;
			}

			var m = window.moment.utc( d, from, locale, true );

			if (! m.isValid()) {
				return d;
			}

			if (type === 'sort') {
				return m;
			}

			var formatted = m.format( to );

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

				var flo = parseFloat( d );
				var abs = Math.abs(flo);

				// Scientific notation for large and small numbers
				if (abs >= 100000000000 || (abs < 0.0001 && abs !== 0) ) {
					var exp = flo.toExponential(precision).split(/e\+?/);
					return exp[0] + ' x 10<sup>' + exp[1] + '</sup>';
				}

				var negative = d < 0 ? '-' : '';

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

				// If zero, then can't have a negative prefix
				if (intPart === 0 && parseFloat(floatPart) === 0) {
					negative = '';
				}

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

