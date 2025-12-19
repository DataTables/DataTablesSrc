import { callbackFire } from '../api/support';
import dom from '../dom';
import { Context } from '../model/settings';

/**
 * Generate the node required for the processing node
 *
 * @param ctx DataTables settings object
 */
export function processingHtml(ctx: Context) {
	var table = ctx.table;
	var scrolling = ctx.scroll.x !== '' || ctx.scroll.y !== '';

	if (ctx.features.processing) {
		var n = dom
			.c('div')
			.attr('id', ctx.tableId + '_processing')
			.attr('role', 'status')
			.classAdd(ctx.classes.processing.container)
			.html(ctx.language.processing)
			.append(
				dom
					.c('div')
					.append(dom.c('div'))
					.append(dom.c('div'))
					.append(dom.c('div'))
					.append(dom.c('div'))
			);

		// Different positioning depending on if scrolling is enabled or not
		if (scrolling) {
			n.prependTo(dom.s(ctx.tableWrapper).find('div.dt-scroll').get(0));
		}
		else {
			n.insertBefore(table);
		}

		dom.s(table).on('processing.dt.DT', (e, s, show) => {
			n.css('display', show ? 'block' : 'none');
		});
	}
}

/**
 * Display or hide the processing indicator
 *
 * @param ctx DataTables settings object
 * @param show Show the processing indicator (true) or not (false)
 */
export function processingDisplay(ctx: Context, show: boolean) {
	// Ignore cases when we are still redrawing
	if (ctx.doingDraw && show === false) {
		return;
	}

	callbackFire(ctx, null, 'processing', [ctx, show]);
}

/**
 * Show the processing element if an action takes longer than a given time
 *
 * @param ctx DataTables settings object
 * @param enable Do (true) or not (false) async processing (local feature enablement)
 * @param run Function to run
 */
export function processingRun(ctx: Context, enable: boolean, run: Function) {
	if (!enable) {
		// Immediate execution, synchronous
		run();
	}
	else {
		processingDisplay(ctx, true);

		// Allow the processing display to show if needed
		setTimeout(function () {
			run();

			processingDisplay(ctx, false);
		}, 0);
	}
}
