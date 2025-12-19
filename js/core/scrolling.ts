import { dataSource } from '../api/support';
import dom from '../dom';
import { Context } from '../model/settings';
import { adjustColumnSizing, visibleToColumnIndex } from './columns';
import { stringToCss } from './sizing';

/**
 * Add any control elements for the table - specifically scrolling
 *
 * @param settings DataTables settings object
 * @returns Node to add to the DOM
 */
export function featureHtmlTable(settings: Context) {
	let table = dom.s(settings.nTable);

	// Scrolling from here on in
	let scroll = settings.scroll;

	if (scroll.x === '' && scroll.y === '') {
		return settings.nTable;
	}

	let scrollX = scroll.x;
	let scrollY = scroll.y;
	let classes = settings.classes.scrolling;
	let caption = settings.captionNode;
	let captionSide: string | null = caption
		? (caption as any)._captionSide
		: null;
	let headerClone = table.clone(false);
	let footerClone = table.clone(false);
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
	let scroller = dom
		.c('div')
		.classAdd(classes.container)
		.append(
			dom
				.c('div')
				.classAdd(classes.header.self)
				.css({
					overflow: 'hidden',
					position: 'relative',
					border: '0',
					width: scrollX ? size(scrollX) : '100%',
				})
				.append(
					dom
						.c('div')
						.classAdd(classes.header.inner)
						.css({
							'box-sizing': 'content-box',
							width: scroll.xInner || '100%',
						})
						.append(
							headerClone
								.removeAttr('id')
								.css('margin-left', '0')
								.append(captionSide === 'top' ? caption : null)
								.append(table.children('thead'))
						)
				)
		)
		.append(
			dom
				.c('div')
				.classAdd(classes.body)
				.css({
					position: 'relative',
					overflow: 'auto',
					width: size(scrollX),
				})
				.append(table)
		);

	if (footer.count()) {
		scroller.append(
			dom
				.c('div')
				.classAdd(classes.footer.self)
				.css({
					overflow: 'hidden',
					border: '0',
					width: scrollX ? size(scrollX) : '100%',
				})
				.append(
					dom
						.c('div')
						.classAdd(classes.footer.inner)
						.append(
							footerClone
								.removeAttr('id')
								.css('margin-left', '0')
								.append(captionSide === 'bottom' ? caption : null)
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

	settings.nScrollHead = scrollHead;
	settings.nScrollBody = scrollBody;
	settings.nScrollFoot = scrollFoot;

	// On redraw - align columns
	settings.callbacks.draw.push(scrollDraw);

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
		divHeader = settings.nScrollHead,
		divHeaderInner = divHeader.children('div'),
		divHeaderTable = divHeaderInner.children('table'),
		divBodyEl = settings.nScrollBody,
		divBody = divBodyEl,
		divFooter = settings.nScrollFoot,
		divFooterInner = divFooter.children('div'),
		divFooterTable = divFooterInner.children('table'),
		header = dom.s(settings.nTHead),
		table = dom.s(settings.nTable),
		footer = dom.s(settings.nTFoot),
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

	// 1. Re-create the table inside the scrolling div
	// Remove the old minimised thead and tfoot elements in the inner table
	table.children('thead, tfoot').remove();

	// Clone the current header and footer elements and then place it into the inner table
	headerCopy = header.clone(true).prependTo(table);
	headerCopy.find('th, td').removeAttr('tabindex');
	headerCopy.find('[id]').removeAttr('id');

	if (footer.count()) {
		footerCopy = footer.clone(true).prependTo(table);
		footerCopy.find('[id]').removeAttr('id');
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
			let colSizes = dom
				.s(firstTr)
				.children('th, td')
				.mapTo(function (cell, idx) {
					return {
						idx: visibleToColumnIndex(settings, idx)!,
						width: dom.s(cell).width('outer'),
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
		dom
			.c('div')
			.classAdd('dt-scroll-sizing')
			.append(Array.from(el.childNodes))
			.appendTo(el);
	});

	if (footerCopy) {
		footerCopy.find('th, td').each(function (el) {
			dom
				.c('div')
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
	let outerWidth = table.width('outer');

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

	// Adjust the position of the header in case we loose the y-scrollbar
	divBody.trigger('scroll');

	// If sorting or filtering has occurred, jump the scrolling back to the top
	// only if we aren't holding the position
	if ((settings.wasOrdered || settings.wasFiltered) && !settings.drawHold) {
		divBodyEl.scrollTop(0);
	}
}
