import dom from '../dom';
import ext from '../ext/index';
import Context from '../model/settings';
import { escapeHtml } from '../util/string';

/**
 * Log an error message
 *
 * @param ctx DataTables settings object
 * @param level log error messages, or display them to the user
 * @param msg error message
 * @param tn Technical note id to get more information about the error.
 */
export function log(ctx: Context | null, level: number, msg: string, tn?: number) {
	msg = 'DataTables warning: ' + (ctx ? 'table id=' + ctx.sTableId + ' - ' : '') + msg;

	if (tn) {
		msg +=
			'. For more information about this error, please see ' +
			'https://datatables.net/tn/' +
			tn;
	}

	if (!level) {
		// Backwards compatibility pre 1.10
		var type = (ext as any).sErrMode || ext.errMode;

		if (ctx) {
			callbackFire(ctx, null, 'dt-error', [ctx, tn, msg], true);
		}

		if (type == 'alert') {
			alert(msg);
		}
		else if (type == 'throw') {
			throw new Error(msg);
		}
		else if (typeof type == 'function') {
			type(ctx, tn, msg);
		}
	}
	else if (window.console && console.log) {
		console.log(msg);
	}
}

/**
 * See if a property is defined on one object, if so assign it to the other object
 *
 * @param ret target object
 * @param src source object
 * @param name property
 * @param [mappedName] name to map too - optional, name used if not given
 */
export function map(ret: object, src: object, name: string | any[], mappedName?: string) {
	if (Array.isArray(name)) {
		$.each(name, function (i, val) {
			if (Array.isArray(val)) {
				map(ret, src, val[0], val[1]);
			}
			else {
				map(ret, src, val);
			}
		});

		return;
	}

	if (mappedName === undefined) {
		mappedName = name;
	}

	if (src[name] !== undefined) {
		ret[mappedName] = src[name];
	}
}

/**
 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
 * shallow copy arrays. The reason we need to do this, is that we don't want to
 * deep copy array init values (such as aaSorting) since the dev wouldn't be
 * able to override them, but we do want to deep copy arrays.
 *
 * @param out Object to extend
 * @param extender Object from which the properties will be applied to out
 * @param breakRefs If true, then arrays will be sliced to take an independent
 *   copy with the exception of the `data` or `aaData` parameters if they are
 *   present. This is so you can pass in a collection to DataTables and have
 *   that used as your data source without breaking the references
 * @returns out Reference, just for convenience - out === the return.
 * @todo This doesn't take account of arrays inside the deep copied objects.
 */
export function extend(out: object, extender: object, breakRefs: boolean = false) {
	var val;

	for (var prop in extender) {
		if (Object.prototype.hasOwnProperty.call(extender, prop)) {
			val = extender[prop];

			if ($.isPlainObject(val)) {
				if (!$.isPlainObject(out[prop])) {
					out[prop] = {};
				}
				$.extend(true, out[prop], val);
			}
			else if (breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val)) {
				out[prop] = val.slice();
			}
			else {
				out[prop] = val;
			}
		}
	}

	return out;
}

/**
 * Bind an event handler to allow a click or return key to activate the callback.
 * This is good for accessibility since a return on the keyboard will have the
 * same effect as a click, if the element has focus.
 *
 * @param n Element to bind the action to
 * @param selector Selector (for delegated events) or data object
 *   to pass to the triggered function
 * @param fn Callback function for when the event is triggered
 */
export function bindAction(
	n: Element,
	selector: string | {[key: string]: any},
	fn: (e: JQuery.TriggeredEvent) => any
) {
	$(n)
		.on('click.DT', selector, function (e: JQuery.TriggeredEvent) {
			fn(e);
		})
		.on('keypress.DT', selector, function (e: JQuery.TriggeredEvent) {
			if (e.which === 13) {
				e.preventDefault();
				fn(e);
			}
		})
		.on('selectstart.DT', selector, function () {
			// Don't want a double click resulting in text selection
			return false;
		});
}

/**
 * Register a callback function. Easily allows a callback function to be added to
 * an array store of callback functions that can then all be called together.
 *
 * @param settings dataTables settings object
 * @param store Name of the array storage for the callbacks in oSettings
 * @param fn Function to be called back
 */
export function callbackReg(ctx: Context, store: string, fn: Function) {
	if (fn) {
		ctx[store].push(fn);
	}
}

/**
 * Fire callback functions and trigger events. Note that the loop over the
 * callback array store is done backwards! Further note that you do not want to
 * fire off triggers in time sensitive applications (for example cell creation)
 * as its slow.
 *
 * @param ctx DataTables settings object
 * @param callbackArr Name of the array storage for the callbacks in oSettings
 * @param eventName Name of the jQuery custom event to trigger. If null no
 *   trigger is fired
 * @param args Array of arguments to pass to the callback function / trigger
 * @param bubbles True if the event should bubble
 */
export function callbackFire(
	ctx: Context,
	callbackArr: string | null,
	eventName: string | null,
	args: any,
	bubbles?: boolean
) {
	var ret: any[] = [];

	if (callbackArr) {
		ret = ctx[callbackArr]
			.slice()
			.reverse()
			.map(function (val) {
				return val.apply(ctx.oInstance, args);
			});
	}

	if (eventName !== null) {
		let table = dom.s(ctx.nTable);
		let returnValue = table.trigger(
			eventName + '.dt',
			bubbles,
			args,
			{dt: ctx.api}
		);

		// If not yet attached to the document, trigger the event
		// on the body directly to sort of simulate the bubble
		if (bubbles && table.closest('body').count() === 0) {
			dom.s('body').trigger(
				eventName + '.dt',
				bubbles,
				args,
				{dt: ctx.api}
			);
		}

		ret.push(returnValue);
	}

	return ret;
}

export function lengthOverflow(ctx: Context) {
	var start = ctx._iDisplayStart,
		end = ctx.fnDisplayEnd(),
		len = ctx._iDisplayLength;

	/* If we have space to show extra rows (backing up from the end point - then do so */
	if (start >= end) {
		start = end - len;
	}

	// Keep the start record on the current page
	start -= start % len;

	if (len === -1 || start < 0) {
		start = 0;
	}

	ctx._iDisplayStart = start;
}

/**
 * Detect the data source being used for the table. Used to simplify the code a
 * little (ajax) and to make it compress a little smaller.
 *
 * @param ctx DataTables settings object
 * @returns Data source
 */
export function dataSource(ctx: Context) {
	if (ctx.oFeatures.bServerSide) {
		return 'ssp';
	}
	else if (ctx.ajax) {
		return 'ajax';
	}
	return 'dom';
}

/**
 * Common replacement for language strings
 *
 * @param ctx DataTables settings object
 * @param str String with values to replace
 * @param entries Plural number for _ENTRIES_ - can be undefined
 * @returns String
 */
export function macros(ctx: Context, str: string, entries?: number) {
	// When infinite scrolling, we are always starting at 1. _iDisplayStart is
	// used only internally
	var formatter = ctx.fnFormatNumber,
		start = ctx._iDisplayStart + 1,
		len = ctx._iDisplayLength,
		vis = ctx.fnRecordsDisplay(),
		max = ctx.fnRecordsTotal(),
		all = len === -1;

	return str
		.replace(/_START_/g, formatter.call(ctx, start))
		.replace(/_END_/g, formatter.call(ctx, ctx.fnDisplayEnd()))
		.replace(/_MAX_/g, formatter.call(ctx, max))
		.replace(/_TOTAL_/g, formatter.call(ctx, vis))
		.replace(/_PAGE_/g, formatter.call(ctx, all ? 1 : Math.ceil(start / len)))
		.replace(/_PAGES_/g, formatter.call(ctx, all ? 1 : Math.ceil(vis / len)))
		.replace(/_ENTRIES_/g, ctx.api.i18n('entries', '', entries))
		.replace(/_ENTRIES-MAX_/g, ctx.api.i18n('entries', '', max))
		.replace(/_ENTRIES-TOTAL_/g, ctx.api.i18n('entries', '', vis));
}

/**
 * Add elements to an array as quickly as possible, but stack safe.
 *
 * @param arr Array to add the data to
 * @param data Data array that is to be added
 */
export function arrayApply(arr: any[], data: any[]) {
	if (!data) {
		return;
	}

	// Chrome can throw a max stack error if apply is called with
	// too large an array, but apply is faster.
	if (data.length < 10000) {
		arr.push.apply(arr, data);
	}
	else {
		for (var i = 0; i < data.length; i++) {
			arr.push(data[i]);
		}
	}
}

/**
 * Add one or more listeners to the table
 *
 * @param that JQ for the table
 * @param name Event name
 * @param src Listener(s)
 */
export function listener(that, name, src) {
	if (!Array.isArray(src)) {
		src = [src];
	}

	for (var i = 0; i < src.length; i++) {
		that.on(name + '.dt', src[i]);
	}
}

/**
 * Escape HTML entities in strings, in an object
 */
export function escapeObject(obj) {
	if (ext.escape.attributes) {
		$.each(obj, function (key, val) {
			obj[key] = escapeHtml(val);
		});
	}

	return obj;
}
