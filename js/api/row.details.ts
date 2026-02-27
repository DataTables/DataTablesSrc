import { visibleColumns } from '../core/columns';
import { saveState } from '../core/state';
import Dom from '../dom';
import { Row } from '../model/row';
import { Context } from '../model/settings';
import { StateLoad } from '../model/state';
import util from '../util';
import Api from './Api';
import { ApiRowMethods, Api as ApiType } from './interface';
import { callbackFire } from './support';

Dom.s(document).on('plugin-init.dt', function (e, context) {
	var api = new Api(context);

	api.on('stateSaveParams.DT', function (ev, settings, d) {
		// This could be more compact with the API, but it is a lot faster as a
		// simple internal loop
		var idFn = settings.rowIdFn;
		var rows = settings.displayMaster;
		var ids: any[] = [];

		for (var i = 0; i < rows.length; i++) {
			var rowIdx = rows[i];
			var row = settings.data[rowIdx];

			if (row.detailsShow) {
				ids.push('#' + idFn(row.data));
			}
		}

		d.childRows = ids;
	});

	// For future state loads (e.g. with StateRestore)
	api.on('stateLoaded.DT', function (ev, settings, state) {
		detailsStateLoad(api, state);
	});

	// And the initial load state
	detailsStateLoad(api, api.state.loaded());
});

function detailsStateLoad(api: ApiType, state: StateLoad | null) {
	if (state && state.childRows) {
		api.rows(
			state.childRows.map(function (id) {
				// Escape any `:` characters from the row id. Accounts for
				// already escaped characters.
				return id.replace(/([^:\\]*(?:\\.[^:\\]*)*):/g, '$1\\:');
			})
		).every(function () {
			callbackFire(api.settings()[0], null, 'requestChild', [this]);
		});
	}
}

function detailsAdd(ctx: Context, row: Row | null, data: any, klass: string) {
	if (!row) {
		return;
	}

	// Convert to array of TR elements
	var rows: any[] = [];
	var addRow = function (r: any, k: string) {
		// Recursion to allow for arrays of jQuery objects
		if (Array.isArray(r) || util.is.jquery(r)) {
			for (var i = 0, iLen = (r as any).length; i < iLen; i++) {
				addRow(r[i], k);
			}
			return;
		}

		// If we get a TR element, then just add it directly - up to the dev
		// to add the correct number of columns etc
		if (r.nodeName && r.nodeName.toLowerCase() === 'tr') {
			r.setAttribute('data-dt-row', row.idx);
			rows.push(r);
		}
		else {
			// Otherwise create a row with a wrapper
			let td = Dom.c('td').classAdd(k);
			let created = Dom
				.c('tr')
				.append(td)
				.attr('data-dt-row', row.idx)
				.classAdd(k);

			if (r.nodeName) {
				td.append(r);
			}
			else {
				td.html(r);
			}

			(td.get(0) as any).colSpan = visibleColumns(ctx);

			rows.push(created.get(0));
		}
	};

	addRow(data, klass);

	if (row.details) {
		row.details.detach();
	}

	row.details = Dom.s(rows);

	// If the children were already shown, that state should be retained
	if (row.detailsShow && row.tr) {
		row.details.insertAfter(row.tr);
	}
}

// Make state saving of child row details async to allow them to be batch
// processed
var detailsState = util.throttle(function (ctx: Context[]) {
	saveState(ctx[0]);
}, 500) as any;

function detailsRemove(api: ApiType, idx?: number) {
	var ctx = api.context;

	if (ctx.length) {
		var row = ctx[0].data[idx !== undefined ? idx : api[0]];

		if (row && row.details) {
			row.details.detach();

			row.detailsShow = undefined;
			row.details = undefined;
			Dom.s(row.tr).classRemove('dt-hasChild');
			detailsState(ctx);
		}
	}
}

function detailsDisplay(api: ApiType, show: boolean) {
	var ctx = api.context;

	if (ctx.length && api.length) {
		var row = ctx[0].data[api[0]];

		if (row && row.details) {
			row.detailsShow = show;

			if (show && row.tr) {
				row.details.insertAfter(row.tr);
				Dom.s(row.tr).classAdd('dt-hasChild');
			}
			else if (!show) {
				row.details.detach();
				Dom.s(row.tr).classRemove('dt-hasChild');
			}

			callbackFire(ctx[0], null, 'childRow', [show, api.row(api[0])]);
			detailsEvents(ctx[0]);
			detailsState(ctx);
		}
	}
}

function detailsEvents(settings: Context) {
	var api = new Api(settings);
	var namespace = '.dt.DT_details';
	var drawEvent = 'draw' + namespace;
	var colvisEvent = 'column-sizing' + namespace;
	var destroyEvent = 'destroy' + namespace;
	var data = settings.data;

	api.off(drawEvent + ' ' + colvisEvent + ' ' + destroyEvent);

	if (util.array.pluck(data, 'details').length > 0) {
		// On each draw, insert the required elements into the document
		api.on(drawEvent, function (e, ctx) {
			if (settings !== ctx) {
				return;
			}

			api.rows({ page: 'current' })
				.eq(0)
				.each(function (idx) {
					// Internal data grab
					var row = data[idx];

					if (row && row.detailsShow && row.details && row.tr) {
						row.details.insertAfter(row.tr);
					}
				});
		});

		// Column visibility change - update the colspan
		api.on(colvisEvent, function (e, ctx) {
			if (settings !== ctx) {
				return;
			}

			// Update the colspan for the details rows (note, only if it already
			// has a colspan)
			var row,
				visible = visibleColumns(ctx);

			for (var i = 0, iLen = data.length; i < iLen; i++) {
				row = data[i];

				if (row && row.details) {
					row.details.each(function (el) {
						var td = Dom.s(el).children('td');

						if (td.count() == 1) {
							td.attr('colspan', visible);
						}
					});
				}
			}
		});

		// Table destroyed - nuke any child rows
		api.on(destroyEvent, function (e, ctx) {
			if (settings !== ctx) {
				return;
			}

			for (var i = 0, iLen = data.length; i < iLen; i++) {
				let d = data[i];

				if (d && d.details) {
					detailsRemove(api, i);
				}
			}
		});
	}
}

// Strings for the method names to help minification
var _emp = '';
var _child_obj = _emp + 'row().child';
var _child_mth = _child_obj + '()';

// data can be:
//  tr
//  string
//  jQuery or array of any of the above
Api.register(
	_child_mth,
	function (this: ApiRowMethods<any>, data: boolean, klass: string) {
		var ctx = this.context;

		if (data === undefined) {
			// get
			let details =
				ctx.length && this.length && ctx[0].data[this[0]]
					? ctx[0].data[this[0]]?.details
					: undefined;

			return details;
		}
		else if (data === true) {
			// show
			this.child.show();
		}
		else if (data === false) {
			// remove
			detailsRemove(this);
		}
		else if (ctx.length && this.length) {
			// set
			detailsAdd(ctx[0], ctx[0].data[this[0]], data, klass);
		}

		return this.inst(this.context, this);
	}
);

Api.register(
	[
		_child_obj + '.show()',
		_child_mth + '.show()' // only when `child()` was called with parameters
	],
	function () {
		// it returns an object and this method is not executed)
		detailsDisplay(this, true);
		return this;
	}
);

Api.register(
	[
		_child_obj + '.hide()',
		_child_mth + '.hide()' // only when `child()` was called with parameters
	],
	function () {
		// it returns an object and this method is not executed)
		detailsDisplay(this, false);
		return this;
	}
);

Api.register(
	[
		_child_obj + '.remove()',
		_child_mth + '.remove()' // only when `child()` was called with parameters
	],
	function () {
		// it returns an object and this method is not executed)
		detailsRemove(this);
		return this;
	}
);

Api.register(_child_obj + '.isShown()', function () {
	var ctx = this.context;

	if (ctx.length && this.length && ctx[0].data[this[0]]) {
		// detailsShown as false or undefined will fall through to return false
		return ctx[0].data[this[0]].detailsShow || false;
	}
	return false;
});
