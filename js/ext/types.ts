import ColumnModel from '../model/columns/settings';
import { Context } from '../model/settings';
import util from '../util';

type DataTypeDetectFn = (
	data: any,
	context: Context
) => boolean | string | null;

interface DataTypeDetectNamed extends DataTypeDetectFn {
	_name: string;
}

type DataTypeDetectInitFn = (
	context: Context,
	col: ColumnModel,
	index: number
) => boolean | string | null;

type DataTypeDetect =
	| DataTypeDetectFn
	| {
			oneOf?: DataTypeDetectFn;
			allOf: DataTypeDetectFn;
			init?: DataTypeDetectInitFn;
	  };

type DataTypeSortFn = (dataA: any, dataB: any) => number;
type DataTypeSortPreFn = (data: any, settings: Context) => any;
type DataTypeOrder = {
	asc?: DataTypeSortFn;
	desc?: DataTypeSortFn;
	pre?: DataTypeSortPreFn;
};

type DataTypeSearchFn = (input: any) => any;

interface DataType {
	className: string;
	detect: DataTypeDetect;
	order: DataTypeOrder;
	render: any;
	search: DataTypeSearchFn;
}

export interface TypeStore {
	/** Automatic column class assignment */
	className: Record<string, string>;

	/** Type detection functions. */
	detect: DataTypeDetect[];

	/** Automatic renderer assignment */
	render: Record<string, any>; // TODO

	/** Type based search formatting. */
	search: Record<string, DataTypeSearchFn>;

	/** Type based ordering. */
	order: Record<string, DataTypeSortFn | DataTypeSortPreFn | undefined>;
}

export const store = {
	className: {},
	detect: [],
	render: {},
	search: {},
	order: {}
} as TypeStore;

// Common function to remove new lines, strip HTML and diacritic control
function _filterString(stripHtml: boolean, normalize: boolean) {
	return function (str: any) {
		if (util.is.empty(str) || typeof str !== 'string') {
			return str;
		}

		str = str.replace(util.regex.reNewLines, ' ');

		if (stripHtml) {
			str = util.stripHtml(str);
		}

		if (normalize) {
			str = util.diacritics(str, false);
		}

		return str;
	};
}

function __numericReplace(
	d: string | number | null,
	decimalPlace: string,
	re1?: RegExp,
	re2?: RegExp
): number {
	if (d !== 0 && (!d || d === '-')) {
		return -Infinity;
	}

	if (typeof d === 'number' || typeof d === 'bigint') {
		return d;
	}

	// If a decimal place other than `.` is used, it needs to be given to the
	// function so we can detect it and replace with a `.` which is the only
	// decimal place JavaScript recognises - it is not locale aware.
	if (decimalPlace) {
		d = util.conv.numToDecimal(d, decimalPlace);
	}

	if (typeof d === 'string') {
		if (re1) {
			d = d.replace(re1, '');
		}

		if (re2) {
			d = d.replace(re2, '');
		}
	}

	return (d as any) * 1;
}

// Get / set type
export function register(name: string): DataType;
export function register(
	name: string,
	prop: 'className',
	className: string
): void;
export function register(
	name: string,
	prop: 'detect',
	detect: DataTypeDetect
): void;
export function register(
	name: string,
	prop: 'order',
	order: DataTypeOrder
): void;
export function register(name: string, prop: 'render', render: any): void;
export function register(
	name: string,
	prop: 'search',
	search: DataTypeSearchFn
): void;
export function register(name: string, type: Partial<DataType>): void;

export function register(
	name: string,
	prop?: string | Partial<DataType>,
	val?: any
): any {
	if (!prop) {
		return {
			className: store.className[name],
			detect: store.detect.find(function (fn: any) {
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

	var setProp = function (
		prop2: 'className' | 'render' | 'search' | 'order',
		propVal: any
	) {
		store[prop2][name] = propVal;
	};
	var setDetect = function (detect: DataTypeDetectNamed) {
		// `detect` can be a function or an object - we set a name
		// property for either - that is used for the detection
		Object.defineProperty(detect, '_name', { value: name });

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
	var setOrder = function (obj: DataTypeOrder) {
		store.order[name + '-pre'] = obj.pre; // can be undefined
		store.order[name + '-asc'] = obj.asc; // can be undefined
		store.order[name + '-desc'] = obj.desc; // can be undefined
	};

	// prop is optional
	if (val === undefined) {
		val = prop;
		prop = undefined;
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
	else if (!prop) {
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
export function types() {
	return store.detect.map(function (detect: any) {
		return detect._name;
	});
}

var __diacriticSort = function (a: any, b: any) {
	a = a !== null && a !== undefined ? a.toString().toLowerCase() : '';
	b = b !== null && b !== undefined ? b.toString().toLowerCase() : '';

	// Checked for `navigator.languages` support in `oneOf` so this code can't execute in old
	// Safari and thus can disable this check
	// eslint-disable-next-line compat/compat
	return a.localeCompare(b, navigator.languages[0] || navigator.language, {
		numeric: true,
		ignorePunctuation: true
	});
};

var __diacriticHtmlSort = function (a: string, b: string) {
	a = util.stripHtml(a);
	b = util.stripHtml(b);

	return __diacriticSort(a, b);
};

//
// Built in data types
//

register('string', {
	detect: function () {
		return 'string';
	},
	order: {
		pre: function (a) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return util.is.empty(a) && typeof a !== 'boolean'
				? ''
				: typeof a === 'string'
				? a.toLowerCase()
				: !a.toString
				? ''
				: a.toString();
		}
	},
	search: _filterString(false, true)
});

register('string-utf8', {
	detect: {
		allOf: function () {
			return true;
		},
		oneOf: function (d) {
			// At least one data point must contain a non-ASCII character
			// This line will also check if navigator.languages is supported or not. If not (Safari 10.0-)
			// this data type won't be supported.
			// eslint-disable-next-line compat/compat
			return (
				!util.is.empty(d) &&
				navigator.languages &&
				typeof d === 'string' &&
				!!d.match(/[^\x00-\x7F]/)
			);
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
		allOf: function (d) {
			return (
				util.is.empty(d) || (typeof d === 'string' && d.indexOf('<') !== -1)
			);
		},
		oneOf: function (d) {
			// At least one data point must contain a `<`
			return (
				!util.is.empty(d) && typeof d === 'string' && d.indexOf('<') !== -1
			);
		}
	},
	order: {
		pre: function (a) {
			return util.is.empty(a)
				? ''
				: a.replace
				? util.stripHtml(a).trim().toLowerCase()
				: a + '';
		}
	},
	search: _filterString(true, true)
});

register('html-utf8', {
	detect: {
		allOf: function (d) {
			return (
				util.is.empty(d) || (typeof d === 'string' && d.indexOf('<') !== -1)
			);
		},
		oneOf: function (d) {
			// At least one data point must contain a `<` and a non-ASCII character
			// eslint-disable-next-line compat/compat
			return (
				navigator.languages &&
				!util.is.empty(d) &&
				typeof d === 'string' &&
				d.indexOf('<') !== -1 &&
				typeof d === 'string' &&
				!!d.match(/[^\x00-\x7F]/)
			);
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
		allOf: function (d) {
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if (d && !(d instanceof Date) && !util.regex.reDate.test(d)) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || util.is.empty(d);
		},
		oneOf: function (d) {
			// At least one entry must be a date or a string with a date
			return (
				d instanceof Date ||
				(typeof d === 'string' && util.regex.reDate.test(d))
			);
		}
	},
	order: {
		pre: function (d) {
			var ts = Date.parse(d);
			return isNaN(ts) ? -Infinity : ts;
		}
	}
});

register('html-num-fmt', {
	className: 'dt-type-numeric',
	detect: {
		allOf: function (d, settings) {
			var decimal = settings.language.decimal;
			return util.is.htmlNum(d, decimal, true, false);
		},
		oneOf: function (d, settings) {
			// At least one data point must contain a numeric value
			var decimal = settings.language.decimal;
			return util.is.htmlNum(d, decimal, true, false);
		}
	},
	order: {
		pre: function (d, s) {
			var dp = s.language.decimal;
			return __numericReplace(
				d,
				dp,
				util.regex.reHtml,
				util.regex.reFormattedNumeric
			);
		}
	},
	search: _filterString(true, true)
});

register('html-num', {
	className: 'dt-type-numeric',
	detect: {
		allOf: function (d, settings) {
			var decimal = settings.language.decimal;
			return util.is.htmlNum(d, decimal, false, true);
		},
		oneOf: function (d, settings) {
			// At least one data point must contain a numeric value
			var decimal = settings.language.decimal;
			return util.is.htmlNum(d, decimal, false, false);
		}
	},
	order: {
		pre: function (d, s) {
			var dp = s.language.decimal;
			return __numericReplace(d, dp, util.regex.reHtml);
		}
	},
	search: _filterString(true, true)
});

register('num-fmt', {
	className: 'dt-type-numeric',
	detect: {
		allOf: function (d, settings) {
			var decimal = settings.language.decimal;
			return util.is.num(d, decimal, true, true);
		},
		oneOf: function (d, settings) {
			// At least one data point must contain a numeric value
			var decimal = settings.language.decimal;
			return util.is.num(d, decimal, true, false);
		}
	},
	order: {
		pre: function (d, s) {
			var dp = s.language.decimal;
			return __numericReplace(d, dp, util.regex.reFormattedNumeric);
		}
	}
});

register('num', {
	className: 'dt-type-numeric',
	detect: {
		allOf: function (d, settings) {
			var decimal = settings.language.decimal;
			return util.is.num(d, decimal, false, true);
		},
		oneOf: function (d, settings) {
			// At least one data point must contain a numeric value
			var decimal = settings.language.decimal;
			return util.is.num(d, decimal, false, false);
		}
	},
	order: {
		pre: function (d, s) {
			var dp = s.language.decimal;
			return __numericReplace(d, dp);
		}
	}
});
