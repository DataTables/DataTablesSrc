

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

