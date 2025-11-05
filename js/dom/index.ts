import * as is from '../util/is';
import * as object from '../util/object';
import { PlainObject } from '../util/types';
import * as events from './events';

type AttributeTypes = string | number | boolean | null;
type TSelector = string | Element | HTMLElement | Document | Array<TSelector>;
type TDimensionInclude =
	| 'outer' // alias to withBorder
	| 'inner' // alias to withPadding
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
	static selector<R extends HTMLElement = HTMLElement>(selector: TSelector) {
		return new Dom<R>(selector);
	}

	private _store: T[] = [];

	/**
	 * `Dom` is used for selection and manipulation of the DOM elements in a
	 * chaining interface.
	 *
	 * @param selector
	 */
	constructor(selector?: TSelector) {
		if (selector) {
			if (typeof selector === 'string') {
				let elements = Array.from(document.querySelectorAll(selector));

				this.add(elements as T[]);
			}
			else if (selector instanceof Dom) {
				this.add(selector.get());
			}
			else if ((selector as any[]).length) {
				// Array-like - could be a jQuery instance
				let arrayLike = selector as any[];

				for (let i = 0; i < arrayLike.length; i++) {
					this.add(arrayLike[i]);
				}
			}
			else {
				this.add(selector as T);
			}
		}
	}

	/**
	 * Add an element (or multiple) to the instance. Will ensure uniqueness.
	 *
	 * @param el Element(s) to add
	 * @returns Self for chaining
	 */
	add(el: T | Array<T> | null) {
		if (Array.isArray(el)) {
			el.forEach(e => {
				if (e && !this._store.includes(e)) {
					this._store.push(e);
				}
			});
		}
		else if (el !== null) {
			if (el && !this._store.includes(el)) {
				this._store.push(el);
			}
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
	append(content: Element | Element[] | ChildNode | ChildNode[] | Dom | null) {
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
	appendTo(selector: TSelector | Dom) {
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

		let names = Array.isArray(name) ? name : name.split(' ');

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

		let names = Array.isArray(name) ? name : name.split(' ');

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
	closest<R extends HTMLElement = T>(selector: string | HTMLElement | Element) {
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
	data<T=AttributeTypes>(name: string): T;

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
					out[attr.name.replace('data-', '')] = dataConvert(attr.value);
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

			callback(el, i);
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
	get(): T[];

	/**
	 * Get a specific element from the result set
	 *
	 * @param idx Element index
	 */
	get(idx: number): T;

	get(idx?: number) {
		return idx !== undefined ? this._store[idx] : this._store;
	}

	/**
	 * Get the parent element for each element in the result set
	 *
	 * @param filter Optional selector that the parent element would need to
	 *   match to be selected.
	 * @returns New Dom instance containing the parent elements
	 */
	filter(filter?: string) {
		return this.map(el => {
			if (filter) {
				return el.matches(filter) ? el : null;
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
		selector: string | HTMLElement | Element | null
	): Dom<R> {
		if (selector === null) {
			return new Dom<R>();
		}

		// Text based selector - loop over each element in the result set, doing
		// the search on each and adding to a new instance.
		if (typeof selector === 'string') {
			return this.map<R>(el => Array.from(el.querySelectorAll(selector)));
		}

		// Otherwise its an element, that we need to see if one of the elements
		// in the result set is a parent of the given target
		let hasParent = false;

		this.each(el => {
			if (new Dom(el).closest(selector).count()) {
				hasParent = true;
			}
		});

		return new Dom<R>(hasParent ? selector : []);
	}

	/**
	 * Get the height for the first element in the result set. Whether this is
	 * the inner or outer height depends on the box model for the element.
	 *
	 * @returns Element's height
	 */
	height(): number;

	/**
	 * Get the height of the first element in the result set, with specific parts
	 * included in the result.
	 *
	 * @param include Parts of the box model to include
	 * @returns Element's height
	 */
	height(include: TDimensionInclude): number;

	/**
	 * Set the height for all elements in the result set,
	 *
	 * @param set Value to set as the height. As a number it will be treated as a
	 *   pixel value, while as a string, it must have a CSS unit already on it.
	 * @returns Self
	 */
	height(set: number | string): this;

	height(include?: any): any {
		if (!include) {
			return this.count() ? this._store[0].getBoundingClientRect().height : 0;
		}
		else if (include === 'withPadding' || include === 'inner') {
			return this.count() ? this._store[0].clientHeight : 0;
		}
		else if (
			include === 'withBorder' ||
			include === 'withMargin' ||
			include === 'outer'
		) {
			if (!this.count()) {
				return 0;
			}

			let offsetheight = (this._store[0] as unknown as HTMLElement)
				.offsetHeight;

			if (include === 'withMargin') {
				let computed = window.getComputedStyle(this._store[0]);

				return (
					offsetheight +
					parseFloat(computed.marginTop) +
					parseFloat(computed.marginBottom)
				);
			}

			return offsetheight;
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
	 * Determine if the first element in the result set is visible or not.
	 *
	 * @returns Visibility flag
	 */
	isVisible() {
		if (this.count() === 0) {
			return false;
		}

		let el = this._store[0];

		return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
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
	insertAfter(target: Element) {
		return this.each(el =>
			target.parentNode?.insertBefore(el, target.nextSibling)
		);
	}

	/**
	 * Insert each element in the result set before a target node
	 *
	 * @param target Element before which the insert should happen
	 * @returns Self for chaining
	 */
	insertBefore(target: Element) {
		return this.each(el => target.parentNode?.insertBefore(el, target));
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
			next.add(fn(el));
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
		let { handler, names, selector } = normaliseEventParams(arg1, arg2, arg3);

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
				left: 0,
			};
		}

		let box = this._store[0].getBoundingClientRect();
		let docElem = document.documentElement;

		return {
			top: box.top + window.pageYOffset - docElem.clientTop,
			left: box.left + window.pageXOffset - docElem.clientLeft,
		};
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
		let { handler, names, selector } = normaliseEventParams(arg1, arg2, arg3);

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
		let { handler, names, selector } = normaliseEventParams(arg1, arg2, arg3);

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
	 * Prepend the given content to each item in the result set.
	 *
	 * You should limit your result set to a single item!
	 *
	 * @param content
	 * @returns
	 */
	prepend(content: Element | Dom) {
		return this.each(el => {
			if (content instanceof Dom) {
				content.each(item => el.prepend(item));
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
	prependTo(selector: TSelector | Dom) {
		if (selector instanceof Dom) {
			selector.prepend(this);
		}
		else {
			new Dom(selector).prepend(this);
		}

		return this;
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
	 * @returns Self
	 */
	trigger(
		name: string,
		bubbles: boolean = true,
		args: any[] | null = null,
		props: PlainObject | null = null
	): boolean[] {
		let { names } = normaliseEventParams(name);
		let ret: boolean[] = [];

		this.each(el => {
			names
				.filter(n => n !== null)
				.forEach(name => {
					ret.push(events.trigger(el, name, bubbles, args, props));
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
	 * Get the width for the first element in the result set. Whether this is
	 * the inner or outer width depends on the box model for the element.
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
		if (!include) {
			return this.count() ? this._store[0].getBoundingClientRect().width : 0;
		}
		else if (include === 'withPadding' || include === 'inner') {
			return this.count() ? this._store[0].clientWidth : 0;
		}
		else if (
			include === 'withBorder' ||
			include === 'withMargin' ||
			include === 'outer'
		) {
			if (!this.count()) {
				return 0;
			}

			let offsetWidth = (this._store[0] as unknown as HTMLElement).offsetWidth;

			if (include === 'withMargin') {
				let computed = window.getComputedStyle(this._store[0]);

				return (
					offsetWidth +
					parseFloat(computed.marginTop) +
					parseFloat(computed.marginBottom)
				);
			}

			return offsetWidth;
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
		selector,
	};
}

export default {
	c: Dom.create,
	Dom,
	s: Dom.selector,
};

type EventHandler = {
	(event: any, ...args: any): any;
	guid?: number;
};
