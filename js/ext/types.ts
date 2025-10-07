
import { numToDecimal, empty, isNumber, htmlNumeric, re_html, re_formatted_numeric } from "../core/internal";
import util from '../api/util';

export const store = {
	/** Automatic column class assignment */
	className: {},

	/** Type detection functions. */
	detect: [],

	/** Automatic renderer assignment */
	render: {},

	/** Type based search formatting. */
	search: {},

	/** Type based ordering. */
	order: {}
} as any; // TODO typing

// This is not strict ISO8601 - Date.parse() is quite lax, although
// implementations differ between browsers.
const _re_date = /^\d{2,4}[./-]\d{1,2}[./-]\d{1,2}([T ]{1}\d{1,2}[:.]\d{2}([.:]\d{2})?)?$/;

const _re_new_lines = /[\r\n\u2028]/g;

// Common function to remove new lines, strip HTML and diacritic control
function _filterString(stripHtml, normalize) {
	return function (str) {
		if (empty(str) || typeof str !== 'string') {
			return str;
		}

		str = str.replace( _re_new_lines, " " );

		if (stripHtml) {
			str = util.stripHtml(str);
		}

		if (normalize) {
			str = util.diacritics(str, false);
		}

		return str;
	};
}


function __numericReplace( d, decimalPlace, re1?, re2? ) {
	if ( d !== 0 && (!d || d === '-') ) {
		return -Infinity;
	}
	
	var type = typeof d;

	if (type === 'number' || type === 'bigint') {
		return d;
	}

	// If a decimal place other than `.` is used, it needs to be given to the
	// function so we can detect it and replace with a `.` which is the only
	// decimal place JavaScript recognises - it is not locale aware.
	if ( decimalPlace ) {
		d = numToDecimal( d, decimalPlace );
	}

	if ( d.replace ) {
		if ( re1 ) {
			d = d.replace( re1, '' );
		}

		if ( re2 ) {
			d = d.replace( re2, '' );
		}
	}

	return d * 1;
};


// Get / set type
export function register(name, prop, val?) {
	if (! prop) {
		return {
			className: store.className[name],
			detect: store.detect.find(function (fn) {
				return fn._name === name;
			}),
			order: {
				pre: store.order[name + '-pre'],
				asc: store.order[name + '-asc'],
				desc: store.order[name + '-desc']
			},
			render: store.render[name],
			search: store.search[name]
		};
	}

	var setProp = function(prop, propVal) {
		store[prop][name] = propVal;
	};
	var setDetect = function (detect) {
		// `detect` can be a function or an object - we set a name
		// property for either - that is used for the detection
		Object.defineProperty(detect, "_name", {value: name});

		var idx = store.detect.findIndex(function (item: any) {
			return item._name === name;
		});

		if (idx === -1) {
			store.detect.unshift(detect);
		}
		else {
			store.detect.splice(idx, 1, detect);
		}
	};
	var setOrder = function (obj) {
		store.order[name + '-pre'] = obj.pre; // can be undefined
		store.order[name + '-asc'] = obj.asc; // can be undefined
		store.order[name + '-desc'] = obj.desc; // can be undefined
	};

	// prop is optional
	if (val === undefined) {
		val = prop;
		prop = null;
	}

	if (prop === 'className') {
		setProp('className', val);
	}
	else if (prop === 'detect') {
		setDetect(val);
	}
	else if (prop === 'order') {
		setOrder(val);
	}
	else if (prop === 'render') {
		setProp('render', val);
	}
	else if (prop === 'search') {
		setProp('search', val);
	}
	else if (! prop) {
		if (val.className) {
			setProp('className', val.className);
		}

		if (val.detect !== undefined) {
			setDetect(val.detect);
		}

		if (val.order) {
			setOrder(val.order);
		}

		if (val.render !== undefined) {
			setProp('render', val.render);
		}

		if (val.search !== undefined) {
			setProp('search', val.search);
		}
	}
}

// Get a list of types
export function types () {
	return store.detect.map(function (fn) {
		return fn._name;
	});
};

var __diacriticSort = function (a, b) {
	a = a !== null && a !== undefined ? a.toString().toLowerCase() : '';
	b = b !== null && b !== undefined ? b.toString().toLowerCase() : '';

	// Checked for `navigator.languages` support in `oneOf` so this code can't execute in old
	// Safari and thus can disable this check
	// eslint-disable-next-line compat/compat
	return a.localeCompare(b, navigator.languages[0] || navigator.language, {
		numeric: true,
		ignorePunctuation: true,
	});
}

var __diacriticHtmlSort = function (a, b) {
	a = util.stripHtml(a);
	b = util.stripHtml(b);

	return __diacriticSort(a, b);
}

//
// Built in data types
//

register('string', {
	detect: function () {
		return 'string';
	},
	order: {
		pre: function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return empty(a) && typeof a !== 'boolean' ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		}
	},
	search: _filterString(false, true)
});

register('string-utf8', {
	detect: {
		allOf: function ( d ) {
			return true;
		},
		oneOf: function ( d ) {
			// At least one data point must contain a non-ASCII character
			// This line will also check if navigator.languages is supported or not. If not (Safari 10.0-)
			// this data type won't be supported.
			// eslint-disable-next-line compat/compat
			return ! empty( d ) && navigator.languages && typeof d === 'string' && d.match(/[^\x00-\x7F]/);
		}
	},
	order: {
		asc: __diacriticSort,
		desc: function (a, b) {
			return __diacriticSort(a, b) * -1;
		}
	},
	search: _filterString(false, true)
});


register('html', {
	detect: {
		allOf: function ( d ) {
			return empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1);
		},
		oneOf: function ( d ) {
			// At least one data point must contain a `<`
			return ! empty( d ) && typeof d === 'string' && d.indexOf('<') !== -1;
		}
	},
	order: {
		pre: function ( a ) {
			return empty(a) ?
				'' :
				a.replace ?
					util.stripHtml(a).trim().toLowerCase() :
					a+'';
		}
	},
	search: _filterString(true, true)
});


register('html-utf8', {
	detect: {
		allOf: function ( d ) {
			return empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1);
		},
		oneOf: function ( d ) {
			// At least one data point must contain a `<` and a non-ASCII character
			// eslint-disable-next-line compat/compat
			return navigator.languages &&
				! empty( d ) &&
				typeof d === 'string' &&
				d.indexOf('<') !== -1 &&
				typeof d === 'string' && d.match(/[^\x00-\x7F]/);
		}
	},
	order: {
		asc: __diacriticHtmlSort,
		desc: function (a, b) {
			return __diacriticHtmlSort(a, b) * -1;
		}
	},
	search: _filterString(true, true)
});


register('date', {
	className: 'dt-type-date',
	detect: {
		allOf: function ( d ) {
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || empty(d);
		},
		oneOf: function ( d ) {
			// At least one entry must be a date or a string with a date
			return (d instanceof Date) || (typeof d === 'string' && _re_date.test(d));
		}
	},
	order: {
		pre: function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		}
	}
});


register('html-num-fmt', {
	className: 'dt-type-numeric',
	detect: {
		allOf: function ( d, settings ) {
			var decimal = settings.oLanguage.sDecimal;
			return htmlNumeric( d, decimal, true, false );
		},
		oneOf: function (d, settings) {
			// At least one data point must contain a numeric value
			var decimal = settings.oLanguage.sDecimal;
			return htmlNumeric( d, decimal, true, false );
		}
	},
	order: {
		pre: function ( d, s ) {
			var dp = s.oLanguage.sDecimal;
			return __numericReplace( d, dp, re_html, re_formatted_numeric );
		}
	},
	search: _filterString(true, true)
});


register('html-num', {
	className: 'dt-type-numeric',
	detect: {
		allOf: function ( d, settings ) {
			var decimal = settings.oLanguage.sDecimal;
			return htmlNumeric( d, decimal, false, true );
		},
		oneOf: function (d, settings) {
			// At least one data point must contain a numeric value
			var decimal = settings.oLanguage.sDecimal;
			return htmlNumeric( d, decimal, false, false );
		}
	},
	order: {
		pre: function ( d, s ) {
			var dp = s.oLanguage.sDecimal;
			return __numericReplace( d, dp, re_html );
		}
	},
	search: _filterString(true, true)
});


register('num-fmt', {
	className: 'dt-type-numeric',
	detect: {
		allOf: function ( d, settings ) {
			var decimal = settings.oLanguage.sDecimal;
			return isNumber( d, decimal, true, true );
		},
		oneOf: function (d, settings) {
			// At least one data point must contain a numeric value
			var decimal = settings.oLanguage.sDecimal;
			return isNumber( d, decimal, true, false );
		}
	},
	order: {
		pre: function ( d, s ) {
			var dp = s.oLanguage.sDecimal;
			return __numericReplace( d, dp, re_formatted_numeric );
		}
	}
});


register('num', {
	className: 'dt-type-numeric',
	detect: {
		allOf: function ( d, settings ) {
			var decimal = settings.oLanguage.sDecimal;
			return isNumber( d, decimal, false, true );
		},
		oneOf: function (d, settings) {
			// At least one data point must contain a numeric value
			var decimal = settings.oLanguage.sDecimal;
			return isNumber( d, decimal, false, false );
		}
	},
	order: {
		pre: function (d, s) {
			var dp = s.oLanguage.sDecimal;
			return __numericReplace( d, dp );
		}
	}
});
