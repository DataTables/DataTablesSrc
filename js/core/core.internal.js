
/*
 * It is useful to have variables which are scoped locally so only the
 * DataTables functions can access them and they don't leak into global space.
 * At the same time these functions are often useful over multiple files in the
 * core and API, so we list, or at least document, all variables which are used
 * by DataTables as private variables here. This also ensures that there is no
 * clashing of variable names and that they can easily referenced for reuse.
 */


// Defined else where
//  _selector_run
//  _selector_opts
//  _selector_row_indexes

var _ext; // DataTable.ext
var _Api; // DataTable.Api
var _api_register; // DataTable.Api.register
var _api_registerPlural; // DataTable.Api.registerPlural

var _re_dic = {};
var _re_new_lines = /[\r\n\u2028]/g;
var _re_html = /<([^>]*>)/g;
var _max_str_len = Math.pow(2, 28);

// This is not strict ISO8601 - Date.parse() is quite lax, although
// implementations differ between browsers.
var _re_date = /^\d{2,4}[./-]\d{1,2}[./-]\d{1,2}([T ]{1}\d{1,2}[:.]\d{2}([.:]\d{2})?)?$/;

// Escape regular expression special characters
var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );

// https://en.wikipedia.org/wiki/Foreign_exchange_market
// - \u20BD - Russian ruble.
// - \u20a9 - South Korean Won
// - \u20BA - Turkish Lira
// - \u20B9 - Indian Rupee
// - R - Brazil (R$) and South Africa
// - fr - Swiss Franc
// - kr - Swedish krona, Norwegian krone and Danish krone
// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
// - Ƀ - Bitcoin
// - Ξ - Ethereum
//   standards as thousands separators.
var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;


var _empty = function ( d ) {
	return !d || d === true || d === '-' ? true : false;
};


var _intVal = function ( s ) {
	var integer = parseInt( s, 10 );
	return !isNaN(integer) && isFinite(s) ? integer : null;
};

// Convert from a formatted number with characters other than `.` as the
// decimal place, to a Javascript number
var _numToDecimal = function ( num, decimalPoint ) {
	// Cache created regular expressions for speed as this function is called often
	if ( ! _re_dic[ decimalPoint ] ) {
		_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
	}
	return typeof num === 'string' && decimalPoint !== '.' ?
		num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
		num;
};


var _isNumber = function ( d, decimalPoint, formatted, allowEmpty ) {
	var type = typeof d;
	var strType = type === 'string';

	if ( type === 'number' || type === 'bigint') {
		return true;
	}

	// If empty return immediately so there must be a number if it is a
	// formatted string (this stops the string "k", or "kr", etc being detected
	// as a formatted number for currency
	if ( allowEmpty && _empty( d ) ) {
		return true;
	}

	if ( decimalPoint && strType ) {
		d = _numToDecimal( d, decimalPoint );
	}

	if ( formatted && strType ) {
		d = d.replace( _re_formatted_numeric, '' );
	}

	return !isNaN( parseFloat(d) ) && isFinite( d );
};


// A string without HTML in it can be considered to be HTML still
var _isHtml = function ( d ) {
	return _empty( d ) || typeof d === 'string';
};

// Is a string a number surrounded by HTML?
var _htmlNumeric = function ( d, decimalPoint, formatted, allowEmpty ) {
	if ( allowEmpty && _empty( d ) ) {
		return true;
	}

	// input and select strings mean that this isn't just a number
	if (typeof d === 'string' && d.match(/<(input|select)/i)) {
		return null;
	}

	var html = _isHtml( d );
	return ! html ?
		null :
		_isNumber( _stripHtml( d ), decimalPoint, formatted, allowEmpty ) ?
			true :
			null;
};


var _pluck = function ( a, prop, prop2 ) {
	var out = [];
	var i=0, iLen=a.length;

	// Could have the test in the loop for slightly smaller code, but speed
	// is essential here
	if ( prop2 !== undefined ) {
		for ( ; i<iLen ; i++ ) {
			if ( a[i] && a[i][ prop ] ) {
				out.push( a[i][ prop ][ prop2 ] );
			}
		}
	}
	else {
		for ( ; i<iLen ; i++ ) {
			if ( a[i] ) {
				out.push( a[i][ prop ] );
			}
		}
	}

	return out;
};


// Basically the same as _pluck, but rather than looping over `a` we use `order`
// as the indexes to pick from `a`
var _pluck_order = function ( a, order, prop, prop2 )
{
	var out = [];
	var i=0, iLen=order.length;

	// Could have the test in the loop for slightly smaller code, but speed
	// is essential here
	if ( prop2 !== undefined ) {
		for ( ; i<iLen ; i++ ) {
			if ( a[ order[i] ] && a[ order[i] ][ prop ] ) {
				out.push( a[ order[i] ][ prop ][ prop2 ] );
			}
		}
	}
	else {
		for ( ; i<iLen ; i++ ) {
			if ( a[ order[i] ] ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	}

	return out;
};


var _range = function ( len, start )
{
	var out = [];
	var end;

	if ( start === undefined ) {
		start = 0;
		end = len;
	}
	else {
		end = start;
		start = len;
	}

	for ( var i=start ; i<end ; i++ ) {
		out.push( i );
	}

	return out;
};


var _removeEmpty = function ( a )
{
	var out = [];

	for ( var i=0, iLen=a.length ; i<iLen ; i++ ) {
		if ( a[i] ) { // careful - will remove all falsy values!
			out.push( a[i] );
		}
	}

	return out;
};

// Replaceable function in api.util
var _stripHtml = function (input) {
	if (! input || typeof input !== 'string') {
		return input;
	}

	// Irrelevant check to workaround CodeQL's false positive on the regex
	if (input.length > _max_str_len) {
		throw new Error('Exceeded max str len');
	}

	var previous;

	input = input.replace(_re_html, ''); // Complete tags

	// Safety for incomplete script tag - use do / while to ensure that
	// we get all instances
	do {
		previous = input;
		input = input.replace(/<script/i, '');
	} while (input !== previous);

	return previous;
};

// Replaceable function in api.util
var _escapeHtml = function ( d ) {
	if (Array.isArray(d)) {
		d = d.join(',');
	}

	return typeof d === 'string' ?
		d
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;') :
		d;
};

// Remove diacritics from a string by decomposing it and then removing
// non-ascii characters
var _normalize = function (str, both) {
	if (typeof str !== 'string') {
		return str;
	}

	// It is faster to just run `normalize` than it is to check if
	// we need to with a regex! (Check as it isn't available in old
	// Safari)
	var res = str.normalize
		? str.normalize("NFD")
		: str;

	// Equally, here we check if a regex is needed or not
	return res.length !== str.length
		? (both === true ? str + ' ' : '' ) + res.replace(/[\u0300-\u036f]/g, "")
		: res;
}

/**
 * Determine if all values in the array are unique. This means we can short
 * cut the _unique method at the cost of a single loop. A sorted array is used
 * to easily check the values.
 *
 * @param  {array} src Source array
 * @return {boolean} true if all unique, false otherwise
 * @ignore
 */
var _areAllUnique = function ( src ) {
	if ( src.length < 2 ) {
		return true;
	}

	var sorted = src.slice().sort();
	var last = sorted[0];

	for ( var i=1, iLen=sorted.length ; i<iLen ; i++ ) {
		if ( sorted[i] === last ) {
			return false;
		}

		last = sorted[i];
	}

	return true;
};


/**
 * Find the unique elements in a source array.
 *
 * @param  {array} src Source array
 * @return {array} Array of unique items
 * @ignore
 */
var _unique = function ( src )
{
	if (Array.from && Set) {
		return Array.from(new Set(src));
	}

	if ( _areAllUnique( src ) ) {
		return src.slice();
	}

	// A faster unique method is to use object keys to identify used values,
	// but this doesn't work with arrays or objects, which we must also
	// consider. See jsperf.app/compare-array-unique-versions/4 for more
	// information.
	var
		out = [],
		val,
		i, iLen=src.length,
		j, k=0;

	again: for ( i=0 ; i<iLen ; i++ ) {
		val = src[i];

		for ( j=0 ; j<k ; j++ ) {
			if ( out[j] === val ) {
				continue again;
			}
		}

		out.push( val );
		k++;
	}

	return out;
};

// Surprisingly this is faster than [].concat.apply
// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
var _flatten = function (out, val) {
	if (Array.isArray(val)) {
		for (var i=0 ; i<val.length ; i++) {
			_flatten(out, val[i]);
		}
	}
	else {
		out.push(val);
	}

	return out;
}

// Similar to jQuery's addClass, but use classList.add
function _addClass(el, name) {
	if (name) {
		name.split(' ').forEach(function (n) {
			if (n) {
				// `add` does deduplication, so no need to check `contains`
				el.classList.add(n);
			}
		});
	}
}
