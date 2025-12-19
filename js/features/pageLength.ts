import { macros } from '../api/support';
import { draw } from '../core/draw';
import { lengthChange } from '../core/length';
import dom from '../dom';
import * as is from '../util/is';
import register from './register';

export interface IFeaturePageLengthOptions {
	/** Text for page length control */
	menu: Array<number | { label: string; value: number }>;

	/** Text for page length control */
	text: string;
}

var __lengthCounter = 0;

// opts
// - menu
// - text
register<Partial<IFeaturePageLengthOptions>>(
	'pageLength',
	function (settings, optsIn) {
		var features = settings.features;

		// For compatibility with the legacy `pageLength` top level option
		if (!features.paging || !features.lengthChange) {
			return null;
		}

		let opts: IFeaturePageLengthOptions = Object.assign(
			{
				menu: settings.lengthMenu,
				text: settings.language.lengthMenu
			},
			optsIn
		);

		let classes = settings.classes.length,
			tableId = settings.tableId,
			menu: any[] = opts.menu,
			lengths: any[] = [],
			language: any[] = [],
			i;

		// Options can be given in a number of ways
		if (Array.isArray(menu[0])) {
			// Old 1.x style - 2D array
			lengths = menu[0];
			language = menu[1];
		}
		else {
			for (i = 0; i < menu.length; i++) {
				// An object with different label and value
				if (is.plainObject(menu[i])) {
					lengths.push(menu[i].value);
					language.push(menu[i].label);
				}
				else {
					// Or just a number to display and use
					lengths.push(menu[i]);
					language.push(menu[i]);
				}
			}
		}

		// We can put the <select> outside of the label if it is at the start or
		// end which helps improve accessability (not all screen readers like
		// implicit for elements).
		var end = opts.text.match(/_MENU_$/);
		var start = opts.text.match(/^_MENU_/);
		var removed = opts.text.replace(/_MENU_/, '');
		var str = '<label>' + opts.text + '</label>';

		if (start) {
			str = '_MENU_<label>' + removed + '</label>';
		}
		else if (end) {
			str = '<label>' + removed + '</label>_MENU_';
		}

		// Wrapper element - use a span as a holder for where the select will go
		var tmpId = 'tmp-' + +new Date();
		var div = dom
			.c('div')
			.classAdd(classes.container)
			.html(str.replace('_MENU_', '<span id="' + tmpId + '"></span>'));

		// Save text node content for macro updating
		var textNodes: any[] = [];
		Array.prototype.slice
			.call(div.find('label').get(0).childNodes)
			.forEach(function (el: HTMLElement) {
				if (el.nodeType === Node.TEXT_NODE) {
					textNodes.push({
						el: el,
						text: el.textContent
					});
				}
			});

		// Update the label text in case it has an entries value
		var updateEntries = function (len: number) {
			textNodes.forEach(function (node) {
				node.el.textContent = macros(settings, node.text, len);
			});
		};

		// Next, the select itself, along with the options
		var select = dom
			.c<HTMLSelectElement>('select')
			.attr('aria-controls', tableId)
			.classAdd(classes.select);

		for (i = 0; i < lengths.length; i++) {
			// Attempt to look up the length from the i18n options
			var label = settings.api.i18n('lengthLabels.' + lengths[i], null);

			if (label === null) {
				// If not present, fallback to old style
				label =
					typeof language[i] === 'number'
						? settings.formatNumber(language[i], settings)
						: language[i];
			}

			select.get(0)[i] = new Option(label, lengths[i]);
		}

		// Swap in the select list
		div.find('#' + tmpId).replaceWith(select);

		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		div
			.find('select')
			.attr('id', 'dt-length-' + __lengthCounter)
			.val(settings.pageLength)
			.on('change.DT', function () {
				lengthChange(settings, select.val() as string);
				draw(settings);
			});

		// add for and id to label and input
		div.find('label').attr('for', 'dt-length-' + __lengthCounter);
		__lengthCounter++;

		// Update node value whenever anything changes the table's length
		dom.s(settings.table).on('length.dt.DT', function (e, s, len) {
			if (settings === s) {
				div.find('select').val(len);

				// Resolve plurals in the text for the new length
				updateEntries(len);
			}
		});

		updateEntries(settings.pageLength);

		return div;
	},
	'l'
);
