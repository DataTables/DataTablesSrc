import { sort } from '../core/sort';
import { Dom } from '../dom';
import ext from '../ext/index';
import Context from '../model/settings';
import { range, unique } from '../util/array';
import * as object from '../util/object';
import { ApiSelectorModifier, Api as ApiType } from './interface';
import { dataSource } from './support';

/**
 * Common run function for selector types
 */
export function selector_run<T = any>(
	type: string,
	selector: any,
	selectFn: (s: any) => T[],
	settings: Context,
	opts: ApiSelectorModifier
): T[] {
	var out: T[] = [],
		res,
		i,
		iLen,
		selectorType = typeof selector;

	// If a Dom instance, then get the underlying elements
	if (selector instanceof Dom) {
		selector = selector.get();
	}

	// Can't just check for isArray here, as an API or jQuery instance might be
	// given with their array like look
	if (
		!selector ||
		selectorType === 'string' ||
		selectorType === 'function' ||
		selector.length === undefined
	) {
		selector = [selector];
	}

	for (i = 0, iLen = selector.length; i < iLen; i++) {
		res = selectFn(
			typeof selector[i] === 'string' ? selector[i].trim() : selector[i]
		);

		// Remove empty items
		res = res.filter(function (item) {
			return item !== null && item !== undefined;
		});

		if (res && res.length) {
			out = out.concat(res);
		}
	}

	// selector extensions
	var extSelectors = ext.selector[type];
	if (extSelectors.length) {
		for (i = 0, iLen = extSelectors.length; i < iLen; i++) {
			out = extSelectors[i](settings, opts, out);
		}
	}

	return unique(out);
}

export function selector_opts(opts?: ApiSelectorModifier): ApiSelectorModifier {
	if (!opts) {
		opts = {};
	}

	// Backwards compatibility for 1.9- which used the terminology filter rather
	// than search
	if (opts.filter && opts.search === undefined) {
		opts.search = opts.filter;
	}

	return object.assign(
		{},
		{
			columnOrder: 'implied',
			search: 'none',
			order: 'current',
			page: 'all'
		},
		opts
	);
}

// Reduce the API instance to the first item found
export function selector_first<R extends ApiType>(old: ApiType) {
	// Need to specify the target class as singular since `old` has the context
	// of the plural
	var inst = old.inst<R>(old.context[0], null, old._newClass.replace(/s$/, ''));

	// Use a push rather than passing to the constructor, since it will
	// merge arrays down automatically, which isn't what is wanted here
	if (old.length) {
		inst.push(old[0]);
	}

	inst.selector = old.selector;

	// Limit to a single row / column / cell
	if (inst.length && inst[0].length > 1) {
		inst[0].splice(1);
	}

	return inst;
}

export function selector_row_indexes(
	settings: Context,
	opts: ApiSelectorModifier
) {
	var i,
		iLen,
		tmp,
		a: number[] = [],
		displayFiltered = settings.aiDisplay,
		displayMaster = settings.aiDisplayMaster;

	var search = opts.search, // none, applied, removed
		order = opts.order, // applied, current, index (original - compatibility with 1.9)
		page = opts.page; // all, current

	if (dataSource(settings) == 'ssp') {
		// In server-side processing mode, most options are irrelevant since
		// rows not shown don't exist and the index order is the applied order
		// Removed is a special case - for consistency just return an empty
		// array
		return search === 'removed' ? [] : range(0, displayMaster.length);
	}

	if (page == 'current') {
		// Current page implies that order=current and filter=applied, since it is
		// fairly senseless otherwise, regardless of what order and search actually
		// are
		for (
			i = settings._iDisplayStart, iLen = settings.fnDisplayEnd();
			i < iLen;
			i++
		) {
			a.push(displayFiltered[i]);
		}
	}
	else if (order == 'current' || order == 'applied') {
		if (search == 'none') {
			a = displayMaster.slice();
		}
		else if (search == 'applied') {
			a = displayFiltered.slice();
		}
		else if (search == 'removed') {
			// O(n+m) solution by creating a hash map
			var displayFilteredMap: Record<number, number | null> = {};

			for (i = 0, iLen = displayFiltered.length; i < iLen; i++) {
				displayFilteredMap[displayFiltered[i]] = null;
			}

			displayMaster.forEach(function (item) {
				if (!Object.prototype.hasOwnProperty.call(displayFilteredMap, item)) {
					a.push(item);
				}
			});
		}
	}
	else if (order == 'index' || order == 'original') {
		for (i = 0, iLen = settings.aoData.length; i < iLen; i++) {
			if (!settings.aoData[i]) {
				continue;
			}

			if (search == 'none') {
				a.push(i);
			}
			else {
				// applied | removed
				tmp = displayFiltered.indexOf(i);

				if (
					(tmp === -1 && search == 'removed') ||
					(tmp >= 0 && search == 'applied')
				) {
					a.push(i);
				}
			}
		}
	}
	else if (typeof order === 'number') {
		// Order the rows by the given column
		var ordered = sort(settings, order, 'asc');

		if (search === 'none') {
			a = ordered;
		}
		else {
			// applied | removed
			for (i = 0; i < ordered.length; i++) {
				tmp = displayFiltered.indexOf(ordered[i]);

				if (
					(tmp === -1 && search == 'removed') ||
					(tmp >= 0 && search == 'applied')
				) {
					a.push(ordered[i]);
				}
			}
		}
	}

	return a;
}
