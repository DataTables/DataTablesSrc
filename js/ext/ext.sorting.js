

var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
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
