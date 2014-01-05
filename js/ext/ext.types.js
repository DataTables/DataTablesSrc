

// Built in type detection. See model.ext.aTypes for information about
// what is required from this methods.
$.extend( DataTable.ext.type.detect, [
	// Plain numbers - first since V8 detects some plain numbers as dates
	// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
	function ( d )
	{
		return _isNumber( d ) ? 'numeric' : null;
	},

	// Dates (only those recognised by the browser's Date.parse)
	function ( d )
	{
		// V8 will remove any unknown characters at the start of the expression,
		// leading to false matches such as `$245.12` being a valid date. See
		// forum thread 18941 for detail.
		if ( d && ! _re_date_start.test(d) ) {
			return null;
		}
		var parsed = Date.parse(d);
		return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
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

