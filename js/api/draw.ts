import { draw, reDraw } from '../core/draw';
import Api from './Api';
import { Api as ApiType } from './interface';

/**
 * Redraw the tables in the current context.
 */
Api.register<ApiType<any>['draw']>('draw()', function (paging) {
	return this.iterator('table', function (settings) {
		if (paging === 'page') {
			draw(settings);
		}
		else {
			if (typeof paging === 'string') {
				paging = paging === 'full-hold' ? false : true;
			}

			reDraw(settings, paging === false);
		}
	});
});
