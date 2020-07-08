
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
//  _selector_first
//  _selector_row_indexes

var _ext; // DataTable.ext
var _Api; // DataTable.Api
var _api_register; // DataTable.Api.register
var _api_registerPlural; // DataTable.Api.registerPlural

var _re_dic = {};
var _re_new_lines = /[\r\n\u2028]/g;
var _re_html = /<.*?>/g;

// This is not strict ISO8601 - Date.parse() is quite lax, although
// implementations differ between browsers.
var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;

// Escape regular expression special characters
var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );

// http://en.wikipedia.org/wiki/Foreign_exchange_market
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


var _isNumber = function ( d, decimalPoint, formatted ) {
	var strType = typeof d === 'string';

	// If empty return immediately so there must be a number if it is a
	// formatted string (this stops the string "k", or "kr", etc being detected
	// as a formatted number for currency
	if ( _empty( d ) ) {
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


var _htmlNumeric = function ( d, decimalPoint, formatted ) {
	if ( _empty( d ) ) {
		return true;
	}

	var html = _isHtml( d );
	return ! html ?
		null :
		_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
			true :
			null;
};


var _pluck = function ( a, prop, prop2 ) {
	var out = [];
	var i=0, ien=a.length;

	// Could have the test in the loop for slightly smaller code, but speed
	// is essential here
	if ( prop2 !== undefined ) {
		for ( ; i<ien ; i++ ) {
			if ( a[i] && a[i][ prop ] ) {
				out.push( a[i][ prop ][ prop2 ] );
			}
		}
	}
	else {
		for ( ; i<ien ; i++ ) {
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
	var i=0, ien=order.length;

	// Could have the test in the loop for slightly smaller code, but speed
	// is essential here
	if ( prop2 !== undefined ) {
		for ( ; i<ien ; i++ ) {
			if ( a[ order[i] ][ prop ] ) {
				out.push( a[ order[i] ][ prop ][ prop2 ] );
			}
		}
	}
	else {
		for ( ; i<ien ; i++ ) {
			out.push( a[ order[i] ][ prop ] );
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

	for ( var i=0, ien=a.length ; i<ien ; i++ ) {
		if ( a[i] ) { // careful - will remove all falsy values!
			out.push( a[i] );
		}
	}

	return out;
};


var _stripHtml = function ( d ) {
	return d.replace( _re_html, '' );
};


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

	for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
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
	if ( _areAllUnique( src ) ) {
		return src.slice();
	}

	// A faster unique method is to use object keys to identify used values,
	// but this doesn't work with arrays or objects, which we must also
	// consider. See jsperf.com/compare-array-unique-versions/4 for more
	// information.
	var
		out = [],
		val,
		i, ien=src.length,
		j, k=0;

	again: for ( i=0 ; i<ien ; i++ ) {
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

// Array.isArray polyfill.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
if (! Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

// .trim() polyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}
