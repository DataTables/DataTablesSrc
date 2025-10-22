import dom from '../dom';
import { _pagingNumbers } from '../features/page';
import Context from '../model/settings';

export default {
	simple: function () {
		return ['previous', 'next'];
	},

	full: function () {
		return ['first', 'previous', 'next', 'last'];
	},

	numbers: function () {
		return ['numbers'];
	},

	simple_numbers: function () {
		return ['previous', 'numbers', 'next'];
	},

	full_numbers: function () {
		return ['first', 'previous', 'numbers', 'next', 'last'];
	},

	first_last: function () {
		return ['first', 'last'];
	},

	first_last_numbers: function () {
		return ['first', 'numbers', 'last'];
	},

	// For testing and plug-ins to use
	_numbers: _pagingNumbers,

	// Number of number buttons - legacy, use `numbers` option for paging feature
	numbers_length: 7,
};

export const render = {
	pagingButton: {
		_: function (
			settings: Context,
			buttonType: string | number,
			content: string,
			active: boolean,
			disabled: boolean
		) {
			var classes = settings.oClasses.paging;
			var btnClasses = [classes.button];
			var btn;

			if (active) {
				btnClasses.push(classes.active);
			}

			if (disabled) {
				btnClasses.push(classes.disabled);
			}

			if (buttonType === 'ellipsis') {
				btn = dom.c('span').classAdd('ellipsis').html(content).get(0);
			}
			else {
				btn = dom
					.c('button')
					.classAdd(btnClasses.join(' '))
					.attr('role', 'link')
					.attr('type', 'button')
					.html(content);
			}

			return {
				display: btn,
				clicker: btn,
			};
		},
	},

	pagingContainer: {
		_: function (settings: Context, buttons: Element[]) {
			// No wrapping element - just append directly to the host
			return buttons;
		},
	},
};
