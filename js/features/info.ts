import { callbackFire, macros } from '../api/support';
import { displayEnd, recordsDisplay, recordsTotal } from '../core/draw';
import dom, { Dom } from '../dom';
import { Context } from '../model/settings';
import register from './register';

export interface IFeatureInfoOptions {
	/** Information display callback */
	callback: (
		settings: Context,
		start: number,
		end: number,
		max: number,
		total: number,
		pre: string
	) => string;

	/** Empty table text */
	empty: string;

	/** Information string postfix */
	postfix: string;

	/** Appended to the info string when searching is active */
	search: string;

	/** Table summary information display string */
	text: string;
}

register<Partial<IFeatureInfoOptions>>(
	'info',
	function (settings, optsIn) {
		// For compatibility with the legacy `info` top level option
		if (!settings.features.info) {
			return null;
		}

		let lang = settings.oLanguage,
			tid = settings.sTableId,
			n = dom.c('div').classAdd(settings.classes.info.container);

		let opts = Object.assign(
			{
				callback: lang.infoCallback,
				empty: lang.sInfoEmpty,
				postfix: lang.sInfoPostFix,
				search: lang.sInfoFiltered,
				text: lang.sInfo,
			},
			optsIn
		);

		// Update display on each draw
		settings.callbacks.draw.push(function (s) {
			updateInfo(s, opts, n);
		});

		// For the first info display in the table, we add a callback and aria information.
		if (!settings._infoEl) {
			n.attr({
				'aria-live': 'polite',
				id: tid + '_info',
				role: 'status',
			});

			// Table is described by our info div
			dom.s(settings.nTable).attr('aria-describedby', tid + '_info');

			settings._infoEl = n;
		}

		return n;
	},
	'i'
);

/**
 * Update the information elements in the display
 *  @param settings DataTables settings object
 */
function updateInfo(settings: Context, opts: IFeatureInfoOptions, node: Dom) {
	var start = settings.displayStart + 1,
		end = displayEnd(settings),
		max = recordsTotal(settings),
		total = recordsDisplay(settings),
		out = total ? opts.text : opts.empty;

	if (total !== max) {
		// Record set after filtering
		out += ' ' + opts.search;
	}

	// Convert the macros
	out += opts.postfix;
	out = macros(settings, out);

	if (opts.callback) {
		out = opts.callback.call(
			settings.oInstance,
			settings,
			start,
			end,
			max,
			total,
			out
		);
	}

	node.html(out);

	callbackFire(settings, null, 'info', [settings, node.get(0), out]);
}
