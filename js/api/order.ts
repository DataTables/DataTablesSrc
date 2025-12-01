import { sortAttachListener, sortFlatten, sortResolve } from '../core/sort';
import { Order, OrderState } from '../model/settings';
import * as object from '../util/object';
import Api from './Api';
import { ApiColumnsMethods, ApiOrder, Api as ApiType, OrderFixed } from './interface';

type ApiOrderOverload = (
	this: ApiType,
	order?: Order | Order[],
	dir?: 'asc' | 'desc' | ''
) => OrderState[] | ApiType | undefined;

Api.register<ApiOrderOverload>('order()', function (order, dir) {
	let ctx = this.context;
	let args = Array.prototype.slice.call(arguments);

	if (order === undefined) {
		// get
		return ctx.length !== 0 ? ctx[0].aaSorting : undefined;
	}

	// set
	if (typeof order === 'number' && typeof dir === 'string') {
		// Simple column / direction passed in
		order = [[order, dir]];
	}
	else if (args.length > 1) {
		// Arguments passed in (list of 1D arrays)
		order = args;
	}
	// otherwise a 2D array was passed in

	return this.iterator('table', function (settings) {
		let resolved: OrderState[] = [];

		sortResolve(settings, resolved, order);

		settings.aaSorting = resolved;
	});
});

Api.register<ApiOrder['listener']>('order.listener()', function (node, column, callback) {
	return this.iterator('table', function (settings) {
		sortAttachListener(settings, node, '', column, callback);
	});
});

type ApiOrderFixedOverload = (
	this: Api,
	order?: OrderFixed
) => OrderFixed | ApiType | undefined;

Api.register<ApiOrderFixedOverload>('order.fixed()', function (set) {
	if (!set) {
		var ctx = this.context;
		var fixed = ctx.length ? ctx[0].aaSortingFixed : undefined;

		return Array.isArray(fixed) ? { pre: fixed } : fixed;
	}

	return this.iterator('table', function (settings) {
		settings.aaSortingFixed = object.assignDeep({}, set);
	});
});

// Order by the selected column(s)
Api.register<ApiColumnsMethods<any>['order']>(
	[
		'columns().order()',
		'column().order()'
	],
	function (dir) {
		var that = this;

		if (!dir) {
			return this.iterator(
				'column',
				function (settings, idx) {
					var sort = sortFlatten(settings);

					for (var i = 0, iLen = sort.length; i < iLen; i++) {
						if (sort[i].col === idx) {
							return sort[i].dir;
						}
					}

					return null;
				},
				true
			);
		}
		else {
			return this.iterator('table', function (settings, i) {
				settings.aaSorting = that[i].map(function (col: number) {
					return [col, dir];
				});
			});
		}
	}
);

type ApiColumnsOrderableOverload = (
	this: ApiColumnsMethods<any>,
	directions?: true
) => ApiType<boolean> | ApiType<Array<string>>;

Api.registerPlural<ApiColumnsOrderableOverload>(
	'columns().orderable()',
	'column().orderable()',
	function (directions?) {
		return this.iterator(
			'column',
			function (settings, idx) {
				var col = settings.aoColumns[idx];

				return directions ? col.asSorting : col.bSortable;
			},
			true
		);
	}
);
