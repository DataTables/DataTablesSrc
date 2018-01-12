

var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
	if ( d !== 0 && (!d || d === '-') ) {
		return -Infinity;
	}

	// If a decimal place other than `.` is used, it needs to be given to the
	// function so we can detect it and replace with a `.` which is the only
	// decimal place Javascript recognises - it is not locale aware.
	if ( decimalPlace ) {
		d = _numToDecimal( d, decimalPlace );
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


// Add the numeric 'deformatting' functions for sorting and search. This is done
// in a function to provide an easy ability for the language options to add
// additional methods if a non-period decimal place is used.
function _addNumericSort ( decimalPlace ) {
	$.each(
		{
			// Plain numbers
			"num": function ( d ) {
				return __numericReplace( d, decimalPlace );
			},

			// Formatted numbers
			"num-fmt": function ( d ) {
				return __numericReplace( d, decimalPlace, _re_formatted_numeric );
			},

			// HTML numeric
			"html-num": function ( d ) {
				return __numericReplace( d, decimalPlace, _re_html );
			},

			// HTML numeric, formatted
			"html-num-fmt": function ( d ) {
				return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
			}
		},
		function ( key, fn ) {
			// Add the ordering method
			_ext.type.order[ key+decimalPlace+'-pre' ] = fn;

			// For HTML types add a search formatter that will strip the HTML
			if ( key.match(/^html\-/) ) {
				_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
			}
		}
	);
}


// Default sort methods
$.extend( _ext.type.order, {
	// Dates
	"date-pre": function ( d ) {
		var ts = Date.parse( d );
		return isNaN(ts) ? -Infinity : ts;
	},

	// html
	"html-pre": function ( a ) {
		return _empty(a) ?
			'' :
			a.replace ?
				a.replace( /<.*?>/g, "" ).toLowerCase() :
				a+'';
	},

	// string
	"string-pre": function ( a ) {
		// This is a little complex, but faster than always calling toString,
		// http://jsperf.com/tostring-v-check
		return _empty(a) ?
			'' :
			typeof a === 'string' ?
				a.toLowerCase() :
				! a.toString ?
					'' :
					a.toString();
	},

	// string-asc and -desc are retained only for compatibility with the old
	// sort methods
	"string-asc": function ( x, y ) {
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	},

	"string-desc": function ( x, y ) {
		return ((x < y) ? 1 : ((x > y) ? -1 : 0));
	}
} );


// Numeric sorting types - order doesn't matter here
_addNumericSort( '' );
