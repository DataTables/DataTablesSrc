import { filterComplete } from '../core/search';
import { SearchInput, SearchOptions } from '../model/search';
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
		var ctx = this.context;

		if (input === undefined) {
			// get
			return ctx.length !== 0 ? ctx[0].previousSearch.search : undefined;
		}

		// set
		return this.iterator('table', function (settings) {
			if (!settings.features.searching) {
				return;
			}

			if (typeof regex === 'object') {
				// New style options to pass to the search builder
				filterComplete(
					settings,
					object.assign(settings.previousSearch, regex, {
						search: input
					})
				);
			}
			else {
				// Compat for the old options
				filterComplete(
					settings,
					object.assign(settings.previousSearch, {
						search: input,
						regex: regex === null ? false : regex,
						smart: smart === null ? true : smart,
						caseInsensitive: caseInsen === null ? true : caseInsen
					})
				);
			}
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
		return this.iterator('column', function (settings, column) {
			var preSearch = settings.preSearchCols;

			if (input === undefined) {
				// get
				return preSearch[column].search;
			}

			// set
			if (!settings.features.searching) {
				return;
			}

			if (typeof regex === 'object') {
				// New style options to pass to the search builder
				object.assign(preSearch[column], regex, {
					search: input
				});
			}
			else {
				// Old style (with not all options available)
				object.assign(preSearch[column], {
					search: input,
					regex: regex === null ? false : regex,
					smart: smart === null ? true : smart,
					caseInsensitive: caseInsen === null ? true : caseInsen
				});
			}

			filterComplete(settings, settings.previousSearch);
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
