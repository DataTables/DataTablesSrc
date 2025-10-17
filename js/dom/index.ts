import * as is from '../util/is';
import * as object from '../util/object';
import * as events from './events';

type TSelector = string | Element | HTMLElement | Document | Array<TSelector>;
type TDimensionInclude =
	| 'outer' // alias to withBorder
	| 'inner' // alias to withPadding
	| 'withBorder'
	| 'withPadding'
	| 'withMargin';

export class Dom<T extends Element = Element> {
	/**
	 * Create a new element and wrap in a `Dom` instance
	 *
	 * @param name Element name to create
	 * @returns Dom instance for manipulating the new element
	 */
	static create(name: string) {
		let el = document.createElement(name);

		return new Dom(el);
	}

	/**
	 * Select items from the document and wrap in a `Dom` instance
	 *
	 * @param selector Items to select
	 * @returns Dom instance for manipulating the selected items
	 */
	static selector(selector: TSelector) {
		return new Dom(selector);
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
				if (!this._store.includes(e)) {
					this._store.push(e);
				}
			});
		}
		else if (el !== null) {
			if (!this._store.includes(el)) {
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
	append(content: Element | Element[] | Dom) {
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
				for (let i = 0; i < (content as any).length; i++) {
					el.append(content[i]);
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
	attr(name: string): string | null;

	/**
	 * Set an attribute's value for all items in the result set.
	 *
	 * @param name Attribute name
	 * @param value Value to give the attribute
	 * @returns Self for chaining
	 */
	attr(name: string, value: string): this;

	/**
	 * Set multiple attributes of the elements in the result set
	 *
	 * @param attributes Plain object of attributes to be assigned
	 */
	attr(attributes: Record<string, string | null | boolean | number>): this;

	attr(name: any, value?: string) {
		if (typeof name === 'string' && value === undefined) {
			return this.count() ? this._store[0].getAttribute(name) : null;
		}

		return this.each(el => {
			if (typeof name === 'string') {
				if (value !== undefined && value !== null) {
					el.setAttribute(name, value);
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
	 * @returns New Dom instance with children as the result set
	 */
	children() {
		return this.map(el => Array.from(el.children));
	}

	/**
	 * Add one or more class names to the result set
	 *
	 * @param name Class name(s) to set
	 * @returns Self for chaining
	 */
	classAdd(name: string | string[]) {
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
	classRemove(name: string | string[]) {
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
	 * @param name Class name to toggle
	 * @param toggle Toggle on or off
	 * @returns Self for chaining
	 */
	classToggle(name: string, toggle?: boolean) {
		return this.each(el => {
			el.classList.toggle(name, toggle);
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
				(el as HTMLElement).style[rule as any] = value!;
			}
			else {
				// Object set of rules
				Object.assign((el as HTMLElement).style, rule);
			}
		});
	}

	/**
	 * Iterate over each item in the result set and perform an action
	 *
	 * @param callback Callback function
	 * @returns Self for chaining
	 */
	each(callback: (el: Element, idx: number) => void) {
		for (let i = 0; i < this._store.length; i++) {
			callback(this._store[i], i);
		}

		return this;
	}

	/**
	 * Remove all children
	 *
	 * @returns Self for chaining
	 */
	empty() {
		return this.each(el => el.replaceChildren());
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
	 * Get all matching descendants
	 *
	 * @param selector Elements to find
	 */
	find(selector: string | Element | null) {
		if (selector === null) {
			return new Dom();
		}

		// Text based selector - loop over each element in the result set, doing
		// the search on each and adding to a new instance.
		if (typeof selector === 'string') {
			return this.map(el => Array.from(el.querySelectorAll(selector)));
		}

		// Otherwise its an element, that we need to see if one of the elements
		// in the result set is a parent of the given target
		let hasParent = false;

		this.each(el => {
			if (new Dom(el).closest(selector).count()) {
				hasParent = true;
			}
		});

		return new Dom(hasParent ? selector : []);
	}

	/**
	 * Find the closest ancestor for each element in the result set
	 *
	 * @param selector
	 * @returns A new DOM instance when the matching ancestors
	 */
	closest(selector: string | Element) {
		if (typeof selector === 'string') {
			return this.map(el => el.closest(selector));
		}

		return this.map(el => {
			// Traverse up the tree seeing if the element matches
			while (el.parentElement) {
				if (el.parentElement === selector) {
					return selector;
				}

				el = el.parentElement;
			}

			// Nothing found
			return null;
		});
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
					((el as HTMLElement).style.height =
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
			(el as HTMLElement).style.display = 'none';
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
		if (data) {
			this.each(el => {
				el.innerHTML = data;
			});
		}
		else {
			return this.count() ? this._store[0].innerHTML : null;
		}

		return this;
	}

	/**
	 * Create a new Dom instance based on the results from a callback function
	 * which is executed per element in the result set.
	 *
	 * @param fn Function to get the elements to add to the new instance
	 * @returns New Dom instance with the results from the callback
	 */
	map(fn: (el: Element) => Element | Element[] | null) {
		let next = new Dom();

		this.each(el => {
			next.add(fn(el));
		});

		return next;
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
	off(name): this;

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
		let {handler, names, selector} = normaliseEventParams(arg1, arg2, arg3);

		return this.each(el => {
			names.forEach(name => {
				events.remove(el, name, handler, selector);
			});
		});
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
		let {handler, names, selector} = normaliseEventParams(arg1, arg2, arg3);

		return this.each(el => {
			names.forEach(name => {
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
		let {handler, names, selector} = normaliseEventParams(arg1, arg2, arg3);

		return this.each(el => {
			names.forEach(name => {
				events.add(el, name, handler, selector, true);
			});
		});
	}

	/**
	 * Get the parent element for each element in the result set
	 *
	 * @returns New Dom instance containing the parent elements
	 */
	parent() {
		return this.map(el => el.parentElement);
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
	prependTo(selector: TSelector) {
		new Dom(selector).prepend(this);

		return this;
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
			(el as HTMLElement).style.display = 'block';
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

	// TODO trigger

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
				return el.options
					.filter(opt => opt.selected)
					.map(opt => opt.value);
			}
			
			return el.value;
		}

		// Setter
		return this.each((el: any) => {
			if (el.options && el.multiple) {
				let valArr = Array.isArray(value) ? value : [value];

				el.options.forEach(opt => opt.selected = valArr.includes(opt.value));
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
					((el as HTMLElement).style.width =
						typeof include === 'string' ? include : include + 'px')
			);
		}
	}
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

export default {
	c: Dom.create,
	Dom,
	s: Dom.selector,
};

type EventHandler = {
  ( event: any, data?: any ): any,
  guid?: number
};