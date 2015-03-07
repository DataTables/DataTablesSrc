

// Built in type detection. See model.ext.aTypes for information about
// what is required from this methods.
$.extend( DataTable.ext.type.detect, [
	// Plain numbers - first since V8 detects some plain numbers as dates
	// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
	function ( d, settings )
	{
		var decimal = settings.oLanguage.sDecimal;
		return _isNumber( d, decimal ) ? 'num'+decimal : null;
	},

	// Dates (only those recognised by the browser's Date.parse)
	function ( d, settings )
	{
		// V8 will remove any unknown characters at the start and end of the
		// expression, leading to false matches such as `$245.12` or `10%` being
		// a valid date. See forum thread 18941 for detail.
		if ( d && !(d instanceof Date) && ( ! _re_date_start.test(d) || ! _re_date_end.test(d) ) ) {
			return null;
		}
		var parsed = Date.parse(d);
		return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
	},

	// Formatted numbers
	function ( d, settings )
	{
		var decimal = settings.oLanguage.sDecimal;
		return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
	},

	// HTML numeric
	function ( d, settings )
	{
		var decimal = settings.oLanguage.sDecimal;
		return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
	},

	// HTML numeric, formatted
	function ( d, settings )
	{
		var decimal = settings.oLanguage.sDecimal;
		return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
	},

	// HTML (this is strict checking - there must be html)
	function ( d, settings )
	{
		return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
			'html' : null;
	}
] );

