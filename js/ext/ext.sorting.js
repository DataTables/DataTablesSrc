
var _numericReplace = function ( d, re1, re2 ) {
	if ( !d || d === '-' ) {
		return -Infinity;
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


$.extend( DataTable.ext.type.sort, {
	// Dates
	"date-pre": function ( d )
	{
		return Date.parse( d ) || 0;
	},

	// Plain numbers
	"numeric-pre": function ( d )
	{
		return _numericReplace( d );
	},

	// Formatted numbers
	"numeric-fmt-pre": function ( d )
	{
		return _numericReplace( d, _re_formatted_numeric );
	},

	// HTML numeric
	"html-numeric-pre": function ( d )
	{
		return _numericReplace( d, _re_html );
	},

	// HTML numeric, formatted
	"html-numeric-fmt-pre": function ( d )
	{
		return _numericReplace( d, _re_html, _re_formatted_numeric );
	},

	// html
	"html-pre": function ( a )
	{
		return a.replace ?
			a.replace( /<.*?>/g, "" ).toLowerCase() :
			a+'';
	},

	// string
	"string-pre": function ( a )
	{
		return typeof a === 'string' ?
			a.toLowerCase() :
			! a || ! a.toString ?
				'' :
				a.toString();
	},

	// string-asc and -desc are retained only for compatibility with the old
	// sort methods
	"string-asc": function ( x, y )
	{
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	},

	"string-desc": function ( x, y )
	{
		return ((x < y) ? 1 : ((x > y) ? -1 : 0));
	}
} );
