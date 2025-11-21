import dom from '../dom';
import ext from '../ext/index';
import Context from '../model/settings';
import util from '../util';
import { selector_row_indexes } from './selectors';
import { arrayApply } from './support';

/**
 * `Array.prototype` reference as methods from it are used in the array-like
 * methods of the API.
 */
const __arrayProto = Array.prototype;

function Api(context, data?) {
	this.context = toContextArray(context);

	// Initial data
	arrayApply(this as any, data);

	// Add properties which will still execute in this scope
	extendApi(this, 'Api');
}

// Add methods to the prototype
util.object.assign(Api.prototype, {
	_newInst: 'Api',

	isDataTableApi: true,

	any() {
		return this.count() !== 0;
	},

	context: [] as Context[], // array of table settings objects

	count() {
		return this.flatten().length;
	},

	each(fn) {
		for (var i = 0, iLen = this.length; i < iLen; i++) {
			fn.call(this, this[i], i, this);
		}

		return this;
	},

	eq(idx) {
		var ctx = this.context;

		return ctx.length > idx ? this.inst(ctx[idx], this[idx]) : null;
	},

	filter(fn) {
		var a = __arrayProto.filter.call(this, fn, this);

		return this.inst(this.context, a);
	},

	flatten() {
		var a = [];

		return this.inst(this.context, a.concat.apply(a, this.toArray()));
	},

	get(idx) {
		return this[idx];
	},

	join: __arrayProto.join,

	includes(find) {
		return this.indexOf(find) === -1 ? false : true;
	},

	indexOf: __arrayProto.indexOf,

	inst(context, data?) {
		let name = this._newInst;
		let inst = Api;

		if (classes[name]) {
			inst = classes[name];
		}

		return new inst(context, data);
	},

	iterator(flatten, type, fn, alwaysNew) {
		var a: any[] = [],
			ret,
			i,
			iLen,
			j,
			jen,
			context = this.context,
			rows,
			items,
			item,
			selector = this.selector;

		// Argument shifting
		if (typeof flatten === 'string') {
			alwaysNew = fn;
			fn = type;
			type = flatten;
			flatten = false;
		}

		for (i = 0, iLen = context.length; i < iLen; i++) {
			var apiInst = this.inst(context[i]);

			if (type === 'table') {
				ret = fn.call(apiInst, context[i], i);

				if (ret !== undefined) {
					a.push(ret);
				}
			}
			else if (type === 'columns' || type === 'rows') {
				// this has same length as context - one entry for each table
				ret = fn.call(apiInst, context[i], this[i], i);

				if (ret !== undefined) {
					a.push(ret);
				}
			}
			else if (
				type === 'every' ||
				type === 'column' ||
				type === 'column-rows' ||
				type === 'row' ||
				type === 'cell'
			) {
				// columns and rows share the same structure.
				// 'this' is an array of column indexes for each context
				items = this[i];

				if (type === 'column-rows') {
					rows = selector_row_indexes(context[i], selector.opts);
				}

				for (j = 0, jen = items.length; j < jen; j++) {
					item = items[j];

					if (type === 'cell') {
						ret = fn.call(apiInst, context[i], item.row, item.column, i, j);
					}
					else {
						ret = fn.call(apiInst, context[i], item, i, j, rows);
					}

					if (ret !== undefined) {
						a.push(ret);
					}
				}
			}
		}

		if (a.length || alwaysNew) {
			var api = this.inst(context, flatten ? a.concat.apply([], a) : a);
			var apiSelector = api.selector;

			if (apiSelector) {
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
			}

			return api;
		}
		return this;
	},

	lastIndexOf: __arrayProto.lastIndexOf,

	length: 0,

	map(fn) {
		var a = __arrayProto.map.call(this, fn, this);

		return this.inst(this.context, a);
	},

	pluck(prop) {
		var fn = util.get(prop);

		return this.map(function (el) {
			return fn(el);
		});
	},

	pop: __arrayProto.pop,

	push: __arrayProto.push,

	reduce: __arrayProto.reduce,

	reduceRight: __arrayProto.reduceRight,

	reverse: __arrayProto.reverse,

	// Object with rows, columns and opts
	selector: {
		rows: null,
		cols: null,
		opts: null
	},

	shift: __arrayProto.shift,

	slice() {
		return this.inst(this.context, this);
	},

	sort: __arrayProto.sort,

	splice: __arrayProto.splice,

	toArray() {
		return __arrayProto.slice.call(this);
	},

	to$() {
		let jq = util.external('jq');

		return jq(this);
	},

	toJQuery: function () {
		let jq = util.external('jq');

		return jq(this);
	},

	unique: function () {
		return this.inst(this.context, util.array.unique(this.toArray()));
	},

	unshift: __arrayProto.unshift
});

Api.register = function (name: string | string[], func: Function) {
	if (Array.isArray(name)) {
		for (let i = 0; i < name.length; i++) {
			Api.register(name[i], func);
		}

		return;
	}

	let names = getPrototypeNames(name);

	if (names.property) {
		if (!properties[names.hostClass]) {
			properties[names.hostClass] = [];
		}

		properties[names.hostClass].push([names.property, names.methodName, func]);
	}
	else {
		// Has the parent already been defined or not?
		if (!classes[names.hostClass]) {
			// Create a new "class"
			createApiClass(names.hostClass);
		}

		let wrapped = function () {
			// If the function creates a new instance, it will be nested down,
			// but only if the nesting class has been defined.
			this._newInst = names.couldReturn;

			return func.apply(this, arguments);
		};

		// Create the new method on the host class
		classes[names.hostClass].prototype[names.methodName] = wrapped;

		// If the method is on the top level, it needs to be applied to other
		// classes which have already been defined to allow the circular
		// chaining of the API (e.g. `row().data(...).draw())`.
		if (names.hostClass === 'Api') {
			util.object.each(classes, (className, klass) => {
				if (!klass.prototype[names.methodName]) {
					klass.prototype[names.methodName] = wrapped;
				}
			});
		}
	}
};

Api.registerPlural = function (
	pluralName: string,
	singularName: string,
	func: Function
) {
	Api.register(pluralName, func);

	Api.register(singularName, function () {
		var ret = func.apply(this, arguments);

		if (ret === this) {
			// Returned item is the API instance that was passed in, return it
			return this;
		}
		else if (ret && ret.isDataTableApi) {
			// New API instance returned, want the value from the first item
			// in the returned array for the singular result.
			return (ret as any).length
				? Array.isArray(ret[0])
					? this.inst((ret as any).context, ret[0]) // Array results are 'enhanced'
					: ret[0]
				: undefined;
		}

		// Non-API return - just fire it back
		return ret;
	});
};

export default Api;

/** A collection of properties to apply to the classes as they are constructed */
const properties: Record<string, Array<[string, string, Function]>> = {};

/** Collection of API classes */
const classes: Record<string, any> = {
	Api
};

// TODO debug
(window as any).classes = classes;

/**
 * Create a new API "class" (function), used for nested levels of the API - e.g.
 * `ApiRows` and `ApiColumn`.
 * @param name
 */
function createApiClass(name: string) {
	classes[name] = function (context: Context[], data: any[]) {
		// Same as the main API constructor
		this.context = toContextArray(context);
		arrayApply(this as any, data);

		// Extend the API with properties that execute in this scope, both for
		// this level and for the top level to allow looped chaining
		extendApi(this, this._newInst);
		extendApi(this, 'Api');
	};

	Object.defineProperty(classes[name], 'name', {
		value: name,
		writable: false
	});

	// Copy the methods from the Api prototype over to our new class
	util.object.each(Api.prototype, (key, method) => {
		classes[name].prototype[key] = method;
	});
}

/**
 * When an instance is created it needs to be extended with properties (since
 * these cannot be given a scope from the prototype due to the nesting).
 *
 * @param api API instance to extend
 * @param className The name of the instance to extend
 * @returns void
 */
function extendApi(api, className) {
	let props = properties[className];

	if (!props) {
		return;
	}

	for (let i = 0; i < props.length; i++) {
		let def = props[i];

		if (!api[def[0]]) {
			api[def[0]] = {};
		}

		api[def[0]][def[1]] = def[2].bind(api);
	}
}

/**
 * Based on an API method name, construct the class, property, etc names that
 * are used to store and construct the API.
 *
 * @param name API function name
 * @returns Name components
 */
function getPrototypeNames(name: string) {
	let parts = name.split('.');
	let property: string | null = null;
	let hostClass = 'Api';
	let returnClass = 'Api';
	let methodName = '';

	for (let i = 0; i < parts.length; i++) {
		let part = parts[i];

		if (part.includes('()')) {
			methodName = part.replace('()', '');

			hostClass = returnClass; // from previous loop
			returnClass +=
				methodName.charAt(0).toUpperCase() + methodName.slice(1).toLowerCase();
		}
		else {
			// Is a property
			property = part;
		}
	}

	return {
		couldReturn: returnClass,
		hostClass,
		property,
		methodName
	};
}

/**
 * Abstraction for `context` parameter of the `Api` constructor to allow it to
 * take several different forms for ease of use.
 *
 * Each of the input parameter types will be converted to a DataTables settings
 * object where possible.
 *
 * @param mixed DataTable identifier. Can be one of:
 *
 *   * `string` - jQuery selector. Any DataTables' matching the given selector
 *     with be found and used.
 *   * `node` - `TABLE` node which has already been formed into a DataTable.
 *   * `jQuery` - A jQuery object of `TABLE` nodes.
 *   * `object` - DataTables settings object
 *   * `DataTables.Api` - API instance
 * @return Matching DataTables settings objects. `null` or `undefined` is
 *   returned if no matching DataTable is found.
 */
function toContext(mixed) {
	var idx, nodes;
	var settings = ext.settings;
	var tables = util.array.pluck(settings, 'nTable');

	if (!mixed) {
		return [];
	}
	else if (mixed.nTable && mixed.oFeatures) {
		// DataTables settings object
		return [mixed];
	}
	else if (mixed.nodeName && mixed.nodeName.toLowerCase() === 'table') {
		// Table node
		idx = tables.indexOf(mixed);
		return idx !== -1 ? [settings[idx]] : null;
	}
	else if (mixed && typeof mixed.settings === 'function') {
		return mixed.settings().toArray();
	}
	else if (typeof mixed === 'string') {
		// jQuery selector
		nodes = dom.s(mixed).get();
	}
	else if (util.is.jquery(mixed)) {
		// jQuery object
		nodes = mixed.get();
	}
	else if (util.is.dom(mixed)) {
		// DOM object
		nodes = mixed.get();
	}

	if (nodes) {
		return settings.filter(function (v, i) {
			return nodes.includes(tables[i]);
		});
	}
}

/**
 * Create the context array for an instance
 *
 * @param mixed The passed in options to convert to context
 * @returns Context array
 */
function toContextArray(mixed) {
	var i;
	var settings = [];
	var ctxSettings = function (o) {
		var a = toContext(o);
		if (a) {
			settings.push.apply(settings, a);
		}
	};

	if (Array.isArray(mixed)) {
		for (i = 0; i < mixed.length; i++) {
			ctxSettings(mixed[i]);
		}
	}
	else {
		ctxSettings(mixed);
	}

	// Remove duplicates
	return settings.length > 1 ? util.unique(settings) : settings;
}
