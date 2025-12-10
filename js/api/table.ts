import { headerLayout } from '../core/draw';
import dom from '../dom';
import { Context } from '../model/settings';
import { register, registerPlural } from './Api';
import {
	Api,
	ApiCaption,
	ApiTableMethods,
	ApiTablesMethods,
	TableSelector
} from './interface';
import { selectorFirst } from './selectors';
import { arrayApply } from './support';

/**
 * Selector for HTML tables. Apply the given selector to the give array of
 * DataTables settings objects.
 *
 * @param selector Selector string or integer
 * @param a Array of DataTables settings objects to be filtered
 * @return Selected table notes
 */
function table_selector(
	selector: TableSelector,
	a: Context[]
): HTMLElement[] | Context[] {
	if (Array.isArray(selector)) {
		var result: any[] = [];

		selector.forEach(function (sel) {
			var inner = table_selector(sel, a);

			arrayApply(result, inner);
		});

		return result.filter(item => !!item);
	}

	// Integer is used to pick out a table by index
	if (typeof selector === 'number') {
		return [a[selector]];
	}

	// Perform a selector on the table nodes
	var nodes = a.map(function (el) {
		return el.nTable;
	});

	return dom
		.s(nodes)
		.filter(selector)
		.mapTo(el => {
			// Need to translate back from the table node to the settings
			var idx = nodes.indexOf(el);
			return a[idx];
		});
}

register<Api['tables']>('tables()', function (selector) {
	// A new instance is created if there was a selector specified
	return selector !== undefined && selector !== null
		? this.inst(table_selector(selector, this.context))
		: this.inst(this.context);
});

register<Api['table']>('table()', function (selector) {
	return selectorFirst(this.tables(selector));
});

// Common methods, combined to reduce size
[
	['nodes', 'node', 'nTable'],
	['body', 'body', 'nTBody'],
	['header', 'header', 'nTHead'],
	['footer', 'footer', 'nTFoot']
].forEach(function (item) {
	registerPlural<
		(this: Api) => Api<HTMLElement>
	>('tables().' + item[0] + '()', 'table().' + item[1] + '()', function () {
		return this.iterator(
			'table',
			ctx => ctx[item[2] as 'nTable' | 'nTBody' | 'nTHead' | 'nTFoot'],
			true
		);
	});
});

// Structure methods
[
	['header', 'aoHeader'],
	['footer', 'aoFooter']
].forEach(function (item) {
	register<
		ApiTableMethods<any>['header']['structure']
	>('table().' + item[0] + '.structure()', function (selector?) {
		var indexes = this.columns(selector).indexes().flatten().toArray();
		var ctx = this.context[0];
		var structure = headerLayout(
			ctx,
			ctx[item[1] as 'aoHeader' | 'aoFooter'],
			indexes
		)!;

		// The structure is in column index order - but from this method we
		// want the return to be in the columns() selector API order. In
		// order to do that we need to map from one form to the other
		var orderedIndexes = indexes.slice().sort(function (a, b) {
			return a - b;
		});

		return structure.map(function (row) {
			return indexes.map(function (colIdx) {
				return row[orderedIndexes.indexOf(colIdx)]!;
			});
		});
	});
});

registerPlural<ApiTablesMethods<any>['containers']>(
	'tables().containers()',
	'table().container()',
	function () {
		return this.iterator(
			'table',
			function (ctx) {
				return ctx.nTableWrapper;
			},
			true
		);
	}
);

register<ApiTablesMethods<any>['every']>('tables().every()', function (fn) {
	return this.iterator('table', (s, i) => {
		fn.call(this.table(i), i);
	});
});

type ApiCaptionOverload = (
	this: Api,
	set?: string,
	side?: 'top' | 'bottom'
) => string | null | Api;

register<ApiCaptionOverload>('caption()', function (value?, side?) {
	var context = this.context;

	// Getter - return existing node's content
	if (value === undefined) {
		var node = context[0].captionNode;

		return node && context.length ? node.innerHTML : null;
	}

	return this.iterator(
		'table',
		function (ctx) {
			var table = dom.s(ctx.nTable);
			var caption = dom.s(ctx.captionNode);
			var container = dom.s(ctx.nTableWrapper);

			// Create the node if it doesn't exist yet
			if (!caption.count()) {
				caption = dom.c('caption').html(value);
				ctx.captionNode = caption.get<HTMLTableCaptionElement>(0);

				// If side isn't set, we need to insert into the document to let
				// the CSS decide so we can read it back, otherwise there is no
				// way to know if the CSS would put it top or bottom for
				// scrolling
				if (!side) {
					table.prepend(caption);

					side = caption.css('caption-side') as 'top' | 'bottom';
				}
			}

			caption.html(value);

			if (side) {
				caption.css('caption-side', side);
				(caption.get(0) as any)._captionSide = side;
			}

			if (container.find('div.dataTables_scroll').count()) {
				var selector = side === 'top' ? 'Head' : 'Foot';

				container
					.find('div.dataTables_scroll' + selector + ' table')
					.prepend(caption);
			}
			else {
				table.prepend(caption);
			}
		},
		true
	);
});

register<ApiCaption['node']>('caption.node()', function () {
	var ctx = this.context;

	return ctx.length ? ctx[0].captionNode : null;
});
