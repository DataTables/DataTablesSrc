import { callbackFire, log } from '../api/support';
import Context from '../model/settings';
import { draw } from './draw';

/**
 * Alter the display settings to change the page
 *
 * @param settings DataTables settings object
 * @param action Paging action to take: "first", "previous",
 *  "next" or "last" or page number to jump to (integer)
 * @param redraw Automatically draw the update or not
 * @returns {bool} true page has changed, false - no change
 */
export function pageChange(settings: Context, action: string | number, redraw?: boolean) {
	var start = settings._iDisplayStart,
		len = settings._iDisplayLength,
		records = settings.fnRecordsDisplay();

	if (records === 0 || len === -1) {
		start = 0;
	}
	else if (typeof action === 'number') {
		start = action * len;

		if (start > records) {
			start = 0;
		}
	}
	else if (action == 'first') {
		start = 0;
	}
	else if (action == 'previous') {
		start = len >= 0 ? start - len : 0;

		if (start < 0) {
			start = 0;
		}
	}
	else if (action == 'next') {
		if (start + len < records) {
			start += len;
		}
	}
	else if (action == 'last') {
		start = Math.floor((records - 1) / len) * len;
	}
	else if (action === 'ellipsis') {
		return;
	}
	else {
		log(settings, 0, 'Unknown paging action: ' + action, 5);
	}

	var changed = settings._iDisplayStart !== start;
	settings._iDisplayStart = start;

	callbackFire(settings, null, changed ? 'page' : 'page-nc', [settings]);

	if (changed && redraw) {
		draw(settings);
	}

	return changed;
}
