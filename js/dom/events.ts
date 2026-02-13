import * as array from '../util/array';
import external from '../util/external';
import * as object from '../util/object';
import { PlainObject } from '../util/types';
import * as eventStore from './eventStore';
import { DomEvent, WrappedHandler } from './interface';

export type EventHandler = {
	(this: HTMLElement, event: any, ...args: any): any;
	guid?: number;
};

/*
 * We need an events library that has many of the features of jQuery's event
 * handling - this is for backwards compatibility. Developers who have used
 * jQuery to listen for events should not need to change their code!
 *
 * DataTables uses the following features of jQuery events, which need to be
 * fully supported:
 *
 * * Namespaces
 * * Custom events
 * * Custom event object properties
 * * Arguments for custom events
 *
 * Frustratingly while `dispatchEvent` will trigger all events listened to by
 * jQuery (including namespaces with a shim of `jQuery.event.fix` to add the
 * namespace and rnamespace properties), there is no way for `dispatchEvent` to
 * pass arguments to custom event handlers.
 *
 * Also the inverse doesn't hold - using `addEventListener` followed by
 * `$().trigger()` doesn't trigger the event handler. Therefore using both
 * `dispatchEvent` and `$().trigger()` to fire off both event handlers would
 * risk triggering some event handlers twice.
 *
 * Because of the backwards compatibility constraint and the complications given
 * above, this library will act as a simple proxy to jQuery, if jQuery is
 * present. If it is not, then it will implement the features described above
 * itself. While this is not ideal (I'd prefer to have a way to trigger jQuery
 * listened for events independently of triggering those added with this
 * library, or any other `addEventListener` call), it does ensure backwards
 * compatibility.
 */

const _mouseEvents = [
	'click',
	'dblclick',
	'mousedown',
	'mouseenter',
	'mouseleave',
	'mousemove',
	'mouseout',
	'mouseover',
	'mouseup'
];

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
		}
	});
}

/**
 * Check that an element matches a given selector for a given event (ie its
 * target)
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

/**
 * Get the event name and namespaces from a string
 *
 * @param original event name and dot delimited namespaces
 * @returns Object with split parts
 */
function parseEventName(original: string | null) {
	if (!original) {
		return {
			eventName: null,
			namespaces: [] as string[]
		};
	}

	let parts = original.split('.');
	let name = parts.shift();
	let isHover = false;
	let isFocus = false;

	// mouse[enter|leave] and focus|blur don't bubble, but do have counterparts
	// which do, so we make use of them, as this allows event delegation on
	// those event names to work as expected.
	if (name === 'mouseenter') {
		name = 'mouseover';
		isHover = true;
	}
	else if (name === 'mouseleave') {
		name = 'mouseout';
		isHover = true;
	}
	else if (name === 'focus') {
		name = 'focusin';
		isFocus = true;
	}
	else if (name === 'blur') {
		name = 'blurout';
		isFocus = true;
	}

	return {
		eventName: name,
		isFocus,
		isHover,
		namespaces: parts
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
	el: Element | Window,
	nameFull: string,
	handler: EventListener,
	selector: string | null,
	one: boolean
) {
	let jq = external('jq');

	if (jq) {
		let method = one ? 'one' : 'on';

		if (selector) {
			jq(el)[method](nameFull, selector, handler);
		}
		else {
			jq(el)[method](nameFull, handler);
		}

		return;
	}

	// No jQuery - add the event ourselves
	let { eventName, namespaces, isFocus, isHover } = parseEventName(nameFull);

	if (!eventName) {
		return;
	}

	// Create a function that will be the actual event handler, and performs any
	// logic we need, such as delegate handling and adding properties.
	let wrapped = function (event: DomEvent) {
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

		// If a special (overridden) type, then we need to check that they apply
		if (
			!selector &&
			((isFocus && event.target !== el) ||
				(isHover &&
					event.relatedTarget &&
					(el as Element).contains(event.relatedTarget)))
		) {
			return;
		}

		// For delegate events, determine if the target matches our selector
		if (selector) {
			let dTarget = delegateTarget(el as Element, selector, event);

			if (!dTarget) {
				return;
			}

			callScope = dTarget;
		}

		// Set the properties that jQuery adds to the event object
		setEventProp(event, 'currentTarget', callScope);
		setEventProp(event, 'delegateTarget', el);
		setEventProp(event, 'relatedTarget', event.relatedTarget);

		// If it was triggered, extra data can be passed through using the
		// arguments passed to trigger.
		let retVal = handler.apply(callScope, [event, ...(event._args || [])]);

		if (one) {
			remove(el, eventName, handler, selector);
		}

		if (retVal === false) {
			event.preventDefault();
			event.stopPropagation();
		}

		event.handlerReturn = retVal;
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
	el: Element | Window,
	nameFull: string | null,
	handler: EventListener | null,
	selector: string | null
) {
	let jq = external('jq');

	if (jq) {
		if (selector) {
			jq(el).off(nameFull, selector, handler);
		}
		else {
			jq(el).off(nameFull, handler);
		}

		return;
	}

	// No jQuery - do it our way
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
				wrapped.type === eventName &&
				wrapped.delegateSelector === selector
		);
	}
	else if (eventName && handler) {
		removeEvents = stored.filter(
			wrapped =>
				wrapped.type === eventName && wrapped.original === handler
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
			// The event needs to match all of the namespaces given in order to
			// be removed - this matches jQuery's behaviour. The event could
			// have other namespaces. Do this by filtering to just the filtering
			// namespaces and check that the length matches
			ev =>
				ev.namespaces.filter(ns => namespaces.includes(ns)).length ===
				namespaces.length
		);
	}

	removeEvents.forEach(wrapped => {
		eventStore.remove(el, wrapped);
		el.removeEventListener(wrapped.type, wrapped);
	});
}

/**
 * Trigger an event on an element. Can have extra data given, which is useful
 * for custom events.
 *
 * @param el Element to trigger the event on
 * @param nameFull Event name with optional dot separated namespaces
 * @param bubbles If the event should bubble up through the DOM or not
 * @param args Array of arguments to pass to the event handler
 * @param eventProps Object of extra parameters to attach to the event object
 * @param returnEvent Indicate if the return should be the event object (for
 *   further processing) or the default prevented state.
 * @returns `true` if default was NOT prevented, `false` if default was
 *   prevented. If `returnEvent` is `true` then the return will be the event
 *   object.
 */
export function trigger(
	el: Element,
	nameFull: string,
	bubbles: boolean = false,
	args: unknown[] | null = [],
	eventProps: PlainObject | null = null,
	returnEvent = false
): boolean | Event {
	let jq = external('jq');

	if (jq) {
		let method = bubbles ? 'trigger' : 'triggerHandler';
		let ev = jq.Event(nameFull);

		object.each(eventProps, (key, val) => {
			setEventProp(ev, key, val);
		});

		jq(el)[method](ev, args || []);

		// See note below regarding the inversion
		return returnEvent ? ev : !ev.isDefaultPrevented();
	}

	// No jQuery
	let { eventName, namespaces } = parseEventName(nameFull);

	if (!eventName) {
		return false;
	}

	let isMouseEvent = _mouseEvents.includes(eventName.toLowerCase());
	let event = isMouseEvent
		? new MouseEvent(eventName, { bubbles, cancelable: true })
		: new Event(eventName, { bubbles, cancelable: true });

	// Set the extra properties for the event
	setEventProp(event, 'namespace', namespaces.join('.'));
	setEventProp(event, '_args', args || []);
	object.each(eventProps, (key, val) => setEventProp(event, key, val));

	el.dispatchEvent(event);

	// A lot of the old DataTables stuff checks for a `false` return to prevent
	// the default action. To maintain compatibility we return an inverted
	// `defaultPrevented` here - i.e. it becomes `do default`.
	return returnEvent ? event : !event.defaultPrevented;
}
