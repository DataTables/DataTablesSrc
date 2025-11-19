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

function getPrototypeNames(name: string) {
	// Strip the `()`, UC the first character for the nesting level, prefix with
	// `Api` and return.
	let parts = name.replace(/\(\)/g, '').split('.');

	let ucParts = parts.map(part => {
		return String(part).charAt(0).toUpperCase() + String(part).slice(1);
	});

	let hostParts = parts.slice();
	let methodName = hostParts.pop()!;

	let ucHostParts = ucParts.slice();
	ucHostParts.pop();

	return {
		fqn: parts.join('.'),
		fqhn: hostParts.join(''),
		methodName,
		className: 'Api' + ucParts.join(''),
		hostClassName: 'Api' + ucHostParts.join('')
	};
}

export class Api {
	static register(name: string | string[], func: Function) {
		if (Array.isArray(name)) {
			for (let i = 0; i < name.length; i++) {
				Api.register(name[i], func);
			}

			return;
		}

		let names = getPrototypeNames(name);

		// Always add the method with Api, and we can modify if needed
		methodPrototypeMap[names.fqn] = Api;

		// Is the method being registered a child of another method?
		if (names.hostClassName !== 'Api') {
			// If so, has the parent already been defined or not?
			if (!classes[names.hostClassName]) {
				// Create a new "class"
				classes[names.hostClassName] = function (
					context: Context[],
					data: any[]
				) {
					this.context = context;
					arrayApply(this as any, data);
				};

				Object.defineProperty(classes[names.hostClassName], 'name', {
					value: names.hostClassName,
					writable: false
				});

				// Copy the methods from the Api prototype over
				// TODO util.object.each
				let protoKeys = Object.keys(Api.prototype);

				for (let i = 0; i < protoKeys.length; i++) {
					let key = protoKeys[i];

					classes[names.hostClassName].prototype[key] = Api.prototype[key];
				}
			}

			classes[names.hostClassName].prototype[names.methodName] = func; // wrap this?

			// Provide a method to get a new instance of this class, without
			// knowing the class itself! This if used by `iterator` and other
			// methods.
			classes[names.hostClassName].prototype.inst = function (c, d) {
				return new classes[names.hostClassName](c, d);
			};
		}
		else {
			// If it is top level, we need to add the method to all prototypes,
			// not just the Api one. But only if there isn't already an override
			// there. This will include `Api`.
			let keys = Object.keys(classes);

			for (let i = 0; i < keys.length; i++) {
				let klass = classes[keys[i]];
				// TODO util.object.each(classes, (className, klass) => {
				if (!klass.prototype[names.methodName]) {
					klass.prototype[names.methodName] = func; // wrap?
				}
				//});
			}
		}
	}

	static registerPlural(
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
	}

	constructor(context, data?) {
		// if ( ! (this instanceof Api) ) {
		// 	return new (Api as any)( context, data );
		// }

		var i;
		var settings = [];
		var ctxSettings = function (o) {
			var a = _toSettings(o);
			if (a) {
				settings.push.apply(settings, a);
			}
		};

		if (Array.isArray(context)) {
			for (i = 0; i < context.length; i++) {
				ctxSettings(context[i]);
			}
		}
		else {
			ctxSettings(context);
		}

		// Remove duplicates
		this.context = settings.length > 1 ? util.unique(settings) : settings;

		// Initial data
		arrayApply(this as any, data);
	}

	public isDataTableApi = true;

	public any() {
		return this.count() !== 0;
	}

	public context: Context[] = []; // array of table settings objects

	public count() {
		return this.flatten().length;
	}

	public each(fn) {
		for (var i = 0, iLen = this.length; i < iLen; i++) {
			fn.call(this, this[i], i, this);
		}

		return this;
	}

	public eq(idx) {
		var ctx = this.context;

		return ctx.length > idx ? this.inst(ctx[idx], this[idx]) : null;
	}

	public filter(fn) {
		var a = __arrayProto.filter.call(this, fn, this);

		return this.inst(this.context, a);
	}

	public flatten() {
		var a = [];

		return this.inst(this.context, a.concat.apply(a, this.toArray()));
	}

	public get(idx) {
		return this[idx];
	}

	public join = __arrayProto.join;

	public includes(find) {
		return this.indexOf(find) === -1 ? false : true;
	}

	public indexOf = __arrayProto.indexOf;

	public inst(context, data?) {
		return new Api(context, data);
	}

	public iterator(flatten, type, fn, alwaysNew) {
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
	}

	public lastIndexOf = __arrayProto.lastIndexOf;

	public length = 0;

	public map(fn) {
		var a = __arrayProto.map.call(this, fn, this);

		return this.inst(this.context, a);
	}

	public pluck(prop) {
		var fn = util.get(prop);

		return this.map(function (el) {
			return fn(el);
		});
	}

	public pop = __arrayProto.pop;

	public push = __arrayProto.push;

	public reduce = __arrayProto.reduce;

	public reduceRight = __arrayProto.reduceRight;

	public reverse = __arrayProto.reverse;

	// Object with rows, columns and opts
	public selector = {
		rows: null,
		cols: null,
		opts: null
	};

	public shift = __arrayProto.shift;

	public slice() {
		return this.inst(this.context, this);
	}

	public sort = __arrayProto.sort;

	public splice = __arrayProto.splice;

	public toArray() {
		return __arrayProto.slice.call(this);
	}

	public to$() {
		let jq = util.external('jq');

		return jq(this);
	}

	public toJQuery() {
		let jq = util.external('jq');

		return jq(this);
	}

	public unique() {
		return this.inst(this.context, util.array.unique(this.toArray()));
	}

	public unshift = __arrayProto.unshift;
}

export default Api;

const classes: Record<string, any> = {
	Api
};
const methodPrototypeMap: Record<string, any> = {};


(window as any).classes = classes;

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
var _toSettings = function (mixed) {
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
};
