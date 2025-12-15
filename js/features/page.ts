import { bindAction } from '../api/support';
import { recordsDisplay } from '../core/draw';
import { pageChange } from '../core/page';
import { renderer } from '../core/render';
import dom, { Dom } from '../dom';
import ext from '../ext';
import { pagingNumbers } from '../ext/paging';
import { Context } from '../model/settings';
import register from './register';

export interface IFeaturePagingOptions {
	/** Set the maximum number of paging number buttons */
	buttons: number;

	/** Paging button display options */
	type:
		| 'numbers'
		| 'simple'
		| 'simple_numbers'
		| 'full'
		| 'full_numbers'
		| 'first_last_numbers';

	/** Display the buttons in the pager (default true) */
	numbers: boolean;

	/** Display the first and last buttons in the pager (default true) */
	firstLast: boolean;

	/** Display the previous and next buttons in the pager (default true) */
	previousNext: boolean;

	/** Include the extreme page numbers, if separated by ellipsis, or not */
	boundaryNumbers: boolean;
}

// opts
// - type - button configuration
// - buttons - number of buttons to show - must be odd
register<Partial<IFeaturePagingOptions>>(
	'paging',
	function (settings, optsIn) {
		// Don't show the paging input if the table doesn't have paging enabled
		if (!settings.features.paging) {
			return null;
		}

		let opts: IFeaturePagingOptions = Object.assign(
			{
				buttons: ext.pager.numbers_length,
				type: settings.pagingType,
				boundaryNumbers: true,
				firstLast: true,
				previousNext: true,
				numbers: true
			},
			optsIn
		);

		let host = dom
			.c('div')
			.classAdd(
				settings.oClasses.paging.container +
					(opts.type ? ' paging_' + opts.type : '')
			)
			.append(
				dom
					.c('nav')
					.attr('aria-label', 'pagination')
					.classAdd(settings.oClasses.paging.nav)
			);

		let draw = function () {
			_pagingDraw(settings, host.children(), opts);
		};

		settings.callbacks.draw.push(draw);

		// Responsive redraw of paging control
		dom.s(settings.nTable).on('column-sizing.dt.DT', draw);

		return host;
	},
	'p'
);

/**
 * Dynamically create the button type array based on the configuration options.
 * This will only happen if the paging type is not defined.
 */
function _pagingDynamic(opts: IFeaturePagingOptions) {
	let out: any[] = [];

	if (opts.numbers) {
		out.push('numbers');
	}

	if (opts.previousNext) {
		out.unshift('previous');
		out.push('next');
	}

	if (opts.firstLast) {
		out.unshift('first');
		out.push('last');
	}

	return out;
}

function _pagingDraw(
	settings: Context,
	host: Dom,
	opts: IFeaturePagingOptions
) {
	if (!settings._bInitComplete) {
		return;
	}

	let plugin = opts.type ? ext.pager[opts.type] : _pagingDynamic,
		aria = settings.oLanguage.oAria.paginate || {},
		start = settings._iDisplayStart,
		len = settings.pageLength,
		visRecords = recordsDisplay(settings),
		all = len === -1,
		page = all ? 0 : Math.ceil(start / len),
		pages = all ? 1 : Math.ceil(visRecords / len),
		buttons: any[] = [],
		buttonEls: Element[] = [],
		buttonsNested = plugin(opts).map(function (val) {
			return val === 'numbers'
				? pagingNumbers(page, pages, opts.buttons, opts.boundaryNumbers)
				: val;
		});

	// .flat() would be better, but not supported in old Safari
	buttons = buttons.concat.apply(buttons, buttonsNested);

	for (let i = 0; i < buttons.length; i++) {
		let button = buttons[i];

		let btnInfo = _pagingButtonInfo(settings, button, page, pages);
		let btn = renderer(settings, 'pagingButton')(
			settings,
			button,
			btnInfo.display,
			btnInfo.active,
			btnInfo.disabled
		);

		let ariaLabel =
			typeof button === 'string'
				? (aria as any)[button]
				: aria.number
				? aria.number + (button + 1)
				: null;

		// Common attributes
		dom.s(btn.clicker).attr({
			'aria-controls': settings.sTableId,
			'aria-disabled': btnInfo.disabled ? 'true' : null,
			'aria-current': btnInfo.active ? 'page' : null,
			'aria-label': ariaLabel,
			'data-dt-idx': button,
			tabIndex: btnInfo.disabled
				? -1
				: settings.tabIndex && btn.clicker.nodeName.toLowerCase() !== 'span'
				? settings.tabIndex
				: null // `0` doesn't need a tabIndex since it is the default
		});

		if (typeof button !== 'number') {
			dom.s(btn.clicker).classAdd(button);
		}

		bindAction(btn.clicker, '', function (e) {
			e.preventDefault();

			pageChange(settings, button, true);
		});

		buttonEls.push(btn.display);
	}

	let wrapped = renderer(settings, 'pagingContainer')(settings, buttonEls);
	let activeEl = host.find(document.activeElement).attr('data-dt-idx');

	host.empty().append(wrapped);

	if (activeEl) {
		host.find('[data-dt-idx="' + activeEl + '"]').trigger('focus');
	}

	// Responsive - check if the buttons are over two lines based on the
	// height of the buttons and the container.
	if (buttonEls.length) {
		let outerHeight = dom.s(buttonEls[0]).height('withBorder');

		if (
			opts.buttons > 1 && // prevent infinite
			outerHeight > 0 && // will be 0 if hidden
			host.height() >= outerHeight * 2 - 10
		) {
			_pagingDraw(
				settings,
				host,
				Object.assign({}, opts, { buttons: opts.buttons - 2 })
			);
		}
	}
}

/**
 * Get properties for a button based on the current paging state of the table
 *
 * @param {*} settings DT settings object
 * @param {*} button The button type in question
 * @param {*} page Table's current page
 * @param {*} pages Number of pages
 * @returns Info object
 */
function _pagingButtonInfo(
	settings: Context,
	button: string,
	page: number,
	pages: number
) {
	let lang = settings.oLanguage.oPaginate;
	let o = {
		display: '',
		active: false,
		disabled: false
	};

	switch (button) {
		case 'ellipsis':
			o.display = '&#x2026;';
			break;

		case 'first':
			o.display = lang.sFirst;

			if (page === 0) {
				o.disabled = true;
			}
			break;

		case 'previous':
			o.display = lang.sPrevious;

			if (page === 0) {
				o.disabled = true;
			}
			break;

		case 'next':
			o.display = lang.sNext;

			if (pages === 0 || page === pages - 1) {
				o.disabled = true;
			}
			break;

		case 'last':
			o.display = lang.sLast;

			if (pages === 0 || page === pages - 1) {
				o.disabled = true;
			}
			break;

		default:
			if (typeof button === 'number') {
				o.display = settings.formatNumber(button + 1, settings);

				if (page === button) {
					o.active = true;
				}
			}
			break;
	}

	return o;
}
