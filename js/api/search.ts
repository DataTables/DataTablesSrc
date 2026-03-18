import { filterComplete } from '../core/search';
import createSearch, { SearchInput, SearchOptions } from '../model/search';
import * as object from '../util/object';
import { register, registerPlural } from './Api';
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

			return ctx[0].searches['*']!.search;
		}

		// set
		return this.iterator('table', function (ctx) {
			if (!ctx.features.searching) {
				return;
			}

			let target = ctx.searches['*'];

			if (! target) {
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
				})
			}

			target.search = input;
			ctx.searches['*'] = target;

			filterComplete(ctx);
		});
	}
);

type ApiSearchFixedOverload = (
	this: Api,
	name?: string,
	search?: SearchInput
) => Api | SearchInput | undefined;

register<ApiSearchFixedOverload>('search.fixed()', function (name, search) {
	var ret = this.iterator(true, 'table', function (settings) {
		var fixed = settings.searchFixed;

		if (!name) {
			return Object.keys(fixed);
		}
		else if (search === undefined) {
			return fixed[name];
		}
		else if (search === null) {
			delete fixed[name];
		}
		else {
			fixed[name] = search;
		}

		return this;
	});

	return name !== undefined && search === undefined ? ret[0] : ret;
});

registerPlural<ApiSearchOverload>(
	'columns().search()',
	'column().search()',
	function (input, regex, smart, caseInsen) {
		return this.iterator('columns', function (ctx, columns) {
			let colIdxs = columns.join(',');
			let target = ctx.searches[colIdxs];

			if (input === undefined) {
				return target?.search;
			}

			if (! target) {
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
				})
			}

			target.search = input;
			target.columns = columns.slice();
			ctx.searches[colIdxs] = target;

			filterComplete(ctx);
		});
	}
);

register<ApiSearchFixedOverload>(
	['columns().search.fixed()', 'column().search.fixed()'],
	function (name, search) {
		var ret = this.iterator(true, 'column', function (settings, colIdx) {
			var fixed = settings.columns[colIdx].searchFixed;

			if (!name) {
				return Object.keys(fixed);
			}
			else if (search === undefined) {
				return fixed[name] || null;
			}
			else if (search === null) {
				delete fixed[name];
			}
			else {
				fixed[name] = search;
			}

			return this;
		});

		return name !== undefined && search === undefined ? ret[0] : ret;
	}
);
