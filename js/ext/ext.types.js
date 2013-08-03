

var _re_formatted_numeric = /[',$£€¥]/g;
var _re_html = /<.*?>/g;


var _empty = function ( d ) {
	return !d || d === '-' ? true : false;
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

var _stripHtml = function ( d ) {
	return d.replace( _re_html, '' );
};

var _htmlNumeric = function ( d, formatted ) {
	var html = _isHtml( d );
	return ! html ?
		null :
		_isNumber( _stripHtml( d ), formatted ) ?
			true :
			null;
};


// Built in type detection. See model.ext.aTypes for information about
// what is required from this methods.
$.extend( DataTable.ext.type.detect, [
	// Dates (only those recognised by the browser's Date.parse)
	function ( d )
	{
		var parsed = Date.parse(d);
		return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
	},

	// Plain numbers
	function ( d )
	{
		return _isNumber( d ) ? 'numeric' : null;
	},

	// Formatted numbers
	function ( d )
	{
		return _isNumber( d, true ) ? 'numeric-fmt' : null;
	},

	// HTML numeric
	function ( d )
	{
		return _htmlNumeric( d ) ? 'html-numeric' : null;
	},

	// HTML numeric, formatted
	function ( d )
	{
		return _htmlNumeric( d, true ) ? 'html-numeric-fmt' : null;
	},

	// HTML (this is strict checking - there much be html)
	function ( d )
	{
		return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
			'html' : null;
	}
] );

