import { callbackFire, lengthOverflow } from '../api/support';
import { Context } from '../model/settings';

/**
 * Set the page length
 *
 * @param settings DataTables context
 * @param val Value to change to
 */
export function lengthChange(ctx: Context, val: string | number) {
	let len = typeof val === 'string'
		? parseInt(val, 10)
		: val;

	ctx.pageLength = len;

	lengthOverflow(ctx);

	// Fire length change event
	callbackFire(ctx, null, 'length', [ctx, len]);
}
