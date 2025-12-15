import { arrayApply, callbackFire, dataSource } from '../api/support';
import dom from '../dom';
import ext from '../ext/index';
import { SearchInput, SearchOptions } from '../model/search';
import { Context } from '../model/settings';
import util from '../util';
import { getCellData } from './data';

const __filter_div = dom.c('div').get(0);
const __filter_div_textContent = __filter_div.textContent !== undefined;

/**
 * Filter the table using both the global filter and column based filtering
 *
 * @param settings DataTables settings object
 * @param input search information
 */
export function filterComplete(settings: Context, input: SearchOptions) {
	let columnsSearch = settings.preSearchCols;

	// In server-side processing all filtering is done by the server, so no point hanging around here
	if (dataSource(settings) != 'ssp') {
		// Check if any of the rows were invalidated
		filterData(settings);

		// Start from the full data set
		settings.aiDisplay = settings.aiDisplayMaster.slice();

		// Global filter first
		filter(settings.aiDisplay, settings, input.search, input);

		util.object.each(settings.searchFixed, function (name, term) {
			filter(settings.aiDisplay, settings, term, {});
		});

		// Then individual column filters
		for (let i = 0; i < columnsSearch.length; i++) {
			let col = columnsSearch[i];

			filter(settings.aiDisplay, settings, col.search, col, i);

			util.object.each(
				settings.aoColumns[i].searchFixed,
				function (name, term) {
					filter(settings.aiDisplay, settings, term, {}, i);
				}
			);
		}

		// And finally global filtering
		filterCustom(settings);
	}

	// Tell the draw function we have been filtering
	settings.bFiltered = true;

	callbackFire(settings, null, 'search', [settings]);
}

/**
 * Apply custom filtering functions
 *
 * This is legacy now that we have named functions, but it is widely used
 * from 1.x, so it is not yet deprecated.
 *
 * @param settings DataTables settings object
 */
function filterCustom(settings: Context) {
	let filters = ext.search as any[]; // TODO typing
	let displayRows = settings.aiDisplay;
	let row, rowIdx;

	for (let i = 0, iLen = filters.length; i < iLen; i++) {
		let rows: number[] = [];

		// Loop over each row and see if it should be included
		for (let j = 0, jen = displayRows.length; j < jen; j++) {
			rowIdx = displayRows[j];
			row = settings.aoData[rowIdx];

			if (
				row &&
				filters[i](settings, row._aFilterData, rowIdx, row._aData, j)
			) {
				rows.push(rowIdx);
			}
		}

		// So the array reference doesn't break set the results into the
		// existing array
		displayRows.length = 0;
		arrayApply(displayRows, rows);
	}
}

/**
 * Filter the data table based on user input and draw the table
 *
 * @param searchRows
 * @param settings
 * @param input
 * @param options
 * @param column
 * @returns
 */
function filter(
	searchRows: number[],
	settings: Context,
	input: SearchInput,
	options: Partial<SearchOptions>,
	column?: number
) {
	if (input === '') {
		return;
	}

	let i = 0;
	let matched: any[] = [];

	// Search term can be a function, regex or string - if a string we apply our
	// smart filtering regex (assuming the options require that)
	let searchFunc = typeof input === 'function' ? input : null;
	let rpSearch =
		input instanceof RegExp
			? input
			: searchFunc
			? null
			: filterCreateSearch(input as string, options);

	// Then for each row, does the test pass. If not, lop the row from the array
	for (i = 0; i < searchRows.length; i++) {
		let row = settings.aoData[searchRows[i]];

		if (row) {
			let data =
				column === undefined ? row._sFilterRow : row._aFilterData![column];

			if (
				(searchFunc && searchFunc(data, row._aData, searchRows[i], column)) ||
				(rpSearch && data && rpSearch.test(data))
			) {
				matched.push(searchRows[i]);
			}
		}
	}

	// Mutate the searchRows array
	searchRows.length = matched.length;

	for (i = 0; i < matched.length; i++) {
		searchRows[i] = matched[i];
	}
}

/**
 * Build a regular expression object suitable for searching a table
 */
function filterCreateSearch(
	searchIn: string | number,
	inOpts: Partial<SearchOptions>
) {
	let not: string[] = [];
	let options = Object.assign(
		{},
		{
			boundary: false,
			caseInsensitive: true,
			exact: false,
			regex: false,
			smart: true
		},
		inOpts
	);

	let search = typeof searchIn !== 'string' ? searchIn.toString() : searchIn;

	// Remove diacritics if normalize is set up to do so
	search = util.diacritics(search);

	if (options.exact) {
		return new RegExp(
			'^' + util.escapeRegex(search) + '$',
			options.caseInsensitive ? 'i' : ''
		);
	}

	search = options.regex ? search : util.escapeRegex(search);

	if (options.smart) {
		/* For smart filtering we want to allow the search to work regardless of
		 * word order. We also want double quoted text to be preserved, so word
		 * order is important - a la google. And a negative look around for
		 * finding rows which don't contain a given string.
		 *
		 * So this is the sort of thing we want to generate:
		 *
		 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
		 */
		let parts = search.match(/!?["\u201C][^"\u201D]+["\u201D]|[^ ]+/g) || [''];
		let a = parts.map(function (word: string) {
			let negative = false;
			let m;

			// Determine if it is a "does not include"
			if (word.charAt(0) === '!') {
				negative = true;
				word = word.substring(1);
			}

			// Strip the quotes from around matched phrases
			if (word.charAt(0) === '"') {
				m = word.match(/^"(.*)"$/);
				word = m ? m[1] : word;
			}
			else if (word.charAt(0) === '\u201C') {
				// Smart quote match (iPhone users)
				m = word.match(/^\u201C(.*)\u201D$/);
				word = m ? m[1] : word;
			}

			// For our "not" case, we need to modify the string that is
			// allowed to match at the end of the expression.
			if (negative) {
				if (word.length > 1) {
					not.push('(?!' + word + ')');
				}

				word = '';
			}

			return word.replace(/"/g, '');
		});

		let match = not.length ? not.join('') : '';

		let boundary = options.boundary ? '\\b' : '';

		search =
			'^(?=.*?' +
			boundary +
			a.join(')(?=.*?' + boundary) +
			')(' +
			match +
			'.)*$';
	}

	return new RegExp(search, options.caseInsensitive ? 'i' : '');
}

// Update the filtering data for each row if needed (by invalidation or first run)
function filterData(settings: Context) {
	let columns = settings.aoColumns;
	let data = settings.aoData;
	let column;
	let j, jen, cellData, row;
	let wasInvalidated = false;

	for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
		if (!data[rowIdx]) {
			continue;
		}

		row = data[rowIdx];

		if (row && !row._aFilterData) {
			const rowFilterData: string[] = [];

			for (j = 0, jen = columns.length; j < jen; j++) {
				column = columns[j];

				if (column.bSearchable) {
					cellData = getCellData(settings, rowIdx, j, 'filter');

					// Search in DataTables is string based
					if (cellData === null) {
						cellData = '';
					}

					if (typeof cellData !== 'string' && cellData.toString) {
						cellData = cellData.toString();
					}
				}
				else {
					cellData = '';
				}

				// If it looks like there is an HTML entity in the string,
				// attempt to decode it so sorting works as expected. Note that
				// we could use a single line of jQuery to do this, but the DOM
				// method used here is much faster https://jsperf.com/html-decode
				if (cellData.indexOf && cellData.indexOf('&') !== -1) {
					__filter_div.innerHTML = cellData;
					cellData = __filter_div_textContent
						? __filter_div.textContent
						: __filter_div.innerText;
				}

				if (cellData.replace) {
					cellData = cellData.replace(/[\r\n\u2028]/g, '');
				}

				rowFilterData.push(cellData);
			}

			row._aFilterData = rowFilterData;
			row._sFilterRow = rowFilterData.join('  ');
			wasInvalidated = true;
		}
	}

	return wasInvalidated;
}
