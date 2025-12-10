import { ILayoutCell, ILayoutRow } from '../core/layout';
import dom, { Dom } from '../dom';
import { Context } from '../model/settings';
import { pluck } from '../util/array';
import classes from './classes';

export type IRendererTypes =
	| 'header'
	| 'footer'
	| 'layout'
	| 'pagingButton'
	| 'pagingContainer';

export type IRendererHeader = (
	ctx: Context,
	cell: Dom,
	classNames: typeof classes
) => void;

export interface IPagingButton {
	display: Element;
	clicker: Element;
}

export type IRendererFooter = (
	ctx: Context,
	cell: Dom,
	classNames: typeof classes
) => void;

export type IRendererLayout = (
	ctx: Context,
	container: Dom,
	items: ILayoutRow
) => void;

export type IRendererPagingButton = (
	ctx: Context,
	button: string | number,
	content: string,
	active: boolean,
	disabled: boolean
) => IPagingButton;

export type IRendererPagingContainer = (
	ctx: Context,
	buttons: Element[]
) => Element | Element[];

export interface IRendererCollection<T> {
	[specific: string]: T;
	_: T; // default
}

export interface IRenderers {
	footer: IRendererCollection<IRendererFooter>;
	header: IRendererCollection<IRendererHeader>;
	layout: IRendererCollection<IRendererLayout>;
	pagingButton: IRendererCollection<IRendererPagingButton>;
	pagingContainer: IRendererCollection<IRendererPagingContainer>;
}

export const footer: IRendererFooter = (settings, cell, classes) => {
	cell.classAdd(classes.tfoot.cell);
};

export const header: IRendererHeader = (settings, cell, classes) => {
	cell.classAdd(classes.thead.cell);

	if (!settings.oFeatures.bSort) {
		cell.classAdd(classes.order.none);
	}

	var titleRow = settings.titleRow;
	var headerRows = cell.closest('thead').find('tr');
	var rowIdx = cell.parent().index();

	// Conditions to not apply the ordering icons
	if (
		// Cells and rows which have the attribute to disable the icons
		cell.attr('data-dt-order') === 'disable' ||
		cell.parent().attr('data-dt-order') === 'disable' ||
		// titleRow support, for defining a specific row in the header
		(titleRow === true && rowIdx !== 0) ||
		(titleRow === false && rowIdx !== headerRows.count() - 1) ||
		(typeof titleRow === 'number' && rowIdx !== titleRow)
	) {
		return;
	}

	// No additional mark-up required. Attach a sort listener to update on sort
	// - note that using the `DT` namespace will allow the event to be removed
	// automatically on destroy, while the `dt` namespaced event is the one we
	// are listening for
	dom
		.s(settings.nTable)
		.on('order.dt.DT column-visibility.dt.DT', function (e, ctx, column) {
			if (settings !== ctx) {
				// need to check if this is the host
				return; // table, not a nested one
			}

			var sorting = ctx.sortDetails;

			if (!sorting) {
				return;
			}

			var orderedColumns = pluck(sorting, 'col');

			// This handler is only needed on column visibility if the column is
			// part of the ordering. If it isn't, then we can bail out to save
			// performance. It could be a separate event handler, but this is a
			// balance between code reuse / size and performance console.log(e,
			// e.name, column, orderedColumns, orderedColumns.includes(column))
			if (e.type === 'column-visibility' && !orderedColumns.includes(column)) {
				return;
			}

			var i;
			var orderClasses = classes.order;
			var columns = ctx.api.columns(cell);
			var col = settings.aoColumns[columns.flatten()[0]];
			var orderable = columns.orderable().includes(true);
			var ariaType = '';
			var indexes = columns.indexes();
			var sortDirs = columns.orderable(true).flatten();
			var tabIndex = settings.iTabIndex;
			var canOrder = ctx.orderHandler && orderable;

			cell
				.classRemove(orderClasses.isAsc + ' ' + orderClasses.isDesc)
				.classToggle(orderClasses.none, !orderable)
				.classToggle(orderClasses.canAsc, canOrder && sortDirs.includes('asc'))
				.classToggle(
					orderClasses.canDesc,
					canOrder && sortDirs.includes('desc')
				);

			// Determine if all of the columns that this cell covers are
			// included in the current ordering
			var isOrdering = true;

			for (i = 0; i < indexes.length; i++) {
				if (!orderedColumns.includes(indexes[i])) {
					isOrdering = false;
				}
			}

			if (isOrdering) {
				// Get the ordering direction for the columns under this cell
				// Note that it is possible for a cell to be asc and desc
				// sorting (column spanning cells)
				var orderDirs = columns.order();

				cell.classAdd(
					(orderDirs.includes('asc') ? orderClasses.isAsc : '') +
						(orderDirs.includes('desc') ? orderClasses.isDesc : '')
				);
			}

			// Find the first visible column that has ordering applied to it -
			// it get's the aria information, as the ARIA spec says that only
			// one column should be marked with aria-sort
			var firstVis = -1; // column index

			for (i = 0; i < orderedColumns.length; i++) {
				if (settings.aoColumns[orderedColumns[i]].bVisible) {
					firstVis = orderedColumns[i];
					break;
				}
			}

			if (indexes[0] == firstVis) {
				var firstSort = sorting[0];
				var sortOrder = col.asSorting;

				cell.attr(
					'aria-sort',
					firstSort.dir === 'asc' ? 'ascending' : 'descending'
				);

				// Determine if the next click will remove sorting or change the sort
				ariaType =
					sortOrder && !sortOrder[firstSort.index + 1] ? 'Remove' : 'Reverse';
			}
			else {
				cell.removeAttr('aria-sort');
			}

			// Make the headers tab-able for keyboard navigation
			if (orderable) {
				var orderSpan = cell.find('.dt-column-order');

				orderSpan
					.attr('role', 'button')
					.attr(
						'aria-label',
						orderable
							? col.ariaTitle + ctx.api.i18n('oAria.orderable' + ariaType)
							: col.ariaTitle
					);

				if (tabIndex !== -1) {
					orderSpan.attr('tabindex', tabIndex);
				}
			}
		});
};

export const layout: IRendererLayout = (settings, container, items) => {
	let classes = settings.oClasses.layout;
	let row = dom
		.c('div')
		.attr('id', items.id || null)
		.classAdd(items.className || classes.row)
		.appendTo(container);

	displayRowCells(items, function (key, val) {
		var klass = '';

		if (val.table) {
			row.classAdd(classes.tableRow);
			klass += classes.tableCell + ' ';
		}

		if (key === 'start') {
			klass += classes.start;
		}
		else if (key === 'end') {
			klass += classes.end;
		}
		else {
			klass += classes.full;
		}

		dom
			.c('div')
			.attr({
				id: val.id || null,
				class: val.className ? val.className : classes.cell + ' ' + klass,
			})
			.append(val.contents)
			.appendTo(row);
	});
};

export const pagingButton: IRendererPagingButton = (
	settings: Context,
	buttonType: string | number,
	content: string,
	active: boolean,
	disabled: boolean
) => {
	var classes = settings.oClasses.paging;
	var btnClasses = [classes.button];
	var btn: Element;

	if (active) {
		btnClasses.push(classes.active);
	}

	if (disabled) {
		btnClasses.push(classes.disabled);
	}

	if (buttonType === 'ellipsis') {
		btn = dom.c('span').classAdd('ellipsis').html(content).get(0);
	}
	else {
		btn = dom
			.c('button')
			.classAdd(btnClasses.join(' '))
			.attr('role', 'link')
			.attr('type', 'button')
			.html(content)
			.get(0);
	}

	return {
		display: btn,
		clicker: btn,
	};
};

export const pagingContainer: IRendererPagingContainer = (
	settings: Context,
	buttons: Element[]
) => {
	// No wrapping element - just append directly to the host
	return buttons;
};

export function displayRowCells(
	items: ILayoutRow,
	fn: (position: 'start' | 'end' | 'full', cell: ILayoutCell) => void
): void {
	if (items.start) {
		fn('start', items.start);
	}

	if (items.end) {
		fn('end', items.end);
	}

	if (items.full) {
		fn('full', items.full);
	}
}
