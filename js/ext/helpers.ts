import util from '../util';
import { register as registerType, store as typeStore } from './types';

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
function __mld(
	dtLib: any,
	momentFn: string,
	luxonFn: string,
	dateFn: string,
	arg1?: any
) {
	if (__moment) {
		return dtLib[momentFn](arg1);
	}
	else if (__luxon) {
		return dtLib[luxonFn](arg1);
	}

	return dateFn ? dtLib[dateFn](arg1) : dtLib;
}

var __mlWarning = false;
var __luxon: any;
var __moment: any;

/**
 *
 */
function resolveWindowLibs() {
	__luxon = util.external('luxon');
	__moment = util.external('moment');
}

function __mldObj(d: string, format?: string | null, locale?: string) {
	var dt;

	resolveWindowLibs();

	if (__moment) {
		dt = __moment.utc(d, format, locale, true);

		if (!dt.isValid()) {
			return null;
		}
	}
	else if (__luxon) {
		dt =
			format && typeof d === 'string'
				? __luxon.DateTime.fromFormat(d, format)
				: __luxon.DateTime.fromISO(d);

		if (!dt.isValid) {
			return null;
		}

		dt = dt.setLocale(locale);
	}
	else if (!format) {
		// No format given, must be ISO
		dt = new Date(d);
	}
	else {
		if (!__mlWarning) {
			alert(
				'DataTables warning: Formatted date without Moment.js or Luxon - https://datatables.net/tn/17'
			);
		}

		__mlWarning = true;
	}

	return dt;
}

// Wrapper for date, datetime and time which all operate the same way with the exception of
// the output string for auto locale support
function __mlHelper(localeString: string) {
	return function (
		from?: string | null,
		to?: string | null,
		locale?: string,
		def?: string
	) {
		// Luxon and Moment support
		// Argument shifting
		if (arguments.length === 0) {
			locale = 'en';
			to = null; // means toLocaleString
			from = null; // means iso8601
		}
		else if (arguments.length === 1) {
			locale = 'en';
			to = from;
			from = null;
		}
		else if (arguments.length === 2) {
			locale = to as string;
			to = from;
			from = null;
		}

		var typeName = 'datetime' + (to ? '-' + to : '');

		// Add type detection and sorting specific to this date format - we need to be able to identify
		// date type columns as such, rather than as numbers in extensions. Hence the need for this.
		if (!typeStore.order[typeName + '-pre']) {
			registerType(typeName, {
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

		return function (d: any, type: string) {
			// Allow for a default value
			if (d === null || d === undefined) {
				if (def === '--now') {
					// We treat everything as UTC further down, so no changes are
					// made, as such need to get the local date / time as if it were
					// UTC
					var local = new Date();
					d = new Date(
						Date.UTC(
							local.getFullYear(),
							local.getMonth(),
							local.getDate(),
							local.getHours(),
							local.getMinutes(),
							local.getSeconds()
						)
					);
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
			if (
				to !== null &&
				from === to &&
				type !== 'sort' &&
				type !== 'type' &&
				!(d instanceof Date)
			) {
				return d;
			}

			var dt = __mldObj(d, from, locale);

			if (dt === null) {
				return d;
			}

			if (type === 'sort') {
				return dt;
			}

			var formatted =
				to === null
					? __mld(dt, 'toDate', 'toJSDate', '')[localeString](
							navigator.language,
							{ timeZone: 'UTC' }
					  )
					: __mld(dt, 'format', 'toFormat', 'toISOString', to);

			// XSS protection
			return type === 'display' ? util.escapeHtml(formatted) : formatted;
		};
	};
}

// Based on locale, determine standard number formatting
// Fallback for legacy browsers is US English
var __thousands = ',';
var __decimal = '.';

if (window.Intl !== undefined) {
	try {
		var num = new Intl.NumberFormat().formatToParts(100000.1);

		for (var i = 0; i < num.length; i++) {
			if (num[i].type === 'group') {
				__thousands = num[i].value;
			}
			else if (num[i].type === 'decimal') {
				__decimal = num[i].value;
			}
		}
	} catch (e) {
		// noop
	}
}

// Formatted date time detection - use by declaring the formats you are going to use
export function datetime(format: string, locale?: string) {
	var typeName = 'datetime-' + format;

	if (!locale) {
		locale = 'en';
	}

	if (!typeStore.order[typeName]) {
		registerType(typeName, {
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
 */
export default {
	date: __mlHelper('toLocaleDateString'),
	datetime: __mlHelper('toLocaleString'),
	time: __mlHelper('toLocaleTimeString'),
	number: function (
		thousands?: string | null,
		decimal?: string | null,
		precision?: number,
		prefix?: string,
		postfix?: string
	) {
		// Auto locale detection
		if (thousands === null || thousands === undefined) {
			thousands = __thousands;
		}

		if (decimal === null || decimal === undefined) {
			decimal = __decimal;
		}

		return {
			display: function (d: unknown) {
				if (typeof d !== 'number' && typeof d !== 'string') {
					return d;
				}

				if (d === '' || d === null) {
					return d;
				}

				var flo: any = typeof d === 'number' ? d : parseFloat(d);
				var negative = flo < 0 ? '-' : '';
				var abs = Math.abs(flo);

				// Scientific notation for large and small numbers
				if (abs >= 100000000000 || (abs < 0.0001 && abs !== 0)) {
					var exp = flo.toExponential(precision).split(/e\+?/);
					return exp[0] + ' x 10<sup>' + exp[1] + '</sup>';
				}

				// If NaN then there isn't much formatting that we can do - just
				// return immediately, escaping any HTML (this was supposed to
				// be a number after all)
				if (isNaN(flo)) {
					return util.escapeHtml(d);
				}

				flo = flo.toFixed(precision);

				var absPart = Math.abs(flo);
				var intPart = parseInt(flo, 10);
				var floatPart = precision
					? decimal + (absPart - intPart).toFixed(precision).substring(2)
					: '';

				// If zero, then can't have a negative prefix
				if (intPart === 0 && parseFloat(floatPart) === 0) {
					negative = '';
				}

				return (
					negative +
					(prefix || '') +
					intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands) +
					floatPart +
					(postfix || '')
				);
			}
		};
	},

	text: function () {
		return {
			display: util.escapeHtml,
			filter: util.escapeHtml
		};
	}
} as Record<string, Function>;
