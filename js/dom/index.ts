import util from '../util';
import * as is from '../util/is';
import * as object from '../util/object';
import { PlainObject } from '../util/types';
import * as events from './events';
import { EventHandler } from './events';
import win from './window';

type AttributeTypes = string | number | boolean | null;
type DomSelector =
	| string
	| Node
	| Element
	| HTMLElement
	| Document
	| Array<DomSelector>
	| null
	| JQuery
	| Dom;
type TDimensionInclude =
	| 'outer' // alias to withBorder
	| 'inner' // alias to withPadding
	| 'content' // default, same as not sending anything
	| 'withBorder'
	| 'withPadding'
	| 'withMargin';

export class Dom<T extends HTMLElement = HTMLElement> {
	/**
	 * Create a new element and wrap in a `Dom` instance
	 *
	 * @param name Element name to create
	 * @returns Dom instance for manipulating the new element
	 */
	static create<R extends HTMLElement = HTMLElement>(name: string) {
		let el = document.createElement(name);

		return new Dom<R>(el);
	}

	/**
	 * Select items from the document and wrap in a `Dom` instance
	 *
	 * @param selector Items to select
	 * @returns Dom instance for manipulating the selected items
	 */
	static selector<R extends HTMLElement = HTMLElement>(
		selector: DomSelector
	) {
		return new Dom<R>(selector);
	}

	/**
	 * Flag to indicate if transitions (animations) should be allowed. Set to
	 * false to disable and have it jump to the end.
	 */
	static transitions = true;

	private _store: T[] = [];
	private _isDom = true;

	/**
	 * `Dom` is used for selection and manipulation of the DOM elements in a
	 * chaining interface.
	 *
	 * @param selector
	 */
	constructor(selector?: DomSelector) {
		if (selector) {
			this.add(selector);
		}
	}

	/**
	 * Add an element (or multiple) to the instance. Will ensure uniqueness.
	 *
	 * @param el Element(s) to add
	 * @param sort Indicate if the element should be added in document order.
	 * @returns Self for chaining
	 */
	add(selector: DomSelector, sort = true) {
		if (selector) {
			if (typeof selector === 'string') {
				let elements = Array.from(document.querySelectorAll(selector));

				addArray(this._store, elements);
			}
			else if (selector instanceof Dom) {
				addArray(this._store, selector.get());
			}
			else if (
				typeof selector === 'object' &&
				!(selector as any).nodeName && // <select> has a length!
				(selector as any[]).length !== undefined
			) {
				// Array-like - could be a jQuery instance or DataTables API
				// instance
				let arrayLike = selector as any[];

				for (let i = 0; i < arrayLike.length; i++) {
					addArray(this._store, arrayLike[i]);
				}

				sort = false;
			}
			else {
				addArray(this._store, selector);
			}
		}

		if (sort) {
			this._store.sort(documentOrder);
		}

		return this;
	}

	/**
	 * Insert the given content to each item in the result set.
	 *
	 * Limit your result set to a single item!
	 *
	 * @param content The content to append
	 * @returns Self for chaining
	 */
	append<T extends Node>(
		content: T | Dom | string | null | Array<T | Dom | string | null>
	) {
		if (!content) {
			return this;
		}

		if (Array.isArray(content)) {
			content.forEach(c => this.append(c));

			return this;
		}

		return this.each(el => {
			if (content instanceof Dom) {
				content.each(item => {
					el.append(item);
				});
			}
			else if (typeof content === 'string') {
				el.insertAdjacentHTML('beforeend', content);
			}
			else if (is.arrayLike(content)) {
				// Allow for a jQuery object being passed
				let arrayLike = content as any;

				for (let i = 0; i < arrayLike.length; i++) {
					el.append(arrayLike[i]);
				}
			}
			else {
				el.append(content);
			}
		});
	}

	/**
	 * Append the current data set items to the element from the selector
	 *
	 * @param selector
	 */
	appendTo(selector: DomSelector | Dom) {
		let inst = selector instanceof Dom ? selector : new Dom(selector);

		inst.append(this);

		return this;
	}

	/**
	 * Get an attribute's value from the first item in the result set. Can be
	 * null.
	 *
	 * @param name Attribute name
	 * @returns Read value
	 */
	attr(name: string): string;

	/**
	 * Set an attribute's value for all items in the result set.
	 *
	 * @param name Attribute name
	 * @param value Value to give the attribute
	 * @returns Self for chaining
	 */
	attr(name: string, value: AttributeTypes): this;

	/**
	 * Set multiple attributes of the elements in the result set
	 *
	 * @param attributes Plain object of attributes to be assigned
	 */
	attr(attributes: Record<string, AttributeTypes>): this;

	attr(name: any, value?: AttributeTypes) {
		if (typeof name === 'string' && value === undefined) {
			return this.count() ? this._store[0].getAttribute(name) : null;
		}

		return this.each(el => {
			if (typeof name === 'string') {
				if (value !== undefined && value !== null) {
					el.setAttribute(
						name,
						typeof value === 'string' ? value : value.toString()
					);
				}
			}
			else {
				object.each<string>(name, (key, val) => {
					if (val !== undefined && val !== null) {
						el.setAttribute(key, val);
					}
				});
			}
		});
	}

	/**
	 * Blur on the target elements
	 *
	 * @returns Self for chaining
	 */
	blur() {
		return this.each(el => el.blur());
	}

	/**
	 * Get the child from all elements in the result set
	 *
	 * @param selector Query string that the child much match to be selected
	 * @returns New Dom instance with children as the result set
	 */
	children<R extends HTMLElement = HTMLElement>(selector?: string) {
		return this.map<R>(el => {
			let children = Array.from(el.children) as unknown as R[];

			return selector
				? children.filter(child => child.matches(selector))
				: children;
		});
	}

	/**
	 * Add one or more class names to the result set
	 *
	 * @param name Class name(s) to set
	 * @returns Self for chaining
	 */
	classAdd(name?: string | string[] | null) {
		if (!name) {
			return this;
		}

		let names = stringArrays(name);

		return this.each(el => {
			names.filter(n => n).forEach(n => el.classList.add(n));
		});
	}

	/**
	 * Check if the first element in the result set has the given class
	 *
	 * @param name Class name to check for
	 * @returns Self for chaining
	 */
	classHas(name: string) {
		return this.count() ? this._store[0].classList.contains(name) : false;
	}

	/**
	 * Remove the given class(s) from all elements in the result set
	 *
	 * @param name Class name to remove
	 * @returns Self for chaining
	 */
	classRemove(name?: string | string[] | null) {
		if (!name) {
			return this;
		}

		let names = stringArrays(name);

		return this.each(el => {
			names.filter(n => n).forEach(n => el.classList.remove(n));
		});
	}

	/**
	 * Toggle a class on all elements in the result set
	 *
	 * @param name Class name(s) to toggle - space separated
	 * @param toggle Toggle on or off
	 * @returns Self for chaining
	 */
	classToggle(name: string | string[], toggle?: boolean) {
		let names = Array.isArray(name) ? name : name.split(' ');

		return this.each(el => {
			names.filter(n => n).forEach(n => el.classList.toggle(n, toggle));
		});
	}

	/**
	 * Clone the nodes in the result set and return a new instance
	 *
	 * @param deep Include the subtree (`true`) or not (`false` - default)
	 * @returns New Dom instance with new elements
	 */
	clone(deep: boolean = false) {
		return this.map(el => el.cloneNode(deep) as T);
	}

	/**
	 * Find the closest ancestor for each element in the result set
	 *
	 * @param selector
	 * @returns New Dom instance when the matching ancestors
	 */
	closest<R extends HTMLElement = T>(
		selector: string | HTMLElement | Element
	) {
		if (typeof selector === 'string') {
			return this.map<R>(el => el.closest<R>(selector));
		}

		return this.map<R>(el => {
			// Traverse up the tree seeing if the element matches
			while (el.parentElement) {
				if (el.parentElement === selector) {
					return selector as R;
				}

				el = el.parentElement as T;
			}

			// Nothing found
			return null;
		});
	}

	/**
	 * Determine if the result set contains the element specified. Shorthand for
	 * .find().count()
	 *
	 * @param input Element / selector to look for
	 * @returns true if it does contain, false otherwise
	 */
	contains(input: Dom | string | HTMLElement | Element | null): boolean {
		return this.find(input).count() !== 0;
	}

	/**
	 * Get the number of elements in the current result set
	 *
	 * @returns Number of elements
	 */
	count() {
		return this._store.length;
	}

	/**
	 * Get a CSS computed value (first item in the result set only)
	 *
	 * @param rule The CSS property to get
	 * @returns Read value
	 */
	css(rule: string): string;

	/**
	 * Set a CSS value
	 *
	 * @param rule CSS property to set
	 * @param value Value to set it to
	 * @returns Self for chaining
	 */
	css(rule: string, value: string): this;

	/**
	 * Set multiple CSS properties for all items in the result set
	 *
	 * @param rules Plain object of rules to assign to the elements
	 */
	css(rules: Record<string, string>): this;

	css(rule: any, value?: string): any {
		// String getter
		if (typeof rule === 'string' && value === undefined) {
			return this._store.length
				? getComputedStyle(this._store[0])[rule as any]
				: null;
		}

		return this.each(el => {
			if (typeof rule === 'string') {
				// String setter
				el.style[rule as any] = value!;
			}
			else {
				// Object set of rules
				Object.assign(el.style, rule);
			}
		});
	}

	/**
	 * Get all the data attributes for an element
	 *
	 * @returns Read values
	 */
	data(): Record<string, AttributeTypes>;

	/**
	 * Get a data attribute's value from the first item in the result set. Can
	 * be null.
	 *
	 * @param name Data attribute name (don't include the `data` prefix)
	 * @returns Read value
	 */
	data<T = AttributeTypes>(name: string): T;

	/**
	 * Set a data attribute's value for all items in the result set.
	 *
	 * @param name Attribute name (don't include the `data` prefix)
	 * @param value Value to give the data attribute
	 * @returns Self for chaining
	 */
	data(name: string, value: AttributeTypes): this;

	/**
	 * Set multiple data attributes of the elements in the result set
	 *
	 * @param attributes Plain object of data attributes to be assigned
	 */
	data(attributes: Record<string, AttributeTypes>): this;

	data(name?: any, value?: string | null | boolean | number) {
		if (!name) {
			let out: Record<string, AttributeTypes> = {};

			if (!this.count()) {
				return out;
			}

			Array.from(this._store[0].attributes).forEach(attr => {
				if (attr.name.startsWith('data-')) {
					out[attr.name.replace('data-', '')] = dataConvert(
						attr.value
					);
				}
			});

			return out;
		}

		if (typeof name === 'string' && value === undefined) {
			return dataConvert(this.attr('data-' + name));
		}

		if (typeof name === 'string') {
			this.attr('data-' + name, value!);
		}
		else {
			object.each<string>(name, (key, val) => {
				this.attr('data-' + key, val);
			});
		}

		return this;
	}

	/**
	 * Remove the elements in the result set from the document. Does not remove
	 * event listeners.
	 *
	 * @returns Self for chaining
	 */
	detach() {
		return this.each(el => el.remove());
	}

	/**
	 * Remove the child elements from each element in the result set from the
	 * document. Does not remove event listeners.
	 *
	 * @returns Self for chaining
	 */
	detachChildren() {
		return this.each(el => {
			el.replaceChildren();
		});
	}

	/**
	 * Iterate over each item in the result set and perform an action
	 *
	 * @param callback Callback function
	 * @returns Self for chaining
	 */
	each(callback: (el: T, idx: number) => void) {
		for (let i = 0; i < this._store.length; i++) {
			let el = this._store[i];

			callback.call(el, el, i);
		}

		return this;
	}

	/**
	 * Inverse iteration over each item in the result set and perform an action
	 *
	 * @param callback Callback function
	 * @returns Self for chaining
	 */
	eachReverse(callback: (el: T, idx: number) => void) {
		for (let i = this._store.length - 1; i >= 0; i--) {
			let el = this._store[i];

			callback.call(el, el, i);
		}

		return this;
	}

	/**
	 * Remove all children
	 *
	 * @returns Self for chaining
	 */
	empty() {
		// TODO should remove event listeners

		return this.each(el => {
			if (el.replaceChildren) {
				el.replaceChildren();
			}
			else {
				while (el.childNodes.length) {
					el.firstChild?.remove();
				}
			}
		});
	}

	/**
	 * Get a new Dom instance with just a specific element from the result set
	 *
	 * @param idx The element to use
	 * @returns New Dom instance
	 */
	eq(idx: number): Dom<T> {
		return idx < this.count() ? new Dom(this.get(idx)) : new Dom();
	}

	/**
	 * Get all elements in the result set
	 */
	get<R = T>(): R[];

	/**
	 * Get a specific element from the result set
	 *
	 * @param idx Element index
	 */
	get<R = T>(idx: number): R;

	get(idx?: number) {
		return idx !== undefined ? this._store[idx] : this._store;
	}

	/**
	 * Call focus on the target elements
	 *
	 * @returns Self for chaining
	 */
	focus() {
		return this.each(el => el.focus());
	}

	/**
	 * Reduce the result set based on a given filter, which can be a CSS
	 * selector, an element or array of elements.
	 *
	 * @param filter Optional selector or function that the result set element
	 *   would need to match to be selected.
	 * @returns New Dom instance containing the filters elements
	 */
	filter(
		filter?:
			| string
			| HTMLElement
			| HTMLElement[]
			| ArrayLike<HTMLElement>
			| ((el: T) => boolean)
	) {
		return this.map(el => {
			if (filter === undefined) {
				return el;
			}

			if (typeof filter === 'function') {
				return filter(el) ? el : null;
			}

			// Direct match - allows an element to be given as the filter
			if (typeof filter !== 'string') {
				if (is.arrayLike(filter)) {
					return Array.from(filter as any).includes(el) ? el : null;
				}

				return filter === el ? el : null;
			}

			// CSS selector
			if (!el.matches(filter)) {
				return null;
			}

			// If there is a pseudo child selector, want to check that the
			// element is actually in the document, if not, then
			// `:first-child` (etc) will match detached elements, which is
			// not desirable.
			if (
				!el.parentNode &&
				(filter.match(/:\w+-child/) || filter.match(/:\w+-of-type/))
			) {
				return null;
			}

			return el;
		});
	}

	/**
	 * Get all matching descendants
	 *
	 * @param selector Elements to find
	 */
	find<R extends HTMLElement = T>(
		input: Dom | string | HTMLElement | Element | null
	): Dom<R> {
		if (input === null) {
			return new Dom<R>();
		}

		// Text based selector - loop over each element in the result set, doing
		// the search on each and adding to a new instance.
		if (typeof input === 'string') {
			return this.map<R>(el => Array.from(el.querySelectorAll(input)));
		}

		let selector = input instanceof Dom ? input.get() : input;

		// Otherwise its an element, that we need to see if one of the elements
		// in the result set is a parent of the given target
		let hasParent = false;

		this.each(el => {
			if (new Dom(selector).closest(el).count()) {
				hasParent = true;
			}
		});

		return new Dom<R>(hasParent ? selector : []);
	}

	/**
	 * Get the last element in the result set
	 *
	 * @returns New instance with just the selected item
	 */
	first() {
		let s = this._store;

		return new Dom(s.length ? s[0] : null);
	}

	/**
	 * Get the height for the first element in the result set. Whether this is
	 * the inner or outer height depends on the box model for the element.
	 *
	 * @returns Element's height
	 */
	height(): number;

	/**
	 * Get the height of the first element in the result set, with specific
	 * parts included in the result.
	 *
	 * @param include Parts of the box model to include
	 * @returns Element's height
	 */
	height(include: TDimensionInclude): number;

	/**
	 * Set the height for all elements in the result set,
	 *
	 * @param set Value to set as the height. As a number it will be treated as
	 *   a pixel value, while as a string, it must have a CSS unit already on
	 *   it.
	 * @returns Self
	 */
	height(set: number | string): this;

	height(include?: any): any {
		if (!this.count()) {
			return 0;
		}

		if (
			include === undefined ||
			include === 'withPadding' ||
			include === 'withBorder' ||
			include === 'withMargin' ||
			include === 'inner' ||
			include === 'outer'
		) {
			let el = this._store[0];
			let computed = window.getComputedStyle(this._store[0]);
			let rectHeight = el.getBoundingClientRect().height;

			if (!include || include === 'content') {
				// Content. Minus scrollbar if there is one. This is basically
				// clientHeight minus padding, but that isn't fractional, so use
				// the bounding rect.
				let barHeight =
					el.offsetHeight -
					parseFloat(computed.borderTop) -
					parseFloat(computed.borderBottom) -
					el.clientHeight;

				return (
					rectHeight -
					parseFloat(computed.paddingTop) -
					parseFloat(computed.paddingBottom) -
					parseFloat(computed.borderTop) -
					parseFloat(computed.borderBottom) -
					barHeight
				);
			}
			else if (include === 'withPadding' || include === 'inner') {
				return (
					rectHeight -
					parseFloat(computed.borderTop) -
					parseFloat(computed.borderBottom)
				);
			}
			else if (include === 'withBorder') {
				return rectHeight;
			}
			else {
				// withMargin
				return (
					rectHeight +
					parseFloat(computed.marginTop) +
					parseFloat(computed.marginBottom)
				);
			}
		}
		else {
			// Setter
			return this.each(
				el =>
					(el.style.height =
						typeof include === 'string' ? include : include + 'px')
			);
		}
	}

	/**
	 * Hide an element by setting it to `display: none`
	 *
	 * @returns Self for chaining
	 */
	hide() {
		return this.each(el => {
			el.style.display = 'none';
		});
	}

	/**
	 * Get the HTML from the first element in the result set
	 */
	html(): string;

	/**
	 * Set the HTML for all elements in the result set
	 * @param data Value to set as the HTML
	 * @returns Self for chaining
	 */
	html(data: string): this;

	html(data?: string) {
		if (data !== undefined) {
			return this.each(el => {
				el.innerHTML = data;
			});
		}
		else {
			return this.count() ? this._store[0].innerHTML : null;
		}
	}

	/**
	 * Boolean return check on if an item in the result set matches the selector
	 * given. Only one need match.
	 *
	 * @param selector Selector to match against
	 * @returns Boolean true if there is a match
	 */
	is(
		selector:
			| string
			| HTMLElement
			| HTMLElement[]
			| ArrayLike<HTMLElement>
			| ((el: T) => boolean)
	) {
		return this.filter(selector).count() > 0;
	}

	/**
	 * Determine if the first element in the result set is in the document or
	 * not
	 *
	 * @returns true if is, false if detached
	 */
	isAttached() {
		if (this.count() === 0) {
			return false;
		}

		return document.body.contains(this._store[0]);
	}

	/**
	 * Determine if the first element in the result set is visible or not.
	 *
	 * @returns Visibility flag
	 */
	isVisible() {
		if (this.count() === 0) {
			return false;
		}

		let el = this._store[0];

		return !!(
			el.offsetWidth ||
			el.offsetHeight ||
			el.getClientRects().length
		);
	}

	/**
	 * Get the index of an element from among its siblings
	 *
	 * @returns Element index
	 */
	index() {
		if (this.count()) {
			let el = this._store[0];

			return Array.from(el.parentNode!.children).indexOf(el);
		}

		return -1;
	}

	/**
	 * Insert each element in the result set after a target node
	 *
	 * @param target Element after which the insert should happen
	 * @returns Self for chaining
	 */
	insertAfter(target: Element | Element[] | Dom) {
		let nodes = elementArray(target);

		return this.eachReverse(el => {
			nodes.forEach(n => n?.parentNode?.insertBefore(el, n.nextSibling));
		});
	}

	/**
	 * Insert each element in the result set before a target node
	 *
	 * @param target Element before which the insert should happen
	 * @returns Self for chaining
	 */
	insertBefore(target: Element | Element[] | Dom) {
		let nodes = elementArray(target);

		return this.each(el => {
			nodes.forEach(n => n?.parentNode?.insertBefore(el, n));
		});
	}

	/**
	 * Get the last element in the result set
	 *
	 * @returns New instance with just the selected item
	 */
	last() {
		let s = this._store;

		return new Dom(s.length ? s[s.length - 1] : null);
	}

	/**
	 * Create a new Dom instance based on the results from a callback function
	 * which is executed per element in the result set.
	 *
	 * @param fn Function to get the elements to add to the new instance
	 * @returns New Dom instance with the results from the callback
	 */
	map<R extends HTMLElement = T>(fn: (el: T) => R | R[] | null) {
		let next = new Dom<R>();

		this.each(el => {
			// Don't reorder the items
			next.add(fn(el), false);
		});

		return next;
	}

	/**
	 * Create an array of any data type based on a function returning a value
	 * from each element in the result set.
	 *
	 * @param fn Mapping function
	 * @returns Array of returned objects.
	 */
	mapTo<R>(fn: (el: T, idx: number) => R) {
		let result: R[] = [];

		this.each((el, idx) => result.push(fn(el, idx)));

		return result;
	}

	/**
	 * Remove all events attached to this element
	 */
	off(): this;

	/**
	 * Remove all events attached to this element that match the given event
	 * name or any of the namespaces (if given).
	 *
	 * @param name Event name. This can optionally include period separated
	 *   namespaces. Multiple events can be removed by space separation of the
	 *   names.
	 */
	off(name: string): this;

	/**
	 * Remove all events attached to this element that match the given event
	 * name or any of the namespaces (if given) and the event handler
	 *
	 * @param name Event name. This can optionally include period separated
	 *   namespaces. Multiple events can be removed by space separation of the
	 *   names.
	 * @param handler Callback to remove
	 */
	off(name: string, handler: Function): this;

	/**
	 * Remove all delegated events attached to this element that match the given
	 * event name or any of the namespaces (if given), the delegate selector and
	 * (optionally) the event handler
	 *
	 * @param name Event name. This can optionally include period separated
	 *   namespaces. Multiple events can be removed by space separation of the
	 *   names.
	 * @param selector CSS style selector to use to match elements from the
	 *   parent.
	 * @param handler Callback to remove
	 */
	off(name: string, selector: string, handler?: Function): this;

	off(arg1?: string, arg2?: any, arg3?: any): this {
		let { handler, names, selector } = normaliseEventParams(
			arg1,
			arg2,
			arg3
		);

		return this.each(el => {
			names.forEach(name => {
				events.remove(el, name, handler, selector);
			});
		});
	}

	/**
	 * Get the offset of the first element in the result set. The offset is the
	 * coordinates of the element relative to the document.
	 *
	 * @returns Object with top and left offset
	 */
	offset() {
		if (!this.count()) {
			return {
				top: 0,
				left: 0
			};
		}

		let box = this._store[0].getBoundingClientRect();
		let docElem = document.documentElement;

		return {
			top: box.top + window.pageYOffset - docElem.clientTop,
			left: box.left + window.pageXOffset - docElem.clientLeft
		};
	}

	/**
	 * Get the offset parents of the elements in the result set.
	 *
	 * Departure from jQuery - it won't go up to `html`
	 *
	 * @returns Instance with the result set as the offset parents
	 */
	offsetParent() {
		return this.map(
			el => (el.offsetParent as HTMLElement) || document.body
		);
	}

	/**
	 * Add an event listener to all elements in the result set.
	 *
	 * @param name Event name. This can optionally include period separated
	 *   namespaces. Multiple events can be added by space separation of the
	 *   names.
	 * @param handler Callback when the event happens.
	 * @return Self for chaining
	 */
	on(name: string, handler: EventHandler): this;

	/**
	 * Add a delegated event listener to all elements in the result set.
	 *
	 * @param name Event name. This can optionally include period separated
	 *   namespaces. Multiple events can be added by space separation of the
	 *   names.
	 * @param selector CSS style selector to use to match elements from the
	 *   parent.
	 * @param handler Callback when the event happens.
	 * @return Self for chaining
	 */
	on(name: string, selector: string, handler: EventHandler): this;

	on(arg1: string, arg2: any, arg3?: any): this {
		let { handler, names, selector } = normaliseEventParams(
			arg1,
			arg2,
			arg3
		);

		return this.each(el => {
			names
				.filter(n => n !== null)
				.forEach(name => {
					events.add(el, name, handler, selector, false);
				});
		});
	}

	/**
	 * Add a one-time event listener to all elements in the result set.
	 *
	 * @param name Event name. This can optionally include period separated
	 *   namespaces. Multiple events can be added by space separation of the
	 *   names.
	 * @param handler Callback when the event happens.
	 * @return Self for chaining
	 */
	one(name: string, handler: EventHandler): this;

	/**
	 * Add a one-time event listener to all elements in the result set.
	 *
	 * @param name Event name. This can optionally include period separated
	 *   namespaces. Multiple events can be added by space separation of the
	 *   names.
	 * @param selector CSS style selector to use to match elements from the
	 *   parent.
	 * @param handler Callback when the event happens.
	 * @return Self for chaining
	 */
	one(name: string, selector: string, handler: EventHandler): this;

	one(arg1: string, arg2: any, arg3?: any): this {
		let { handler, names, selector } = normaliseEventParams(
			arg1,
			arg2,
			arg3
		);

		return this.each(el => {
			names
				.filter(n => n !== null)
				.forEach(name => {
					events.add(el, name, handler, selector, true);
				});
		});
	}

	/**
	 * Get the parent element for each element in the result set
	 *
	 * @param filter Optional selector that the parent element would need to
	 *   match to be selected.
	 * @returns New Dom instance containing the parent elements
	 */
	parent(filter?: string) {
		return this.map(el => {
			let parent = el.parentElement;

			if (filter) {
				return parent?.matches(filter) ? parent : null;
			}

			return parent;
		});
	}

	/**
	 * Get the position of the first element in the result set. The position is
	 * the coordinates relative to the offset parent.
	 *
	 * @returns Object with top and left position coordinates
	 */
	position() {
		if (!this.count()) {
			return {
				top: 0,
				left: 0
			};
		}

		let el = this._store[0];
		let { marginTop, marginLeft } = getComputedStyle(el);

		return {
			top: el.offsetTop - parseInt(marginTop),
			left: el.offsetLeft - parseInt(marginLeft)
		};
	}

	/**
	 * Prepend the given content to each item in the result set.
	 *
	 * You should limit your result set to a single item!
	 *
	 * @param content
	 * @returns
	 */
	prepend(content: Element | Dom | string) {
		return this.each(el => {
			if (content instanceof Dom) {
				// Reverse the array, so if there are multiple elements, they
				// end up being added sequentially, just like jQuery
				content._store.reverse();
				content.each(item => el.prepend(item));
				content._store.reverse();
			}
			else if (typeof content === 'string') {
				el.insertAdjacentHTML('afterbegin', content);
			}
			else {
				el.prepend(content);
			}
		});
	}

	/**
	 * Append the current data set items to the element from the selector
	 *
	 * @param selector
	 */
	prependTo(selector: DomSelector | Dom) {
		if (selector instanceof Dom) {
			selector.prepend(this);
		}
		else {
			new Dom(selector).prepend(this);
		}

		return this;
	}

	/**
	 * Get an property value from the first item in the result set. Can be
	 * undefined. Note this is not the same as an attribute, although they could
	 * be!
	 *
	 * @param name Property name
	 * @returns Read value
	 */
	prop(name: string): AttributeTypes;

	/**
	 * Set an property value for all items in the result set.
	 *
	 * @param name Property name
	 * @param value Value to give the property
	 * @returns Self for chaining
	 */
	prop(name: string, value: AttributeTypes): this;

	prop(name: any, value?: AttributeTypes) {
		if (typeof name === 'string' && value === undefined) {
			return this.count() ? (this._store[0] as any)[name] : null;
		}

		return this.each(el => {
			(el as any)[name] = value;
		});
	}

	/**
	 * Remove a property from all elements in the result set
	 *
	 * @param name Property name to remove
	 * @returns Self for chaining
	 */
	propRemove(name: string) {
		return this.each(el => {
			delete (el as any)[name];
		});
	}

	/**
	 * Removed all nodes in the result set from the document
	 *
	 * @returns Self for chaining
	 */
	remove() {
		// TODO this should remove event listeners

		return this.each(el => el.remove());
	}

	/**
	 * Remove an attribute on each element in the result set
	 *
	 * @param attr Attribute to remove
	 * @returns Self for chaining
	 */
	removeAttr(attr: string) {
		return this.each(el => el.removeAttribute(attr));
	}

	/**
	 * Replace the elements in the result set with those given.
	 *
	 * @param replacer Element(s) to insert in place of the originals
	 * @returns Self
	 */
	replaceWith(replacer: Element | Dom) {
		return this.each(el => {
			if (replacer instanceof Dom) {
				el.replaceWith(...(replacer as Dom).get());
			}
			else {
				el.replaceWith(replacer as Element);
			}
		});
	}

	/**
	 * Get the scrollLeft property of the first element in the result set
	 */
	scrollLeft(): number;

	/**
	 * Set the scrollLeft property for all elements in the result set
	 *
	 * @param val Value to set
	 */
	scrollLeft(val: number): this;

	scrollLeft(val?: number) {
		if (val === undefined) {
			return this.count() ? this._store[0].scrollLeft : 0;
		}

		return this.each(el => (el.scrollLeft = val));
	}

	/**
	 * Get the scrollTop property of the first element in the result set
	 */
	scrollTop(): number;

	/**
	 * Set the scrollTop property for all elements in the result set
	 *
	 * @param val Value to set
	 */
	scrollTop(val: number): this;

	scrollTop(val?: number) {
		if (val === undefined) {
			return this.count() ? this._store[0].scrollTop : 0;
		}

		return this.each(el => (el.scrollTop = val));
	}

	/**
	 * Get the siblings of all elements in the result set
	 * @returns
	 */
	siblings() {
		return this.map(el => {
			return el.parentElement
				? (Array.from(el.parentElement.children).filter(
						child => child !== el
				  ) as T[])
				: [];
		});
	}

	/**
	 * Set the elements in the result set to display as blocks
	 *
	 * @returns Self for chaining
	 * @todo Could be smarter with hide, since some elements might have been a
	 *   grid or flex before being hidden.
	 */
	show() {
		return this.each(el => {
			el.style.display = 'block';
		});
	}

	/**
	 * Get the text content for the first item in the result set
	 */
	text(): string;

	/**
	 * Set the text content for the items in the result set
	 *
	 * @param txt Text value to set
	 * @returns Self for chaining
	 */
	text(txt: string): this;

	text(txt?: string): any {
		if (txt === undefined) {
			return this.count() ? this._store[0].textContent : null;
		}

		return this.each(el => {
			el.textContent = txt;
		});
	}

	/**
	 * Perform a CSS transition - i.e. an animation. Note this isn't nearly as
	 * comprehensive as an animation library, nor is it meant to be. It is for
	 * simple transitions such as fading in only.
	 *
	 * To set up something like a fade in, do `dom.css({opacity:
	 * 0}).transition({opacity: 1})`.
	 *
	 * @param css CSS properties to transition
	 * @param duration Transition duration
	 * @param ease CSS easing function name
	 * @param cb Callback function
	 * @returns Self for chaining
	 */
	transition(
		css: Record<string, string>,
		duration?: number | null,
		ease?: string | null,
		cb?: Function
	) {
		if (!duration) {
			duration = 400;
		}

		if (!ease) {
			ease = '';
		}

		if (!cb) {
			cb = () => {};
		}

		if (Dom.transitions) {
			let first = this._store[0] as any;

			// If there was an existing transition, cancel its callback
			if (first._dom_tra) {
				clearTimeout(first._dom_tra);
				delete first._dom_tra;
			}

			setTimeout(() => {
				this.css('transition', 'all ' + duration + 'ms ' + ease);
				this.css(css);
			}, 0);

			first._dom_tra = setTimeout(() => {
				delete first._dom_tra;

				this.css('transition', '');
				cb.call(this);
			}, duration);
		}
		else {
			this.css(css);
			cb.call(this);
		}

		return this;
	}

	/**
	 * Trigger an event on all of the elements in the result set. A different
	 * event object is created per element.
	 *
	 * @param name Event name. This can optionally include period separated
	 *   namespaces. Multiple events can be added by space separation of the
	 *   names.
	 * @param bubbles If the event should bubble up the DOM. Default, true.
	 * @param args Arguments to pass to the event handlers (after the event
	 *   object, which is always the first parameter).
	 * @param props An object of key/value pairs which should be added to the
	 *   event object that is created and fired for the events.
	 * @param returnEvent If not set or `false` the return array contains
	 *   booleans.
	 * @returns An array of do default results from the event `true` indicates
	 *  that the default action should happen, `false` means default was
	 *  prevented.
	 */
	trigger(
		name: string,
		bubbles?: boolean,
		args?: any[] | null,
		props?: PlainObject | null,
		returnEvent?: false
	): boolean[];

	/**
	 * Trigger an event on all of the elements in the result set. A different
	 * event object is created per element.
	 *
	 * @param name Event name. This can optionally include period separated
	 *   namespaces. Multiple events can be added by space separation of the
	 *   names.
	 * @param bubbles If the event should bubble up the DOM. Default, true.
	 * @param args Arguments to pass to the event handlers (after the event
	 *   object, which is always the first parameter).
	 * @param props An object of key/value pairs which should be added to the
	 *   event object that is created and fired for the events.
	 * @param returnEvent When set to `true` the return will be an array of
	 *  Event objects.
	 * @returns An array of Event objects for further processing.
	 */
	trigger(
		name: string,
		bubbles: boolean,
		args: any[] | null,
		props: PlainObject | null,
		returnEvent: true
	): Event[];

	trigger(
		name: string,
		bubbles: boolean = true,
		args: any[] | null = null,
		props: PlainObject | null = null,
		returnEvent: boolean = false
	): any[] {
		let { names } = normaliseEventParams(name);
		let ret: Array<boolean | Event> = [];

		this.each(el => {
			names
				.filter(n => n !== null)
				.forEach(name => {
					ret.push(
						events.trigger(
							el,
							name,
							bubbles,
							args,
							props,
							returnEvent
						)
					);
				});
		});

		return ret;
	}

	/**
	 * Get the value from the first item in the result set
	 */
	val(): string;

	/**
	 * Set the value for all elements in the result set
	 *
	 * @param value Value to set
	 */
	val(value: string | number): this;

	val(value?: string | number) {
		if (value === undefined) {
			// Getter
			if (!this.count()) {
				return null;
			}

			let el = this._store[0] as any;

			if (el.options && el.multiple) {
				return Array.from((el as HTMLSelectElement).options)
					.filter(opt => opt.selected)
					.map(opt => opt.value);
			}

			return el.value;
		}

		// Setter
		return this.each((el: any) => {
			if (el.options && el.multiple) {
				let valArr = Array.isArray(value) ? value : [value];

				Array.from((el as HTMLSelectElement).options).forEach(
					opt => (opt.selected = valArr.includes(opt.value))
				);
			}
			else {
				// This works for select elements as well in modern browsers
				el.value = value;
			}
		});
	}

	/**
	 * Get the content width for the first element in the result set (i.e. no
	 * padding, border or margin), regardless of the box model type.
	 *
	 * @returns Element's width
	 */
	width(): number;

	/**
	 * Get the width of the first element in the result set, with specific parts
	 * included in the result.
	 *
	 * @param include Parts of the box model to include
	 * @returns Element's width
	 */
	width(include: TDimensionInclude): number;

	/**
	 * Set the width for all elements in the result set,
	 *
	 * @param set Value to set as the width. As a number it will be treated as a
	 *   pixel value, while as a string, it must have a CSS unit already on it.
	 * @returns Self
	 */
	width(set: number | string): this;

	width(include?: any): any {
		if (!this.count()) {
			return 0;
		}

		if (
			include === undefined ||
			include === 'withPadding' ||
			include === 'withBorder' ||
			include === 'withMargin' ||
			include === 'inner' ||
			include === 'outer'
		) {
			let el = this._store[0];
			let computed = window.getComputedStyle(el);
			let rectWidth = el.getBoundingClientRect().width;

			if (!include || include === 'content') {
				// Content. Minus scrollbar if there is one. This is basically
				// clientWidth minus padding, but that isn't fractional, so use
				// the bounding rect.
				let barWidth =
					el.offsetWidth -
					parseFloat(computed.borderLeft) -
					parseFloat(computed.borderRight) -
					el.clientWidth;

				return (
					rectWidth -
					parseFloat(computed.paddingLeft) -
					parseFloat(computed.paddingRight) -
					parseFloat(computed.borderLeft) -
					parseFloat(computed.borderRight) -
					barWidth
				);
			}
			else if (include === 'withPadding' || include === 'inner') {
				return (
					rectWidth -
					parseFloat(computed.borderLeft) -
					parseFloat(computed.borderRight)
				);
			}
			else if (include === 'withBorder') {
				return rectWidth;
			}
			else {
				// withMargin
				return (
					rectWidth +
					parseFloat(computed.marginLeft) +
					parseFloat(computed.marginRight)
				);
			}
		}
		else {
			// Setter
			return this.each(
				el =>
					(el.style.width =
						typeof include === 'string' ? include : include + 'px')
			);
		}
	}
}

// Aliases for jQuery-likeness. Not exposed via Typescript, but that might
// change.
(Dom.prototype as any).addClass = Dom.prototype.classAdd;
(Dom.prototype as any).hasClass = Dom.prototype.classHas;
(Dom.prototype as any).removeClass = Dom.prototype.classRemove;

/**
 * Convert a data value into a typed value
 *
 * @param val Data to convert
 * @returns Converted value
 */
function dataConvert(val: string | null): AttributeTypes {
	if (val === 'true') {
		return true;
	}
	else if (val === 'false') {
		return false;
	}
	else if (is.num(val)) {
		return parseFloat(val!);
	}

	return val;
}

function normaliseEventParams(name?: string, arg2?: any, arg3?: any) {
	let selector: string | null;
	let handler: EventHandler;
	let names = name ? name.split(' ').map(str => str.trim()) : [null];

	if (typeof arg2 === 'string') {
		selector = arg2;
		handler = arg3;
	}
	else {
		selector = null;
		handler = arg2;
	}

	return {
		handler,
		names,
		selector
	};
}

function documentOrder(a: HTMLElement, b: HTMLElement) {
	if (a === b) {
		return 0;
	}

	let position = a.compareDocumentPosition(b);

	if (position & Node.DOCUMENT_POSITION_DISCONNECTED) {
		// One is disconnected - find which
		if (document.body.contains(a)) {
			return -1;
		}
		else if (document.body.contains(b)) {
			return 1;
		}

		return 0;
	}
	else if (
		position & Node.DOCUMENT_POSITION_FOLLOWING ||
		position & Node.DOCUMENT_POSITION_CONTAINED_BY
	) {
		return -1;
	}
	else if (
		position & Node.DOCUMENT_POSITION_PRECEDING ||
		position & Node.DOCUMENT_POSITION_CONTAINS
	) {
		return 1;
	}
	else {
		return 0;
	}
}

function elementArray(target: Element | Element[] | Dom): Element[] {
	return is.dom(target)
		? target.get()
		: Array.isArray(target)
		? target
		: [target];
}

function addArray(store: any[], el: any | any[]) {
	if (util.is.arrayLike(el)) {
		for (var i = 0; i < el.length; i++) {
			let e = el[i];

			if (e !== null && e !== undefined) {
				store.push(e);
			}
		}
	}
	else if (el !== null && el !== undefined) {
		store.push(el);
	}
}

function stringArrays(name: string | string[]) {
	let names: string[] = [];
	let add = function (n: string) {
		names.push.apply(names, n.split(' '));
	};

	if (Array.isArray(name)) {
		name.forEach(n => add(n));
	}
	else {
		add(name);
	}

	return names;
}

export default {
	c: Dom.create,
	Dom,
	s: Dom.selector,
	w: win
};
