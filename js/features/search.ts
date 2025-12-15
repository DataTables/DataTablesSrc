import { macros } from '../api/support';
import { draw } from '../core/draw';
import { processingRun } from '../core/processing';
import { filterComplete } from '../core/search';
import dom from '../dom';
import { SearchInput } from '../model/search';
import util from '../util';
import register from './register';

export interface IFeatureSearchOptions {
	/** Placeholder for the input element */
	placeholder: string;

	/** Show the processing icon when searching */
	processing: boolean;

	/** Text for search control */
	text: string;
}

let __searchCounter = 0;

// opts
// - text
// - placeholder
register<Partial<IFeatureSearchOptions>>(
	'search',
	function (settings, optsIn) {
		// Don't show the input if filtering isn't available on the table
		if (!settings.features.searching) {
			return null;
		}

		let classes = settings.classes.search;
		let tableId = settings.sTableId;
		let language = settings.oLanguage;
		let previousSearch = settings.previousSearch;
		let input = '<input type="search" class="' + classes.input + '"/>';

		let opts: IFeatureSearchOptions = Object.assign(
			{
				placeholder: language.sSearchPlaceholder,
				processing: false,
				text: language.sSearch
			},
			optsIn
		);

		// The _INPUT_ is optional - is appended if not present
		if (opts.text.indexOf('_INPUT_') === -1) {
			opts.text += '_INPUT_';
		}

		opts.text = macros(settings, opts.text);

		// We can put the <input> outside of the label if it is at the start or
		// end which helps improve accessability (not all screen readers like
		// implicit for elements).
		let end = opts.text.match(/_INPUT_$/);
		let start = opts.text.match(/^_INPUT_/);
		let removed = opts.text.replace(/_INPUT_/, '');
		let str = '<label>' + opts.text + '</label>';

		if (start) {
			str = '_INPUT_<label>' + removed + '</label>';
		}
		else if (end) {
			str = '<label>' + removed + '</label>_INPUT_';
		}

		let filter = dom
			.c('div')
			.classAdd(classes.container)
			.html(str.replace(/_INPUT_/, input));

		// add for and id to label and input
		filter.find('label').attr('for', 'dt-search-' + __searchCounter);
		filter.find('input').attr('id', 'dt-search-' + __searchCounter);
		__searchCounter++;

		let searchFn = function (this: HTMLInputElement, event: KeyboardEvent) {
			let val = this.value;

			if (previousSearch.return && event.key !== 'Enter') {
				return;
			}

			/* Now do the filter */
			if (val != previousSearch.search) {
				processingRun(settings, opts.processing, function () {
					previousSearch.search = val;

					filterComplete(settings, previousSearch);

					// Need to redraw, without resorting
					settings.displayStart = 0;
					draw(settings);
				});
			}
		};

		let searchDelay = settings.searchDelay;
		let filterEl = filter
			.find('input')
			.val(textValue(previousSearch.search))
			.attr('placeholder', opts.placeholder)
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ? util.debounce(searchFn, searchDelay) : searchFn
			)
			.on('mouseup.DT', function (e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse
				// events when clicking on the clear icon (Edge bug 17584515).
				// This is safe in other browsers as `searchFn` checks the value
				// to see if it has changed. In other browsers it won't have.
				setTimeout(function () {
					searchFn.call(filterEl.get(0), e);
				}, 10);
			})
			.on('keypress.DT', function (e) {
				/* Prevent form submission */
				if (e.keyCode == 13) {
					return false;
				}
			})
			.attr('aria-controls', tableId);

		// Update the input elements whenever the table is filtered
		dom.s(settings.nTable).on('search.dt.DT', function (ev, s) {
			if (settings === s && filterEl.get(0) !== document.activeElement) {
				filterEl.val(textValue(previousSearch.search));
			}
		});

		return filter;
	},
	'f'
);

/**
 * Convert a search input into a plain string value for display. This is needed
 * as the value could be a function or regex, which can't be displayed in the
 * input element.
 *
 * @param val Search term
 * @returns String version
 */
function textValue(val: SearchInput) {
	if (val instanceof RegExp) {
		return val.toString();
	}
	else if (typeof val !== 'function') {
		return val;
	}
	return '';
}
