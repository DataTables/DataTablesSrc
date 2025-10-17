
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

export function add(
	el: Element,
	name: string,
	handler: EventListener,
	selector: string | null,
	one: boolean
) {
	// Create a function that will be the actual event handler, and performs any
	// logic we need, such as delegate handling and adding properties.
	let wrapped = function (event) {
		let callScope: EventTarget = el; // Scope for the callback function

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
			remove(el, name, handler, selector);
		}

		if (retVal === false) {
			event.preventDefault();
			event.stopPropagation();
		}
	} as WrappedHandler;

	wrapped.delegateSelector = selector;
	wrapped.original = handler;
	wrapped.one = one;
	wrapped.type = name;

	eventStore.set(el, wrapped);
	el.addEventListener(name, wrapped);
}

export function remove(
	el: Element,
	name: string | null,
	handler: EventListener,
	selector: string | null
) {
	let removeEvents: WrappedHandler[] = [];
	let stored = eventStore.get(el);

	if (stored === null) {
		return;
	}

	if (name && selector && handler) {
		removeEvents = stored.filter(
			wrapped =>
				wrapped.type === name &&
				wrapped.delegateSelector === selector &&
				wrapped.original === handler
		);
	}
	if (name && selector) {
		removeEvents = stored.filter(
			wrapped => wrapped.type === name && wrapped.delegateSelector === selector
		);
	}
	else if (name && handler) {
		removeEvents = stored.filter(
			wrapped => wrapped.type === name && wrapped.original === handler
		);
	}
	else if (name) {
		removeEvents = stored.filter(wrapped => wrapped.type === name);
	}
	else {
		// No name, remove all events
		removeEvents = stored;
	}

	removeEvents.forEach(wrapped => {
		eventStore.remove(el, wrapped);
		el.removeEventListener(wrapped.type, wrapped);
	});
}
