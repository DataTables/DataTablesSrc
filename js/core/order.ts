import { bindAction, callbackFire, dataSource } from '../api/support';
import dom from '../dom';
import ext from '../ext/index';
import { Order, OrderArray, OrderCombined, OrderIdx, OrderName, OrderState } from '../model/interface';
import {
	Context,
	ISortItem,
} from '../model/settings';
import { pluck } from '../util/array';
import * as is from '../util/is';
import {
	columnIndexToVisible,
	columnTypes,
	columnsFromHeader,
} from './columns';
import { getCellData } from './data';
import { reDraw } from './draw';
import { processingRun } from './processing';

export function sortInit(settings: Context) {
	var target = settings.nTHead;
	var headerRows = target.querySelectorAll('tr');
	var titleRow = settings.titleRow;
	var notSelector =
		':not([data-dt-order="disable"]):not([data-dt-order="icon-only"])';

	// Legacy support for `orderCellsTop`
	if (titleRow === true) {
		target = headerRows[0];
	}
	else if (titleRow === false) {
		target = headerRows[headerRows.length - 1];
	}
	else if (titleRow !== null) {
		target = headerRows[titleRow];
	}
	// else - all rows

	if (settings.orderHandler) {
		sortAttachListener(
			settings,
			target,
			target === settings.nTHead
				? 'tr' +
						notSelector +
						' th' +
						notSelector +
						', tr' +
						notSelector +
						' td' +
						notSelector
				: 'th' + notSelector + ', td' + notSelector
		);
	}

	// Need to resolve the user input array into our internal structure
	var order: OrderState[] = [];

	sortResolve(settings, order, settings.order);

	settings.order = order;
}

/**
 * Attach event listeners to a node that will trigger ordering on a column
 *
 * @param settings DataTables context
 * @param node Node to attach to
 * @param selector Delegate selector
 * @param column Column index to target
 * @param callback Callback for when done
 */
export function sortAttachListener(
	settings: Context,
	node: Element,
	selector: string,
	column?: number | number[] | (() => number[]),
	callback?: () => void
) {
	bindAction(node, selector, function (e) {
		var run = false;
		var columns =
			column === undefined
				? columnsFromHeader(e.target as HTMLElement)
				: typeof column === 'function'
				? column()
				: Array.isArray(column)
				? column
				: [column];

		if (columns.length) {
			for (var i = 0, iLen = columns.length; i < iLen; i++) {
				var ret = sortAdd(settings, columns[i], i, e.shiftKey);

				if (ret !== false) {
					run = true;
				}

				// If the first entry is no sort, then subsequent
				// sort columns are ignored
				if (
					settings.order.length === 1 &&
					settings.order[0][1] === ''
				) {
					break;
				}
			}

			if (run) {
				processingRun(settings, true, function () {
					sort(settings);
					sortDisplay(settings, settings.aiDisplay);

					reDraw(settings, false, false);

					if (callback) {
						callback();
					}
				});
			}
		}
	});
}

/**
 * Sort the display array to match the master's order
 *
 * @param settings DataTables context
 */
export function sortDisplay(settings: Context, display: number[]) {
	if (display.length < 2) {
		return;
	}

	var master = settings.aiDisplayMaster;
	var masterMap: { [idx: number]: number } = {};
	var map: { [idx: number]: number } = {};
	var i;

	// Rather than needing an `indexOf` on master array, we can create a map
	for (i = 0; i < master.length; i++) {
		masterMap[master[i]] = i;
	}

	// And then cache what would be the indexOf from the display
	for (i = 0; i < display.length; i++) {
		map[display[i]] = masterMap[display[i]];
	}

	display.sort(function (a, b) {
		// Short version of this function is simply `master.indexOf(a) - master.indexOf(b);`
		return map[a] - map[b];
	});
}

/**
 * Convert the API variants that can be used for defining the order into our
 * internal OrderColumn array.
 *
 * @param settings DataTable context object
 * @param nestedSort Array to write the resolve values to
 * @param sortItem Source object / array from user (It is really an `Order`
 *   but due to `aaSorting` being used for input and the internal structure
 *   it is currently any).
 * @todo Split aaSorting into unresolved and resolved parameters (in state.ts as
 *   well)
 */
export function sortResolve(
	settings: Context,
	nestedSort: OrderState[],
	sortItem: any // TODO typing
) {
	var push = function (a: Order) {
		if (is.plainObject(a)) {
			let orderIdx = a as OrderIdx;
			let orderName = a as OrderName;

			if (orderIdx.idx !== undefined) {
				// Index based ordering
				nestedSort.push([orderIdx.idx, orderIdx.dir]);
			}
			else if (orderName.name) {
				// Name based ordering
				var cols = pluck(settings.aoColumns, 'sName');
				var idx = cols.indexOf(orderName.name);

				if (idx !== -1) {
					nestedSort.push([idx, orderName.dir]);
				}
			}
		}
		else {
			// Plain column index and direction pair
			nestedSort.push(a as OrderArray);
		}
	};

	if (is.plainObject(sortItem)) {
		// Object
		push(sortItem as any);
	}
	else if (Array.isArray(sortItem) && typeof sortItem[0] === 'number') {
		// 1D array
		push(sortItem);
	}
	else if (Array.isArray(sortItem)) {
		// 2D array
		for (var z = 0; z < sortItem.length; z++) {
			push(sortItem[z] as OrderCombined); // Object or array
		}
	}
}

export function sortFlatten(settings: Context) {
	var i,
		k,
		kLen,
		aSort: ISortItem[] = [],
		extSort = ext.type.order,
		aoColumns = settings.aoColumns,
		aDataSort,
		iCol,
		sType,
		srcCol,
		fixed = settings.orderFixed as any,
		fixedObj = is.plainObject(fixed),
		nestedSort = [] as any;

	if (!settings.oFeatures.ordering) {
		return aSort;
	}

	// Build the sort array, with pre-fix and post-fix options if they have been
	// specified
	if (Array.isArray(fixed)) {
		sortResolve(settings, nestedSort, fixed);
	}

	if (fixedObj && fixed.pre) {
		sortResolve(settings, nestedSort, fixed.pre);
	}

	sortResolve(settings, nestedSort, settings.order);

	if (fixedObj && fixed.post) {
		sortResolve(settings, nestedSort, fixed.post);
	}

	for (i = 0; i < nestedSort.length; i++) {
		srcCol = nestedSort[i][0];

		if (aoColumns[srcCol]) {
			aDataSort = aoColumns[srcCol].aDataSort;

			for (k = 0, kLen = aDataSort.length; k < kLen; k++) {
				iCol = aDataSort[k];
				sType = aoColumns[iCol].sType || 'string';

				if (nestedSort[i]._idx === undefined) {
					nestedSort[i]._idx = aoColumns[iCol].asSorting!.indexOf(
						nestedSort[i][1]
					);
				}

				if (nestedSort[i][1]) {
					aSort.push({
						src: srcCol,
						col: iCol,
						dir: nestedSort[i][1],
						index: nestedSort[i]._idx,
						type: sType,
						formatter: extSort[sType + '-pre'],
						sorter: extSort[sType + '-' + nestedSort[i][1]],
					});
				}
			}
		}
	}

	return aSort;
}

/**
 * Change the order of the table
 *
 * @param ctx DataTables settings object
 * @param col Column to perform sort on
 * @param dir Direction to sort on
 */
export function sort(ctx: Context, col?: number, dir?: string) {
	var i,
		iLen,
		aiOrig: number[] = [],
		extSort = ext.type.order,
		aoData = ctx.aoData,
		sortCol,
		displayMaster = ctx.aiDisplayMaster,
		aSort: ISortItem[];

	// Make sure the columns all have types defined
	columnTypes(ctx);

	// Allow a specific column to be sorted, which will _not_ alter the display
	// master
	if (col !== undefined) {
		var srcCol = ctx.aoColumns[col];

		aSort = [
			{
				src: col,
				col: col,
				dir: dir || '',
				index: 0,
				type: srcCol.sType!,
				formatter: extSort[srcCol.sType + '-pre'],
				sorter: extSort[srcCol.sType + '-' + dir],
			},
		];
		displayMaster = displayMaster.slice();
	}
	else {
		aSort = sortFlatten(ctx);
	}

	for (i = 0, iLen = aSort.length; i < iLen; i++) {
		sortCol = aSort[i];

		// Load the data needed for the sort, for each cell
		sortData(ctx, sortCol.col);
	}

	/* No sorting required if server-side or no sorting array */
	if (dataSource(ctx) != 'ssp' && aSort.length !== 0) {
		// Reset the initial positions on each pass so we get a stable sort
		for (i = 0, iLen = displayMaster.length; i < iLen; i++) {
			aiOrig[i] = i;
		}

		// If the first sort is desc, then reverse the array to preserve original
		// order, just in reverse
		if (aSort.length && aSort[0].dir === 'desc' && ctx.orderDescReverse) {
			aiOrig.reverse();
		}

		/* Do the sort - here we want multi-column sorting based on a given data source (column)
		 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
		 * follow on its own, but this is what we want (example two column sorting):
		 *  fnLocalSorting = function(a,b){
		 *    var test;
		 *    test = oSort['string-asc']('data11', 'data12');
		 *      if (test !== 0)
		 *        return test;
		 *    test = oSort['numeric-desc']('data21', 'data22');
		 *    if (test !== 0)
		 *      return test;
		 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
		 *  }
		 * Basically we have a test for each sorting column, if the data in that column is equal,
		 * test the next column. If all columns match, then we use a numeric sort on the row
		 * positions in the original data array to provide a stable sort.
		 */
		displayMaster.sort(function (a, b) {
			var x: any,
				y: any,
				k,
				test,
				sortItem,
				len = aSort.length,
				dataA = aoData[a]?._aSortData!,
				dataB = aoData[b]?._aSortData!;

			for (k = 0; k < len; k++) {
				sortItem = aSort[k];

				// Data, which may have already been through a `-pre` function
				x = dataA[sortItem.col];
				y = dataB[sortItem.col];

				if (sortItem.sorter) {
					// If there is a custom sorter (`-asc` or `-desc`) for this
					// data type, use it
					test = sortItem.sorter(x, y);

					if (test !== 0) {
						return test;
					}
				}
				else {
					// Otherwise, use generic sorting
					test = x < y ? -1 : x > y ? 1 : 0;

					if (test !== 0) {
						return sortItem.dir === 'asc' ? test : -test;
					}
				}
			}

			x = aiOrig[a];
			y = aiOrig[b];

			return x < y ? -1 : x > y ? 1 : 0;
		});
	}
	else if (aSort.length === 0) {
		// Apply index order
		displayMaster.sort(function (x, y) {
			return x < y ? -1 : x > y ? 1 : 0;
		});
	}

	if (col === undefined) {
		// Tell the draw function that we have sorted the data
		ctx.bSorted = true;
		ctx.sortDetails = aSort;

		callbackFire(ctx, null, 'order', [ctx, aSort]);
	}

	return displayMaster;
}

/**
 * Function to run on user sort request
 *
 * @param settings dataTables settings object
 * @param attachTo node to attach the handler to
 * @param colIdx column sorting index
 * @param addIndex Counter
 * @param shift Shift click add
 */
export function sortAdd(
	settings: Context,
	colIdx: number,
	addIndex: number,
	shift: boolean
) {
	var col = settings.aoColumns[colIdx];
	var sorting = settings.order;
	var asSorting = col.asSorting;
	var nextSortIdx;
	var next = function (a: OrderState, overflow?: boolean) {
		var idx = a._idx;
		if (idx === undefined) {
			idx = asSorting.indexOf(a[1]);
		}

		return idx + 1 < asSorting.length ? idx + 1 : overflow ? null : 0;
	};

	if (!col.bSortable) {
		return false;
	}

	// Convert to 2D array if needed
	if (typeof sorting[0] === 'number') {
		sorting = settings.order = [sorting as unknown as OrderState];
	}

	// If appending the sort then we are multi-column sorting
	if ((shift || addIndex) && settings.oFeatures.orderMulti) {
		// Are we already doing some kind of sort on this column?
		var sortIdx = pluck(sorting, '0').indexOf(colIdx);

		if (sortIdx !== -1) {
			// Yes, modify the sort
			nextSortIdx = next(sorting[sortIdx], true);

			if (nextSortIdx === null && sorting.length === 1) {
				nextSortIdx = 0; // can't remove sorting completely
			}

			if (nextSortIdx === null || asSorting[nextSortIdx] === '') {
				sorting.splice(sortIdx, 1);
			}
			else {
				sorting[sortIdx][1] = asSorting[nextSortIdx];
				sorting[sortIdx]._idx = nextSortIdx;
			}
		}
		else if (shift) {
			// No sort on this column yet, being added by shift click
			// add it as itself
			sorting.push([colIdx, asSorting[0], 0]);
			sorting[sorting.length - 1]._idx = 0;
		}
		else {
			// No sort on this column yet, being added from a colspan
			// so add with same direction as first column
			sorting.push([colIdx, sorting[0][1], 0]);
			sorting[sorting.length - 1]._idx = 0;
		}
	}
	else if (sorting.length && sorting[0][0] == colIdx) {
		// Single column - already sorting on this column, modify the sort
		nextSortIdx = next(sorting[0]);

		if (nextSortIdx) {
			sorting.length = 1;
			sorting[0][1] = asSorting[nextSortIdx];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			sorting.length = 1;
			sorting[0][1] = asSorting[0];
			sorting[0]._idx = 0;
		}
	}
	else {
		// Single column - sort only on this column
		sorting.length = 0;
		sorting.push([colIdx, asSorting[0]]);
		sorting[0]._idx = 0;
	}
}

/**
 * Set the sorting classes on table's body, Note: it is safe to call this function
 * when bSort and bSortClasses are false
 *
 * @param settings DataTables settings object
 */
export function sortingClasses(settings: Context) {
	var oldSort = settings.aLastSort;
	var sortClass = settings.oClasses.order.position;
	var sortFlat = sortFlatten(settings);
	var features = settings.oFeatures;
	var i, iLen, colIdx;

	if (features.ordering && features.orderClasses) {
		// Remove old sorting classes
		for (i = 0, iLen = oldSort.length; i < iLen; i++) {
			colIdx = oldSort[i].src;

			// Remove column sorting
			dom
				.s(pluck(settings.aoData, 'anCells', colIdx))
				.classRemove(sortClass + (i < 2 ? i + 1 : 3));
		}

		// Add new column sorting
		for (i = 0, iLen = sortFlat.length; i < iLen; i++) {
			colIdx = sortFlat[i].src;

			dom
				.s(pluck(settings.aoData, 'anCells', colIdx))
				.classAdd(sortClass + (i < 2 ? i + 1 : 3));
		}
	}

	settings.aLastSort = sortFlat;
}

/**
 * Get the data to sort a column, be it from cache, fresh (populating the
 * cache), or from a sort formatter
 *
 * @param settings DataTables settings object
 * @param colIdx Column index
 */
export function sortData(settings: Context, colIdx: number) {
	// Custom sorting function - provided by the sort data type
	var column = settings.aoColumns[colIdx];
	var customSort = ext.order[column.sSortDataType];
	var customData;

	if (customSort) {
		customData = customSort.call(
			settings.oInstance,
			settings,
			colIdx,
			columnIndexToVisible(settings, colIdx)
		);
	}

	// Use / populate cache
	var row, cellData;
	var formatter = ext.type.order[column.sType + '-pre'];
	var data = settings.aoData;

	for (var rowIdx = 0; rowIdx < data.length; rowIdx++) {
		// Sparse array
		if (!data[rowIdx]) {
			continue;
		}

		row = data[rowIdx];

		if (row && !row._aSortData) {
			row._aSortData = [];
		}

		if (row && (!row._aSortData![colIdx] || customSort)) {
			cellData = customSort
				? customData[rowIdx] // If there was a custom sort function, use data from there
				: getCellData(settings, rowIdx, colIdx, 'sort');

			row._aSortData![colIdx] = formatter
				? formatter(cellData, settings)
				: cellData;
		}
	}
}
