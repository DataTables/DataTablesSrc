import register from './register';

export interface IFeatureDivOptions {
	/** Class name for the div */
	className: string;

	/** ID to give the div */
	id: string;

	/** HTML content for the div (cannot be used as well as textContent) */
	html: string;

	/** Text content for the div (cannot be used as well as innerHTML) */
	text: string;
}

function _divProp<T extends HTMLElement, K extends keyof T>(
	el: T,
	prop: K,
	val?: T[K]
) {
	if (val) {
		el[prop] = val;
	}
}

register<Partial<IFeatureDivOptions>>('div', function (settings, opts) {
	var n = document.createElement('div');

	if (opts) {
		_divProp(n, 'className', opts.className);
		_divProp(n, 'id', opts.id);
		_divProp(n, 'innerHTML', opts.html);
		_divProp(n, 'textContent', opts.text);
	}

	return n;
});
