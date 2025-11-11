import { filterComplete } from '../core/filter';
import * as object from '../util/object';
import Api from './base';

Api.register('search()', function (input, regex, smart, caseInsen) {
	var ctx = this.context;

	if (input === undefined) {
		// get
		return ctx.length !== 0 ? ctx[0].oPreviousSearch.search : undefined;
	}

	// set
	return this.iterator('table', function (settings) {
		if (!settings.oFeatures.bFilter) {
			return;
		}

		if (typeof regex === 'object') {
			// New style options to pass to the search builder
			filterComplete(
				settings,
				object.assign(settings.oPreviousSearch, regex, {
					search: input,
				})
			);
		}
		else {
			// Compat for the old options
			filterComplete(
				settings,
				object.assign(settings.oPreviousSearch, {
					search: input,
					regex: regex === null ? false : regex,
					smart: smart === null ? true : smart,
					caseInsensitive: caseInsen === null ? true : caseInsen,
				})
			);
		}
	});
});

Api.register('search.fixed()', function (name, search) {
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

Api.registerPlural(
	'columns().search()',
	'column().search()',
	function (input, regex, smart, caseInsen) {
		return this.iterator('column', function (settings, column) {
			var preSearch = settings.aoPreSearchCols;

			if (input === undefined) {
				// get
				return preSearch[column].search;
			}

			// set
			if (!settings.oFeatures.bFilter) {
				return;
			}

			if (typeof regex === 'object') {
				// New style options to pass to the search builder
				object.assign(preSearch[column], regex, {
					search: input,
				});
			}
			else {
				// Old style (with not all options available)
				object.assign(preSearch[column], {
					search: input,
					regex: regex === null ? false : regex,
					smart: smart === null ? true : smart,
					caseInsensitive: caseInsen === null ? true : caseInsen,
				});
			}

			filterComplete(settings, settings.oPreviousSearch);
		});
	}
);

Api.register(
	['columns().search.fixed()', 'column().search.fixed()'],
	function (name, search) {
		var ret = this.iterator(true, 'column', function (settings, colIdx) {
			var fixed = settings.aoColumns[colIdx].searchFixed;

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
