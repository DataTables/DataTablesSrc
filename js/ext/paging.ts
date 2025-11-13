
import { range } from '../util/array';

/**
 * Compute what number buttons to show in the paging control
 *
 * @param page Current page
 * @param pages Total number of pages
 * @param buttons Target number of number buttons
 * @param addFirstLast Indicate if page 1 and end should be included
 * @returns Buttons to show
 */
export function pagingNumbers(
	page: number,
	pages: number,
	buttons: number,
	addFirstLast: boolean
) {
	let numbers: Array<string | number> = [],
		half = Math.floor(buttons / 2),
		before = addFirstLast ? 2 : 1,
		after = addFirstLast ? 1 : 0;

	if (pages <= buttons) {
		numbers = range(0, pages);
	}
	else if (buttons === 1) {
		// Single button - current page only
		numbers = [page];
	}
	else if (buttons === 3) {
		// Special logic for just three buttons
		if (page <= 1) {
			numbers = [0, 1, 'ellipsis'];
		}
		else if (page >= pages - 2) {
			numbers = range(pages - 2, pages);
			numbers.unshift('ellipsis');
		}
		else {
			numbers = ['ellipsis', page, 'ellipsis'];
		}
	}
	else if (page <= half) {
		numbers = range(0, buttons - before);
		numbers.push('ellipsis');

		if (addFirstLast) {
			numbers.push(pages - 1);
		}
	}
	else if (page >= pages - 1 - half) {
		numbers = range(pages - (buttons - before), pages);
		numbers.unshift('ellipsis');

		if (addFirstLast) {
			numbers.unshift(0);
		}
	}
	else {
		numbers = range(page - half + before, page + half - after);
		numbers.push('ellipsis');
		numbers.unshift('ellipsis');

		if (addFirstLast) {
			numbers.push(pages - 1);
			numbers.unshift(0);
		}
	}

	return numbers;
}

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
	_numbers: pagingNumbers,

	// Number of number buttons - legacy, use `numbers` option for paging feature
	numbers_length: 7,
};
