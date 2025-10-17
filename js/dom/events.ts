import * as array from '../util/array';
import * as eventStore from './eventStore';
import { WrappedHandler } from './interface';

/**
 * Add a property to an event object.
 *
 * @param event Event
 * @param name Property name
 * @param value Value to give the value
 */
function setEventProp(event: Event, name: string, value: any) {
	// Can't use do `event[name] =` - event object can't always have properties
	// added like that.
	Object.defineProperty(event, name, {
		configurable: true,
		get() {
			return value;
		},
	});
}

/**
 * Check that an element matches a given selector for a given event (ie its target)
 *
 * @param el Root element
 * @param selector CSS selector
 * @param event Event that
 * @returns The matching element if there is one
 */
function delegateTarget(el: Element, selector: string, event: Event) {
	// Its a delegate - get all elements that match the selector as
	// descendants from the element the event was triggered on
	let elements = Array.from(el.querySelectorAll(selector));
	let target = event.target;

	// The event might originate below our target, so need to climb the ladder
	for (; target && target !== this; target = (target as Element).parentNode) {
		// Needs to happen for all matched descendants
		for (let element of elements) {
			// And only call it when matched
			if (element !== target) {
				continue;
			}

			return target;
		}
	}
}

function parseEventName(original: string | null) {
	if (!original) {
		return {
			eventName: null,
			namespaces: [],
		};
	}

	let parts = original.split('.');
	let name = parts.shift();

	return {
		eventName: name,
		namespaces: parts,
	};
}

/**
 * Add an event listener to a function
 *
 * @param el The element to add an event handler to
 * @param nameFull Event name. This can optionally be followed by a dot
 *   separated list of namespaces, a la jQuery. This allows for easy event
 *   removal and also matching triggering.
 * @param handler Callback function to execute
 * @param selector Delegate selector. `null` for non-delegate events
 * @param one Indicate if the event handler should execute only once and then be
 *   removed.
 */
export function add(
	el: Element,
	nameFull: string,
	handler: EventListener,
	selector: string | null,
	one: boolean
) {
	let { eventName, namespaces } = parseEventName(nameFull);

	if (!eventName) {
		return;
	}

	// Create a function that will be the actual event handler, and performs any
	// logic we need, such as delegate handling and adding properties.
	let wrapped = function (event) {
		let callScope: EventTarget = el; // Scope for the callback function

		// If the event has a namespace (from a trigger), then the handler
		// should only be run if there is at least one namespace being listened
		// for that matches. This is an OR operation.
		if (
			event.namespace &&
			!array.intersection(namespaces, event.namespace.split('.')).length
		) {
			return;
		}

		// For delegate events, determine if the target matches our selector
		if (selector) {
			let dTarget = delegateTarget(el, selector, event);

			if (!dTarget) {
				return;
			}

			callScope = dTarget;
		}

		// Set the properties that jQuery adds to the event object
		setEventProp(event, 'currentTarget', callScope);
		setEventProp(event, 'delegateTarget', el);

		let retVal = handler.call(this, event);

		if (one) {
			remove(el, eventName, handler, selector);
		}

		if (retVal === false) {
			event.preventDefault();
			event.stopPropagation();
		}
	} as WrappedHandler;

	wrapped.delegateSelector = selector;
	wrapped.original = handler;
	wrapped.one = one;
	wrapped.type = eventName;
	wrapped.namespaces = namespaces;

	eventStore.set(el, wrapped);
	el.addEventListener(eventName, wrapped);
}

/**
 * Remove an event from an element
 *
 * @param el The element to remove the event(s) from
 * @param nameFull Event name and / or dot separated namespaces
 * @param handler The function to remove (optional)
 * @param selector Delegate selector (optional)
 */
export function remove(
	el: Element,
	nameFull: string | null,
	handler: EventListener | null,
	selector: string | null
) {
	let { eventName, namespaces } = parseEventName(nameFull);
	let removeEvents: WrappedHandler[] = [];
	let stored = eventStore.get(el);

	if (stored === null) {
		return;
	}

	if (eventName && selector && handler) {
		removeEvents = stored.filter(
			wrapped =>
				wrapped.type === eventName &&
				wrapped.delegateSelector === selector &&
				wrapped.original === handler
		);
	}
	if (eventName && selector) {
		removeEvents = stored.filter(
			wrapped =>
				wrapped.type === eventName && wrapped.delegateSelector === selector
		);
	}
	else if (eventName && handler) {
		removeEvents = stored.filter(
			wrapped => wrapped.type === eventName && wrapped.original === handler
		);
	}
	else if (eventName) {
		removeEvents = stored.filter(wrapped => wrapped.type === eventName);
	}
	else {
		// No name, use all events
		removeEvents = stored;
	}

	// If namespaces were given then we need to filter down to just those event
	// handlers which have the given namespaces
	if (namespaces.length) {
		removeEvents = removeEvents.filter(
			ev => array.intersection(ev.namespaces, namespaces).length
		);
	}

	removeEvents.forEach(wrapped => {
		eventStore.remove(el, wrapped);
		el.removeEventListener(wrapped.type, wrapped);
	});
}
