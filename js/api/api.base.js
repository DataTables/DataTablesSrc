

/**
 * Computed structure of the DataTables API, defined by the options passed to
 * `DataTable.Api.register()` when building the API.
 *
 * The structure is built in order to speed creation and extension of the Api
 * objects since the extensions are effectively pre-parsed.
 *
 * The array is an array of objects with the following structure, where this
 * base array represents the Api prototype base:
 *
 *     [
 *       {
 *         name:      'data'                -- string   - Property name
 *         val:       function () {},       -- function - Api method (or undefined if just an object
 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
 *       },
 *       {
 *         name:     'row'
 *         val:       {},
 *         methodExt: [ ... ],
 *         propExt:   [
 *           {
 *             name:      'data'
 *             val:       function () {},
 *             methodExt: [ ... ],
 *             propExt:   [ ... ]
 *           },
 *           ...
 *         ]
 *       }
 *     ]
 *
 * @type {Array}
 * @ignore
 */
var __apiStruct = [];


/**
 * `Array.prototype` reference.
 *
 * @type object
 * @ignore
 */
var __arrayProto = Array.prototype;


/**
 * Abstraction for `context` parameter of the `Api` constructor to allow it to
 * take several different forms for ease of use.
 *
 * Each of the input parameter types will be converted to a DataTables settings
 * object where possible.
 *
 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
 *   of:
 *
 *   * `string` - jQuery selector. Any DataTables' matching the given selector
 *     with be found and used.
 *   * `node` - `TABLE` node which has already been formed into a DataTable.
 *   * `jQuery` - A jQuery object of `TABLE` nodes.
 *   * `object` - DataTables settings object
 *   * `DataTables.Api` - API instance
 * @return {array|null} Matching DataTables settings objects. `null` or
 *   `undefined` is returned if no matching DataTable is found.
 * @ignore
 */
var _toSettings = function ( mixed )
{
	var idx, jq;
	var settings = DataTable.settings;
	var tables = $.map( settings, function (el, i) {
		return el.nTable;
	} );

	if ( ! mixed ) {
		return [];
	}
	else if ( mixed.nTable && mixed.oApi ) {
		// DataTables settings object
		return [ mixed ];
	}
	else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
		// Table node
		idx = $.inArray( mixed, tables );
		return idx !== -1 ? [ settings[idx] ] : null;
	}
	else if ( mixed && typeof mixed.settings === 'function' ) {
		return mixed.settings().toArray();
	}
	else if ( typeof mixed === 'string' ) {
		// jQuery selector
		jq = $(mixed);
	}
	else if ( mixed instanceof $ ) {
		// jQuery object (also DataTables instance)
		jq = mixed;
	}

	if ( jq ) {
		return jq.map( function(i) {
			idx = $.inArray( this, tables );
			return idx !== -1 ? settings[idx] : null;
		} ).toArray();
	}
};


/**
 * DataTables API class - used to control and interface with  one or more
 * DataTables enhanced tables.
 *
 * The API class is heavily based on jQuery, presenting a chainable interface
 * that you can use to interact with tables. Each instance of the API class has
 * a "context" - i.e. the tables that it will operate on. This could be a single
 * table, all tables on a page or a sub-set thereof.
 *
 * Additionally the API is designed to allow you to easily work with the data in
 * the tables, retrieving and manipulating it as required. This is done by
 * presenting the API class as an array like interface. The contents of the
 * array depend upon the actions requested by each method (for example
 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
 * return an array of objects or arrays depending upon your table's
 * configuration). The API object has a number of array like methods (`push`,
 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
 * `unique` etc) to assist your working with the data held in a table.
 *
 * Most methods (those which return an Api instance) are chainable, which means
 * the return from a method call also has all of the methods available that the
 * top level object had. For example, these two calls are equivalent:
 *
 *     // Not chained
 *     api.row.add( {...} );
 *     api.draw();
 *
 *     // Chained
 *     api.row.add( {...} ).draw();
 *
 * @class DataTable.Api
 * @param {array|object|string|jQuery} context DataTable identifier. This is
 *   used to define which DataTables enhanced tables this API will operate on.
 *   Can be one of:
 *
 *   * `string` - jQuery selector. Any DataTables' matching the given selector
 *     with be found and used.
 *   * `node` - `TABLE` node which has already been formed into a DataTable.
 *   * `jQuery` - A jQuery object of `TABLE` nodes.
 *   * `object` - DataTables settings object
 * @param {array} [data] Data to initialise the Api instance with.
 *
 * @example
 *   // Direct initialisation during DataTables construction
 *   var api = $('#example').DataTable();
 *
 * @example
 *   // Initialisation using a DataTables jQuery object
 *   var api = $('#example').dataTable().api();
 *
 * @example
 *   // Initialisation as a constructor
 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
 */
_Api = function ( context, data )
{
	if ( ! this instanceof _Api ) {
		throw 'DT API must be constructed as a new object';
		// or should it do the 'new' for the caller?
		// return new _Api.apply( this, arguments );
	}

	var settings = [];
	var ctxSettings = function ( o ) {
		var a = _toSettings( o );
		if ( a ) {
			settings.push.apply( settings, a );
		}
	};

	if ( $.isArray( context ) ) {
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			ctxSettings( context[i] );
		}
	}
	else {
		ctxSettings( context );
	}

	// Remove duplicates
	this.context = _unique( settings );

	// Initial data
	if ( data ) {
		this.push.apply( this, data.toArray ? data.toArray() : data );
	}

	// selector
	this.selector = {
		rows: null,
		cols: null,
		opts: null
	};

	_Api.extend( this, this, __apiStruct );
};

DataTable.Api = _Api;

_Api.prototype = /** @lends DataTables.Api */{
	/**
	 * Return a new Api instance, comprised of the data held in the current
	 * instance, join with the other array(s) and/or value(s).
	 *
	 * An alias for `Array.prototype.concat`.
	 *
	 * @type method
	 * @param {*} value1 Arrays and/or values to concatenate.
	 * @param {*} [...] Additional arrays and/or values to concatenate.
	 * @returns {DataTables.Api} New API instance, comprising of the combined
	 *   array.
	 */
	concat:  __arrayProto.concat,


	context: [], // array of table settings objects


	each: function ( fn )
	{
		for ( var i=0, ien=this.length ; i<ien; i++ ) {
			fn.call( this, this[i], i, this );
		}

		return this;
	},


	eq: function ( idx )
	{
		var ctx = this.context;

		return ctx.length > idx ?
			new _Api( ctx[idx], this[idx] ) :
			null;
	},


	filter: function ( fn )
	{
		var a = [];

		if ( __arrayProto.filter ) {
			a = __arrayProto.filter.call( this, fn, this );
		}
		else {
			// Compatibility for browsers without EMCA-252-5 (JS 1.6)
			for ( var i=0, ien=this.length ; i<ien ; i++ ) {
				if ( fn.call( this, this[i], i, this ) ) {
					a.push( this[i] );
				}
			}
		}

		return new _Api( this.context, a );
	},


	flatten: function ()
	{
		var a = [];
		return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
	},


	join:    __arrayProto.join,


	indexOf: __arrayProto.indexOf || function (obj, start)
	{
		for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
			if ( this[i] === obj ) {
				return i;
			}
		}
		return -1;
	},

	iterator: function ( flatten, type, fn, alwaysNew ) {
		var
			a = [], ret,
			i, ien, j, jen,
			context = this.context,
			rows, items, item,
			selector = this.selector;

		// Argument shifting
		if ( typeof flatten === 'string' ) {
			alwaysNew = fn;
			fn = type;
			type = flatten;
			flatten = false;
		}

		for ( i=0, ien=context.length ; i<ien ; i++ ) {
			var apiInst = new _Api( context[i] );

			if ( type === 'table' ) {
				ret = fn.call( apiInst, context[i], i );

				if ( ret !== undefined ) {
					a.push( ret );
				}
			}
			else if ( type === 'columns' || type === 'rows' ) {
				// this has same length as context - one entry for each table
				ret = fn.call( apiInst, context[i], this[i], i );

				if ( ret !== undefined ) {
					a.push( ret );
				}
			}
			else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
				// columns and rows share the same structure.
				// 'this' is an array of column indexes for each context
				items = this[i];

				if ( type === 'column-rows' ) {
					rows = _selector_row_indexes( context[i], selector.opts );
				}

				for ( j=0, jen=items.length ; j<jen ; j++ ) {
					item = items[j];

					if ( type === 'cell' ) {
						ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
					}
					else {
						ret = fn.call( apiInst, context[i], item, i, j, rows );
					}

					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
			}
		}

		if ( a.length || alwaysNew ) {
			var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
			var apiSelector = api.selector;
			apiSelector.rows = selector.rows;
			apiSelector.cols = selector.cols;
			apiSelector.opts = selector.opts;
			return api;
		}
		return this;
	},


	lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
	{
		// Bit cheeky...
		return this.indexOf.apply( this.toArray.reverse(), arguments );
	},


	length:  0,


	map: function ( fn )
	{
		var a = [];

		if ( __arrayProto.map ) {
			a = __arrayProto.map.call( this, fn, this );
		}
		else {
			// Compatibility for browsers without EMCA-252-5 (JS 1.6)
			for ( var i=0, ien=this.length ; i<ien ; i++ ) {
				a.push( fn.call( this, this[i], i ) );
			}
		}

		return new _Api( this.context, a );
	},


	pluck: function ( prop )
	{
		return this.map( function ( el ) {
			return el[ prop ];
		} );
	},

	pop:     __arrayProto.pop,


	push:    __arrayProto.push,


	// Does not return an API instance
	reduce: __arrayProto.reduce || function ( fn, init )
	{
		return _fnReduce( this, fn, init, 0, this.length, 1 );
	},


	reduceRight: __arrayProto.reduceRight || function ( fn, init )
	{
		return _fnReduce( this, fn, init, this.length-1, -1, -1 );
	},


	reverse: __arrayProto.reverse,


	// Object with rows, columns and opts
	selector: null,


	shift:   __arrayProto.shift,


	sort:    __arrayProto.sort, // ? name - order?


	splice:  __arrayProto.splice,


	toArray: function ()
	{
		return __arrayProto.slice.call( this );
	},


	to$: function ()
	{
		return $( this );
	},


	toJQuery: function ()
	{
		return $( this );
	},


	unique: function ()
	{
		return new _Api( this.context, _unique(this) );
	},


	unshift: __arrayProto.unshift
};


_Api.extend = function ( scope, obj, ext )
{
	// Only extend API instances and static properties of the API
	if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
		return;
	}

	var
		i, ien,
		j, jen,
		struct, inner,
		methodScoping = function ( scope, fn, struc ) {
			return function () {
				var ret = fn.apply( scope, arguments );

				// Method extension
				_Api.extend( ret, ret, struc.methodExt );
				return ret;
			};
		};

	for ( i=0, ien=ext.length ; i<ien ; i++ ) {
		struct = ext[i];

		// Value
		obj[ struct.name ] = typeof struct.val === 'function' ?
			methodScoping( scope, struct.val, struct ) :
			$.isPlainObject( struct.val ) ?
				{} :
				struct.val;

		obj[ struct.name ].__dt_wrapper = true;

		// Property extension
		_Api.extend( scope, obj[ struct.name ], struct.propExt );
	}
};


// @todo - Is there need for an augment function?
// _Api.augment = function ( inst, name )
// {
// 	// Find src object in the structure from the name
// 	var parts = name.split('.');

// 	_Api.extend( inst, obj );
// };


//     [
//       {
//         name:      'data'                -- string   - Property name
//         val:       function () {},       -- function - Api method (or undefined if just an object
//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
//       },
//       {
//         name:     'row'
//         val:       {},
//         methodExt: [ ... ],
//         propExt:   [
//           {
//             name:      'data'
//             val:       function () {},
//             methodExt: [ ... ],
//             propExt:   [ ... ]
//           },
//           ...
//         ]
//       }
//     ]

_Api.register = _api_register = function ( name, val )
{
	if ( $.isArray( name ) ) {
		for ( var j=0, jen=name.length ; j<jen ; j++ ) {
			_Api.register( name[j], val );
		}
		return;
	}

	var
		i, ien,
		heir = name.split('.'),
		struct = __apiStruct,
		key, method;

	var find = function ( src, name ) {
		for ( var i=0, ien=src.length ; i<ien ; i++ ) {
			if ( src[i].name === name ) {
				return src[i];
			}
		}
		return null;
	};

	for ( i=0, ien=heir.length ; i<ien ; i++ ) {
		method = heir[i].indexOf('()') !== -1;
		key = method ?
			heir[i].replace('()', '') :
			heir[i];

		var src = find( struct, key );
		if ( ! src ) {
			src = {
				name:      key,
				val:       {},
				methodExt: [],
				propExt:   []
			};
			struct.push( src );
		}

		if ( i === ien-1 ) {
			src.val = val;
		}
		else {
			struct = method ?
				src.methodExt :
				src.propExt;
		}
	}
};


_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
	_Api.register( pluralName, val );

	_Api.register( singularName, function () {
		var ret = val.apply( this, arguments );

		if ( ret === this ) {
			// Returned item is the API instance that was passed in, return it
			return this;
		}
		else if ( ret instanceof _Api ) {
			// New API instance returned, want the value from the first item
			// in the returned array for the singular result.
			return ret.length ?
				$.isArray( ret[0] ) ?
					new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
					ret[0] :
				undefined;
		}

		// Non-API return - just fire it back
		return ret;
	} );
};

