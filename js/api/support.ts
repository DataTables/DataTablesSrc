import dom, { Dom } from '../dom';
import ext from '../ext/index';
import Context from '../model/settings';
import * as object from '../util/object';
import { escapeHtml } from '../util/string';
import { Api } from './interface';

/**
 * Log an error message
 *
 * @param ctx DataTables settings object
 * @param level log error messages, or display them to the user
 * @param msg error message
 * @param tn Technical note id to get more information about the error.
 */
export function log(
	ctx: Context | null,
	level: number,
	msg: string,
	tn?: number
) {
	msg =
		'DataTables warning: ' +
		(ctx ? 'table id=' + ctx.sTableId + ' - ' : '') +
		msg;

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
 * See if a property is defined on one object, if so assign it to the other
 * object
 *
 * @param ret target object
 * @param src source object
 * @param name property
 * @param mappedName name to map too - optional, name used if not given
 */
export function map(
	ret: Record<string, any>,
	src: Record<string, any>,
	name: string | any[],
	mappedName?: string
) {
	if (Array.isArray(name)) {
		for (let i = 0; i < name.length; i++) {
			let val = name[i];

			if (Array.isArray(val)) {
				map(ret, src, val[0], val[1]);
			}
			else {
				map(ret, src, val);
			}
		}

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
 * Bind an event handler to allow a click or return key to activate the callback.
 * This is good for accessibility since a return on the keyboard will have the
 * same effect as a click, if the element has focus.
 *
 * @param n Element to bind the action to
 * @param selector Selector (for delegated events)
 * @param fn Callback function for when the event is triggered
 */
export function bindAction(
	n: Element,
	selector: string,
	fn: (e: MouseEvent | KeyboardEvent) => any
) {
	dom
		.s(n)
		.on('click.DT', selector, function (e: MouseEvent) {
			fn(e);
		})
		.on('keypress.DT', selector, function (e: KeyboardEvent) {
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
 * Register a callback function. Easily allows a callback function to be added
 * to an array store of callback functions that can then all be called together.
 *
 * @param settings dataTables settings object
 * @param store Name of the array storage for the callbacks in oSettings
 * @param fn Function to be called back
 */
export function callbackReg(ctx: Context, store: string, fn?: Function | null) {
	if (fn) {
		(ctx as any)[store].push(fn);
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
	bubbles: boolean = false
) {
	var ret: any[] = [];

	if (callbackArr) {
		ret = (ctx as any)[callbackArr]
			.slice()
			.reverse()
			.map(function (val: Function) {
				return val.apply(ctx.oInstance, args);
			});
	}

	if (eventName !== null) {
		let table = dom.s(ctx.nTable);
		let result = table.trigger(eventName + '.dt', bubbles, args, {
			dt: ctx.api
		});

		// If not yet attached to the document, trigger the event
		// on the body directly to sort of simulate the bubble
		if (bubbles && table.closest('body').count() === 0) {
			dom.s('body').trigger(eventName + '.dt', bubbles, args, { dt: ctx.api });
		}

		ret.push(result[0]);
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
export function arrayApply(arr: any[] | Api, data?: any[] | Api) {
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
export function listener(that: Dom, name: string, src: Function | Function[]) {
	let srcArr = Array.isArray(src) ? src : [src];

	for (var i = 0; i < src.length; i++) {
		that.on(name + '.dt', srcArr[i] as any);
	}
}

/**
 * Escape HTML entities in strings, in an object
 */
export function escapeObject(obj: Record<string, any>) {
	if (ext.escape.attributes) {
		object.each(obj, function (key, val) {
			obj[key] = escapeHtml(val);
		});
	}

	return obj;
}
