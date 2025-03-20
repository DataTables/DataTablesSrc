
/*
 * Public helper functions. These aren't used internally by DataTables, or
 * called by any of the options passed into DataTables, but they can be used
 * externally by developers working with DataTables. They are helper functions
 * to make working with DataTables a little bit easier.
 */

/**
 * Common logic for moment, luxon or a date action.
 *
 * Happens after __mldObj, so don't need to call `resolveWindowsLibs` again
 */
function __mld( dtLib, momentFn, luxonFn, dateFn, arg1 ) {
	if (__moment) {
		return dtLib[momentFn]( arg1 );
	}
	else if (__luxon) {
		return dtLib[luxonFn]( arg1 );
	}
	
	return dateFn ? dtLib[dateFn]( arg1 ) : dtLib;
}


var __mlWarning = false;
var __luxon; // Can be assigned in DateTable.use()
var __moment; // Can be assigned in DateTable.use()

/**
 * 
 */
function resolveWindowLibs() {
	if (window.luxon && ! __luxon) {
		__luxon = window.luxon;
	}
	
	if (window.moment && ! __moment) {
		__moment = window.moment;
	}
}

function __mldObj (d, format, locale) {
	var dt;

	resolveWindowLibs();

	if (__moment) {
		dt = __moment.utc( d, format, locale, true );

		if (! dt.isValid()) {
			return null;
		}
	}
	else if (__luxon) {
		dt = format && typeof d === 'string'
			? __luxon.DateTime.fromFormat( d, format )
			: __luxon.DateTime.fromISO( d );

		if (! dt.isValid) {
			return null;
		}

		dt = dt.setLocale(locale);
	}
	else if (! format) {
		// No format given, must be ISO
		dt = new Date(d);
	}
	else {
		if (! __mlWarning) {
			alert('DataTables warning: Formatted date without Moment.js or Luxon - https://datatables.net/tn/17');
		}

		__mlWarning = true;
	}

	return dt;
}

// Wrapper for date, datetime and time which all operate the same way with the exception of
// the output string for auto locale support
function __mlHelper (localeString) {
	return function ( from, to, locale, def ) {
		// Luxon and Moment support
		// Argument shifting
		if ( arguments.length === 0 ) {
			locale = 'en';
			to = null; // means toLocaleString
			from = null; // means iso8601
		}
		else if ( arguments.length === 1 ) {
			locale = 'en';
			to = from;
			from = null;
		}
		else if ( arguments.length === 2 ) {
			locale = to;
			to = from;
			from = null;
		}

		var typeName = 'datetime' + (to ? '-' + to : '');

		// Add type detection and sorting specific to this date format - we need to be able to identify
		// date type columns as such, rather than as numbers in extensions. Hence the need for this.
		if (! DataTable.ext.type.order[typeName + '-pre']) {
			DataTable.type(typeName, {
				detect: function (d) {
					// The renderer will give the value to type detect as the type!
					return d === typeName ? typeName : false;
				},
				order: {
					pre: function (d) {
						// The renderer gives us Moment, Luxon or Date objects for the sorting, all of which have a
						// `valueOf` which gives milliseconds epoch
						return d.valueOf();
					}
				},
				className: 'dt-right'
			});
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
				return type !== 'sort'
					? ''
					: __mldObj('0000-01-01 00:00:00', null, locale);
			}

			// Shortcut. If `from` and `to` are the same, we are using the renderer to
			// format for ordering, not display - its already in the display format.
			if ( to !== null && from === to && type !== 'sort' && type !== 'type' && ! (d instanceof Date) ) {
				return d;
			}

			var dt = __mldObj(d, from, locale);

			if (dt === null) {
				return d;
			}

			if (type === 'sort') {
				return dt;
			}
			
			var formatted = to === null
				? __mld(dt, 'toDate', 'toJSDate', '')[localeString]()
				: __mld(dt, 'format', 'toFormat', 'toISOString', to);

			// XSS protection
			return type === 'display' ?
				_escapeHtml( formatted ) :
				formatted;
		};
	}
}

// Based on locale, determine standard number formatting
// Fallback for legacy browsers is US English
var __thousands = ',';
var __decimal = '.';

if (window.Intl !== undefined) {
	try {
		var num = new Intl.NumberFormat().formatToParts(100000.1);
	
		for (var i=0 ; i<num.length ; i++) {
			if (num[i].type === 'group') {
				__thousands = num[i].value;
			}
			else if (num[i].type === 'decimal') {
				__decimal = num[i].value;
			}
		}
	}
	catch (e) {
		// noop
	}
}

// Formatted date time detection - use by declaring the formats you are going to use
DataTable.datetime = function ( format, locale ) {
	var typeName = 'datetime-' + format;

	if (! locale) {
		locale = 'en';
	}

	if (! DataTable.ext.type.order[typeName]) {
		DataTable.type(typeName, {
			detect: function (d) {
				var dt = __mldObj(d, format, locale);
				return d === '' || dt ? typeName : false;
			},
			order: {
				pre: function (d) {
					return __mldObj(d, format, locale) || 0;
				}
			},
			className: 'dt-right'
		});
	}
}

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
	date: __mlHelper('toLocaleDateString'),
	datetime: __mlHelper('toLocaleString'),
	time: __mlHelper('toLocaleTimeString'),
	number: function ( thousands, decimal, precision, prefix, postfix ) {
		// Auto locale detection
		if (thousands === null || thousands === undefined) {
			thousands = __thousands;
		}

		if (decimal === null || decimal === undefined) {
			decimal = __decimal;
		}

		return {
			display: function ( d ) {
				if ( typeof d !== 'number' && typeof d !== 'string' ) {
					return d;
				}

				if (d === '' || d === null) {
					return d;
				}

				var negative = d < 0 ? '-' : '';
				var flo = parseFloat( d );
				var abs = Math.abs(flo);

				// Scientific notation for large and small numbers
				if (abs >= 100000000000 || (abs < 0.0001 && abs !== 0) ) {
					var exp = flo.toExponential(precision).split(/e\+?/);
					return exp[0] + ' x 10<sup>' + exp[1] + '</sup>';
				}

				// If NaN then there isn't much formatting that we can do - just
				// return immediately, escaping any HTML (this was supposed to
				// be a number after all)
				if ( isNaN( flo ) ) {
					return _escapeHtml( d );
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
			display: _escapeHtml,
			filter: _escapeHtml
		};
	}
};

