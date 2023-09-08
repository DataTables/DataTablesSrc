
// Filter formatting functions. See model.ext.ofnSearch for information about
// what is required from these methods.
// 
// Note that additional search methods are added for the html numbers and
// html formatted numbers by `_addNumericSort()` when we know what the decimal
// place is

function __extSearchHtml ( data ) {
	return _empty(data) ?
		data :
		typeof data === 'string' ?
			_stripHtml(data.replace( _re_new_lines, " " )) :
			'';
}

