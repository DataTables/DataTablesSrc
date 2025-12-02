import { clearTable } from '../core/data';
import { sortingClasses } from '../core/sort';
import dom from '../dom';
import ext from '../ext/index';
import util from '../util';
import Api, { register } from './Api';
import { Api as ApiType } from './interface';
import { callbackFire, log } from './support';

register<ApiType['$']>('$()', function (selector, opts) {
	let jq = util.external('jq');

	if (!jq) {
		log(
			this.context[0],
			0,
			'No jQuery available. Use `.dom()` or register jQuery'
		);
	}

	let rows = this.rows(opts).nodes(), // Get all rows
		jqRows = jq(rows) as any;

	return jq(
		[].concat(
			jqRows.filter(selector).toArray(),
			jqRows.find(selector).toArray()
		)
	);
});

// jQuery functions to operate on the tables
['on', 'one', 'off'].forEach(key => {
	register(key + '()', function (/* event, handler */) {
		var args = Array.prototype.slice.call(arguments);

		// Add the `dt` namespace automatically if it isn't already present
		args[0] = args[0]
			.split(/\s/)
			.map(function (e: string) {
				return !e.match(/\.dt\b/) ? e + '.dt' : e;
			})
			.join(' ');

		var inst = dom.s(this.tables().nodes());
		inst[key as 'on' | 'one' | 'off'].apply(inst, args);

		return this;
	});
});

register<ApiType['clear']>('clear()', function () {
	return this.iterator('table', function (settings) {
		clearTable(settings);
	});
});

register<ApiType['error']>('error()', function (msg: string) {
	return this.iterator('table', function (settings) {
		log(settings, 0, msg);
	});
});

register<ApiType['settings']>('settings()', function () {
	return new Api(this.context, this.context);
});

register<ApiType['init']>('init()', function () {
	var ctx = this.context;
	return ctx.length ? ctx[0].oInit : null;
});

register<ApiType['data']>('data()', function () {
	return this.iterator('table', function (settings) {
		return util.array.pluck(settings.aoData, '_aData');
	}).flatten();
});

register<ApiType['trigger']>('trigger()', function (name, args?, bubbles?) {
	return this.iterator('table', function (settings) {
		return callbackFire(settings, null, name, args, bubbles);
	}).flatten();
});

type ApiReadyMethod = (
	this: ApiType,
	fn?: (this: ApiType) => void
) => ApiType | boolean;

register<ApiReadyMethod>('ready()', function (fn?) {
	var ctx = this.context;

	// Get status of first table
	if (!fn) {
		return ctx.length ? ctx[0]._bInitComplete || false : false;
	}

	// Function to run either once the table becomes ready or
	// immediately if it is already ready.
	return this.tables().every(function () {
		var api = this;

		if (this.context[0]._bInitComplete) {
			fn.call(api);
		}
		else {
			this.on('init.dt.DT', function () {
				fn.call(api);
			});
		}
	});
});

register<ApiType['destroy']>('destroy()', function (remove) {
	remove = remove || false;

	return this.iterator('table', function (settings) {
		var classes = settings.oClasses;
		var table = settings.nTable;
		var tbody = settings.nTBody;
		var thead = settings.nTHead;
		var tfoot = settings.nTFoot;
		var jqTable = dom.s(table);
		var jqTbody = dom.s(tbody);
		var jqWrapper = dom.s(settings.nTableWrapper);
		var rows = settings.aoData
			.map(function (r) {
				return r ? r.nTr : null;
			})
			.filter(r => !!r);
		var orderClasses = classes.order;

		// Flag to note that the table is currently being destroyed - no action
		// should be taken
		settings.bDestroying = true;

		// Fire off the destroy callbacks for plug-ins etc
		callbackFire(settings, 'aoDestroyCallback', 'destroy', [settings], true);

		// If not being removed from the document, make all columns visible
		if (!remove) {
			new Api(settings).columns().visible();
		}

		// Container width change listener
		if (settings.resizeObserver) {
			settings.resizeObserver.disconnect();
		}

		// Blitz all `DT` namespaced events (these are internal events, the
		// lowercase, `dt` events are user subscribed and they are responsible
		// for removing them
		jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');

		if (settings.windowResizeCb) {
			window.removeEventListener('resize', settings.windowResizeCb);
		}

		// When scrolling we had to break the table up - restore it
		if (table != thead.parentNode) {
			jqTable.children('thead').detach();
			jqTable.append(thead);
		}

		if (tfoot && table != tfoot.parentNode) {
			jqTable.children('tfoot').detach();
			jqTable.append(tfoot);
		}

		// Clean up the header / footer
		cleanHeader(thead, 'header');
		cleanHeader(tfoot, 'footer');
		settings.colgroup.remove();

		settings.aaSorting = [];
		settings.aaSortingFixed = [];
		sortingClasses(settings);

		jqTable
			.find('th, td')
			.classRemove(Object.values(ext.type.className).join(' '));

		dom
			.s(thead)
			.find('th, td')
			.classRemove(
				orderClasses.none +
					' ' +
					orderClasses.canAsc +
					' ' +
					orderClasses.canDesc +
					' ' +
					orderClasses.isAsc +
					' ' +
					orderClasses.isDesc
			)
			.css('width', '')
			.removeAttr('aria-sort');

		// Add the TR elements back into the table in their original order
		jqTbody.children().detach();
		jqTbody.append(rows);

		var orig = settings.nTableWrapper.parentNode;
		var insertBefore = settings.nTableWrapper.nextSibling;

		// Remove the DataTables generated nodes, events and classes
		var removedMethod: 'remove' | 'detach' = remove ? 'remove' : 'detach';
		jqTable[removedMethod]();
		jqWrapper[removedMethod]();

		// If we need to reattach the table to the document
		if (!remove && orig) {
			// insertBefore acts like appendChild if !arg[1]
			orig.insertBefore(table, insertBefore);

			// Restore the width of the original table - was read from the style property,
			// so we can restore directly to that
			jqTable.css('width', settings + 'px').classRemove(classes.table);
		}

		/* Remove the settings object from the settings array */
		var idx = ext.settings.indexOf(settings);
		if (idx !== -1) {
			ext.settings.splice(idx, 1);
		}
	});
});

// i18n method for extensions to be able to use the language object from the
// DataTable
register<ApiType['i18n']>('i18n()', function (token, def, plural) {
	var ctx = this.context[0];
	var resolved = util.get(token)(ctx.oLanguage);

	if (resolved === undefined) {
		resolved = def;
	}

	if (util.is.plainObject(resolved)) {
		resolved =
			plural !== undefined && resolved[plural] !== undefined
				? resolved[plural]
				: (plural as any) === false
				? resolved
				: resolved._;
	}

	return typeof resolved === 'string'
		? resolved.replace('%d', plural as any) // nb: plural might be undefined,
		: resolved;
});

// Needed for header and footer, so pulled into its own function
function cleanHeader(node: HTMLElement, className: string) {
	let headerCell = dom.s(node);

	headerCell.find('span.dt-column-order').remove();
	headerCell.find('span.dt-column-title').each(function (el) {
		let cell = dom.s(el);
		var title = cell.html();

		cell.parent().parent().html(title);
		cell.remove();
	});

	headerCell.find('div.dt-column-' + className).remove();
	headerCell.find('th, td').removeAttr('data-dt-column');
}
