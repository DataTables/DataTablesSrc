import { ajaxDataSrc, buildAjax } from '../core/ajax';
import { addData, clearTable } from '../core/data';
import { reDraw } from '../core/draw';
import { initComplete } from '../core/init';
import { processingDisplay } from '../core/processing';
import { AjaxFunction, Context, DtAjaxOptions } from '../model/settings';
import util from '../util';
import Api, { register } from './Api';
import { AjaxMethods, ApiAjax, Api as ApiType } from './interface';
import { dataSource } from './support';

type TReloadCallback = (json: any) => void;

const __reload = function (
	settings: Context,
	holdPosition: boolean,
	callback: TReloadCallback
) {
	// Use the draw event to trigger a callback
	if (callback) {
		var api = new Api(settings);

		api.one('draw', function () {
			callback(api.ajax.json());
		});
	}

	if (dataSource(settings) == 'ssp') {
		reDraw(settings, holdPosition);
	}
	else {
		processingDisplay(settings, true);

		// Cancel an existing request
		var xhr = settings.jqXHR;
		if (xhr && xhr.readyState !== 4) {
			xhr.abort();
		}

		// Trigger xhr
		buildAjax(settings, {}, function (json) {
			clearTable(settings);

			var data = ajaxDataSrc(settings, json, false);
			for (var i = 0, iLen = data.length; i < iLen; i++) {
				addData(settings, data[i]);
			}

			reDraw(settings, holdPosition);
			initComplete(settings);
			processingDisplay(settings, false);
		});
	}
};

register<ApiAjax['json']>('ajax.json()', function () {
	var ctx = this.context;

	if (ctx.length > 0) {
		return ctx[0].json as any;
	}

	// else return undefined;
});

register<ApiAjax['params']>('ajax.params()', function () {
	var ctx = this.context;

	if (ctx.length > 0) {
		return ctx[0].oAjaxData as any;
	}

	// else return undefined;
});

register<ApiAjax['reload']>(
	'ajax.reload()',
	function (callback: TReloadCallback, resetPaging: boolean) {
		return this.iterator('table', function (settings: Context) {
			__reload(settings, resetPaging === false, callback);
		});
	}
);

type ApiAjaxUrlOverload = (
	this: ApiType,
	url?: string
) => string | DtAjaxOptions | AjaxFunction | undefined | null | AjaxMethods;

register<ApiAjaxUrlOverload>('ajax.url()', function (url?: string) {
	var ctx = this.context;

	if (url === undefined) {
		// get
		if (ctx.length === 0) {
			return undefined;
		}

		let context = ctx[0];

		return util.is.plainObject<DtAjaxOptions>(context.ajax)
			? context.ajax.url
			: context.ajax;
	}

	// set
	return this.iterator<AjaxMethods>(
		'table',
		function (settings: Context) {
			if (util.is.plainObject<DtAjaxOptions>(settings.ajax)) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
		},
		true
	);
});

register<AjaxMethods['load']>(
	'ajax.url().load()',
	function (callback: TReloadCallback, resetPaging: boolean) {
		// Same as a reload, but makes sense to present it for easy access after
		// a url change
		return this.iterator('table', function (ctx: Context) {
			__reload(ctx, resetPaging === false, callback);
		});
	}
);
