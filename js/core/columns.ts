import { callbackFire, map } from '../api/support';
import dom from '../dom';
import helpers from '../ext/helpers';
import ext from '../ext/index';
import columnDefaults, { ConfigColumnDefs } from '../model/columns/defaults';
import ColumnModel from '../model/columns/settings';
import createSearch from '../model/search';
import { Context, HeaderStructure } from '../model/settings';
import util from '../util';
import { compatCols, hungarianToCamel } from './compat';
import { getCellData, writeCell } from './data';
import { scrollDraw } from './scrolling';
import { calculateColumnWidths } from './sizing';

/**
 * Add a column to the list used for the table with default values
 *
 * @param settings DataTables settings object
 */
export function addColumn(settings: Context) {
	// Add column to aoColumns array
	let columnIdx = settings.columns.length;
	let column = util.object.assign<ColumnModel>(
		{},
		new ColumnModel(),
		columnDefaults,
		{
			orderData: columnDefaults.orderData
				? columnDefaults.orderData
				: [columnIdx],
			data: columnDefaults.data ? columnDefaults.data : columnIdx,
			idx: columnIdx,
			searchFixed: {},
			colEl: dom
				.c<HTMLTableColElement>('col')
				.attr('data-dt-column', columnIdx)
		}
	);

	settings.columns.push(column);

	// Add search object for column specific search. Note that the `searchCols[
	// iCol ]` passed into extend can be undefined. This allows the user to give
	// a default with only some of the parameters defined, and also not give a
	// default
	let searchCols = settings.preSearchCols;

	searchCols[columnIdx] = createSearch(
		hungarianToCamel(searchCols[columnIdx])
	);
}

/**
 * Apply options for a column
 *
 * @param settings DataTables settings object
 * @param colIdx column index to consider
 * @param options Column configuration options
 */
export function columnOptions(
	settings: Context,
	colIdx: number,
	options?: Partial<ColumnModel>
) {
	var column = settings.columns[colIdx];

	/* User specified column options */
	if (options !== undefined && options !== null) {
		// Backwards compatibility
		compatCols(options);

		if (options.type) {
			column.typeManual = options.type;
		}

		// `class` is a reserved word in JavaScript, so we need to provide
		// the ability to use a valid name for the camel case input
		if (options.className && !options.className) {
			options.className = options.className;
		}

		var origClass = column.className;

		util.object.assign(column, options);
		map(column, options, 'width', 'widthOrig');

		// Merge class from previously defined classes with this one, rather
		// than just overwriting it in the extend above
		if (origClass !== column.className) {
			column.className = origClass + ' ' + column.className;
		}

		map(column, options, 'orderData');
	}

	/* Cache the data get and set functions for speed */
	var dataSrc = column.data;
	var dataFn = util.get(dataSrc);

	// The `render` option can be given as an array to access the helper
	// rendering methods. The first element is the rendering method to use, the
	// rest are the parameters to pass
	if (column.render && Array.isArray(column.render)) {
		var copy = column.render.slice();
		var name = copy.shift();

		column.render = (helpers as any)[name].apply(window, copy);
	}

	column.renderer = column.render ? util.get(column.render) : null;

	var attrTest = function (src: any) {
		return typeof src === 'string' && src.indexOf('@') !== -1;
	};
	column.attrSrc =
		!!dataSrc &&
		util.is.plainObject(dataSrc) &&
		(attrTest(dataSrc.sort) ||
			attrTest(dataSrc.type) ||
			attrTest(dataSrc.filter));
	column.setter = null;

	column.dataGet = function (rowData, type, meta) {
		var innerData = dataFn(rowData, type, undefined, meta);

		return column.renderer && type
			? column.renderer(innerData, type, rowData, meta)
			: innerData;
	};
	column.dataSet = function (rowData, val, meta) {
		return util.set(dataSrc)(rowData, val, meta);
	};

	// Indicate if DataTables should read DOM data as an object or array
	// Used in _fnGetRowElements
	if (typeof dataSrc !== 'number' && !column._isArrayHost) {
		settings.rowReadObject = true;
	}

	/* Feature sorting overrides column specific when off */
	if (!settings.features.ordering) {
		column.orderable = false;
	}
}

/**
 * Adjust the table column widths for new data. Note: you would probably want to
 * do a redraw after calling this function!
 *
 * @param settings DataTables settings object
 */
export function adjustColumnSizing(settings: Context) {
	calculateColumnWidths(settings);
	columnSizes(settings);

	let scroll = settings.scroll;

	if (scroll.y !== '' || scroll.x !== '') {
		scrollDraw(settings);
	}

	callbackFire(settings, null, 'column-sizing', [settings]);
}

/**
 * Apply column sizes
 *
 * @param settings DataTables settings object
 */
export function columnSizes(settings: Context) {
	let cols = settings.columns;

	for (let i = 0; i < cols.length; i++) {
		let width = columnsSumWidth(settings, [i], false, false);

		if (width) {
			cols[i].colEl.css('width', width);

			if (settings.scroll.x) {
				cols[i].colEl.css('min-width', width);
			}
		}
	}
}

/**
 * Convert the index of a visible column to the index in the data array (take
 * account of hidden columns)
 *
 * @param settings DataTables settings object
 * @param visIdx Visible column index to lookup
 * @returns i the data index
 */
export function visibleToColumnIndex(settings: Context, visIdx: number) {
	let aiVis = getColumns(settings, 'visible');

	return typeof aiVis[visIdx] === 'number' ? aiVis[visIdx] : null;
}

/**
 * Convert the index of an index in the data array and convert it to the visible
 * column index (take account of hidden columns)
 *
 * @param settings DataTables settings object
 * @param match Column index to lookup
 * @returns The data index
 */
export function columnIndexToVisible(settings: Context, match: number) {
	let aiVis = getColumns(settings, 'visible');
	let iPos = aiVis.indexOf(match);

	return iPos !== -1 ? iPos : null;
}

/**
 * Get the number of visible columns
 *
 * @param settings DataTables settings object
 * @returns i the number of visible columns
 */
export function visibleColumns(settings: Context) {
	let layout = settings.header;
	let columns = settings.columns;
	let vis = 0;

	if (layout.length) {
		for (let i = 0, iLen = layout[0].length; i < iLen; i++) {
			if (
				columns[i].visible &&
				dom.s(layout[0][i].cell).css('display') !== 'none'
			) {
				vis++;
			}
		}
	}

	return vis;
}

/**
 * Get an array of column indexes that match a given property
 *
 * @param settings DataTables settings object
 * @param param Parameter in the columns array to look for
 *  @returns Array of indexes with matched properties
 */
export function getColumns(settings: Context, param: keyof ColumnModel) {
	let a: number[] = [];

	settings.columns.map(function (val, i) {
		if (val[param]) {
			a.push(i);
		}
	});

	return a;
}

/**
 * Allow the result from a type detection function to be `true` while
 * translating that into a string. Old type detection functions will return the
 * type name if it passes. An object store would be better, but not backwards
 * compatible.
 *
 * @param typeDetect Object or function for type detection
 * @param res Result from the type detection function
 * @returns Type name or false
 */
function _typeResult(typeDetect: any, res: boolean | string | null) {
	return res === true ? typeDetect._name : res;
}

/**
 * Calculate the 'type' of a column
 * @param settings DataTables settings object
 */
export function columnTypes(settings: Context) {
	var columns = settings.columns;
	var data = settings.data;
	var types = ext.type.detect;
	var i, iLen, j, jen, k, ken;
	var col, detectedType, cache;

	// For each column, spin over the data type detection functions, seeing if
	// one matches
	for (i = 0, iLen = columns.length; i < iLen; i++) {
		col = columns[i];
		cache = [];

		if (!col.type && col.typeManual) {
			col.type = col.typeManual;
		}
		else if (!col.type) {
			// With SSP type detection can be unreliable and error prone, so we
			// provide a way to turn it off.
			if (!settings.typeDetect) {
				return;
			}

			for (j = 0, jen = types.length; j < jen; j++) {
				let typeDetect = types[j];
				let oneOf;
				let allOf;
				let init;
				let one = false;

				// There can be either one, or three type detection functions
				if (typeof typeDetect === 'function') {
					allOf = typeDetect;
				}
				else {
					oneOf = typeDetect.oneOf;
					allOf = typeDetect.allOf;
					init = typeDetect.init;
				}

				detectedType = null;

				// Fast detect based on column assignment
				if (init) {
					detectedType = _typeResult(
						typeDetect,
						init(settings, col, i)
					);

					if (detectedType) {
						col.type = detectedType;
						break;
					}
				}

				for (k = 0, ken = data.length; k < ken; k++) {
					if (!data[k]) {
						continue;
					}

					// Use a cache array so we only need to get the type data
					// from the formatter once (when using multiple detectors)
					if (cache[k] === undefined) {
						cache[k] = getCellData(settings, k, i, 'type');
					}

					// Only one data point in the column needs to match this
					// function
					if (oneOf && !one) {
						one = _typeResult(
							typeDetect,
							oneOf(cache[k], settings)
						);
					}

					// All data points need to match this function
					detectedType = _typeResult(
						typeDetect,
						allOf(cache[k], settings)
					);

					// If null, then this type can't apply to this column, so
					// rather than testing all cells, break out. There is an
					// exception for the last type which is `html`. We need to
					// scan all rows since it is possible to mix string and HTML
					// types
					if (!detectedType && j !== types.length - 3) {
						break;
					}

					// Only a single match is needed for html type since it is
					// bottom of the pile and very similar to string - but it
					// must not be empty
					if (detectedType === 'html' && !util.is.empty(cache[k])) {
						break;
					}
				}

				// Type is valid for all data points in the column - use this
				// type
				if (
					(oneOf && one && detectedType) ||
					(!oneOf && detectedType)
				) {
					col.type = detectedType;
					break;
				}
			}

			// Fall back - if no type was detected, always use string
			if (!col.type) {
				col.type = 'string';
			}
		}

		// Set class names for header / footer for auto type classes
		var autoClass = ext.type.className[col.type];

		if (autoClass) {
			_columnAutoClass(settings.header, i, autoClass);
			_columnAutoClass(settings.footer, i, autoClass);
		}

		var renderer = ext.type.render[col.type];

		// This can only happen once! There is no way to remove
		// a renderer. After the first time the renderer has
		// already been set so createTr will run the renderer itself.
		if (renderer && !col.renderer) {
			col.renderer = util.get(renderer);

			_columnAutoRender(settings, i);
		}
	}
}

/**
 * Apply an auto detected renderer to data which doesn't yet have a renderer
 */
function _columnAutoRender(settings: Context, colIdx: number) {
	let data = settings.data;

	for (let i = 0; i < data.length; i++) {
		let d = data[i];

		if (d && d.tr) {
			// We have to update the display here since there is no invalidation
			// check for the data
			let display = getCellData(settings, i, colIdx, 'display');

			d.displayData![colIdx] = display;
			writeCell(d.cells[colIdx], display);

			// No need to update sort / filter data since it has been
			// invalidated and will be re-read with the renderer now applied
		}
	}
}

/**
 * Apply a class name to a column's header cells
 *
 * @param container The header / footer structure array
 * @param colIdx Column index
 * @param className Class name to apply
 */
function _columnAutoClass(
	container: HeaderStructure[],
	colIdx: number,
	className: string
) {
	container.forEach(function (row) {
		if (row[colIdx] && row[colIdx].unique) {
			dom.s(row[colIdx].cell).classAdd(className);
		}
	});
}

/**
 * Take the column definitions and static columns arrays and calculate how they
 * relate to column indexes. The callback function will then apply the
 * definition found for a column to a suitable configuration object.
 *
 * @param settings DataTables settings object
 * @param aoColDefs The aoColumnDefs array that is to be applied
 * @param aoCols The aoColumns array that defines columns individually
 * @param headerLayout Layout for header as it was loaded
 * @param fn Callback function - takes two parameters, the calculated column
 *    index and the definition for that column.
 */
export function applyColumnDefs(
	settings: Context,
	aoColDefs: Partial<ConfigColumnDefs>[] | null | undefined,
	aoCols: Partial<ColumnModel>[],
	headerLayout: HeaderStructure[],
	fn: (idx: number, def: any) => void
) {
	var i, iLen, j, jLen, k: number, kLen;
	var columns = settings.columns;

	if (aoCols) {
		for (i = 0, iLen = aoCols.length; i < iLen; i++) {
			// Compat
			if (aoCols[i] && (aoCols[i] as any).name) {
				columns[i].name = (aoCols[i] as any).name;
			}
		}
	}

	// Column definitions with aTargets
	if (aoColDefs) {
		// Loop over the definitions array - loop in reverse so first instance
		// has priority
		for (i = aoColDefs.length - 1; i >= 0; i--) {
			let def = aoColDefs[i];

			/* Each definition can target multiple columns, as it is an array */
			let aTargets =
				def.target !== undefined
					? def.target
					: def.targets !== undefined
					? def.targets
					: (def as any).aTargets; // legacy

			if (!Array.isArray(aTargets)) {
				aTargets = [aTargets];
			}

			for (j = 0, jLen = aTargets.length; j < jLen; j++) {
				var target = aTargets[j];

				if (typeof target === 'number' && target >= 0) {
					/* Add columns that we don't yet know about */
					while (columns.length <= target) {
						addColumn(settings);
					}

					/* Integer, basic index */
					fn(target, def);
				}
				else if (typeof target === 'number' && target < 0) {
					/* Negative integer, right to left column counting */
					fn(columns.length + target, def);
				}
				else if (typeof target === 'string') {
					for (k = 0, kLen = columns.length; k < kLen; k++) {
						if (target === '_all') {
							// Apply to all columns
							fn(k, def);
						}
						else if (target.indexOf(':name') !== -1) {
							// Column selector
							if (
								columns[k].name === target.replace(':name', '')
							) {
								fn(k, def);
							}
						}
						else {
							// Cell selector
							headerLayout.forEach(function (row) {
								if (row[k]) {
									var cell = row[k].cell;

									// Legacy support. Note that it means that
									// we don't support an element name selector
									// only, since they are treated as class
									// names for 1.x compat.
									if (target.match(/^[a-z][\w-]*$/i)) {
										target = '.' + target;
									}

									if (cell.matches(target)) {
										fn(k, def);
									}
								}
							});
						}
					}
				}
			}
		}
	}

	// Statically defined columns array
	if (aoCols) {
		for (i = 0, iLen = aoCols.length; i < iLen; i++) {
			fn(i, aoCols[i]);
		}
	}
}

/**
 * Get the width for a given set of columns
 *
 * @param settings DataTables settings object
 * @param targets Columns - comma separated string or array of numbers
 * @param original Use the original width (true) or calculated (false)
 * @param incVisible Include visible columns (true) or not (false)
 * @returns Combined CSS value
 */
export function columnsSumWidth(
	settings: Context,
	targets: HTMLElement | number[],
	original: boolean,
	incVisible: boolean
) {
	if (!Array.isArray(targets)) {
		targets = columnsFromHeader(targets);
	}

	let sum = 0;
	let unit = 'px';
	let columns = settings.columns;

	for (let i = 0, iLen = targets.length; i < iLen; i++) {
		let column = columns[targets[i]];
		let definedWidth = original ? column.widthOrig : column.width;

		if (!incVisible && column.visible === false) {
			continue;
		}

		if (definedWidth === null || definedWidth === undefined) {
			return null; // can't determine a defined width - browser defined
		}
		else if (typeof definedWidth === 'number') {
			sum += definedWidth;
		}
		else {
			let matched = definedWidth.match(/([\d\.]+)([^\d]*)/);

			if (matched) {
				sum += parseFloat(matched[1]);
				unit = matched.length === 3 ? matched[2] : 'px';
			}
		}
	}

	return sum + unit;
}

/**
 * Determine what columns a header cell covers (can be multiple for colspan
 * cases).
 *
 * @param cell The header cell in question
 * @returns An array of column indexes
 */
export function columnsFromHeader(cell: HTMLElement) {
	let attr = dom.s(cell).closest('[data-dt-column]').attr('data-dt-column');

	if (!attr) {
		return [];
	}

	return attr.split(',').map(function (val) {
		return parseInt(val);
	});
}
