import { visibleColumns } from '../core/columns';
import { saveState } from '../core/state';
import dom from '../dom';
import util from '../util';
import Api from './Api';
import { callbackFire } from './support';

declare module './Api' {
	interface Api {
		state: any;
	}
}

dom.s(document).on('plugin-init.dt', function (e, context) {
	var api = new Api(context);

	api.on('stateSaveParams.DT', function (ev, settings, d) {
		// This could be more compact with the API, but it is a lot faster as a simple
		// internal loop
		var idFn = settings.rowIdFn;
		var rows = settings.aiDisplayMaster;
		var ids: any[] = [];

		for (var i = 0; i < rows.length; i++) {
			var rowIdx = rows[i];
			var data = settings.aoData[rowIdx];

			if (data._detailsShow) {
				ids.push('#' + idFn(data._aData));
			}
		}

		d.childRows = ids;
	});

	// For future state loads (e.g. with StateRestore)
	api.on('stateLoaded.DT', function (ev, settings, state) {
		__details_state_load(api, state);
	});

	// And the initial load state
	__details_state_load(api, api.state.loaded());
});

var __details_state_load = function (api, state) {
	if (state && state.childRows) {
		api
			.rows(
				state.childRows.map(function (id) {
					// Escape any `:` characters from the row id. Accounts for
					// already escaped characters.
					return id.replace(/([^:\\]*(?:\\.[^:\\]*)*):/g, '$1\\:');
				})
			)
			.every(function () {
				callbackFire(api.settings()[0], null, 'requestChild', [this]);
			});
	}
};

var __details_add = function (ctx, row, data, klass) {
	// Convert to array of TR elements
	var rows: any[] = [];
	var addRow = function (r: any, k) {
		// Recursion to allow for arrays of jQuery objects
		if (Array.isArray(r) || util.is.jquery(r)) {
			for (var i = 0, iLen = (r as any).length; i < iLen; i++) {
				// TODO typing
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
			let td = dom.c('td').classAdd(k);
			let created = dom
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

	if (row._details) {
		row._details.detach();
	}

	row._details = dom.s(rows);

	// If the children were already shown, that state should be retained
	if (row._detailsShow) {
		row._details.insertAfter(row.nTr);
	}
};

// Make state saving of child row details async to allow them to be batch processed
var __details_state = util.throttle(function (ctx) {
	saveState(ctx[0]);
}, 500) as any;

var __details_remove = function (api, idx?) {
	var ctx = api.context;

	if (ctx.length) {
		var row = ctx[0].aoData[idx !== undefined ? idx : api[0]];

		if (row && row._details) {
			row._details.detach();

			row._detailsShow = undefined;
			row._details = undefined;
			dom.s(row.nTr).classRemove('dt-hasChild');
			__details_state(ctx);
		}
	}
};

var __details_display = function (api, show) {
	var ctx = api.context;

	if (ctx.length && api.length) {
		var row = ctx[0].aoData[api[0]];

		if (row._details) {
			row._detailsShow = show;

			if (show) {
				row._details.insertAfter(row.nTr);
				dom.s(row.nTr).classAdd('dt-hasChild');
			}
			else {
				row._details.detach();
				dom.s(row.nTr).classRemove('dt-hasChild');
			}

			callbackFire(ctx[0], null, 'childRow', [show, api.row(api[0])]);

			__details_events(ctx[0]);
			__details_state(ctx);
		}
	}
};

var __details_events = function (settings) {
	var api = new Api(settings);
	var namespace = '.dt.DT_details';
	var drawEvent = 'draw' + namespace;
	var colvisEvent = 'column-sizing' + namespace;
	var destroyEvent = 'destroy' + namespace;
	var data = settings.aoData;

	api.off(drawEvent + ' ' + colvisEvent + ' ' + destroyEvent);

	if (util.array.pluck(data, '_details').length > 0) {
		// On each draw, insert the required elements into the document
		api.on(drawEvent, function (e, ctx) {
			if (settings !== ctx) {
				return;
			}

			api
				.rows({ page: 'current' })
				.eq(0)
				.each(function (idx) {
					// Internal data grab
					var row = data[idx];

					if (row._detailsShow) {
						row._details.insertAfter(row.nTr);
					}
				});
		});

		// Column visibility change - update the colspan
		api.on(colvisEvent, function (e, ctx) {
			if (settings !== ctx) {
				return;
			}

			// Update the colspan for the details rows (note, only if it already has
			// a colspan)
			var row,
				visible = visibleColumns(ctx);

			for (var i = 0, iLen = data.length; i < iLen; i++) {
				row = data[i];

				if (row && row._details) {
					row._details.each(function (el) {
						var td = dom.s(el).children('td');

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
				if (data[i] && data[i]._details) {
					__details_remove(api, i);
				}
			}
		});
	}
};

// Strings for the method names to help minification
var _emp = '';
var _child_obj = _emp + 'row().child';
var _child_mth = _child_obj + '()';

// data can be:
//  tr
//  string
//  jQuery or array of any of the above
Api.register(_child_mth, function (data, klass) {
	var ctx = this.context;

	if (data === undefined) {
		// get
		let jq = util.external('jq');
		let details =
			ctx.length && this.length && ctx[0].aoData[this[0]]
				? ctx[0].aoData[this[0]]._details
				: undefined;

		if (!details) {
			return;
		}
		else if (jq) {
			return jq(details.get());
		}
		return details;
	}
	else if (data === true) {
		// show
		this.child.show();
	}
	else if (data === false) {
		// remove
		__details_remove(this);
	}
	else if (ctx.length && this.length) {
		// set
		__details_add(ctx[0], ctx[0].aoData[this[0]], data, klass);
	}

	return this.inst(this.context, this);
});

Api.register(
	[
		_child_obj + '.show()',
		_child_mth + '.show()', // only when `child()` was called with parameters (without
	],
	function () {
		// it returns an object and this method is not executed)
		__details_display(this, true);
		return this;
	}
);

Api.register(
	[
		_child_obj + '.hide()',
		_child_mth + '.hide()', // only when `child()` was called with parameters (without
	],
	function () {
		// it returns an object and this method is not executed)
		__details_display(this, false);
		return this;
	}
);

Api.register(
	[
		_child_obj + '.remove()',
		_child_mth + '.remove()', // only when `child()` was called with parameters (without
	],
	function () {
		// it returns an object and this method is not executed)
		__details_remove(this);
		return this;
	}
);

Api.register(_child_obj + '.isShown()', function () {
	var ctx = this.context;

	if (ctx.length && this.length && ctx[0].aoData[this[0]]) {
		// _detailsShown as false or undefined will fall through to return false
		return ctx[0].aoData[this[0]]._detailsShow || false;
	}
	return false;
});
