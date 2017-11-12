
/**
 * DataTables utility methods
 * 
 * This namespace provides helper methods that DataTables uses internally to
 * create a DataTable, but which are not exclusively used only for DataTables.
 * These methods can be used by extension authors to save the duplication of
 * code.
 *
 *  @namespace
 */
DataTable.util = {
	/**
	 * Throttle the calls to a function. Arguments and context are maintained
	 * for the throttled function.
	 *
	 * @param {function} fn Function to be called
	 * @param {integer} freq Call frequency in mS
	 * @return {function} Wrapped function
	 */
	throttle: function ( fn, freq ) {
		var
			call,
			that,
			timer;

		freq = freq !== undefined ? freq : 200;

		function timeout() {
			fn.apply( that, call );
			call = undefined;
			that = undefined;
			timer = setTimeout( function () {
				timer = undefined;
				if ( call ) {
					timeout();
				}
			}, freq );
		}

		return function () {
			that = this;
			call = arguments;
			if ( !timer ) {
				timeout();
			}
		};
	},


	/**
	 * Debounce the calls to a function. Arguments and context are maintained
	 * for the debounced function.
	 *
	 * @param {function} fn Function to be called
	 * @param {integer} wait Wait after last call in mS
	 * @return {function} Wrapped function
	 */
	debounce: function ( fn, wait ) {
		var timer;

		wait = wait !== undefined ? wait : 200;	

		return function () {
			var args = arguments;
			var that = this;
			if ( timer ) {
			  clearTimeout(timer);
			}
			timer = setTimeout( function () {
				timer = undefined;
				fn.apply( that, args );
			}, wait );
		};
	},

	/**
	 * Escape a string such that it can be used in a regular expression
	 *
	 *  @param {string} val string to escape
	 *  @returns {string} escaped string
	 */
	escapeRegex: function ( val ) {
		return val.replace( _re_escape_regex, '\\$1' );
	}
};

