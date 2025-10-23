import { log } from '../api/support';
import dom, { Dom } from '../dom';
import ext from '../ext';
import { Layout } from '../model/interface';
import Context from '../model/settings';
import * as is from '../util/is';
import * as object from '../util/object';
import { processingHtml } from './processing';
import { renderer } from './render';
import { featureHtmlTable } from './scrolling';

export interface ILayoutRow {
	id?: string;
	className?: string;
	full?: ILayoutCell;
	start?: ILayoutCell;
	end?: ILayoutCell;
	rowNum?: number;
}

interface ILayoutCell {
	id?: string;
	className?: string;
	contents: Array<{
		feature: string;
		opts: unknown;
	}>;
	table?: boolean;
}

/**
 * Add the options to the page HTML for the table
 *
 * @param settings DataTables settings object
 */
export function createLayout(ctx: Context) {
	var classes = ctx.oClasses;

	// Wrapper div around everything DataTables controls
	var insert = dom
		.c('div')
		.attr('id', ctx.sTableId + '_wrapper')
		.classAdd(classes.container)
		.insertBefore(ctx.nTable);

	ctx.nTableWrapper = insert.get(0);

	if (ctx.sDom) {
		// Legacy
		legacyDom(ctx, ctx.sDom, insert);
	}
	else {
		var top = convert(ctx, ctx.layout, 'top');
		var bottom = convert(ctx, ctx.layout, 'bottom');
		var render = renderer(ctx, 'layout');

		// Everything above - the renderer will actually insert the contents into the document
		top.forEach(function (item) {
			render(ctx, insert, item);
		});

		// The table - always the center of attention
		render(ctx, insert, {
			full: {
				table: true,
				contents: [featureHtmlTable(ctx)],
			},
		});

		// Everything below
		bottom.forEach(function (item) {
			render(ctx, insert, item);
		});
	}

	// Processing floats on top, so it isn't an inserted feature
	processingHtml(ctx);
}

/**
 * Expand the layout items into an object for the rendering function
 */
function layoutItems(row: ILayoutRow, align: 'start' | 'end' | 'full', items) {
	if (Array.isArray(items)) {
		for (var i = 0; i < items.length; i++) {
			layoutItems(row, align, items[i]);
		}

		return;
	}

	var rowCell = row[align]!; // can't be undefined - will have been created by getRow

	// If it is an object, then there can be multiple features contained in it
	if (is.plainObject(items)) {
		// A feature plugin cannot be named "features" due to this check
		if (items.features) {
			if (items.rowId) {
				row.id = items.rowId;
			}
			if (items.rowClass) {
				row.className = items.rowClass;
			}

			rowCell.id = items.id;
			rowCell.className = items.className;

			layoutItems(row, align, items.features);
		}
		else {
			object.each(items, (key, val) => {
				rowCell.contents.push({
					feature: key,
					opts: val,
				});
			});
		}
	}
	else {
		rowCell.contents.push(items);
	}
}

/**
 * Find, or create a layout row and setup a target cell in it
 *
 * @param rows Rows array to search for the target row. Is mutated when a row is
 *   added if not found.
 * @param rowNum Row index to get
 * @param align Where the cell position is
 * @returns The row
 */
function getRow(
	rows: ILayoutRow[],
	rowNum: number,
	align: 'full' | 'start' | 'end'
) {
	var row: ILayoutRow;

	// Find existing rows
	for (var i = 0; i < rows.length; i++) {
		row = rows[i];

		if (row.rowNum === rowNum) {
			// full is on its own, but start and end share a row
			if (
				(align === 'full' && row.full) ||
				((align === 'start' || align === 'end') && (row.start || row.end))
			) {
				if (!row[align]) {
					row[align] = {
						contents: [],
					};
				}

				return row;
			}
		}
	}

	// If we get this far, then there was no match, create a new row
	row = {
		rowNum: rowNum,
	};

	row[align] = {
		contents: [],
	};

	rows.push(row);

	return row;
}

/**
 * Convert a `layout` object given by a user to the object structure needed
 * for the renderer. This is done twice, once for above and once for below
 * the table. Ordering must also be considered.
 *
 * @param settings DataTables settings object
 * @param layout Layout object to convert
 * @param side `top` or `bottom`
 * @returns Converted array structure - one item for each row.
 */
function convert(settings: Context, layout: Layout, side: 'top' | 'bottom') {
	var rows: ILayoutRow[] = [];

	// Split out into an array
	object.each(layout, function (pos, items) {
		var parts = pos.match(/^([a-z]+)([0-9]*)([A-Za-z]*)$/);

		if (items === null || !parts) {
			return;
		}

		var rowNum = parts[2] ? parseInt(parts[2]) : 0;
		var align = parts[3] ? parts[3].toLowerCase() : 'full';

		// Filter out the side we aren't interested in
		if (parts[1] !== side) {
			return;
		}

		// Only really a type check
		if (align !== 'full' && align !== 'start' && align !== 'end') {
			return;
		}

		// Get or create the row we should attach to
		var row = getRow(rows, rowNum, align);

		layoutItems(row, align, items);
	});

	// Order by item identifier
	rows.sort(function (a, b) {
		var order1 = a.rowNum || 0;
		var order2 = b.rowNum || 0;

		// If both in the same row, then the row with `full` comes first
		if (order1 === order2) {
			var ret = a.full && !b.full ? -1 : 1;

			return side === 'bottom' ? ret * -1 : ret;
		}

		return order2 - order1;
	});

	// Invert for below the table
	if (side === 'bottom') {
		rows.reverse();
	}

	for (var row = 0; row < rows.length; row++) {
		delete rows[row].rowNum;

		resolve(settings, rows[row]);
	}

	return rows;
}

/**
 * Convert the contents of a row's layout object to nodes that can be inserted
 * into the document by a renderer. Execute functions, look up plug-ins, etc.
 *
 * @param settings DataTables settings object
 * @param row Layout object for this row
 */
function resolve(settings: Context, row) {
	var getFeature = function (feature, opts) {
		if (!ext.features[feature]) {
			log(settings, 0, 'Unknown feature: ' + feature);
		}

		return ext.features[feature].apply(this, [settings, opts]);
	};

	var resolve = function (item) {
		if (!row[item]) {
			return;
		}

		var line = row[item].contents;

		for (var i = 0, iLen = line.length; i < iLen; i++) {
			if (!line[i]) {
				continue;
			}
			else if (typeof line[i] === 'string') {
				line[i] = getFeature(line[i], null);
			}
			else if (is.plainObject(line[i])) {
				// If it's an object, it just has feature and opts properties from
				// the transform in _layoutArray
				line[i] = getFeature(line[i].feature, line[i].opts);
			}
			else if (typeof line[i].node === 'function') {
				line[i] = line[i].node(settings);
			}
			else if (typeof line[i] === 'function') {
				var inst = line[i](settings);

				line[i] = typeof inst.node === 'function' ? inst.node() : inst;
			}
		}
	};

	resolve('start');
	resolve('end');
	resolve('full');
}

/**
 * Draw the table with the legacy DOM property
 *
 * @param settings DT settings instance
 * @param layout DOM string
 * @param insert Insert point
 */
function legacyDom(settings: Context, layout: string, insert: Dom) {
	let parts = layout.match(/(".*?")|('.*?')|./g);
	let featureNode, option, newNode: Dom, next, attr;

	if (!parts) {
		return;
	}

	for (let i = 0; i < parts.length; i++) {
		featureNode = null;
		option = parts[i];

		if (option == '<') {
			// New container div
			newNode = dom.c('div');

			// Check to see if we should append an id and/or a class name to the container
			next = parts[i + 1];

			if (next[0] == "'" || next[0] == '"') {
				attr = next.replace(/['"]/g, '');

				let id = '',
					className;

				/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
				 * breaks the string into parts and applies them as needed
				 */
				if (attr.indexOf('.') != -1) {
					let split = attr.split('.');

					id = split[0];
					className = split[1];
				}
				else if (attr[0] == '#') {
					id = attr;
				}
				else {
					className = attr;
				}

				newNode.attr('id', id.substring(1)).classAdd(className);

				i++; // Move along the position array
			}

			insert.append(newNode.get()); // TODO
			insert = newNode;
		}
		else if (option == '>') {
			// End container div
			insert = insert.parent();
		}
		else if (option == 't') {
			// Table
			featureNode = featureHtmlTable(settings);
		}
		else {
			ext.feature.forEach(function (feature) {
				if (option == feature.cFeature) {
					featureNode = feature.fnInit(settings);
				}
			});
		}

		// Add to the display
		if (featureNode) {
			// TODO when doing the full dom update, won't need this check
			insert.append(
				featureNode instanceof Dom ? featureNode.get() : featureNode
			);
		}
	}
}
