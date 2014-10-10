

// Filter formatting functions. See model.ext.ofnSearch for information about
// what is required from these methods.
// 
// Note that additional search methods are added for the html numbers and
// html formatted numbers by `_addNumericSort()` when we know what the decimal
// place is


$.extend( DataTable.ext.type.search, {
	html: function ( data ) {
		return _empty(data) ?
			data :
			typeof data === 'string' ?
				data
					.replace( _re_new_lines, " " )
					.replace( _re_html, "" ) :
				'';
	},

	string: function ( data ) {
		return _empty(data) ?
			data :
			typeof data === 'string' ?
				data.replace( _re_new_lines, " " ) :
				data;
	}
} );

