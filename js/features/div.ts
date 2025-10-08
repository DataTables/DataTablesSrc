
import register from './register';

function _divProp(el, prop, val) {
	if (val) {
		el[prop] = val;
	}
}

register( 'div', function ( settings, opts ) {
	var n = $('<div>')[0];

	if (opts) {
		_divProp(n, 'className', opts.className);
		_divProp(n, 'id', opts.id);
		_divProp(n, 'innerHTML', opts.html);
		_divProp(n, 'textContent', opts.text);
	}

	return n;
} );
