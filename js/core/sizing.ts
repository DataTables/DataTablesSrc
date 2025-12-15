import { callbackFire } from '../api/support';
import dom from '../dom';
import ext from '../ext/index';
import { Context } from '../model/settings';
import util from '../util';
import { adjustColumnSizing, columnsSumWidth, getColumns } from './columns';
import { getRowDisplay } from './draw';

/**
 * Calculate the width of columns for the table
 *
 * @param settings dataTables settings object
 */
export function calculateColumnWidths(settings: Context) {
	// Not interested in doing column width calculation if auto-width is disabled
	if (!settings.features.autoWidth) {
		return;
	}

	var table = settings.nTable,
		columns = settings.aoColumns,
		scroll = settings.oScroll,
		scrollY = scroll.sY,
		scrollX = scroll.sX,
		scrollXInner = scroll.sXInner,
		visibleColumns = getColumns(settings, 'bVisible'),
		tableWidthAttr = table.getAttribute('width'), // from DOM element
		tableContainer = table.parentElement!,
		i,
		j,
		column,
		columnIdx;

	var styleWidth = table.style.width;
	var containerWidth = wrapperWidth(settings);

	// Don't re-run for the same width as the last time
	if (containerWidth === settings.containerWidth) {
		return false;
	}

	settings.containerWidth = containerWidth;

	// If there is no width applied as a CSS style or as an attribute, we assume that
	// the width is intended to be 100%, which is usually is in CSS, but it is very
	// difficult to correctly parse the rules to get the final result.
	if (!styleWidth && !tableWidthAttr) {
		table.style.width = '100%';
		styleWidth = '100%';
	}

	if (styleWidth && styleWidth.indexOf('%') !== -1) {
		tableWidthAttr = styleWidth;
	}

	// Let plug-ins know that we are doing a recalc, in case they have changed any of the
	// visible columns their own way (e.g. Responsive uses display:none).
	callbackFire(
		settings,
		null,
		'column-calc',
		{ visible: visibleColumns },
		false
	);

	// Construct a worst case table with the widest, assign any user defined
	// widths, then insert it into  the DOM and allow the browser to do all
	// the hard work of calculating table widths
	var tmpTable = dom
		.s(table.cloneNode())
		.css('visibility', 'hidden')
		.css('margin', '0')
		.removeAttr('id');

	// Clean up the table body
	tmpTable.append(dom.c('tbody'));

	// Clone the table header and footer - we can't use the header / footer
	// from the cloned table, since if scrolling is active, the table's
	// real header and footer are contained in different table tags
	tmpTable
		.append(settings.nTHead.cloneNode(true))
		.append(settings.nTFoot.cloneNode(true));

	// Remove any assigned widths from the footer (from scrolling)
	tmpTable.find('tfoot th, tfoot td').css('width', '');

	// Apply custom sizing to the cloned header
	tmpTable.find('thead th, thead td').each(cell => {
		// Get the `width` from the header layout
		var width = columnsSumWidth(settings, cell, true, false);

		if (width) {
			cell.style.width = width;

			// For scrollX we need to force the column width otherwise the
			// browser will collapse it. If this width is smaller than the
			// width the column requires, then it will have no effect
			if (scrollX) {
				cell.style.minWidth = width;

				dom.s(cell).append(
					dom.c('div').css({
						width: width,
						margin: '0',
						padding: '0',
						border: '0',
						height: '1px',
					})
				);
			}
		}
		else {
			cell.style.width = '';
		}
	});

	// Get the widest strings for each of the visible columns and add them to
	// our table to create a "worst case"
	var longestData: string[][] = [];

	for (i = 0; i < visibleColumns.length; i++) {
		longestData.push(getWideStrings(settings, visibleColumns[i]));
	}

	if (longestData.length) {
		for (i = 0; i < longestData[0].length; i++) {
			var tr = dom.c('tr').appendTo(tmpTable.find('tbody'));

			for (j = 0; j < visibleColumns.length; j++) {
				columnIdx = visibleColumns[j];
				column = columns[columnIdx];

				var longest = longestData[j][i] || '';
				var autoClass = ext.type.className[column.sType!];
				var padding = column.sContentPadding || (scrollX ? '-' : '');
				var text = longest + padding;

				var cell = dom
					.c('td')
					.classAdd(autoClass)
					.classAdd(column.sClass)
					.appendTo(tr);

				if (
					longest.indexOf('<') === -1 &&
					longest.indexOf('&') === -1
				) {
					cell.text(text);
				}
				else {
					cell.html(text);
				}
			}
		}
	}

	// Tidy the temporary table - remove name attributes so there aren't
	// duplicated in the dom (radio elements for example)
	tmpTable.find('[name]').removeAttr('name');

	// Table has been built, attach to the document so we can work with it.
	// A holding element is used, positioned at the top of the container
	// with minimal height, so it has no effect on if the container scrolls
	// or not. Otherwise it might trigger scrolling when it actually isn't
	// needed
	var holder = dom
		.c('div')
		.css(
			scrollX || scrollY
				? {
						position: 'absolute',
						top: '0',
						left: '0',
						height: '1px',
						right: '0',
						overflow: 'hidden',
				  }
				: {}
		)
		.append(tmpTable)
		.appendTo(tableContainer);

	// When scrolling (X or Y) we want to set the width of the table as
	// appropriate. However, when not scrolling leave the table width as it
	// is. This results in slightly different, but I think correct behaviour
	//
	// Note that the table must be `box-sizing: border-box` for this to work.
	if (scrollX && scrollXInner) {
		tmpTable.width(scrollXInner);
	}
	else if (scrollX) {
		tmpTable.css('width', 'auto').removeAttr('width');

		// If there is no width attribute or style, then allow the table to
		// collapse
		if (tmpTable.width() < tableContainer.clientWidth && tableWidthAttr) {
			tmpTable.width(tableContainer.clientWidth);
		}
	}
	else if (scrollY) {
		tmpTable.width(tableContainer.clientWidth);
	}
	else if (tableWidthAttr) {
		tmpTable.width(tableWidthAttr);
	}

	// Get the width of each column in the constructed table
	var total = 0;
	var bodyCells = tmpTable.find('tbody tr').eq(0).children();

	for (i = 0; i < visibleColumns.length; i++) {
		// Use getBounding for sub-pixel accuracy, which we then want to round up!
		var bounding = bodyCells.get(i).getBoundingClientRect().width;

		// Total is tracked to remove any sub-pixel errors as the outerWidth
		// of the table might not equal the total given here
		total += bounding;

		// Width for each column to use
		columns[visibleColumns[i]].sWidth = stringToCss(bounding);
	}

	table.style.width = stringToCss(total);

	// Finished with the table - ditch it
	holder.remove();

	// If there is a width attr, we want to attach an event listener which
	// allows the table sizing to automatically adjust when the window is
	// resized. Use the width attr rather than CSS, since we can't know if the
	// CSS is a relative value or absolute - DOM read is always px.
	if (tableWidthAttr) {
		table.style.width = stringToCss(tableWidthAttr);
	}

	if ((tableWidthAttr || scrollX) && !settings._reszEvt) {
		var resize = util.throttle(function () {
			var newWidth = wrapperWidth(settings);

			// Don't do it if destroying or the container width is 0
			if (!settings.bDestroying && newWidth !== 0) {
				adjustColumnSizing(settings);
			}
		});

		// For browsers that support it (~2020 onwards for wide support) we can watch for the
		// container changing width.
		if (window.ResizeObserver) {
			// This is a tricky beast - if the element is visible when `.observe()` is called,
			// then the callback is immediately run. Which we don't want. If the element isn't
			// visible, then it isn't run, but we want it to run when it is then made visible.
			// This flag allows the above to be satisfied.
			var first = dom.s(settings.nTableWrapper).isVisible();

			// Use an empty div to attach the observer so it isn't impacted by height changes
			var resizer = dom
				.c('div')
				.css({
					width: '100%',
					height: '0',
				})
				.classAdd('dt-autosize')
				.appendTo(settings.nTableWrapper);

			settings.resizeObserver = new ResizeObserver(function (e) {
				if (first) {
					first = false;
				}
				else {
					resize();
				}
			});

			settings.resizeObserver.observe(resizer.get(0));
		}
		else {
			// For old browsers, the best we can do is listen for a window
			// resize
			window.addEventListener('resize', resize);
			settings.windowResizeCb = resize; // For removal in `destroy`
		}

		settings._reszEvt = true;
	}
}

/**
 * Get the width of the DataTables wrapper element
 *
 * @param settings DataTables settings object
 * @returns Width
 */
function wrapperWidth(settings: Context): number {
	let wrapper = dom.s(settings.nTableWrapper);

	return wrapper.isVisible() ? wrapper.width() : 0;
}

/**
 * Get the widest strings for each column.
 *
 * It is very difficult to determine what the widest string actually is due to variable character
 * width and kerning. Doing an exact calculation with the DOM or even Canvas would kill performance
 * and this is a critical point, so we use two techniques to determine a collection of the longest
 * strings from the column, which will likely contain the widest strings:
 *
 * 1) Get the top three longest strings from the column
 * 2) Get the top three widest words (i.e. an unbreakable phrase)
 *
 * @param settings DataTables settings object
 * @param colIdx column of interest
 * @returns Array of the longest strings
 */
function getWideStrings(settings: Context, colIdx: number) {
	var column = settings.aoColumns[colIdx];

	// Do we need to recalculate (i.e. was invalidated), or just use the cached data?
	if (!column.wideStrings) {
		var allStrings: string[] = [];
		var collection: any[] = [];

		// Create an array with the string information for the column
		for (var i = 0, iLen = settings.aiDisplayMaster.length; i < iLen; i++) {
			var rowIdx = settings.aiDisplayMaster[i];
			var data = getRowDisplay(settings, rowIdx)[colIdx];

			var cellString =
				data && typeof data === 'object' && data.nodeType
					? data.innerHTML
					: data + '';

			// Remove id / name attributes from elements so they
			// don't interfere with existing elements
			cellString = cellString
				.replace(/id=".*?"/g, '')
				.replace(/name=".*?"/g, '');

			var noHtml = util.string
				.stripHtml(cellString, ' ')
				.replace(/&nbsp;/g, ' ');

			collection.push({
				str: cellString,
				len: noHtml.length,
			});

			allStrings.push(noHtml);
		}

		// Order and then cut down to the size we need
		collection
			.sort(function (a, b) {
				return b.len - a.len;
			})
			.splice(3);

		column.wideStrings = collection.map(function (item) {
			return item.str;
		});

		// Longest unbroken string
		const parts = allStrings.join(' ').split(' ');

		parts.sort(function (a, b) {
			return b.length - a.length;
		});

		if (parts.length) {
			column.wideStrings.push(parts[0]);
		}

		if (parts.length > 1) {
			column.wideStrings.push(parts[1]);
		}

		if (parts.length > 2) {
			column.wideStrings.push(parts[3]);
		}
	}

	return column.wideStrings;
}

/**
 * Append a CSS unit (only if required) to a string
 *
 * @param value to css-ify
 * @returns Value with css unit
 */
export function stringToCss(s: number | null | string) {
	if (s === null) {
		return '0px';
	}

	if (typeof s == 'number') {
		return s < 0 ? '0px' : s + 'px';
	}

	// Check it has a unit character already
	return s.match(/\d$/) ? s + 'px' : s;
}

/**
 * Re-insert the `col` elements for current visibility
 *
 * @param settings DT settings
 */
export function colGroup(settings: Context) {
	var cols = settings.aoColumns;

	settings.colgroup.empty();

	for (var i = 0; i < cols.length; i++) {
		if (cols[i].bVisible) {
			settings.colgroup.append(cols[i].colEl);
		}
	}
}
