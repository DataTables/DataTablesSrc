

// Filter formatting functions. See model.ext.ofnSearch for information about
// what is required from these methods.


$.extend( DataTable.ext.type.filter, {
	html: function ( data ) {
		return _empty(data) ?
			'' :
			typeof data === 'string' ?
				data
					.replace( _re_new_lines, " " )
					.replace( _re_html, "" ) :
				'';
	},

	string: function ( data ) {
		return _empty(data) ?
			'' :
			typeof data === 'string' ?
				data.replace( _re_new_lines, " " ) :
				data;
	}
} );

