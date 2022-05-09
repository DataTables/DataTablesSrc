
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
			frequency = freq !== undefined ? freq : 200,
			last,
			timer;

		return function () {
			var
				that = this,
				now  = +new Date(),
				args = arguments;

			if ( last && now < last + frequency ) {
				clearTimeout( timer );

				timer = setTimeout( function () {
					last = undefined;
					fn.apply( that, args );
				}, frequency );
			}
			else {
				last = now;
				fn.apply( that, args );
			}
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
	},

	/**
	 * Create a function that will write to a nested object or array
	 * @param {*} source JSON notation string
	 * @returns Write function
	 */
	set: function ( source ) {
		if ( $.isPlainObject( source ) ) {
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return DataTable.util.set( source._ );
		}
		else if ( source === null ) {
			// Nothing to do when the data source is null
			return function () {};
		}
		else if ( typeof source === 'function' ) {
			return function (data, val, meta) {
				source( data, 'set', val, meta );
			};
		}
		else if ( typeof source === 'string' && (source.indexOf('.') !== -1 ||
				  source.indexOf('[') !== -1 || source.indexOf('(') !== -1) )
		{
			// Like the get, we need to get data from a nested object
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ ) {
					// Protect against prototype pollution
					if (a[i] === '__proto__' || a[i] === 'constructor') {
						throw new Error('Cannot set prototype values');
					}
	
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation ) {
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( Array.isArray( val ) ) {
							for ( var j=0, jLen=val.length ; j<jLen ; j++ ) {
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else {
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation ) {
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined ) {
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) ) {
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else {
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, source );
			};
		}
		else {
			// Array or flat object mapping
			return function (data, val) { // meta is also passed in, but not used
				data[source] = val;
			};
		}
	},

	/**
	 * Create a function that will read nested objects from arrays, based on JSON notation
	 * @param {*} source JSON notation string
	 * @returns Value read
	 */
	get: function ( source ) {
		if ( $.isPlainObject( source ) ) {
			// Build an object of get functions, and wrap them in a single call
			var o = {};
			$.each( source, function (key, val) {
				if ( val ) {
					o[key] = DataTable.util.get( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( source === null ) {
			// Give an empty string for rendering / sorting etc
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof source === 'function' ) {
			return function (data, type, row, meta) {
				return source( data, type, row, meta );
			};
		}
		else if ( typeof source === 'string' && (source.indexOf('.') !== -1 ||
				  source.indexOf('[') !== -1 || source.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" ) {
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ ) {
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation ) {
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( Array.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation ) {
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined ) {
							return undefined;
						}

						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, source );
			};
		}
		else {
			// Array or flat object mapping
			return function (data, type) { // row and meta also passed, but not used
				return data[source];
			};
		}
	}
};

