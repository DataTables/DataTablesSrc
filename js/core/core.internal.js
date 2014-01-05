
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

var _re_new_lines = /[\r\n]/g;
var _re_html = /<.*?>/g;
var _re_formatted_numeric = /[',$£€¥%]/g;
var _re_date_start = /^[\d\+\-a-zA-Z]/;




var _empty = function ( d ) {
	return !d || d === '-' ? true : false;
};


var _intVal = function ( s ) {
	var integer = parseInt( s, 10 );
	return !isNaN(integer) && isFinite(s) ? integer : null;
};


var _isNumber = function ( d, formatted ) {
	if ( formatted && typeof d === 'string' ) {
		d = d.replace( _re_formatted_numeric, '' );
	}

	return !d || d==='-' || (!isNaN( parseFloat(d) ) && isFinite( d ));
};


// A string without HTML in it can be considered to be HTML still
var _isHtml = function ( d ) {
	return !d || typeof d === 'string';
};


var _htmlNumeric = function ( d, formatted ) {
	if ( _empty( d ) ) {
		return true;
	}

	var html = _isHtml( d );
	return ! html ?
		null :
		_isNumber( _stripHtml( d ), formatted ) ?
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
			out.push( a[ order[i] ][ prop ][ prop2 ] );
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


var _stripHtml = function ( d ) {
	return d.replace( _re_html, '' );
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

