import { macros } from '../api/support';
import { draw } from '../core/draw';
import { lengthChange } from '../core/length';
import dom from '../dom';
import Context from '../model/settings';
import * as is from '../util/is';
import register from './register';

interface IFeaturePageLength {
	/** Text for page length control */
	menu: Array<number | { label: string; value: number }>;

	/** Text for page length control */
	text: string;
}

var __lengthCounter = 0;

// opts
// - menu
// - text
register(
	'pageLength',
	function (settings: Context, optsIn: Partial<IFeaturePageLength>) {
		var features = settings.oFeatures;

		// For compatibility with the legacy `pageLength` top level option
		if (!features.bPaginate || !features.bLengthChange) {
			return null;
		}

		let opts: IFeaturePageLength = Object.assign(
			{
				menu: settings.aLengthMenu,
				text: settings.oLanguage.sLengthMenu,
			},
			optsIn
		);

		let classes = settings.oClasses.length,
			tableId = settings.sTableId,
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
			.forEach(function (el) {
				if (el.nodeType === Node.TEXT_NODE) {
					textNodes.push({
						el: el,
						text: el.textContent,
					});
				}
			});

		// Update the label text in case it has an entries value
		var updateEntries = function (len) {
			textNodes.forEach(function (node) {
				node.el.textContent = macros(settings, node.text, len);
			});
		};

		// Next, the select itself, along with the options
		var select = dom
			.c('select')
			.attr('aria-controls', tableId)
			.classAdd(classes.select);

		for (i = 0; i < lengths.length; i++) {
			// Attempt to look up the length from the i18n options
			var label = settings.api.i18n('lengthLabels.' + lengths[i], null);

			if (label === null) {
				// If not present, fallback to old style
				label =
					typeof language[i] === 'number'
						? settings.fnFormatNumber(language[i])
						: language[i];
			}

			select.get(0)[i] = new Option(label, lengths[i]);
		}

		// add for and id to label and input
		div.find('label').attr('for', 'dt-length-' + __lengthCounter);
		select.attr('id', 'dt-length-' + __lengthCounter);
		__lengthCounter++;

		// Swap in the select list
		div.find('#' + tmpId).replaceWith(select);

		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		select.val(settings._iDisplayLength);

		$(select.get(0)).on('change.DT', function () {
			lengthChange(settings, select.val() as string);
			draw(settings);
		});

		// Update node value whenever anything changes the table's length
		$(settings.nTable).on('length.dt.DT', function (e, s, len) {
			if (settings === s) {
				select.val(len);

				// Resolve plurals in the text for the new length
				updateEntries(len);
			}
		});

		updateEntries(settings._iDisplayLength);

		return div;
	},
	'l'
);
