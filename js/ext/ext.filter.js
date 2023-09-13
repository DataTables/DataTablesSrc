
// Common function to remove new lines, strip HTML and diacritic control
var _filterString = function (stripHtml, diacritics) {
	return function (str) {
		if (_empty(str) || typeof str !== 'string') {
			return str;
		}

		str = str.replace( _re_new_lines, " " );

		if (stripHtml) {
			str = _stripHtml(str);
		}

		if (diacritics) {
			str = _normalize(str, true);
		}

		return str;
	};
}
