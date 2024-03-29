
// Common function to remove new lines, strip HTML and diacritic control
var _filterString = function (stripHtml, normalize) {
	return function (str) {
		if (_empty(str) || typeof str !== 'string') {
			return str;
		}

		str = str.replace( _re_new_lines, " " );

		if (stripHtml) {
			str = _stripHtml(str);
		}

		if (normalize) {
			str = _normalize(str, false);
		}

		return str;
	};
}
