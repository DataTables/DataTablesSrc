import { _pagingNumbers } from '../features/page';

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
