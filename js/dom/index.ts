import * as object from '../util/object';

type TSelector = string | Element | HTMLElement | Document;

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

	private _store: Element[] = [];

	/**
	 * `Dom` is used for selection and manipulation of the DOM elements in a chaining
	 * interface.
	 *
	 * @param selector
	 */
	constructor(selector?: TSelector) {
		if (typeof selector === 'string') {
			let elements = Array.from(document.querySelectorAll(selector));

			this.add(elements as T[]);
		}
		else if (Array.isArray(selector)) {
		}
		else if (selector) {
			this.add(selector as T);
		}
	}

	/**
	 * Add an element (or multiple) to the instance
	 *
	 * @param el Element(s) to add
	 * @returns Self for chaining
	 */
	add(el: T | Array<T>) {
		if (Array.isArray(el)) {
			el.forEach(e => this._store.push(e));
		}
		else {
			this._store.push(el);
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
	append(content: Element | Dom) {
		return this.each(el => {
			if (content instanceof Dom) {
				content.each(item => el.append(item));
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
	appendTo(selector: TSelector) {
		new Dom(selector).append(this);

		return this;
	}

	/**
	 * Get an attribute's value from the first item in the result set. Can be null.
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
	attr(attributes: Record<string, string | null>): this;

	attr(name: any, value?: string) {
		if (typeof name === 'string' && value === undefined) {
			return this._store[0].getAttribute(name);
		}

		return this.each(el => {
			if (typeof name === 'string' && value) {
				el.setAttribute(name, value);
			}
			else {
				object.each<string>(name, (key, val) => {
					if (val) {
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
		let next = new Dom();

		this.each(el => {
			next.add(Array.from(el.children) as Element[]);
		});

		return next;
	}

	/**
	 * Add one or more class names to the result set
	 *
	 * @param name Class name(s) to set
	 * @returns Self for chaining
	 */
	classAdd(name: string | string[]) {
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
		return this._store[0].classList.contains(name);
	}

	/**
	 * Remove the given class(s) from all elements in the result set
	 *
	 * @param name Class name to remove
	 * @returns Self for chaining
	 */
	classRemove(name: string | string[]) {
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
	 * Get all matching decendents. Similar to `find` in jQuery.
	 *
	 * @param selector Elements to find
	 */
	search(selector: string) {
		// this.each();
	}

	hide() {
		this.each(el => {
			(el as HTMLElement).style.display = 'none';
		});

		return this;
	}

	// height and width?

	html(): string;
	html(data: string): this;
	html(data?: string) {
		if (data) {
			this.each(el => {
				el.innerHTML = data;
			});
		}
		else {
			return this._store[0].innerHTML;
		}

		return this;
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

	siblings() {
		let next = new Dom();

		if (this._store.length && this._store[0].parentNode) {
			this.add(
				Array.from(this._store[0].parentNode.children).filter(
					child => child !== this._store[0]
				) as T[]
			);
		}

		return next;
	}

	/**
	 * Set the elements in the result set to display as blocks
	 *
	 * @returns Self for chaining
	 * @todo Could be smarter with hide, since some elements might have been a grid or flex
	 *   before being hidden.
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
			return this._store.length ? this._store[0].textContent : null;
		}

		return this.each(el => {
			el.textContent = txt;
		});
	}
}

export default {
	c: Dom.create,
	s: Dom.selector,
};
