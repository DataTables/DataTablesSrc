// Window level functions
import * as events from './events';
import { EventHandler } from './events';

export default {
	/**
	 * Get the height of the window, excluding a horizontal scrollbar if it is
	 * present.
	 *
	 * @returns Height in pixels
	 */
	height() {
		return document.querySelector('html')?.clientHeight || 0;
	},

	/**
	 * Remove an event handler from the window
	 *
	 * @param name Event name (can include or just be a namespace)
	 * @param cb Event callback function
	 */
	off(name: string, cb: EventHandler | null = null) {
		events.remove(window, name, cb, null);
	},

	/**
	 * Add an event handler to the window
	 *
	 * @param name Event name (can include a namespace)
	 * @param cb Event callback function
	 */
	on(name: string, cb: EventHandler) {
		events.add(window, name, cb, null, false);
	},

	/**
	 * Add an event handler to the window that will execute just once
	 *
	 * @param name Event name (can include a namespace)
	 * @param cb Event callback function
	 */
	one(name: string, cb: EventHandler) {
		events.add(window, name, cb, null, true);
	},

	/**
	 * Get the left scroll offset of the window / document
	 *
	 * @returns Window X scroll offset in pixels
	 */
	scrollLeft() {
		return window.scrollX;
	},

	/**
	 * Get the top scroll offset of the window / document
	 *
	 * @returns Window Y scroll offset in pixels
	 */
	scrollTop() {
		return window.scrollY;
	},

	/**
	 * Get the width of the window, excluding a vertical scrollbar if it is
	 * present.
	 *
	 * @returns Width in pixels
	 */
	width() {
		return document.querySelector('html')?.clientWidth || 0;
	}
}