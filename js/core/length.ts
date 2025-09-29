import Context from '../model/settings';
import {callbackFire, lengthOverflow} from './support';

/**
 * Set the page length
 *
 * @param settings DataTables context
 * @param val Value to change to
 */
export function lengthChange(ctx: Context, val: string) {
	var len = parseInt(val, 10);
	ctx._iDisplayLength = len;

	lengthOverflow(ctx);

	// Fire length change event
	callbackFire(ctx, null, 'length', [ctx, len]);
}
