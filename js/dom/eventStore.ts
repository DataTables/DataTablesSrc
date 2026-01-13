import { WrappedHandler } from './interface';

/** Each element with an event attached needs a unique id */
let _uidCounter = 1;

/**
 * All wrapped event handlers are stored in this array so we can refer back to
 * them for removal. Each entry in the array is for a unique element, using the
 * index to refer to it (the `uid` that is attached to the element).
 */
const _eventStore: Array<WrappedHandler[]> = [];

/**
 * Get a unique id that can be assigned to an element.
 *
 * @returns UID
 */
function getUid(el: any) {
	if (!el._event_uid) {
		el._event_uid = _uidCounter++;
	}

	return el._event_uid;
}

/**
 * Get all event handlers that have been assigned to an element
 *
 * @param el Element
 * @returns Array of functions
 */
export function get(el: Element | Window) {
	let uid = (el as any)._event_uid;

	if (!uid || !_eventStore[uid]) {
		return null;
	}

	return _eventStore[uid];
}

/**
 * Store an event handler for an element (does not apply it)
 *
 * @param el Element
 * @param wrapper Function to set
 */
export function set(el: Element | Window, wrapper: WrappedHandler) {
	let uid = getUid(el);

	if (_eventStore[uid] === undefined) {
		_eventStore[uid] = [];
	}

	_eventStore[uid].push(wrapper);
}

/**
 * Remove an event handler from an element's store
 *
 * @param el Element
 * @param wrapper Function to set
 * @returns void
 */
export function remove(el: Element | Window, wrapper: WrappedHandler) {
	let store = get(el);

	if (!store) {
		return;
	}

	let idx = store.indexOf(wrapper);

	if (idx !== -1) {
		store.splice(idx, 1);
	}
}
