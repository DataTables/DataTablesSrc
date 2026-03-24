import { filterComplete } from '../core/search';
import createSearch, { SearchInput, SearchOptions } from '../model/search';
import util from '../util';
import * as object from '../util/object';
import { register } from './Api';
import { Api } from './interface';

type ApiSearchOverload = (
	this: Api,
	input?: SearchInput,
	regex?: boolean | SearchOptions,
	smart?: boolean,
	caseInsen?: boolean
) => Api | SearchInput | undefined;

register<ApiSearchOverload>(
	'search()',
	function (input?, regex?, smart?, caseInsen?) {
		if (input === undefined) {
			let ctx = this.context;

			// get
			if (ctx.length === 0) {
				return;
			}

			return ctx[0].searches['*']!.term;
		}

		// set
		return this.iterator('table', function (ctx) {
			if (!ctx.features.searching) {
				return;
			}

			let target = ctx.searches['*'];

			if (!target) {
				target = createSearch();
			}

			if (typeof regex === 'object') {
				// New style object of options
				object.assign(target, regex);
			}
			else {
				// Compat for the old options
				object.assign(target, {
					regex: regex === null ? false : regex,
					smart: smart === null ? true : smart,
					caseInsensitive: caseInsen === null ? true : caseInsen
				});
			}

			target.term = input;
			ctx.searches['*'] = target;

			filterComplete(ctx);
		});
	}
);

type ApiSearchFixedOverload = (
	this: Api,
	name?: string,
	search?: SearchInput,
	options?: SearchOptions
) => Api | SearchInput | undefined;

register<ApiSearchFixedOverload>('search.fixed()', function (name, search, options) {
	var ret = this.iterator(true, 'table', function (settings) {
		var fixed = settings.searchesFixed['*'];

		if (!name) {
			return Object.keys(fixed);
		}
		else if (search === undefined) {
			return fixed[name]?.term;
		}
		else if (search === null) {
			delete fixed[name];
		}
		else {
			let target = fixed[name];

			if (!target || !util.is.plainObject(target)) {
				target = createSearch();
			}

			if (options) {
				object.assign(target, options);
			}
	
			target.term = search;
			fixed[name] = target;
		}

		return this;
	});

	return name !== undefined && search === undefined ? ret[0] : ret;
});

register<ApiSearchOverload>(
	['columns().search()', 'column().search()'],
	function (input, regex, smart, caseInsen) {
		if (input === undefined) {
			let name = this[0].join(',');

			return this.context.length
				? this.context[0].searches[name]?.term || ''
				: '';
		}

		return this.iterator('columns', function (ctx, columns) {
			let colIdxs = columns.join(',');
			let target = ctx.searches[colIdxs];

			if (input === undefined) {
				return target?.term;
			}

			if (!target) {
				target = createSearch();
			}

			if (typeof regex === 'object') {
				// New style object of options
				object.assign(target, regex);
			}
			else {
				// Compat for the old options
				object.assign(target, {
					regex: regex === null ? false : regex,
					smart: smart === null ? true : smart,
					caseInsensitive: caseInsen === null ? true : caseInsen
				});
			}

			target.term = input;
			target.columns = columns.slice();
			ctx.searches[colIdxs] = target;

			filterComplete(ctx);
		});
	}
);

register<ApiSearchFixedOverload>(
	['columns().search.fixed()', 'column().search.fixed()'],
	function (name, search, options) {
		// No name, just return the names of the fixed searches applied to these
		// columns
		if (! name) {
			return this.iterator(true, 'columns', function (settings, columns) {
				let colIdxs = columns.join(',');
				let fixed = settings.searchesFixed[colIdxs];

				return fixed ? Object.keys(fixed) : [];
			});
		}

		// Get the value from an existing search
		if (search === undefined) {
			if (! this.context.length) {
				return undefined;
			}
			else {
				let colIdxs = this[0].join(',');
				let fixed = this.context[0].searchesFixed[colIdxs];

				return fixed && fixed[name] ? fixed[name].term : undefined;
			}
		}

		// Set a search, possibly with options
		return this.iterator(true, 'columns', function (settings, columns) {
			let colIdxs = columns.join(',');
			let fixed = settings.searchesFixed[colIdxs];

			if (! fixed) {
				fixed = {};
				settings.searchesFixed[colIdxs] = fixed;
			}

			if (search === null) {
				delete fixed[name];
			}
			else {
				let target = fixed[name];
	
				if (!target || !util.is.plainObject(target)) {
					target = createSearch();
				}
	
				if (options) {
					object.assign(target, options);
				}
		
				target.term = search;
				target.columns = columns;
				fixed[name] = target;
			}

			return this;
		});
	}
);
