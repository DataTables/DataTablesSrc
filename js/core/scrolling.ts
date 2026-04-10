import { dataSource } from '../api/support';
import Dom from '../dom';
import { Context } from '../model/settings';
import { adjustColumnSizing, visibleToColumnIndex } from './columns';
import { stringToCss } from './sizing';

/**
 * Scrolling setup
 *
 * @param settings DataTables settings object
 * @returns Node to add to the DOM
 */
export function featureTable(settings: Context) {
	let table = Dom.s(settings.table);
	let scroll = settings.scroll;
	let scrollX = scroll.x;
	let scrollY = scroll.y;

	// No scrolling or x-scrolling only
	if (scrollY === '' && scrollX === '') {
		return table.get(0);
	}

	let classes = settings.classes.scrolling;
	let caption = settings.captionNode;
	let captionSide: string | null = caption
		? (caption as any)._captionSide
		: null;
	let tableCloneHeader = table.clone(false);
	let tableCloneFooter = table.clone(false);
	let footer = table.children('tfoot');
	let size = function (s: string | number | null) {
		return !s ? '100%' : stringToCss(s);
	};

	/*
	 * The HTML structure that we want to generate in this function is:
	 *  div - scroller
	 *    div - scroll head
	 *      div - scroll head inner
	 *        table - scroll head table
	 *          thead - thead
	 *    div - scroll body
	 *      table - table (master table)
	 *        thead - thead clone for sizing
	 *        tbody - tbody
	 *    div - scroll foot
	 *      div - scroll foot inner
	 *        table - scroll foot table
	 *          tfoot - tfoot
	 */
	let scroller = Dom.c('div')
		.classAdd(classes.container)
		.attr('role', 'table')
		.append(
			Dom.c('div')
				.classAdd(classes.header.self)
				.css({
					overflow: 'hidden',
					position: 'relative',
					border: '0',
					width: scrollX ? size(scrollX) : '100%'
				})
				.attr('role', 'none')
				.append(
					Dom.c('div')
						.classAdd(classes.header.inner)
						.css({
							'box-sizing': 'content-box',
							width: scroll.xInner || '100%'
						})
						.attr('role', 'none')
						.append(
							tableCloneHeader
								.attrRemove('id')
								.css('margin-left', '0')
								.append(captionSide === 'top' ? caption : null)
								.append(table.children('thead'))
						)
				)
		)
		.append(
			Dom.c('div')
				.classAdd(classes.body)
				.css({
					position: 'relative',
					overflow: 'auto',
					width: size(scrollX)
				})
				.attr('role', 'none')
				.append(table)
		);

	if (footer.count()) {
		scroller.append(
			Dom.c('div')
				.classAdd(classes.footer.self)
				.css({
					overflow: 'hidden',
					border: '0',
					width: scrollX ? size(scrollX) : '100%'
				})
				.attr('role', 'none')
				.append(
					Dom.c('div')
						.classAdd(classes.footer.inner)
						.attr('role', 'none')
						.append(
							tableCloneFooter
								.attrRemove('id')
								.css('margin-left', '0')
								.append(
									captionSide === 'bottom' ? caption : null
								)
								.append(table.children('tfoot'))
						)
				)
		);
	}

	let children = scroller.children();
	let scrollHead = children.eq(0);
	let scrollBody = children.eq(1);
	let scrollFoot = children.eq(2);

	// When the body is scrolled, then we also want to scroll the header and
	// footer. Note that each element has its own scroll listener, and that in
	// turn sets the scroll for the other elements. However this doesn't lead to
	// an infinite loop as `scroll` is only triggered if the value changes.
	scrollBody.on('scroll.DT', () => {
		let scrollLeft = scrollBody.scrollLeft();

		scrollHead.scrollLeft(scrollLeft);
		scrollFoot.scrollLeft(scrollLeft);
	});

	scrollHead.on('scroll.DT', () => {
		let scrollLeft = scrollHead.scrollLeft();

		scrollBody.scrollLeft(scrollLeft);
		scrollFoot.scrollLeft(scrollLeft);
	});

	scrollFoot.on('scroll.DT', () => {
		let scrollLeft = scrollFoot.scrollLeft();

		scrollHead.scrollLeft(scrollLeft);
		scrollBody.scrollLeft(scrollLeft);
	});

	scrollBody.css('max-height', size(scrollY));

	if (!scroll.collapse) {
		scrollBody.css('height', size(scrollY));
	}

	settings.scrollHead = scrollHead;
	settings.scrollBody = scrollBody;
	settings.scrollFoot = scrollFoot;

	// On redraw - align columns
	settings.callbacks.draw.push(scrollDraw);

	// Aria roles - because we break the table up into parts we need to be very
	// explicit with the roles to create the accessability tree for the table,
	// otherwise browser's attempt to "fix" the tree by filling in what it
	// thinks are gaps. The static elements that we can assign roles to are done
	// here. Dynamic ones are done in the draw function below.
	table.attr('role', 'none');
	table.find('tbody').attr('role', 'rowgroup');
	tableCloneHeader.attr('role', 'none');
	tableCloneFooter.attr('role', 'none');
	settings.colgroup.find('colgroup').attr('role', 'none');

	// Move the info feature's aria desc by to the new "table"
	let describedBy = table.attr('aria-describedby');

	if (describedBy) {
		scroller.attr('aria-describedby', describedBy);
		table.attrRemove('aria-describedby');
	}

	return scroller.get(0);
}

/**
 * Update the header, footer and body tables for resizing - i.e. column
 * alignment.
 *
 * Welcome to the most horrible function DataTables. The process that this
 * function follows is basically:
 *   1. Re-create the table inside the scrolling div
 *   2. Correct colgroup > col values if needed
 *   3. Copy colgroup > col over to header and footer
 *   4. Clean up
 *
 * @param settings DataTables settings object
 */
export function scrollDraw(settings: Context) {
	// Given that this is such a monster function, a lot of variables are use
	// to try and keep the minimised size as small as possible
	let scroll = settings.scroll,
		barWidth = scroll.barWidth,
		divHeader = settings.scrollHead,
		divHeaderInner = divHeader.children('div'),
		divHeaderTable = divHeaderInner.children('table'),
		divBodyEl = settings.scrollBody,
		divBody = divBodyEl,
		divFooter = settings.scrollFoot,
		divFooterInner = divFooter.children('div'),
		divFooterTable = divFooterInner.children('table'),
		header = Dom.s(settings.thead),
		table = Dom.s(settings.table),
		footer = Dom.s(settings.tfoot),
		browser = settings.browser,
		headerCopy,
		footerCopy;

	// If the scrollbar visibility has changed from the last draw, we need to
	// adjust the column sizes as the table width will have changed to account
	// for the scrollbar
	let scrollBarVis =
		divBodyEl.get(0).scrollHeight > divBodyEl.get(0).clientHeight;

	if (
		settings.scrollBarVis !== scrollBarVis &&
		settings.scrollBarVis !== undefined
	) {
		settings.scrollBarVis = scrollBarVis;
		adjustColumnSizing(settings);
		return; // adjust column sizing will call this function again
	}
	else {
		settings.scrollBarVis = scrollBarVis;
	}

	header.find('thead').attr('role', 'rowgroup');
	footer.find('tfoot').attr('role', 'rowgroup');

	// 1. Re-create the table inside the scrolling div
	// Remove the old minimised thead and tfoot elements in the inner table
	table.children('thead, tfoot').remove();

	// Clone the current header and footer elements and then place it into the
	// inner table
	headerCopy = header.clone(true).prependTo(table);
	headerCopy.find('th, td').attrRemove('tabindex');
	headerCopy.find('[id]').attrRemove('id');

	if (footer.count()) {
		footerCopy = footer.clone(true).prependTo(table);
		footerCopy.find('[id]').attrRemove('id');
	}

	// 2. Correct colgroup > col values if needed
	// It is possible that the cell sizes are smaller than the content, so we need to
	// correct colgroup>col for such cases. This can happen if the auto width detection
	// uses a cell which has a longer string, but isn't the widest! For example
	// "Chief Executive Officer (CEO)" is the longest string in the demo, but
	// "Systems Administrator" is actually the widest string since it doesn't collapse.
	// Note the use of translating into a column index to get the `col` element. This
	// is because of Responsive which might remove `col` elements, knocking the alignment
	// of the indexes out.
	if (settings.display.length) {
		// Get the column sizes from the first row in the table. This should really be a
		// [].find, but it wasn't supported in Chrome until Sept 2015, and DT has 10 year
		// browser support
		let firstTr: HTMLTableRowElement | null = null;
		let start = dataSource(settings) !== 'ssp' ? settings.displayStart : 0;

		for (let i = start; i < start + settings.display.length; i++) {
			let idx = settings.display[i];
			let row = settings.data[idx];

			if (row) {
				let tr = row.tr;

				if (tr) {
					firstTr = tr;
					break;
				}
			}
		}

		if (firstTr) {
			let colSizes = Dom.s(firstTr)
				.children('th, td')
				.mapTo(function (cell, idx) {
					return {
						idx: visibleToColumnIndex(settings, idx)!,
						width: Dom.s(cell).width('outer')
					};
				});

			// Check against what the colgroup > col is set to and correct if needed
			for (let i = 0; i < colSizes.length; i++) {
				let colEl = settings.columns[colSizes[i].idx].colEl;
				let colWidth = colEl.width();

				if (colWidth !== colSizes[i].width) {
					colEl.css('width', colSizes[i].width + 'px');

					if (scroll.x) {
						colEl.css('minWidth', colSizes[i].width + 'px');
					}
				}
			}
		}
	}

	// 3. Copy the colgroup over to the header and footer
	divHeaderTable.find('colgroup').remove();
	divHeaderTable.append(settings.colgroup.clone(true));

	if (footer) {
		divFooterTable.find('colgroup').remove();
		divFooterTable.append(settings.colgroup.clone(true));
	}

	// "Hide" the header and footer that we used for the sizing. We need to keep
	// the content of the cell so that the width applied to the header and body
	// both match, but we want to hide it completely.
	headerCopy.find('th, td').each(function (el) {
		Dom.c('div')
			.classAdd('dt-scroll-sizing')
			.append(Array.from(el.childNodes))
			.appendTo(el);
	});

	if (footerCopy) {
		footerCopy.find('th, td').each(function (el) {
			Dom.c('div')
				.classAdd('dt-scroll-sizing')
				.append(Array.from(el.childNodes))
				.appendTo(el);
		});
	}

	// 4. Clean up
	// Figure out if there are scrollbar present - if so then we need the header and footer to
	// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
	let isScrolling =
		Math.floor(table.height()) > divBodyEl.get(0).clientHeight ||
		divBody.css('overflow-y') == 'scroll';
	let paddingSide = 'padding' + (browser.scrollbarLeft ? 'Left' : 'Right');

	// Set the width's of the header and footer tables
	let outerWidth = table.width('withPadding');

	divHeaderTable.css('width', stringToCss(outerWidth));
	divHeaderInner
		.css('width', stringToCss(outerWidth))
		.css(paddingSide, isScrolling ? barWidth + 'px' : '0px');

	if (footer.count()) {
		divFooterTable.css('width', stringToCss(outerWidth));
		divFooterInner
			.css('width', stringToCss(outerWidth))
			.css(paddingSide, isScrolling ? barWidth + 'px' : '0px');
	}

	// Correct DOM ordering for colgroup - comes before the thead
	table.children('colgroup').prependTo(table);

	// Remove tabindex from the hidden row elements
	table.find('thead, tfoot').find('[tabindex]').attrRemove('tabindex');

	// Dynamic ARIA roles - see setup for details on why this is needed
	table
		.find('thead, tfoot')
		.attr('role', 'none')
		.find('[role]')
		.attrRemove('role');
	table.find('tbody tr:not([role])').attr('role', 'row');
	table.find('tbody td:not([role]), tbody th:not([role])').attr('role', 'cell');

	scrollAria(headerCopy);
	scrollAria(footerCopy);

	// Adjust the position of the header in case we loose the y-scrollbar
	divBody.trigger('scroll');

	// If sorting or filtering has occurred, jump the scrolling back to the top
	// only if we aren't holding the position
	if ((settings.wasOrdered || settings.wasFiltered) && !settings.drawHold) {
		divBodyEl.scrollTop(0);
	}
}

/**
 * Apply ARIA roles for the header / footer of a scrolling table
 * @param element 
 */
function scrollAria(element?: Dom) {
	if (element) {
		element.find('tfoot:not([role])').attr('role', 'rowgroup');
		element.find('tr:not([role])').attr('role', 'row');
		element.find('th:not([role])').attr('role', 'columnheader');
		element.find('td:not([role])').attr('role', 'cell');
	}
}